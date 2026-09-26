import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import {
  discoverMidnightWallets,
  createDemoWalletSession,
  getInitialWalletState,
} from '../lib/midnight/walletConnector';

describe('Midnight Wallet Connector Tests', () => {
  beforeEach(() => {
    // Reset window.midnight
    delete (window as any).midnight;
  });

  afterEach(() => {
    delete (window as any).midnight;
  });

  it('returns empty array when window.midnight is not injected', () => {
    const wallets = discoverMidnightWallets();
    expect(wallets).toEqual([]);
  });

  it('discovers injected wallets and prioritizes 1AM wallet', () => {
    (window as any).midnight = {
      'uuid-lace': {
        name: 'Midnight Lace Wallet',
        apiVersion: '4.0.0',
        connect: async () => ({}),
      },
      'uuid-1am': {
        name: '1AM Midnight Wallet',
        apiVersion: '4.1.0',
        connect: async () => ({}),
      },
    };

    const wallets = discoverMidnightWallets();
    expect(wallets.length).toBe(2);
    // 1AM must be sorted first
    expect(wallets[0].is1AM).toBe(true);
    expect(wallets[0].name).toBe('1AM Midnight Wallet');
    expect(wallets[1].is1AM).toBe(false);
  });

  it('creates valid demo simulation wallet session', () => {
    const demo = createDemoWalletSession('preprod');
    expect(demo.connected).toBe(true);
    expect(demo.isDemo).toBe(true);
    expect(demo.network).toBe('preprod');
    expect(demo.unshieldedAddress).toContain('0xmn_demo_preprod_');
  });

  it('initial state is disconnected on preprod network', () => {
    const initial = getInitialWalletState();
    expect(initial.connected).toBe(false);
    expect(initial.network).toBe('mainnet');
  });
});
