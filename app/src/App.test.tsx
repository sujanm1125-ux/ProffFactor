import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { App } from './App';

describe('AegisBid Application Shell Tests', () => {
  it('renders the brand title and main auction list', () => {
    render(<App />);
    expect(screen.getByText('AEGISBID')).toBeInTheDocument();
    expect(screen.getByText('ZK-SEALED BID PROTOCOL')).toBeInTheDocument();
    expect(screen.getByText('Confidential Sealed-Bid Registry')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /CONNECT WALLET/i })).toBeInTheDocument();
    expect(screen.getByText(/The Architecture of/i)).toBeInTheDocument();
  });

  it('switches between tabs cleanly', () => {
    render(<App />);
    // Switch to Bidder Haven via nav tab
    fireEvent.click(screen.getByRole('button', { name: /03 BIDDER HAVEN/i }));
    expect(screen.getByText(/Bidder Haven & Sovereign Vault/i)).toBeInTheDocument();
    expect(screen.getByText(/Confidential Margin Simulator/i)).toBeInTheDocument();

    // Switch to Privacy Matrix
    fireEvent.click(screen.getByRole('button', { name: /PRIVACY MATRIX/i }));
    expect(screen.getByText('Cryptographic Privacy Boundary')).toBeInTheDocument();
    expect(screen.getByText('Observer Disclosure Matrix')).toBeInTheDocument();

    // Switch to Gemini Architect
    fireEvent.click(screen.getByRole('button', { name: /GEMINI ARCHITECT/i }));
    expect(screen.getByText('Gemini Procurement Architect')).toBeInTheDocument();

    // Switch to Metrics
    fireEvent.click(screen.getByRole('button', { name: /METRICS/i }));
    expect(screen.getByText('Protocol & Public Ledger Metrics')).toBeInTheDocument();
  });

  it('opens wallet modal and supports demo wallet sandbox launch', () => {
    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: /CONNECT WALLET/i }));
    expect(screen.getByText('Connect Midnight Wallet')).toBeInTheDocument();

    // Click demo sandbox wallet
    fireEvent.click(screen.getByText('Launch Demo Simulation Wallet'));
    // Modal closes and wallet shows DEMO status
    expect(screen.getByText('DEMO')).toBeInTheDocument();
  });

  it('resets connected wallet session when network is changed', () => {
    render(<App />);
    // Connect demo wallet
    fireEvent.click(screen.getByRole('button', { name: /CONNECT WALLET/i }));
    fireEvent.click(screen.getByText('Launch Demo Simulation Wallet'));
    expect(screen.getByText('DEMO')).toBeInTheDocument();

    // Switch network to preview
    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { value: 'preview' } });

    // Wallet session must be reset to disconnected state per security requirements
    expect(screen.queryByText('DEMO')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: /CONNECT WALLET/i })).toBeInTheDocument();
  });
});
