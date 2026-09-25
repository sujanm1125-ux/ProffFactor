import { describe, it, expect, beforeEach } from 'vitest';
import {
  generateRandomHex,
  computeClientIdentity,
  computeClientCommitment,
  computeClientNullifier,
  getOrCreateDefaultIdentity,
  rotateIdentity,
  loadStoredIdentities,
  clearAllPrivateState,
} from '../domain/privateState';

describe('Client-Side Private State Tests', () => {
  beforeEach(() => {
    clearAllPrivateState();
  });

  it('generates 32-byte (64 hex char) random strings with 0x prefix', () => {
    const hex = generateRandomHex(32);
    expect(hex.startsWith('0x')).toBe(true);
    expect(hex.length).toBe(66); // '0x' + 64 hex chars
  });

  it('computes deterministic simulated user identity from secret', async () => {
    const secret = '0x' + 'a'.repeat(64);
    const id1 = await computeClientIdentity(secret);
    const id2 = await computeClientIdentity(secret);
    expect(id1).toBe(id2);
    expect(id1.length).toBe(66);
  });

  it('computes distinct commitments for different bid amounts and salts', async () => {
    const auctionId = '0x' + '1'.repeat(64);
    const bidderId = '0x' + '2'.repeat(64);
    const salt = '0x' + '3'.repeat(64);

    const commit1 = await computeClientCommitment(auctionId, bidderId, 100_000n, salt);
    const commit2 = await computeClientCommitment(auctionId, bidderId, 150_000n, salt);
    expect(commit1).not.toBe(commit2);
  });

  it('computes deterministic nullifier preventing replay attacks', async () => {
    const auctionId = '0x' + '1'.repeat(64);
    const secret = '0x' + 'f'.repeat(64);

    const nullifier1 = await computeClientNullifier(auctionId, secret);
    const nullifier2 = await computeClientNullifier(auctionId, secret);
    expect(nullifier1).toBe(nullifier2);
  });

  it('persists and rotates identity in local vault', async () => {
    const id1 = await getOrCreateDefaultIdentity();
    expect(id1.secretHex).toBeDefined();

    const id2 = await rotateIdentity('Secondary Trading Vault');
    expect(id2.id).not.toBe(id1.id);
    expect(id2.secretHex).not.toBe(id1.secretHex);

    const all = loadStoredIdentities();
    expect(all.length).toBe(2);
  });
});
