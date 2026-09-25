import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { App } from './App';

describe('ProofFactor application shell', () => {
  it('renders the supplier decision-first dashboard', () => {
    render(<App />);
    expect(screen.getByRole('heading', { name: 'Good morning, Northstar.' })).toBeInTheDocument();
    expect(screen.getByText('Synthetic data only.', { exact: false })).toBeInTheDocument();
    expect(screen.getAllByText('PRIVATE INPUT').length).toBeGreaterThan(0);
  });

  it('switches to the buyer review experience', () => {
    render(<App />);
    fireEvent.change(screen.getByLabelText('Selected role'), { target: { value: 'buyer' } });
    expect(screen.getByRole('heading', { name: 'Review acknowledged invoices.' })).toBeInTheDocument();
    expect(screen.getByText('Buyer review queue')).toBeInTheDocument();
  });

  it('opens the invoice registration workflow', () => {
    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: 'Register invoice' }));
    expect(screen.getByRole('dialog', { name: 'Register invoice commitment' })).toBeInTheDocument();
    expect(screen.getByText('Private fields stay local in this demo.')).toBeInTheDocument();
  });

  it('requires a display name before showing wallet choices', () => {
    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: 'Connect wallet' }));
    expect(screen.getByRole('heading', { name: 'Choose a wallet' })).toBeInTheDocument();
    expect(screen.getByLabelText('Display name')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Use demo wallet' })).not.toBeInTheDocument();
    fireEvent.change(screen.getByLabelText('Display name'), { target: { value: 'Maya Chen' } });
    fireEvent.click(screen.getByRole('button', { name: 'Continue' }));
    expect(screen.getByRole('button', { name: 'Use demo wallet' })).toBeInTheDocument();
  });

  it('keeps the operator admin panel out of the user navigation', () => {
    render(<App />);
    expect(screen.queryByRole('button', { name: 'Admin panel' })).not.toBeInTheDocument();
  });
});
