import type * as __compactRuntime from '@midnight-ntwrk/compact-runtime';

export type RoleSecret = Uint8Array;

export type RoleIdentity = Uint8Array;

export type InvoiceCommitment = Uint8Array;

export type InvoiceNullifier = Uint8Array;

export type SupplierControlKey = Uint8Array;

export enum InvoiceStatus { Proposed = 0,
                            Accepted = 1,
                            PendingFinancing = 2,
                            FinancedConfirmed = 3,
                            Paid = 4,
                            Rejected = 5,
                            Cancelled = 6
}

export type InvoicePrivateData = { invoiceReference: Uint8Array;
                                   supplierIdentity: RoleIdentity;
                                   buyerIdentity: RoleIdentity;
                                   amountMinor: bigint;
                                   currencyCode: bigint;
                                   dueAt: bigint;
                                   salt: Uint8Array
                                 };

export type FinancingWitness = { invoice: InvoicePrivateData;
                                 supplierControlSecret: Uint8Array;
                                 buyerNullifierNonce: Uint8Array
                               };

export type AcceptanceWitness = { invoiceReference: Uint8Array;
                                  buyerNullifierNonce: Uint8Array
                                };

export type InvoiceRecord = { buyerIdentity: RoleIdentity;
                              supplierControlKey: SupplierControlKey;
                              nullifier: InvoiceNullifier;
                              status: InvoiceStatus;
                              policyId: bigint
                            };

export type LenderPolicy = { lenderIdentity: RoleIdentity;
                             currencyCode: bigint;
                             minimumAmount: bigint;
                             maximumAmount: bigint;
                             latestInvoiceDueAt: bigint;
                             requestDeadline: bigint;
                             active: boolean
                           };

export type Witnesses<PS> = {
  getRoleSecret(context: __compactRuntime.WitnessContext<Ledger, PS>): [PS, RoleSecret];
  getFinancingWitness(context: __compactRuntime.WitnessContext<Ledger, PS>): [PS, FinancingWitness];
  getAcceptanceWitness(context: __compactRuntime.WitnessContext<Ledger, PS>): [PS, AcceptanceWitness];
}

export type ImpureCircuits<PS> = {
  authorizeBuyer(context: __compactRuntime.CircuitContext<PS>,
                 identity_0: RoleIdentity): __compactRuntime.CircuitResults<PS, []>;
  revokeBuyer(context: __compactRuntime.CircuitContext<PS>,
              identity_0: RoleIdentity): __compactRuntime.CircuitResults<PS, []>;
  authorizeLender(context: __compactRuntime.CircuitContext<PS>,
                  identity_0: RoleIdentity): __compactRuntime.CircuitResults<PS, []>;
  revokeLender(context: __compactRuntime.CircuitContext<PS>,
               identity_0: RoleIdentity): __compactRuntime.CircuitResults<PS, []>;
  registerInvoiceCommitment(context: __compactRuntime.CircuitContext<PS>,
                            commitment_0: InvoiceCommitment,
                            buyerIdentity_0: RoleIdentity,
                            supplierControlKey_0: SupplierControlKey): __compactRuntime.CircuitResults<PS, []>;
  acceptInvoice(context: __compactRuntime.CircuitContext<PS>,
                commitment_0: InvoiceCommitment): __compactRuntime.CircuitResults<PS, []>;
  rejectInvoice(context: __compactRuntime.CircuitContext<PS>,
                commitment_0: InvoiceCommitment): __compactRuntime.CircuitResults<PS, []>;
  registerPolicy(context: __compactRuntime.CircuitContext<PS>,
                 policyId_0: bigint,
                 policy_0: LenderPolicy): __compactRuntime.CircuitResults<PS, []>;
  requestFinancing(context: __compactRuntime.CircuitContext<PS>,
                   commitment_0: InvoiceCommitment,
                   policyId_0: bigint): __compactRuntime.CircuitResults<PS, []>;
  confirmFinancing(context: __compactRuntime.CircuitContext<PS>,
                   commitment_0: InvoiceCommitment): __compactRuntime.CircuitResults<PS, []>;
  declineFinancing(context: __compactRuntime.CircuitContext<PS>,
                   commitment_0: InvoiceCommitment): __compactRuntime.CircuitResults<PS, []>;
  releaseExpiredRequest(context: __compactRuntime.CircuitContext<PS>,
                        commitment_0: InvoiceCommitment): __compactRuntime.CircuitResults<PS, []>;
  markInvoicePaid(context: __compactRuntime.CircuitContext<PS>,
                  commitment_0: InvoiceCommitment): __compactRuntime.CircuitResults<PS, []>;
}

