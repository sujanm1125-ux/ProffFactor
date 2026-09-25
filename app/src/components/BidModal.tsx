import React, { useState, useEffect } from 'react';
import { X, Shield, Lock, EyeOff, CheckCircle2, AlertTriangle, ArrowRight, Check } from 'lucide-react';
import { Auction, StagedBidWitness, WalletState, FinalizedReceipt } from '../domain/types';
import {
  generateRandomHex,
  getOrCreateDefaultIdentity,
  computeClientCommitment,
  computeClientNullifier,
  LocalBidderSecret,
} from '../domain/privateState';
import { executeSubmitSealedBid } from '../lib/midnight/contractClient';
import { postReceiptToBackend } from '../lib/api/backendClient';

interface BidModalProps {
  auction: Auction;
  wallet: WalletState;
  onClose: () => void;
  onReceiptGenerated: (receipt: FinalizedReceipt) => void;
  onRequireWallet: () => void;
}

export const BidModal: React.FC<BidModalProps> = ({
  auction,
  wallet,
  onClose,
  onReceiptGenerated,
  onRequireWallet,
}) => {
  const [identity, setIdentity] = useState<LocalBidderSecret | null>(null);
  const [bidAmountStr, setBidAmountStr] = useState<string>(
    (Number(auction.reservePrice) * 1.25).toString()
  );
  const [saltHex, setSaltHex] = useState<string>('');
  const [commitmentHex, setCommitmentHex] = useState<string>('');
  const [nullifierHex, setNullifierHex] = useState<string>('');
  const [progressMsg, setProgressMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [acknowledged, setAcknowledged] = useState(false);

  useEffect(() => {
    getOrCreateDefaultIdentity().then((ident) => {
      setIdentity(ident);
      const salt = generateRandomHex(32);
      setSaltHex(salt);
    });
  }, []);

  const bidAmount = BigInt(bidAmountStr || '0');
  const isReserveCompliant = bidAmount >= auction.reservePrice;

  // Real-time recomputation of public commitment and nullifier
  useEffect(() => {
    if (identity && saltHex && bidAmount > 0n) {
      computeClientCommitment(auction.auctionIdHex, identity.derivedIdentityHex, bidAmount, saltHex).then(
        setCommitmentHex
      );
      computeClientNullifier(auction.auctionIdHex, identity.secretHex).then(
        setNullifierHex
      );
    }
  }, [auction.auctionIdHex, identity, saltHex, bidAmount]);

  const handleSubmit = async () => {
    if (!wallet.connected) {
      onRequireWallet();
      return;
    }
    if (!isReserveCompliant) {
      setErrorMsg('Bid is below the minimum reserve threshold.');
      return;
    }

    const staged: StagedBidWitness = {
      auctionIdHex: auction.auctionIdHex,
      bidderSecretHex: identity!.secretHex,
      amount: bidAmount,
      saltHex,
      commitmentHex,
      nullifierHex,
      reserveCompliant: isReserveCompliant,
    };

    try {
      setErrorMsg(null);
      const receipt = await executeSubmitSealedBid({
        stagedBid: staged,
        wallet,
        onProgress: (_, __, msg) => setProgressMsg(msg),
      });

      // Transmit public receipt metadata to backend
      await postReceiptToBackend(receipt);

      onReceiptGenerated(receipt);
      onClose();
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Execution failed');
      setProgressMsg(null);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div>
            <span className="eyebrow">COMPACT 0.31.1 ZK CIRCUIT</span>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Submit Confidential Bid</h2>
          </div>
          <button className="btn btn-secondary btn-sm" onClick={onClose}>
            <X size={16} />
          </button>
        </div>

        {/* Auction summary */}
        <div style={{ background: 'var(--bg-elevated)', padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '1.25rem', border: '1px solid var(--border-subtle)' }}>
          <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>{auction.title}</div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem', fontSize: '0.85rem' }}>
            <span style={{ color: 'var(--text-secondary)' }}>Minimum Reserve:</span>
            <strong className="mono">{auction.reservePrice.toLocaleString()} {auction.currency}</strong>
          </div>
        </div>

        {/* Bid Input */}
        <div className="form-group">
          <label className="form-label">
            Your Private Bid Valuation ({auction.currency}) — Remains on your device
          </label>
          <input
            type="number"
            className="form-input"
            value={bidAmountStr}
            onChange={(e) => setBidAmountStr(e.target.value)}
            min={1}
            disabled={progressMsg !== null}
          />
          {!isReserveCompliant && (
            <div style={{ color: 'var(--accent-danger)', fontSize: '0.75rem', marginTop: '0.25rem' }}>
              Warning: Bid must be at least {auction.reservePrice.toLocaleString()} {auction.currency} to satisfy circuit constraints.
            </div>
          )}
        </div>

        {/* Cryptographic Preview */}
        <div style={{ background: 'var(--bg-core)', padding: '0.85rem', borderRadius: 'var(--radius-md)', marginBottom: '1.25rem', border: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <span className="eyebrow">PUBLIC ANCHORS (PROVEN VIA ZK SNARK)</span>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Public Bid Commitment:</div>
            <div className="mono" style={{ fontSize: '0.75rem', color: 'var(--accent-mint)', wordBreak: 'break-all' }}>
              {commitmentHex || 'Calculating...'}
            </div>
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Anti-Replay Nullifier:</div>
            <div className="mono" style={{ fontSize: '0.75rem', color: 'var(--accent-cobalt)', wordBreak: 'break-all' }}>
              {nullifierHex || 'Calculating...'}
            </div>
          </div>
        </div>

        {/* Disclosure Checklist */}
        <div style={{ marginBottom: '1.5rem', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '0.85rem' }}>
          <label style={{ display: 'flex', gap: '0.65rem', alignItems: 'flex-start', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={acknowledged}
              onChange={(e) => setAcknowledged(e.target.checked)}
              style={{ marginTop: '0.25rem' }}
            />
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              I confirm that my exact valuation of <strong>{bidAmount.toLocaleString()} {auction.currency}</strong> will remain private.
              Only the 32-byte commitment and nullifier will be disclosed on the Midnight ledger.
            </span>
          </label>
        </div>

        {errorMsg && (
          <div style={{ padding: '0.75rem', background: 'rgba(255, 71, 87, 0.1)', border: '1px solid var(--accent-danger)', borderRadius: 'var(--radius-md)', marginBottom: '1rem', color: 'var(--accent-danger)', fontSize: '0.85rem' }}>
            {errorMsg}
          </div>
        )}

        {progressMsg && (
          <div style={{ padding: '0.75rem', background: 'rgba(45, 104, 255, 0.1)', border: '1px solid var(--accent-cobalt)', borderRadius: 'var(--radius-md)', marginBottom: '1rem', color: 'var(--accent-cobalt)', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span className="animate-spin">⚙</span>
            {progressMsg}
          </div>
        )}

        {/* Action Button */}
        <button
          className="btn btn-primary"
          style={{ width: '100%', padding: '0.85rem' }}
          disabled={!acknowledged || !isReserveCompliant || progressMsg !== null}
          onClick={handleSubmit}
        >
          <Shield size={16} />
          {progressMsg ? 'GENERATING PROOF...' : 'GENERATE ZK PROOF & SUBMIT BID'}
        </button>
      </div>
    </div>
  );
};
