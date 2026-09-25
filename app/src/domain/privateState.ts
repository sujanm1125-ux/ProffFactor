/**
 * Client-side Private State Manager for AegisBid.
 * 
 * STRICT PRIVACY INVARIANT:
 * Private keys, secrets, seeds, salts, and exact bid valuations NEVER leave the client's local memory/storage.
 * Only mathematically derived public commitments and nullifiers are transmitted to the network.
 */
import { LocalBidderSecret, StagedBidWitness } from './types';
export type { LocalBidderSecret };

const IDENTITIES_STORAGE_KEY = 'aegisbid.private.identities.v1';
const STAGED_BIDS_STORAGE_KEY = 'aegisbid.private.staged_bids.v1';

export function generateRandomHex(byteLength = 32): string {
  const buffer = new Uint8Array(byteLength);
  crypto.getRandomValues(buffer);
  return '0x' + Array.from(buffer, b => b.toString(16).padStart(2, '0')).join('');
}

export function hexToBytes(hex: string): Uint8Array {
  const clean = hex.startsWith('0x') ? hex.slice(2) : hex;
  const bytes = new Uint8Array(clean.length / 2);
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(clean.substring(i * 2, i * 2 + 2), 16);
  }
  return bytes;
}

export function bytesToHex(bytes: Uint8Array): string {
  return '0x' + Array.from(bytes, b => b.toString(16).padStart(2, '0')).join('');
}

// Simple fast SHA-256 for client-side preview hashing
export async function sha256Hex(data: Uint8Array): Promise<string> {
  const hashBuffer = await crypto.subtle.digest('SHA-256', data as ArrayBufferView<ArrayBuffer>);
  return '0x' + Array.from(new Uint8Array(hashBuffer), b => b.toString(16).padStart(2, '0')).join('');
}

export async function computeClientCommitment(
  auctionIdHex: string,
  bidderIdentityHex: string,
  amount: bigint,
  saltHex: string
): Promise<string> {
  const encoder = new TextEncoder();
  const tag = encoder.encode('aegisbid:bidcommit:v1');
  const auctionBytes = hexToBytes(auctionIdHex);
  const bidderBytes = hexToBytes(bidderIdentityHex);
  const saltBytes = hexToBytes(saltHex);
  
  // Big-endian 64-bit amount
  const amountBytes = new Uint8Array(8);
  const view = new DataView(amountBytes.buffer);
  view.setBigUint64(0, amount, false);

  const combined = new Uint8Array(tag.length + auctionBytes.length + bidderBytes.length + 8 + saltBytes.length);
  combined.set(tag, 0);
  combined.set(auctionBytes, tag.length);
  combined.set(bidderBytes, tag.length + auctionBytes.length);
  combined.set(amountBytes, tag.length + auctionBytes.length + bidderBytes.length);
  combined.set(saltBytes, tag.length + auctionBytes.length + bidderBytes.length + 8);

  return sha256Hex(combined);
}

export async function computeClientNullifier(
  auctionIdHex: string,
  secretHex: string
): Promise<string> {
  const encoder = new TextEncoder();
  const tag = encoder.encode('aegisbid:nullifier:v1');
  const auctionBytes = hexToBytes(auctionIdHex);
  const secretBytes = hexToBytes(secretHex);

  const combined = new Uint8Array(tag.length + auctionBytes.length + secretBytes.length);
  combined.set(tag, 0);
  combined.set(auctionBytes, tag.length);
  combined.set(secretBytes, tag.length + auctionBytes.length);

  return sha256Hex(combined);
}

export async function computeClientIdentity(secretHex: string): Promise<string> {
  const encoder = new TextEncoder();
  const tag = encoder.encode('aegisbid:user:v1');
  const secretBytes = hexToBytes(secretHex);

  const combined = new Uint8Array(tag.length + secretBytes.length);
  combined.set(tag, 0);
  combined.set(secretBytes, tag.length);

  return sha256Hex(combined);
}

export function loadStoredIdentities(): LocalBidderSecret[] {
  try {
    const raw = localStorage.getItem(IDENTITIES_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveIdentity(identity: LocalBidderSecret): void {
  const existing = loadStoredIdentities().filter(i => i.id !== identity.id);
  existing.unshift(identity);
  localStorage.setItem(IDENTITIES_STORAGE_KEY, JSON.stringify(existing));
}

export async function getOrCreateDefaultIdentity(): Promise<LocalBidderSecret> {
  const existing = loadStoredIdentities();
  if (existing.length > 0) {
    return existing[0];
  }
  const secretHex = generateRandomHex(32);
  const derivedIdentityHex = await computeClientIdentity(secretHex);
  const defaultIdent: LocalBidderSecret = {
    id: crypto.randomUUID(),
    label: 'Primary Ephemeral Bidder Identity',
    secretHex,
    derivedIdentityHex,
    createdAt: new Date().toISOString(),
  };
  saveIdentity(defaultIdent);
  return defaultIdent;
}

export async function rotateIdentity(label?: string): Promise<LocalBidderSecret> {
  const secretHex = generateRandomHex(32);
  const derivedIdentityHex = await computeClientIdentity(secretHex);
  const newIdent: LocalBidderSecret = {
    id: crypto.randomUUID(),
    label: label || `Rotated Identity ${new Date().toLocaleTimeString()}`,
    secretHex,
    derivedIdentityHex,
    createdAt: new Date().toISOString(),
  };
  saveIdentity(newIdent);
  return newIdent;
}

export function clearAllPrivateState(): void {
  localStorage.removeItem(IDENTITIES_STORAGE_KEY);
  localStorage.removeItem(STAGED_BIDS_STORAGE_KEY);
}