export type ProvableCircuits<PS> = {
  authorizeBuyer(context: __compactRuntime.CircuitContext<PS>,
                 identity_0: RoleIdentity): __compactRuntime.CircuitResults<PS, []>;
  revokeBuyer(context: __compactRuntime.CircuitContext<PS>,
              identity_0: RoleIdentity): __compactRuntime.CircuitResults<PS, []>;
  authorizeLender(context: __compactRuntime.CircuitContext<PS>,
                  identity_0: RoleIdentity): __compactRuntime.CircuitResults<PS, []>;
  revokeLender(context: __compactRuntime.CircuitContext<PS>,
               identity_0: RoleIdentity): __compactRuntime.CircuitResults<PS, []>;
  registerInvoiceCommitment(context: __compactRuntime.CircuitContext<PS>,
                            commitment_0: InvoiceCommitment,
                            buyerIdentity_0: RoleIdentity,
                            supplierControlKey_0: SupplierControlKey): __compactRuntime.CircuitResults<PS, []>;
  acceptInvoice(context: __compactRuntime.CircuitContext<PS>,
                commitment_0: InvoiceCommitment): __compactRuntime.CircuitResults<PS, []>;
  rejectInvoice(context: __compactRuntime.CircuitContext<PS>,
                commitment_0: InvoiceCommitment): __compactRuntime.CircuitResults<PS, []>;
  registerPolicy(context: __compactRuntime.CircuitContext<PS>,
                 policyId_0: bigint,
                 policy_0: LenderPolicy): __compactRuntime.CircuitResults<PS, []>;
  requestFinancing(context: __compactRuntime.CircuitContext<PS>,
                   commitment_0: InvoiceCommitment,
                   policyId_0: bigint): __compactRuntime.CircuitResults<PS, []>;
  confirmFinancing(context: __compactRuntime.CircuitContext<PS>,
                   commitment_0: InvoiceCommitment): __compactRuntime.CircuitResults<PS, []>;
  declineFinancing(context: __compactRuntime.CircuitContext<PS>,
                   commitment_0: InvoiceCommitment): __compactRuntime.CircuitResults<PS, []>;
  releaseExpiredRequest(context: __compactRuntime.CircuitContext<PS>,
                        commitment_0: InvoiceCommitment): __compactRuntime.CircuitResults<PS, []>;
  markInvoicePaid(context: __compactRuntime.CircuitContext<PS>,
                  commitment_0: InvoiceCommitment): __compactRuntime.CircuitResults<PS, []>;
}

export type PureCircuits = {
  deriveAdminIdentity(secret_0: RoleSecret): RoleIdentity;
  deriveBuyerIdentity(secret_0: RoleSecret): RoleIdentity;
  deriveLenderIdentity(secret_0: RoleSecret): RoleIdentity;
  deriveInvoiceCommitment(data_0: InvoicePrivateData): InvoiceCommitment;
  deriveInvoiceNullifier(buyerIdentity_0: RoleIdentity,
                         invoiceReference_0: Uint8Array,
                         nonce_0: Uint8Array): InvoiceNullifier;
  deriveSupplierControlKey(commitment_0: InvoiceCommitment, secret_0: Uint8Array): SupplierControlKey;
}

