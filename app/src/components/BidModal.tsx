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
      <div className="modal-content card-bracketed" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.25rem' }}>
              <span className="hanko-seal">密印</span>
              <span className="eyebrow">THREE-STAGE CRYPTOGRAPHIC SEALING CEREMONY</span>
            </div>
            <h2 className="font-mincho" style={{ fontSize: '1.45rem', fontWeight: 700 }}>
              Submit Confidential Sealed Bid
            </h2>
          </div>
          <button className="btn btn-secondary btn-sm" onClick={onClose}>
            <X size={16} />
          </button>
        </div>

        {/* Auction Lot Summary */}
        <div style={{ background: 'var(--bg-elevated)', padding: '1rem', borderRadius: 'var(--radius-sm)', marginBottom: '1.25rem', border: '1px solid var(--border-subtle)' }}>
          <div className="eyebrow" style={{ color: 'var(--accent-shu)', marginBottom: '0.2rem' }}>TARGET PROCUREMENT LOT</div>
          <div className="font-mincho" style={{ fontWeight: 600, fontSize: '1.05rem' }}>{auction.title}</div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem', fontSize: '0.85rem' }}>
            <span style={{ color: 'var(--text-secondary)' }}>Minimum Reserve Price:</span>
            <strong className="mono" style={{ color: 'var(--accent-yamabuki)' }}>
              {auction.reservePrice.toLocaleString()} {auction.currency}
            </strong>
          </div>
        </div>

        {/* Phase 01: Private Valuation */}
        <div style={{ marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.6rem' }}>
            <span className="kanji-step">壱</span>
            <span className="font-mincho" style={{ fontWeight: 700, fontSize: '1rem' }}>Phase 01 &bull; Private Valuation Formulation</span>
            <span className="badge badge-mint" style={{ marginLeft: 'auto' }}>LOCAL MEMORY ONLY</span>
          </div>

          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">
              Private Bid Valuation ({auction.currency}) — Remains on your physical device
            </label>
            <input
              type="number"
              className="form-input"
              value={bidAmountStr}
              onChange={(e) => setBidAmountStr(e.target.value)}
              min={1}
              disabled={progressMsg !== null}
            />
            {!isReserveCompliant ? (
              <div style={{ color: 'var(--accent-danger)', fontSize: '0.75rem', marginTop: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <AlertTriangle size={13} />
                <span>Constraint warning: Bid must meet or exceed minimum reserve ({auction.reservePrice.toLocaleString()} {auction.currency}).</span>
              </div>
            ) : (
              <div style={{ color: 'var(--accent-matsuba)', fontSize: '0.75rem', marginTop: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Check size={13} />
                <span>Reserve threshold satisfied (Margin headroom: +{(bidAmount - auction.reservePrice).toLocaleString()} {auction.currency})</span>
              </div>
            )}
          </div>
        </div>

        {/* Phase 02: Cryptographic Sealing */}
        <div style={{ marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.6rem' }}>
            <span className="kanji-step">弐</span>
            <span className="font-mincho" style={{ fontWeight: 700, fontSize: '1rem' }}>Phase 02 &bull; Cryptographic Commitment &amp; Salt</span>
            <span className="badge badge-shu" style={{ marginLeft: 'auto' }}>PEDERSEN & POSEIDON</span>
          </div>

          <div style={{ background: 'var(--bg-core)', padding: '0.85rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }} className="eyebrow">Public Bid Commitment Anchor (32-Bytes):</div>
              <div className="mono" style={{ fontSize: '0.75rem', color: 'var(--accent-matsuba)', wordBreak: 'break-all' }}>
                {commitmentHex || 'Computing commitment...'}
              </div>
            </div>
            <div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }} className="eyebrow">Anti-Replay Nullifier Digest:</div>
              <div className="mono" style={{ fontSize: '0.75rem', color: 'var(--accent-cobalt)', wordBreak: 'break-all' }}>
                {nullifierHex || 'Computing nullifier...'}
              </div>
            </div>
          </div>
        </div>

        {/* Phase 03: Zero-Knowledge Submission */}
        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.6rem' }}>
            <span className="kanji-step">参</span>
            <span className="font-mincho" style={{ fontWeight: 700, fontSize: '1rem' }}>Phase 03 &bull; Midnight Zero-Knowledge Attestation</span>
            <span className="badge badge-mint" style={{ marginLeft: 'auto' }}>COMPACT 0.31.1</span>
          </div>

          <div style={{ border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', padding: '0.85rem', background: 'var(--bg-elevated)' }}>
            <label style={{ display: 'flex', gap: '0.65rem', alignItems: 'flex-start', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={acknowledged}
                onChange={(e) => setAcknowledged(e.target.checked)}
                style={{ marginTop: '0.25rem', accentColor: 'var(--accent-shu)' }}
              />
              <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                I confirm that my exact valuation of <strong>{bidAmount.toLocaleString()} {auction.currency}</strong> will remain private.
                Only the zero-knowledge proof of reserve compliance and the 32-byte public commitment will be recorded on the Midnight ledger.
              </span>
            </label>
          </div>
        </div>

        {errorMsg && (
          <div style={{ padding: '0.75rem', background: 'rgba(229, 62, 62, 0.1)', border: '1px solid var(--accent-danger)', borderRadius: 'var(--radius-sm)', marginBottom: '1rem', color: 'var(--accent-danger)', fontSize: '0.85rem' }}>
            {errorMsg}
          </div>
        )}

        {progressMsg && (
          <div style={{ padding: '0.75rem', background: 'rgba(214, 63, 40, 0.1)', border: '1px solid var(--accent-shu)', borderRadius: 'var(--radius-sm)', marginBottom: '1rem', color: 'var(--accent-shu)', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span className="animate-spin">⚙</span>
            <span>{progressMsg}</span>
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
          <span>{progressMsg ? 'PROVING CIRCUIT...' : 'GENERATE ZK PROOF & SUBMIT BID'}</span>
        </button>
      </div>
    </div>
  );
};
