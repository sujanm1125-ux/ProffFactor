import { render, screen, fireEvent, act } from '@testing-library/react';
import App from './App';
import { describe, it, expect } from 'vitest';

const enterApp = async () => {
  fireEvent.click(screen.getByRole('button', { name: /CONNECT WALLET_/i }));
  fireEvent.click(screen.getByRole('button', { name: /Launch Demo Simulation Wallet/i }));
  const input = screen.getByPlaceholderText('ENTER_DESIGNATION');
  fireEvent.change(input, { target: { value: 'Tester' } });
  fireEvent.click(screen.getByRole('button', { name: /INITIALIZE_/i }));
};

describe('AegisBid Application', () => {
  it('renders landing page with correct editorial branding', async () => {
    render(<App />);
    await enterApp();
    const el = await screen.findAllByText('AEGISBID');
    expect(el.length).toBeGreaterThan(0);
    expect(await screen.findByText('Sealed-Bid Protocol')).toBeInTheDocument();
  });

  it('navigates to Bidder Haven tab', async () => {
    render(<App />);
    await enterApp();
    fireEvent.click(await screen.findByRole('button', { name: /Bidder Haven/i }));
    
    expect(await screen.findByText(/TERMINAL \/\/ 01/i)).toBeInTheDocument();
  });

  it('navigates to Privacy Matrix and Gemini Assistant', async () => {
    render(<App />);
    await enterApp();
    
    fireEvent.click(await screen.findByRole('button', { name: /Privacy/i }));
    expect(await screen.findByText(/CLIENT-SIDE ENCLAVE/i)).toBeInTheDocument();
  });
});

