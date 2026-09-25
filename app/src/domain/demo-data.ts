import type { ActivityItem, Invoice, Policy, TransactionStage } from './types';

export const demoInvoices: Invoice[] = [
  {
    id: 'harbor-17',
    alias: 'Harbor-17',
    supplierAlias: 'Northstar Supply',
    buyerAlias: 'Juniper Works',
    commitment: '0x7a3c5d8f224af6b491e2',
    nullifier: '0x50e18d7a20bc44c9',
    status: 'ACCEPTED',
    currency: 'USD',
    amountMinor: 4_280_000,
    dueWindow: '18–24 days',
    dueDate: '2026-10-19',
    updatedAt: '12 min ago',
    policyId: null,
    proofVerified: false,
  },
  {
    id: 'cedar-08',
    alias: 'Cedar-08',
    supplierAlias: 'Northstar Supply',
    buyerAlias: 'Atlas Retail',
    commitment: '0x19bd990ab6e9f442',
    nullifier: '0x88d017b4f2cc91ad',
    status: 'PENDING_FINANCING',
    currency: 'USD',
    amountMinor: 7_850_000,
    dueWindow: '31–45 days',
    dueDate: '2026-11-04',
    updatedAt: '2 hr ago',
    policyId: 'greenline-v3',
    proofVerified: true,
  },
  {
    id: 'tide-24',
    alias: 'Tide-24',
    supplierAlias: 'Northstar Supply',
    buyerAlias: 'Copper & Co.',
    commitment: '0x640ae120d4b8af77',
    nullifier: null,
    status: 'PROPOSED',
    currency: 'EUR',
    amountMinor: 2_190_000,
    dueWindow: '45–60 days',
    dueDate: '2026-11-23',
    updatedAt: 'Yesterday',
    policyId: null,
    proofVerified: false,
  },
];

export const demoPolicies: Policy[] = [
  {
    id: 'greenline-v3',
    lenderAlias: 'Greenline Working Capital',
    currency: 'USD',
    minMinor: 1_000_000,
    maxMinor: 10_000_000,
    maxRemainingDays: 60,
    active: true,
  },
  {
    id: 'meridian-v2',
    lenderAlias: 'Meridian Trade Advance',
    currency: 'EUR',
    minMinor: 500_000,
    maxMinor: 8_000_000,
    maxRemainingDays: 45,
    active: true,
  },
  {
    id: 'northbank-v1',
    lenderAlias: 'Northbank Receivables',
    currency: 'GBP',
    minMinor: 2_000_000,
    maxMinor: 15_000_000,
    maxRemainingDays: 90,
    active: true,
  },
];

export const initialActivity: ActivityItem[] = [
  { id: 'a1', invoiceAlias: 'Harbor-17', message: 'Buyer acceptance finalized', timestamp: '12 min ago' },
  { id: 'a2', invoiceAlias: 'Cedar-08', message: 'Private policy proof verified', timestamp: '2 hr ago' },
  { id: 'a3', invoiceAlias: 'Tide-24', message: 'Commitment registered', timestamp: 'Yesterday' },
];

export const transactionStages: TransactionStage[] = [
  { id: 'proof', label: 'Generate proof', description: 'Check eligibility without disclosing invoice values.', state: 'waiting' },
  { id: 'wallet', label: 'Approve in wallet', description: 'Review public effects and authorize the transaction.', state: 'waiting' },
  { id: 'submit', label: 'Submit transaction', description: 'Publish proof output and the pending request lock.', state: 'waiting' },
  { id: 'finality', label: 'Await finality', description: 'Confirm inclusion on Midnight Preprod.', state: 'waiting' },
];

export const roleLabels = {
  supplier: 'Supplier',
  buyer: 'Buyer',
  lender: 'Lender',
  viewer: 'Public viewer',
} as const;

export const statusLabels = {
  PROPOSED: 'Proposed',
  ACCEPTED: 'Accepted',
  PENDING_FINANCING: 'Pending financing',
  FINANCED_CONFIRMED: 'Financed confirmed',
  PAID: 'Paid',
  REJECTED: 'Rejected',
  CANCELLED: 'Cancelled',
  EXPIRED: 'Expired',
} as const;
