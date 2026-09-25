import type * as __compactRuntime from '@midnight-ntwrk/compact-runtime';

export type AuctionId = Uint8Array;

export type BidCommitment = Uint8Array;

export type BidNullifier = Uint8Array;

export type UserIdentity = Uint8Array;

export type UserSecret = Uint8Array;

export enum AuctionState { Open = 0, Closed = 1, Settled = 2, Cancelled = 3 }

export type AuctionDetails = { seller: UserIdentity;
                               reservePrice: bigint;
                               biddingDeadline: bigint;
                               state: AuctionState;
                               highestCommitment: BidCommitment;
                               highestDisclosedBid: bigint;
                               winnerIdentity: UserIdentity
                             };

export type BidWitness = { auctionId: AuctionId;
                           bidderSecret: UserSecret;
                           amount: bigint;
                           salt: Uint8Array
                         };

export type RevealWitness = { auctionId: AuctionId;
                              bidderSecret: UserSecret;
                              amount: bigint;
                              salt: Uint8Array
                            };

export type Witnesses<PS> = {
  getCallerSecret(context: __compactRuntime.WitnessContext<Ledger, PS>): [PS, UserSecret];
  getBidWitness(context: __compactRuntime.WitnessContext<Ledger, PS>): [PS, BidWitness];
  getRevealWitness(context: __compactRuntime.WitnessContext<Ledger, PS>): [PS, RevealWitness];
}

export type ImpureCircuits<PS> = {
  createAuction(context: __compactRuntime.CircuitContext<PS>,
                auctionId_0: AuctionId,
                reservePrice_0: bigint,
                biddingDeadline_0: bigint): __compactRuntime.CircuitResults<PS, []>;
  submitSealedBid(context: __compactRuntime.CircuitContext<PS>,
                  auctionId_0: AuctionId): __compactRuntime.CircuitResults<PS, BidCommitment>;
  closeBidding(context: __compactRuntime.CircuitContext<PS>,
               auctionId_0: AuctionId): __compactRuntime.CircuitResults<PS, []>;
  revealAndSettle(context: __compactRuntime.CircuitContext<PS>,
                  auctionId_0: AuctionId): __compactRuntime.CircuitResults<PS, []>;
  cancelAuction(context: __compactRuntime.CircuitContext<PS>,
                auctionId_0: AuctionId): __compactRuntime.CircuitResults<PS, []>;
}

export type ProvableCircuits<PS> = {
  createAuction(context: __compactRuntime.CircuitContext<PS>,
                auctionId_0: AuctionId,
                reservePrice_0: bigint,
                biddingDeadline_0: bigint): __compactRuntime.CircuitResults<PS, []>;
  submitSealedBid(context: __compactRuntime.CircuitContext<PS>,
                  auctionId_0: AuctionId): __compactRuntime.CircuitResults<PS, BidCommitment>;
  closeBidding(context: __compactRuntime.CircuitContext<PS>,
               auctionId_0: AuctionId): __compactRuntime.CircuitResults<PS, []>;
  revealAndSettle(context: __compactRuntime.CircuitContext<PS>,
                  auctionId_0: AuctionId): __compactRuntime.CircuitResults<PS, []>;
  cancelAuction(context: __compactRuntime.CircuitContext<PS>,
                auctionId_0: AuctionId): __compactRuntime.CircuitResults<PS, []>;
}

export type PureCircuits = {
  deriveUserIdentity(secret_0: UserSecret): UserIdentity;
  deriveBidCommitment(auctionId_0: AuctionId,
                      bidder_0: UserIdentity,
                      amount_0: bigint,
                      salt_0: Uint8Array): BidCommitment;
  deriveBidNullifier(auctionId_0: AuctionId, secret_0: UserSecret): BidNullifier;
}

export type Circuits<PS> = {
  deriveUserIdentity(context: __compactRuntime.CircuitContext<PS>,
                     secret_0: UserSecret): __compactRuntime.CircuitResults<PS, UserIdentity>;
  deriveBidCommitment(context: __compactRuntime.CircuitContext<PS>,
                      auctionId_0: AuctionId,
                      bidder_0: UserIdentity,
                      amount_0: bigint,
                      salt_0: Uint8Array): __compactRuntime.CircuitResults<PS, BidCommitment>;
  deriveBidNullifier(context: __compactRuntime.CircuitContext<PS>,
                     auctionId_0: AuctionId,
                     secret_0: UserSecret): __compactRuntime.CircuitResults<PS, BidNullifier>;
  createAuction(context: __compactRuntime.CircuitContext<PS>,
                auctionId_0: AuctionId,
                reservePrice_0: bigint,
                biddingDeadline_0: bigint): __compactRuntime.CircuitResults<PS, []>;
  submitSealedBid(context: __compactRuntime.CircuitContext<PS>,
                  auctionId_0: AuctionId): __compactRuntime.CircuitResults<PS, BidCommitment>;
  closeBidding(context: __compactRuntime.CircuitContext<PS>,
               auctionId_0: AuctionId): __compactRuntime.CircuitResults<PS, []>;
  revealAndSettle(context: __compactRuntime.CircuitContext<PS>,
                  auctionId_0: AuctionId): __compactRuntime.CircuitResults<PS, []>;
  cancelAuction(context: __compactRuntime.CircuitContext<PS>,
                auctionId_0: AuctionId): __compactRuntime.CircuitResults<PS, []>;
}

export type Ledger = {
  readonly admin: UserIdentity;
  auctions: {
    isEmpty(): boolean;
    size(): bigint;
    member(key_0: AuctionId): boolean;
    lookup(key_0: AuctionId): AuctionDetails;
    [Symbol.iterator](): Iterator<[AuctionId, AuctionDetails]>
  };
  bidCommitments: {
    isEmpty(): boolean;
    size(): bigint;
    member(elem_0: BidCommitment): boolean;
    [Symbol.iterator](): Iterator<BidCommitment>
  };
  spentNullifiers: {
    isEmpty(): boolean;
    size(): bigint;
    member(elem_0: BidNullifier): boolean;
    [Symbol.iterator](): Iterator<BidNullifier>
  };
  readonly totalBidsCount: bigint;
}

export type ContractReferenceLocations = any;

export declare const contractReferenceLocations : ContractReferenceLocations;

export declare class Contract<PS = any, W extends Witnesses<PS> = Witnesses<PS>> {
  witnesses: W;
  circuits: Circuits<PS>;
  impureCircuits: ImpureCircuits<PS>;
  provableCircuits: ProvableCircuits<PS>;
  constructor(witnesses: W);
  initialState(context: __compactRuntime.ConstructorContext<PS>): __compactRuntime.ConstructorResult<PS>;
}

export declare function ledger(state: __compactRuntime.StateValue | __compactRuntime.ChargedState): Ledger;
export declare const pureCircuits: PureCircuits;
