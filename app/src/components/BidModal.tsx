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
              <span className="eyebrow">THREE-STAGE SEALING CEREMONY / 三段階の封緘プロトコル</span>
            </div>
            <h2 className="font-mincho" style={{ fontSize: '1.4rem', fontWeight: 700 }}>
              機密入札の封緘 <span style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', fontWeight: 400 }}>Sealed-Bid Ceremony</span>
            </h2>
          </div>
          <button className="btn btn-secondary btn-sm" onClick={onClose}>
            <X size={16} />
          </button>
        </div>

        {/* Auction Lot Summary */}
        <div style={{ background: 'var(--bg-elevated)', padding: '1rem', borderRadius: 'var(--radius-sm)', marginBottom: '1.25rem', border: '1px solid var(--border-subtle)' }}>
          <div className="eyebrow" style={{ color: 'var(--accent-shu)', marginBottom: '0.2rem' }}>対象調達案件 LOT DETAILS</div>
          <div className="font-mincho" style={{ fontWeight: 600, fontSize: '1.05rem' }}>{auction.title}</div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem', fontSize: '0.85rem' }}>
            <span style={{ color: 'var(--text-secondary)' }}>最低予定価格 (Minimum Reserve):</span>
            <strong className="mono" style={{ color: 'var(--accent-yamabuki)' }}>
              {auction.reservePrice.toLocaleString()} {auction.currency}
            </strong>
          </div>
        </div>

        {/* Step 壱: 私的算定 (Private Valuation) */}
        <div style={{ marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.6rem' }}>
            <span className="kanji-step">壱</span>
            <span className="font-mincho" style={{ fontWeight: 700, fontSize: '1rem' }}>私的算定 (Private Valuation)</span>
            <span className="badge badge-mint" style={{ marginLeft: 'auto' }}>端末内隔離 LOCAL ONLY</span>
          </div>

          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">
              提案評価額 ({auction.currency}) — 貴社端末内にのみ留まり、外部通信されません
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
                <span>警告：回路制約を満たすため、最低価格（{auction.reservePrice.toLocaleString()} {auction.currency}）以上を入力してください。</span>
              </div>
            ) : (
              <div style={{ color: 'var(--accent-matsuba)', fontSize: '0.75rem', marginTop: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Check size={13} />
                <span>予定価格基準を満たしています（余力: +{(bidAmount - auction.reservePrice).toLocaleString()} {auction.currency}）</span>
              </div>
            )}
          </div>
        </div>

        {/* Step 弐: 暗号封緘 (Cryptographic Sealing) */}
        <div style={{ marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.6rem' }}>
            <span className="kanji-step">弐</span>
            <span className="font-mincho" style={{ fontWeight: 700, fontSize: '1rem' }}>暗号封緘 (Cryptographic Sealing)</span>
            <span className="badge badge-shu" style={{ marginLeft: 'auto' }}>PEDERSEN & POSEIDON</span>
          </div>

          <div style={{ background: 'var(--bg-core)', padding: '0.85rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }} className="eyebrow">公開封緘コミットメント (32-Byte Public Anchor):</div>
              <div className="mono" style={{ fontSize: '0.75rem', color: 'var(--accent-matsuba)', wordBreak: 'break-all' }}>
                {commitmentHex || '計算中...'}
              </div>
            </div>
            <div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }} className="eyebrow">二重入札抑止識別子 (Anti-Replay Nullifier):</div>
              <div className="mono" style={{ fontSize: '0.75rem', color: 'var(--accent-cobalt)', wordBreak: 'break-all' }}>
                {nullifierHex || '計算中...'}
              </div>
            </div>
          </div>
        </div>

        {/* Step 参: 零知識証明 (Zero-Knowledge Attestation) */}
        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.6rem' }}>
            <span className="kanji-step">参</span>
            <span className="font-mincho" style={{ fontWeight: 700, fontSize: '1rem' }}>零知識証明提出 (ZK Submission)</span>
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
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                貴社の正確な評価額（<strong>{bidAmount.toLocaleString()} {auction.currency}</strong>）は台帳にも主催者にも開示されません。
                Midnight 零知識回路により「予定価格以上である」という数学的事実と封緘コミットメントのみを提出することを確認します。
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
          <span>{progressMsg ? '証明生成中 PROVING CIRCUIT...' : '封緘証明を発行し提出 EXECUTE SEALED SUBMISSION'}</span>
        </button>
      </div>
    </div>
  );
};
