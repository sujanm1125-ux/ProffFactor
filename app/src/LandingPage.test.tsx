import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { LandingPage } from './LandingPage';

describe('ProofFactor landing page', () => {
  it('presents the privacy-first product entry point', () => {
    render(<LandingPage />);

    expect(screen.getByRole('heading', { name: 'A receivable without exposure.' })).toBeInTheDocument();
    expect(screen.getByText('Built for sensitive receivables')).toBeInTheDocument();
    expect(screen.getAllByRole('link', { name: 'Open workspace' }).every((link) => link.getAttribute('href') === '/app')).toBe(true);
  });

  it('keeps the proof actions available until a visitor starts one', () => {
    render(<LandingPage />);

    expect(screen.getByRole('button', { name: 'Inspect Proof' })).toBeEnabled();
    fireEvent.click(screen.getByRole('button', { name: 'Run print proof' }));
    expect(screen.getAllByRole('button', { name: 'Printing proof...' }).every((button) => button.hasAttribute('disabled'))).toBe(true);
  });

  it('opens a no-sign-up wallet chooser from the landing page', () => {
    render(<LandingPage />);

    fireEvent.click(screen.getByRole('button', { name: 'Connect wallet' }));
    expect(screen.getByRole('heading', { name: 'Choose a wallet' })).toBeInTheDocument();
    expect(screen.queryByLabelText('Display name')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Use demo wallet' })).toBeInTheDocument();
  });



  it('starts the local proof print animation', () => {
    render(<LandingPage />);

    fireEvent.click(screen.getByRole('button', { name: 'Run print proof' }));
    expect(screen.getAllByRole('button', { name: 'Printing proof...' }).every((button) => button.hasAttribute('disabled'))).toBe(true);
  });
});