export type Circuits<PS> = {
  deriveAdminIdentity(context: __compactRuntime.CircuitContext<PS>,
                      secret_0: RoleSecret): __compactRuntime.CircuitResults<PS, RoleIdentity>;
  deriveBuyerIdentity(context: __compactRuntime.CircuitContext<PS>,
                      secret_0: RoleSecret): __compactRuntime.CircuitResults<PS, RoleIdentity>;
  deriveLenderIdentity(context: __compactRuntime.CircuitContext<PS>,
                       secret_0: RoleSecret): __compactRuntime.CircuitResults<PS, RoleIdentity>;
  deriveInvoiceCommitment(context: __compactRuntime.CircuitContext<PS>,
                          data_0: InvoicePrivateData): __compactRuntime.CircuitResults<PS, InvoiceCommitment>;
  deriveInvoiceNullifier(context: __compactRuntime.CircuitContext<PS>,
                         buyerIdentity_0: RoleIdentity,
                         invoiceReference_0: Uint8Array,
                         nonce_0: Uint8Array): __compactRuntime.CircuitResults<PS, InvoiceNullifier>;
  deriveSupplierControlKey(context: __compactRuntime.CircuitContext<PS>,
                           commitment_0: InvoiceCommitment,
                           secret_0: Uint8Array): __compactRuntime.CircuitResults<PS, SupplierControlKey>;
  authorizeBuyer(context: __compactRuntime.CircuitContext<PS>,
                 identity_0: RoleIdentity): __compactRuntime.CircuitResults<PS, []>;
  revokeBuyer(context: __compactRuntime.CircuitContext<PS>,
              identity_0: RoleIdentity): __compactRuntime.CircuitResults<PS, []>;
  authorizeLender(context: __compactRuntime.CircuitContext<PS>,
                  identity_0: RoleIdentity): __compactRuntime.CircuitResults<PS, []>;
  revokeLender(context: __compactRuntime.CircuitContext<PS>,
               identity_0: RoleIdentity): __compactRuntime.CircuitResults<PS, []>;
  registerInvoiceCommitment(context: __compactRuntime.CircuitContext<PS>,
                            commitment_0: InvoiceCommitment,
                            buyerIdentity_0: RoleIdentity,
                            supplierControlKey_0: SupplierControlKey): __compactRuntime.CircuitResults<PS, []>;
  acceptInvoice(context: __compactRuntime.CircuitContext<PS>,
                commitment_0: InvoiceCommitment): __compactRuntime.CircuitResults<PS, []>;
  rejectInvoice(context: __compactRuntime.CircuitContext<PS>,
                commitment_0: InvoiceCommitment): __compactRuntime.CircuitResults<PS, []>;
  registerPolicy(context: __compactRuntime.CircuitContext<PS>,
                 policyId_0: bigint,
                 policy_0: LenderPolicy): __compactRuntime.CircuitResults<PS, []>;
  requestFinancing(context: __compactRuntime.CircuitContext<PS>,
                   commitment_0: InvoiceCommitment,
                   policyId_0: bigint): __compactRuntime.CircuitResults<PS, []>;
  confirmFinancing(context: __compactRuntime.CircuitContext<PS>,
                   commitment_0: InvoiceCommitment): __compactRuntime.CircuitResults<PS, []>;
  declineFinancing(context: __compactRuntime.CircuitContext<PS>,
                   commitment_0: InvoiceCommitment): __compactRuntime.CircuitResults<PS, []>;
  releaseExpiredRequest(context: __compactRuntime.CircuitContext<PS>,
                        commitment_0: InvoiceCommitment): __compactRuntime.CircuitResults<PS, []>;
  markInvoicePaid(context: __compactRuntime.CircuitContext<PS>,
                  commitment_0: InvoiceCommitment): __compactRuntime.CircuitResults<PS, []>;
}

export type Ledger = {
  readonly contractAdmin: RoleIdentity;
  authorizedBuyers: {
    isEmpty(): boolean;
    size(): bigint;
    member(elem_0: RoleIdentity): boolean;
    [Symbol.iterator](): Iterator<RoleIdentity>
  };
  authorizedLenders: {
    isEmpty(): boolean;
    size(): bigint;
    member(elem_0: RoleIdentity): boolean;
    [Symbol.iterator](): Iterator<RoleIdentity>
  };
  invoices: {
    isEmpty(): boolean;
    size(): bigint;
    member(key_0: InvoiceCommitment): boolean;
    lookup(key_0: InvoiceCommitment): InvoiceRecord;
    [Symbol.iterator](): Iterator<[InvoiceCommitment, InvoiceRecord]>
  };
  policies: {
    isEmpty(): boolean;
    size(): bigint;
    member(key_0: bigint): boolean;
    lookup(key_0: bigint): LenderPolicy;
    [Symbol.iterator](): Iterator<[bigint, LenderPolicy]>
  };
  consumedNullifiers: {
    isEmpty(): boolean;
    size(): bigint;
    member(elem_0: InvoiceNullifier): boolean;
    [Symbol.iterator](): Iterator<InvoiceNullifier>
  };
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
