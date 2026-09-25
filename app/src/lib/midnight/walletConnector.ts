/**
 * Midnight Wallet Connector with 1AM Wallet Priority and Demo Fallback.
 */
import { MidnightNetwork, WalletState } from '../../domain/types';

export interface InjectedMidnightWallet {
  id: string;
  name: string;
  apiVersion: string;
  is1AM: boolean;
  connect: (networkId?: string) => Promise<ConnectedMidnightAPI>;
}

export interface ConnectedMidnightAPI {
  getUnshieldedAddress?: () => Promise<string>;
  getShieldedAddresses?: () => Promise<{ shieldedAddress?: string } | string[]>;
  getConnectionStatus?: () => Promise<{ networkId?: string }>;
}

declare global {
  interface Window {
    midnight?: Record<string, {
      name?: string;
      apiVersion?: string;
      connect?: (networkId?: string) => Promise<ConnectedMidnightAPI>;
    }>;
  }
}

export function discoverMidnightWallets(): InjectedMidnightWallet[] {
  if (typeof window === 'undefined' || !window.midnight || typeof window.midnight !== 'object') {
    return [];
  }

  const wallets: InjectedMidnightWallet[] = [];

  for (const [id, candidate] of Object.entries(window.midnight)) {
    if (candidate && typeof candidate.connect === 'function') {
      const name = candidate.name?.trim() || `Midnight Wallet (${id.slice(0, 8)})`;
      const is1AM = name.toLowerCase().includes('1am') || id.toLowerCase().includes('1am');
      
      wallets.push({
        id,
        name,
        apiVersion: candidate.apiVersion || '4.0.0',
        is1AM,
        connect: candidate.connect.bind(candidate),
      });
    }
  }

  // Sort so that 1AM wallet is presented first
  return wallets.sort((a, b) => (b.is1AM ? 1 : 0) - (a.is1AM ? 1 : 0));
}

export async function connectInjectedWallet(
  wallet: InjectedMidnightWallet,
  network: MidnightNetwork
): Promise<WalletState> {
  try {
    const api = await wallet.connect(network);
    let unshieldedAddress = '';
    
    if (typeof api.getUnshieldedAddress === 'function') {
      unshieldedAddress = await api.getUnshieldedAddress();
    } else if (typeof api.getShieldedAddresses === 'function') {
      const addresses = await api.getShieldedAddresses();
      if (Array.isArray(addresses) && addresses.length > 0) {
        unshieldedAddress = typeof addresses[0] === 'string' ? addresses[0] : (addresses[0] as any).shieldedAddress || '';
      } else if (addresses && typeof addresses === 'object' && 'shieldedAddress' in addresses) {
        unshieldedAddress = addresses.shieldedAddress || '';
      }
    }

    if (!unshieldedAddress) {
      unshieldedAddress = `0xmn_${wallet.id.slice(0, 12)}...${network}`;
    }

    return {
      connected: true,
      walletId: wallet.id,
      walletName: wallet.name,
      is1AM: wallet.is1AM,
      unshieldedAddress,
      network,
      isDemo: false,
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Wallet connection rejected by user';
    return {
      connected: false,
      walletId: wallet.id,
      walletName: wallet.name,
      is1AM: wallet.is1AM,
      unshieldedAddress: '',
      network,
      isDemo: false,
      error: message,
    };
  }
}

export function createDemoWalletSession(network: MidnightNetwork): WalletState {
  return {
    connected: true,
    walletId: 'demo-midnight-simulator',
    walletName: 'Demo Simulation Wallet (Sandbox)',
    is1AM: false,
    unshieldedAddress: `0xmn_demo_${network}_${Math.random().toString(16).slice(2, 10)}`,
    network,
    isDemo: true,
  };
}

export function getInitialWalletState(): WalletState {
  return {
    connected: false,
    walletId: '',
    walletName: '',
    is1AM: false,
    unshieldedAddress: '',
    network: 'preprod',
    isDemo: false,
  };
}
