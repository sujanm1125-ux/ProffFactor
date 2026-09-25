import {
  createCircuitContext,
  createConstructorContext,
  dummyContractAddress,
  type ChargedState,
  type CircuitContext,
  type EncodedZswapLocalState,
} from '@midnight-ntwrk/compact-runtime';
import { describe, expect, it } from 'vitest';

import {
  Contract,
  AuctionState,
  ledger,
  pureCircuits,
  type AuctionId,
  type BidWitness,
  type RevealWitness,
  type UserSecret,
  type Witnesses,
} from './managed/aegisbid/contract/index.js';

type PrivateState = {
  callerSecret: UserSecret;
  bidWitness: BidWitness;
  revealWitness: RevealWitness;
};

const bytes = (seed: number): Uint8Array => new Uint8Array(32).fill(seed);

const blankBidWitness = (auctionId: Uint8Array): BidWitness => ({
  auctionId,
  bidderSecret: bytes(0),
  amount: 0n,
  salt: bytes(0),
});

const blankRevealWitness = (auctionId: Uint8Array): RevealWitness => ({
  auctionId,
  bidderSecret: bytes(0),
  amount: 0n,
  salt: bytes(0),
});

const defaultPrivateState = (callerSecret: UserSecret, auctionId = bytes(1)): PrivateState => ({
  callerSecret,
  bidWitness: blankBidWitness(auctionId),
  revealWitness: blankRevealWitness(auctionId),
});

const witnesses: Witnesses<PrivateState> = {
  getCallerSecret: ({ privateState }) => [privateState, privateState.callerSecret],
  getBidWitness: ({ privateState }) => [privateState, privateState.bidWitness],
  getRevealWitness: ({ privateState }) => [privateState, privateState.revealWitness],
};

class AegisBidHarness {
  readonly contract = new Contract(witnesses);
  private state: ChargedState;
  private zswap: EncodedZswapLocalState;
  private localState: PrivateState;

  constructor(adminSecret: UserSecret) {
    const initial = defaultPrivateState(adminSecret);
    const result = this.contract.initialState(
      createConstructorContext(initial, { bytes: bytes(250) }),
    );
    this.state = result.currentContractState.data;
    this.zswap = result.currentZswapLocalState;
    this.localState = result.currentPrivateState;
  }

  call(
    circuit: keyof Contract<PrivateState>['impureCircuits'],
    secret: UserSecret,
    args: readonly unknown[],
    bidWitness?: BidWitness,
    revealWitness?: RevealWitness,
    time = 1_000,
  ): unknown {
    this.localState = {
      callerSecret: secret,
      bidWitness: bidWitness ?? this.localState.bidWitness,
      revealWitness: revealWitness ?? this.localState.revealWitness,
    };
    const context = createCircuitContext(
      dummyContractAddress(),
      this.zswap,
      this.state,
      this.localState,
      undefined,
      undefined,
      time,
    );
    const run = this.contract.impureCircuits[circuit] as (
      circuitContext: CircuitContext<PrivateState>,
      ...args: readonly unknown[]
    ) => {
      context: CircuitContext<PrivateState>;
      result: unknown;
    };
    const out = run(context, ...args);
    this.state = out.context.currentQueryContext.state;
    this.zswap = out.context.currentZswapLocalState;
    this.localState = out.context.currentPrivateState;
    return out.result;
  }

  get publicState() {
    return ledger(this.state);
  }
}

