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
  InvoiceStatus,
  ledger,
  pureCircuits,
  type FinancingWitness,
  type AcceptanceWitness,
  type InvoicePrivateData,
  type LenderPolicy,
  type RoleSecret,
  type Witnesses,
} from './managed/prooffactor/contract/index.js';

type PrivateState = {
  roleSecret: RoleSecret;
  financingWitness: FinancingWitness;
  acceptanceWitness: AcceptanceWitness;
};

const bytes = (seed: number): Uint8Array => new Uint8Array(32).fill(seed);

const blankInvoice = (): InvoicePrivateData => ({
  invoiceReference: bytes(0),
  supplierIdentity: bytes(0),
  buyerIdentity: bytes(0),
  amountMinor: 0n,
  currencyCode: 0n,
  dueAt: 0n,
  salt: bytes(0),
});

const privateState = (roleSecret: RoleSecret): PrivateState => ({
  roleSecret,
  financingWitness: {
    invoice: blankInvoice(),
    supplierControlSecret: bytes(0),
    buyerNullifierNonce: bytes(0),
  },
  acceptanceWitness: {
    invoiceReference: bytes(0),
    buyerNullifierNonce: bytes(0),
  },
});

const witnesses: Witnesses<PrivateState> = {
  getRoleSecret: ({ privateState }) => [
    privateState,
    privateState.roleSecret,
  ],
  getFinancingWitness: ({ privateState }) => [
    privateState,
    privateState.financingWitness,
  ],
  getAcceptanceWitness: ({ privateState }) => [
    privateState,
    privateState.acceptanceWitness,
  ],
};

class Harness {
  readonly contract = new Contract(witnesses);
  private state: ChargedState;
  private zswap: EncodedZswapLocalState;
  private localState: PrivateState;

  constructor(adminSecret: RoleSecret) {
    const initial = privateState(adminSecret);
    const result = this.contract.initialState(
      createConstructorContext(initial, { bytes: bytes(250) }),
    );
    this.state = result.currentContractState.data;
    this.zswap = result.currentZswapLocalState;
    this.localState = result.currentPrivateState;
  }

  call(
    circuit: keyof Contract<PrivateState>['impureCircuits'],
    secret: RoleSecret,
    args: readonly unknown[],
    financingWitness?: FinancingWitness,
    acceptanceWitness?: AcceptanceWitness,
    time = 1_000,
  ): void {
    this.localState = {
      roleSecret: secret,
      financingWitness: financingWitness ?? this.localState.financingWitness,
      acceptanceWitness: acceptanceWitness ?? this.localState.acceptanceWitness,
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
    };
    const result = run(context, ...args);
    this.state = result.context.currentQueryContext.state;
    this.zswap = result.context.currentZswapLocalState;
    this.localState = result.context.currentPrivateState;
  }

  get publicState() {
    return ledger(this.state);
  }
}

