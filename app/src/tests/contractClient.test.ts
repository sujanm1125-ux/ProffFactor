import { describe, it, expect } from 'vitest';
import { executeSubmitSealedBid } from '../lib/midnight/contractClient';
import { StagedBidWitness, WalletState } from '../domain/types';

describe('Midnight Contract Client Circuit Execution Tests', () => {
  const dummyWallet: WalletState = {
    connected: true,
    walletId: 'test-wallet',
    walletName: '1AM Test Wallet',
    is1AM: true,
    unshieldedAddress: '0xmn_test_address_123',
    network: 'preprod',
    isDemo: false,
  };

  it('rejects execution when wallet is disconnected', async () => {
    const disconnectedWallet: WalletState = {
      ...dummyWallet,
      connected: false,
    };
    const staged: StagedBidWitness = {
      auctionIdHex: '0x' + '1'.repeat(64),
      bidderSecretHex: '0x' + '2'.repeat(64),
      amount: 100_000n,
      saltHex: '0x' + '3'.repeat(64),
      commitmentHex: '0x' + '4'.repeat(64),
      nullifierHex: '0x' + '5'.repeat(64),
      reserveCompliant: true,
    };

    await expect(
      executeSubmitSealedBid({ stagedBid: staged, wallet: disconnectedWallet })
    ).rejects.toThrow('Wallet not connected');
  });

  it('rejects execution when bid is below reserve price', async () => {
    const invalidStaged: StagedBidWitness = {
      auctionIdHex: '0x' + '1'.repeat(64),
      bidderSecretHex: '0x' + '2'.repeat(64),
      amount: 50_000n,
      saltHex: '0x' + '3'.repeat(64),
      commitmentHex: '0x' + '4'.repeat(64),
      nullifierHex: '0x' + '5'.repeat(64),
      reserveCompliant: false, // Invariant violation!
    };

    await expect(
      executeSubmitSealedBid({ stagedBid: invalidStaged, wallet: dummyWallet })
    ).rejects.toThrow('Circuit constraint violation');
  });

  it('executes submitSealedBid and returns finalized receipt', async () => {
    const validStaged: StagedBidWitness = {
      auctionIdHex: '0x' + '1'.repeat(64),
      bidderSecretHex: '0x' + '2'.repeat(64),
      amount: 150_000n,
      saltHex: '0x' + '3'.repeat(64),
      commitmentHex: '0x' + '4'.repeat(64),
      nullifierHex: '0x' + '5'.repeat(64),
      reserveCompliant: true,
    };

    const receipt = await executeSubmitSealedBid({
      stagedBid: validStaged,
      wallet: dummyWallet,
    });

    expect(receipt.circuitName).toBe('submitSealedBid');
    expect(receipt.commitmentHex).toBe(validStaged.commitmentHex);
    expect(receipt.nullifierHex).toBe(validStaged.nullifierHex);
    expect(receipt.proofOutcome).toBe('finalized');
    expect(receipt.disclosureScope.hiddenWitnessFields).toContain('bidAmount');
  });
});
