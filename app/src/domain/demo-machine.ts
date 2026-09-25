import type { Invoice, InvoiceStatus, NewInvoiceInput } from './types';

const allowedTransitions: Record<InvoiceStatus, readonly InvoiceStatus[]> = {
  PROPOSED: ['ACCEPTED', 'REJECTED', 'CANCELLED'],
  ACCEPTED: ['PENDING_FINANCING', 'PAID', 'CANCELLED', 'EXPIRED'],
  PENDING_FINANCING: ['ACCEPTED', 'FINANCED_CONFIRMED', 'PAID', 'EXPIRED'],
  FINANCED_CONFIRMED: ['PAID'],
  PAID: [],
  REJECTED: [],
  CANCELLED: [],
  EXPIRED: [],
};

export function transitionInvoice(invoice: Invoice, next: InvoiceStatus): Invoice {
  if (!allowedTransitions[invoice.status].includes(next)) {
    throw new Error(`Invalid invoice transition: ${invoice.status} -> ${next}`);
  }

  return {
    ...invoice,
    status: next,
    updatedAt: 'Just now',
    proofVerified: next === 'PENDING_FINANCING' || next === 'FINANCED_CONFIRMED' ? true : invoice.proofVerified,
  };
}

function demoHex(input: string): string {
  let first = 0x811c9dc5;
  let second = 0x9e3779b9;
  for (let index = 0; index < input.length; index += 1) {
    first = Math.imul(first ^ input.charCodeAt(index), 0x01000193);
    second = Math.imul(second ^ input.charCodeAt(index), 0x85ebca6b);
  }
  return `${(first >>> 0).toString(16).padStart(8, '0')}${(second >>> 0).toString(16).padStart(8, '0')}`;
}

export function createDemoInvoice(input: NewInvoiceInput, ordinal: number): Invoice {
  const amountMinor = Math.round(Number(input.amount) * 100);
  if (!Number.isFinite(amountMinor) || amountMinor <= 0) {
    throw new Error('Invoice amount must be greater than zero.');
  }

  const canonicalDemoInput = [input.alias.trim(), input.buyerAlias.trim(), amountMinor, input.currency, input.dueDate].join('|');
  return {
    id: `invoice-${ordinal}-${demoHex(canonicalDemoInput).slice(0, 6)}`,
    alias: input.alias.trim(),
    supplierAlias: 'Northstar Supply',
    buyerAlias: input.buyerAlias.trim(),
    commitment: `0x${demoHex(`commitment|${canonicalDemoInput}`)}`,
    nullifier: null,
    status: 'PROPOSED',
    currency: input.currency,
    amountMinor,
    dueWindow: 'Pending buyer review',
    dueDate: input.dueDate,
    updatedAt: 'Just now',
    policyId: null,
    proofVerified: false,
  };
}

export function isPolicyEligible(invoice: Invoice, minMinor: number, maxMinor: number, currency: Invoice['currency']): boolean {
  return (
    invoice.status === 'ACCEPTED' &&
    invoice.currency === currency &&
    invoice.amountMinor >= minMinor &&
    invoice.amountMinor <= maxMinor
  );
}