describe('ProofFactor Compact contract', () => {
  const adminSecret = bytes(1);
  const buyerSecret = bytes(2);
  const lenderSecret = bytes(3);
  const supplierIdentity = bytes(4);
  const supplierControlSecret = bytes(5);
  const buyerNullifierNonce = bytes(6);

  const buyerIdentity = pureCircuits.deriveBuyerIdentity(buyerSecret);
  const lenderIdentity = pureCircuits.deriveLenderIdentity(lenderSecret);

  const invoice = (saltSeed = 7): InvoicePrivateData => ({
    invoiceReference: bytes(8),
    supplierIdentity,
    buyerIdentity,
    amountMinor: 125_000n,
    currencyCode: 840n,
    dueAt: 2_000_000_000n,
    salt: bytes(saltSeed),
  });

  const policy = (): LenderPolicy => ({
    lenderIdentity,
    currencyCode: 840n,
    minimumAmount: 10_000n,
    maximumAmount: 1_000_000n,
    latestInvoiceDueAt: 2_100_000_000n,
    requestDeadline: 1_900_000_000n,
    active: true,
  });

  const registerAndAccept = (
    harness: Harness,
    data: InvoicePrivateData,
  ): { commitment: Uint8Array; nullifier: Uint8Array } => {
    const commitment = pureCircuits.deriveInvoiceCommitment(data);
    const controlKey = pureCircuits.deriveSupplierControlKey(
      commitment,
      supplierControlSecret,
    );
    const nullifier = pureCircuits.deriveInvoiceNullifier(
      buyerIdentity,
      data.invoiceReference,
      buyerNullifierNonce,
    );
    harness.call('registerInvoiceCommitment', supplierIdentity, [
      commitment,
      buyerIdentity,
      controlKey,
    ]);
    harness.call('acceptInvoice', buyerSecret, [commitment], undefined, {
      invoiceReference: data.invoiceReference,
      buyerNullifierNonce,
    });
    expect(harness.publicState.invoices.lookup(commitment).nullifier).toEqual(nullifier);
    return { commitment, nullifier };
  };

  it('domain-separates admin, buyer, and lender identities', () => {
    const secret = bytes(21);
    expect(pureCircuits.deriveAdminIdentity(secret)).not.toEqual(
      pureCircuits.deriveBuyerIdentity(secret),
    );
    expect(pureCircuits.deriveBuyerIdentity(secret)).not.toEqual(
      pureCircuits.deriveLenderIdentity(secret),
    );
  });

  it('allows only the private admin identity to authorize participants', () => {
    const harness = new Harness(adminSecret);
    expect(() =>
      harness.call('authorizeBuyer', buyerSecret, [buyerIdentity]),
    ).toThrow(/Only the contract admin/);

    harness.call('authorizeBuyer', adminSecret, [buyerIdentity]);
    expect(harness.publicState.authorizedBuyers.member(buyerIdentity)).toBe(true);
  });

  it('rejects an empty buyer acceptance opening', () => {
    const harness = new Harness(adminSecret);
    harness.call('authorizeBuyer', adminSecret, [buyerIdentity]);
    const data = invoice();
    const commitment = pureCircuits.deriveInvoiceCommitment(data);
    const controlKey = pureCircuits.deriveSupplierControlKey(commitment, supplierControlSecret);
    harness.call('registerInvoiceCommitment', supplierIdentity, [commitment, buyerIdentity, controlKey]);

    expect(() =>
      harness.call('acceptInvoice', buyerSecret, [commitment], undefined, {
        invoiceReference: bytes(0),
        buyerNullifierNonce: bytes(0),
      }),
    ).toThrow(/Invoice reference is required/);
  });

  it('enforces buyer and lender roles across the financing lifecycle', () => {
    const harness = new Harness(adminSecret);
    harness.call('authorizeBuyer', adminSecret, [buyerIdentity]);
    harness.call('authorizeLender', adminSecret, [lenderIdentity]);

    const data = invoice();
    const { commitment } = registerAndAccept(harness, data);

    expect(() =>
      harness.call('registerPolicy', buyerSecret, [1n, policy()]),
    ).toThrow(/Lender identity is not authorized/);

    harness.call('registerPolicy', lenderSecret, [1n, policy()]);
    harness.call(
      'requestFinancing',
      supplierIdentity,
      [commitment, 1n],
      {
        invoice: data,
        supplierControlSecret,
        buyerNullifierNonce,
      },
    );
    expect(harness.publicState.invoices.lookup(commitment).status).toBe(
      InvoiceStatus.PendingFinancing,
    );

    expect(() =>
      harness.call('confirmFinancing', buyerSecret, [commitment]),
    ).toThrow(/Only the selected lender/);

    harness.call('confirmFinancing', lenderSecret, [commitment]);
    expect(harness.publicState.invoices.lookup(commitment).status).toBe(
      InvoiceStatus.FinancedConfirmed,
    );
  });

  it('rejects a false supplier-control opening', () => {
    const harness = new Harness(adminSecret);
    harness.call('authorizeBuyer', adminSecret, [buyerIdentity]);
    harness.call('authorizeLender', adminSecret, [lenderIdentity]);
    harness.call('registerPolicy', lenderSecret, [1n, policy()]);
    const data = invoice();
    const { commitment } = registerAndAccept(harness, data);

    expect(() =>
      harness.call(
        'requestFinancing',
        supplierIdentity,
        [commitment, 1n],
        {
          invoice: data,
          supplierControlSecret: bytes(99),
          buyerNullifierNonce,
        },
      ),
    ).toThrow(/Supplier control secret is invalid/);
  });

  it('prevents financing two commitments with the same stable nullifier', () => {
    const harness = new Harness(adminSecret);
    harness.call('authorizeBuyer', adminSecret, [buyerIdentity]);
    harness.call('authorizeLender', adminSecret, [lenderIdentity]);
    harness.call('registerPolicy', lenderSecret, [1n, policy()]);

    const first = invoice(10);
    const firstRecord = registerAndAccept(harness, first);
    harness.call(
      'requestFinancing',
      supplierIdentity,
      [firstRecord.commitment, 1n],
      {
        invoice: first,
        supplierControlSecret,
        buyerNullifierNonce,
      },
    );
    harness.call('confirmFinancing', lenderSecret, [firstRecord.commitment]);

    const second = invoice(11);
    const secondRecord = registerAndAccept(harness, second);
    expect(secondRecord.commitment).not.toEqual(firstRecord.commitment);
    expect(secondRecord.nullifier).toEqual(firstRecord.nullifier);
    expect(() =>
      harness.call(
        'requestFinancing',
        supplierIdentity,
        [secondRecord.commitment, 1n],
        {
          invoice: second,
          supplierControlSecret,
          buyerNullifierNonce,
        },
      ),
    ).toThrow(/Invoice was already financed/);
  });
  it('releases a pending request only at or after the policy deadline', () => {
    const harness = new Harness(adminSecret);
    harness.call('authorizeBuyer', adminSecret, [buyerIdentity]);
    harness.call('authorizeLender', adminSecret, [lenderIdentity]);
    harness.call('registerPolicy', lenderSecret, [1n, policy()]);

    const data = invoice(12);
    const { commitment } = registerAndAccept(harness, data);
    harness.call(
      'requestFinancing',
      supplierIdentity,
      [commitment, 1n],
      {
        invoice: data,
        supplierControlSecret,
        buyerNullifierNonce,
      },
    );

    expect(() =>
      harness.call(
        'releaseExpiredRequest',
        supplierIdentity,
        [commitment],
        undefined,
        undefined,
        1_899_999_999,
      ),
    ).toThrow(/has not expired/);

    harness.call(
      'releaseExpiredRequest',
      supplierIdentity,
      [commitment],
      undefined,
      undefined,
      1_900_000_000,
    );
    expect(harness.publicState.invoices.lookup(commitment).status).toBe(
      InvoiceStatus.Accepted,
    );
  });

});
