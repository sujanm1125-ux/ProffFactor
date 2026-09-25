import { describe, expect, it } from 'vitest';
import { demoInvoices } from './demo-data';
import { createDemoInvoice, isPolicyEligible, transitionInvoice } from './demo-machine';

describe('ProofFactor demo lifecycle', () => {
  it('allows the valid accepted to pending-financing transition', () => {
    const accepted = demoInvoices.find((invoice) => invoice.status === 'ACCEPTED')!;
    expect(transitionInvoice(accepted, 'PENDING_FINANCING').status).toBe('PENDING_FINANCING');
  });

  it('rejects an invalid proposed to financed transition', () => {
    const proposed = demoInvoices.find((invoice) => invoice.status === 'PROPOSED')!;
    expect(() => transitionInvoice(proposed, 'FINANCED_CONFIRMED')).toThrow('Invalid invoice transition');
  });

  it('creates deterministic demo commitments without exposing the amount', () => {
    const input = {
      alias: 'Delta-31',
      buyerAlias: 'Elm Trading',
      amount: '25000',
      currency: 'USD' as const,
      dueDate: '2026-12-12',
    };
    const first = createDemoInvoice(input, 4);
    const second = createDemoInvoice(input, 4);
    expect(first.commitment).toBe(second.commitment);
    expect(first.commitment).not.toContain(input.amount);
    expect(first.status).toBe('PROPOSED');
  });

  it('evaluates amount and currency inside the policy boundary', () => {
    const accepted = demoInvoices.find((invoice) => invoice.status === 'ACCEPTED')!;
    expect(isPolicyEligible(accepted, 1_000_000, 10_000_000, 'USD')).toBe(true);
    expect(isPolicyEligible(accepted, 1_000_000, 10_000_000, 'EUR')).toBe(false);
  });
});