describe('AegisBid Compact Contract Invariant Tests', () => {
  const adminSecret = bytes(1);
  const sellerSecret = bytes(2);
  const bidder1Secret = bytes(10);
  const bidder2Secret = bytes(20);
  const auctionId = bytes(99);

  it('initializes admin ledger state correctly', () => {
    const harness = new AegisBidHarness(adminSecret);
    const state = harness.publicState;
    const expectedAdmin = pureCircuits.deriveUserIdentity(adminSecret);
    expect(state.admin).toEqual(expectedAdmin);
    expect(state.totalBidsCount).toBe(0n);
  });

  it('allows seller to create an auction with reserve price and deadline', () => {
    const harness = new AegisBidHarness(adminSecret);
    const reservePrice = 100_000n;
    const deadline = 500n;

    harness.call('createAuction', sellerSecret, [auctionId, reservePrice, deadline]);
    const state = harness.publicState;

    expect(state.auctions.member(auctionId)).toBe(true);
    const auction = state.auctions.lookup(auctionId);
    expect(auction.reservePrice).toBe(reservePrice);
    expect(auction.biddingDeadline).toBe(deadline);
    expect(auction.state).toBe(AuctionState.Open);
  });

  it('rejects duplicate auction creation with same ID', () => {
    const harness = new AegisBidHarness(adminSecret);
    harness.call('createAuction', sellerSecret, [auctionId, 50_000n, 1000n]);

    expect(() => {
      harness.call('createAuction', sellerSecret, [auctionId, 60_000n, 1000n]);
    }).toThrow('Auction already exists');
  });

  it('accepts a sealed bid that meets reserve price without disclosing bid amount', () => {
    const harness = new AegisBidHarness(adminSecret);
    harness.call('createAuction', sellerSecret, [auctionId, 100_000n, 500n]);

    const bidWitness: BidWitness = {
      auctionId,
      bidderSecret: bidder1Secret,
      amount: 150_000n, // Above reserve
      salt: bytes(77),
    };

    harness.call('submitSealedBid', bidder1Secret, [auctionId], bidWitness);
    const state = harness.publicState;

    expect(state.totalBidsCount).toBe(1n);

    // Verify nullifier was marked
    const expectedNullifier = pureCircuits.deriveBidNullifier(auctionId, bidder1Secret);
    expect(state.spentNullifiers.member(expectedNullifier)).toBe(true);

    // Verify commitment is stored
    const bidderIdentity = pureCircuits.deriveUserIdentity(bidder1Secret);
    const expectedCommitment = pureCircuits.deriveBidCommitment(
      auctionId,
      bidderIdentity,
      bidWitness.amount,
      bidWitness.salt,
    );
    expect(state.bidCommitments.member(expectedCommitment)).toBe(true);
  });

  it('rejects bids below reserve price in ZK circuit assert', () => {
    const harness = new AegisBidHarness(adminSecret);
    harness.call('createAuction', sellerSecret, [auctionId, 100_000n, 500n]);

    const belowReserveWitness: BidWitness = {
      auctionId,
      bidderSecret: bidder1Secret,
      amount: 80_000n, // Below 100_000n reserve!
      salt: bytes(11),
    };

    expect(() => {
      harness.call('submitSealedBid', bidder1Secret, [auctionId], belowReserveWitness);
    }).toThrow('Bid amount below reserve price');
  });

  it('prevents bidder replay: same identity cannot bid twice on same auction', () => {
    const harness = new AegisBidHarness(adminSecret);
    harness.call('createAuction', sellerSecret, [auctionId, 100_000n, 500n]);

    const bid1: BidWitness = {
      auctionId,
      bidderSecret: bidder1Secret,
      amount: 120_000n,
      salt: bytes(1),
    };
    harness.call('submitSealedBid', bidder1Secret, [auctionId], bid1);

    const bid2: BidWitness = {
      auctionId,
      bidderSecret: bidder1Secret, // Same bidder secret!
      amount: 140_000n,
      salt: bytes(2),
    };

    expect(() => {
      harness.call('submitSealedBid', bidder1Secret, [auctionId], bid2);
    }).toThrow('Bidder nullifier already used');
  });

  it('enforces that only seller or admin can close bidding and cancel auction', () => {
    const harness = new AegisBidHarness(adminSecret);
    harness.call('createAuction', sellerSecret, [auctionId, 100_000n, 500n]);

    // Unauthorized bidder tries to close
    expect(() => {
      harness.call('closeBidding', bidder1Secret, [auctionId]);
    }).toThrow('Caller not authorized to close auction');

    // Seller can close
    harness.call('closeBidding', sellerSecret, [auctionId]);
    let state = harness.publicState;
    expect(state.auctions.lookup(auctionId).state).toBe(AuctionState.Closed);
  });

  it('allows winner to reveal bid and settle auction, updating winning commitment and identity', () => {
    const harness = new AegisBidHarness(adminSecret);
    harness.call('createAuction', sellerSecret, [auctionId, 100_000n, 500n]);

    const bidWitness: BidWitness = {
      auctionId,
      bidderSecret: bidder2Secret,
      amount: 250_000n,
      salt: bytes(88),
    };
    harness.call('submitSealedBid', bidder2Secret, [auctionId], bidWitness);
    harness.call('closeBidding', sellerSecret, [auctionId]);

    const revealWitness: RevealWitness = {
      auctionId,
      bidderSecret: bidder2Secret,
      amount: 250_000n,
      salt: bytes(88),
    };

    harness.call('revealAndSettle', bidder2Secret, [auctionId], undefined, revealWitness);
    const state = harness.publicState;
    const auction = state.auctions.lookup(auctionId);

    expect(auction.state).toBe(AuctionState.Settled);
    expect(auction.highestDisclosedBid).toBe(250_000n);
    const expectedWinner = pureCircuits.deriveUserIdentity(bidder2Secret);
    expect(auction.winnerIdentity).toEqual(expectedWinner);
  });
});
