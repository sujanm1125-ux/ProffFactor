export interface DiscoveredWallet {
  id: string;
  name: string;
  apiVersion: string;
  connect: (networkId?: string) => Promise<ConnectedWallet>;
}

export interface ConnectedWallet {
  getUnshieldedAddress?: () => Promise<string>;
  getShieldedAddresses?: () => Promise<{ shieldedAddress?: string } | string[]>;
  getConnectionStatus?: () => Promise<{ networkId?: string }>;
}

type WalletCandidate = {
  name?: string;
  apiVersion?: string;
  connect?: (networkId?: string) => Promise<ConnectedWallet>;
};

declare global {
  interface Window {
    midnight?: Record<string, WalletCandidate>;
  }
}

export function discoverInjectedWallets(): DiscoveredWallet[] {
  const injected = window.midnight;
  if (!injected || typeof injected !== 'object') return [];

  return Object.entries(injected)
    .filter((entry): entry is [string, WalletCandidate & { connect: (networkId?: string) => Promise<unknown> }] => {
      return typeof entry[1]?.connect === 'function' && isCompatibleConnectorVersion(entry[1].apiVersion);
    })
    .map(([id, wallet]) => ({
      id,
      name: typeof wallet.name === 'string' && wallet.name.trim() ? wallet.name : `Midnight wallet ${id.slice(0, 6)}`,
      apiVersion: typeof wallet.apiVersion === 'string' ? wallet.apiVersion : 'unknown',
      connect: wallet.connect.bind(wallet),
    }));
}

export function isCompatibleConnectorVersion(version: string | undefined): boolean {
  if (!version) return false;
  const majorVersion = Number.parseInt(version.split('.')[0], 10);
  return majorVersion === 4;
}

export function safeWalletLabel(wallet: Pick<DiscoveredWallet, 'name' | 'id'>): string {
  const normalizedName = wallet.name.replace(/[<>]/g, '').trim().slice(0, 48);
  return normalizedName || `Wallet ${wallet.id.slice(0, 6)}`;
}

const usersStorageKey = 'prooffactor.admin.users';
const auditsStorageKey = 'prooffactor.admin.audit';

export function readRegisteredUsers(): import('../../domain/types').RegisteredUser[] {
  return readStorage(usersStorageKey);
}

export function readTransactionAudits(): import('../../domain/types').TransactionAudit[] {
  return readStorage(auditsStorageKey);
}

export function saveRegisteredUser(user: import('../../domain/types').RegisteredUser) {
  writeStorage(usersStorageKey, [user, ...readRegisteredUsers().filter((item) => item.id !== user.id)]);
}

export function saveTransactionAudit(audit: import('../../domain/types').TransactionAudit) {
  writeStorage(auditsStorageKey, [audit, ...readTransactionAudits()]);
}

function readStorage<T>(key: string): T[] {
  try {
    const value = window.localStorage.getItem(key);
    return value ? JSON.parse(value) as T[] : [];
  } catch {
    return [];
  }
}

function writeStorage<T>(key: string, value: T[]) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Local storage is optional for the synthetic demo.
  }
}
