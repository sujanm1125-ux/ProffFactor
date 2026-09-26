import React, { useState, useEffect } from 'react';
import { X, Shield, Lock, AlertTriangle, Check } from 'lucide-react';
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
      setErrorMsg('Bid is below the minimum reserve.');
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

      await postReceiptToBackend(receipt);
      onReceiptGenerated(receipt);
      onClose();
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Submission failed');
      setProgressMsg(null);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem', borderBottom: '2px solid var(--border-strong)', paddingBottom: '1rem' }}>
          <div>
            <span className="eyebrow">SEALED BID SUBMISSION</span>
            <h2 className="font-display" style={{ fontSize: '2rem' }}>
              Execution
            </h2>
          </div>
          <button className="btn btn-secondary btn-sm" onClick={onClose} style={{ border: 'none' }}>
            <X size={20} />
          </button>
        </div>

        <div style={{ padding: '1.5rem', border: '1px solid var(--border-medium)', marginBottom: '2rem' }}>
          <div className="eyebrow" style={{ marginBottom: '0.5rem' }}>TARGET LOT</div>
          <div className="font-display" style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>{auction.title}</div>
          <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border-subtle)', paddingTop: '1rem' }}>
            <span className="eyebrow">MINIMUM RESERVE</span>
            <strong className="mono">{auction.reservePrice.toLocaleString()} {auction.currency}</strong>
          </div>
        </div>

        <div style={{ marginBottom: '2rem' }}>
          <h3 className="font-display" style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>1. Local Valuation</h3>
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Bid amount ({auction.currency})</label>
            <input
              type="number"
              className="form-input"
              value={bidAmountStr}
              onChange={(e) => setBidAmountStr(e.target.value)}
              min={1}
              disabled={progressMsg !== null}
            />
            {!isReserveCompliant ? (
              <div style={{ color: 'var(--status-danger)', fontSize: '0.85rem', marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <AlertTriangle size={16} /> Constraint: Must meet {auction.reservePrice.toLocaleString()}
              </div>
            ) : (
              <div style={{ color: 'var(--status-success)', fontSize: '0.85rem', marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Check size={16} /> Reserve verified locally
              </div>
            )}
          </div>
        </div>

        <div style={{ marginBottom: '2rem' }}>
          <h3 className="font-display" style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>2. Cryptographic Envelope</h3>
          <div style={{ border: '1px solid var(--border-medium)', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <span className="eyebrow">COMMITMENT (32-BYTE)</span>
              <div className="mono" style={{ marginTop: '0.25rem', wordBreak: 'break-all' }}>{commitmentHex || 'Computing...'}</div>
            </div>
            <div>
              <span className="eyebrow">NULLIFIER</span>
              <div className="mono" style={{ marginTop: '0.25rem', wordBreak: 'break-all' }}>{nullifierHex || 'Computing...'}</div>
            </div>
          </div>
        </div>

        <div style={{ marginBottom: '2rem' }}>
          <label style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', cursor: 'pointer', padding: '1rem', border: '1px solid var(--border-medium)', background: 'var(--bg-elevated)' }}>
            <input
              type="checkbox"
              checked={acknowledged}
              onChange={(e) => setAcknowledged(e.target.checked)}
              style={{ marginTop: '0.25rem' }}
            />
            <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              I confirm my valuation of <strong style={{ color: 'var(--text-primary)' }}>{bidAmount.toLocaleString()} {auction.currency}</strong> stays strictly on this device. Only the ZK proof is committed on-chain.
            </span>
          </label>
        </div>

        {errorMsg && (
          <div style={{ padding: '1rem', border: '1px solid var(--status-danger)', color: 'var(--status-danger)', marginBottom: '1.5rem' }}>
            {errorMsg}
          </div>
        )}

        {progressMsg && (
          <div style={{ padding: '1rem', border: '1px solid var(--text-primary)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span className="mono">Running...</span>
            <span className="font-display">{progressMsg}</span>
          </div>
        )}

        <button
          className="btn btn-primary"
          style={{ width: '100%', fontSize: '1rem', padding: '1rem' }}
          disabled={!acknowledged || !isReserveCompliant || progressMsg !== null}
          onClick={handleSubmit}
        >
          {progressMsg ? 'Proving...' : 'Generate ZK Proof & Submit'}
        </button>
      </div>
    </div>
  );
};
