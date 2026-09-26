import React from 'react';
import { X, CheckCircle, Download, ExternalLink, ShieldCheck, Copy } from 'lucide-react';
import { FinalizedReceipt } from '../domain/types';

interface ReceiptModalProps {
  receipt: FinalizedReceipt;
  onClose: () => void;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({ receipt, onClose }) => {
  const handleDownload = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(receipt, null, 2));
    const a = document.createElement('a');
    a.href = dataStr;
    a.download = `aegisbid-receipt-${receipt.transactionId}.json`;
    a.click();
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content card-bracketed" onClick={(e) => e.stopPropagation()}>
        {/* Certificate Frame */}
        <div className="certificate-frame">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span className="hanko-seal" style={{ fontSize: '0.85rem', padding: '0.3rem 0.6rem' }}>済印</span>
              <div>
                <span className="eyebrow" style={{ color: 'var(--accent-shu)' }}>OFFICIAL CRYPTOGRAPHIC ATTESTATION</span>
                <h2 className="font-mincho" style={{ fontSize: '1.35rem', fontWeight: 700 }}>
                  Certificate of Sealed Submission
                </h2>
              </div>
            </div>
            <button className="btn btn-secondary btn-sm" onClick={onClose}>
              <X size={16} />
            </button>
          </div>

          <div style={{ padding: '0.85rem', background: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.25)', borderRadius: 'var(--radius-sm)', marginBottom: '1.25rem' }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--accent-matsuba)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <ShieldCheck size={16} />
              <span>Zero-Knowledge Verification Confirmed (Compact 0.31.1)</span>
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.3rem', lineHeight: 1.6 }}>
              The Compact circuit <code className="mono">submitSealedBid</code> evaluated successfully.
              Your valuation was mathematically proven to satisfy reserve criteria. The secret amount never left your device; only the public commitment anchor was committed to the Midnight ledger.
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.25rem', background: 'var(--bg-core)', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
            <div>
              <span className="eyebrow">TRANSACTION ID</span>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.2rem' }}>
                <span className="mono" style={{ fontSize: '0.8rem', wordBreak: 'break-all' }}>{receipt.transactionId}</span>
                <button className="btn btn-secondary btn-sm" onClick={() => copyToClipboard(receipt.transactionId)} title="Copy to clipboard">
                  <Copy size={12} />
                </button>
              </div>
            </div>

            <div>
              <span className="eyebrow">PUBLIC COMMITMENT ANCHOR</span>
              <div className="mono" style={{ fontSize: '0.8rem', color: 'var(--accent-matsuba)', wordBreak: 'break-all', marginTop: '0.2rem' }}>
                {receipt.commitmentHex}
              </div>
            </div>

            <div>
              <span className="eyebrow">ANTI-REPLAY NULLIFIER</span>
              <div className="mono" style={{ fontSize: '0.8rem', color: 'var(--accent-cobalt)', wordBreak: 'break-all', marginTop: '0.2rem' }}>
                {receipt.nullifierHex}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem', marginTop: '0.5rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.75rem' }}>
              <div>
                <span className="eyebrow">CIRCUIT</span>
                <div className="mono" style={{ fontSize: '0.8rem' }}>{receipt.circuitName}</div>
              </div>
              <div>
                <span className="eyebrow">NETWORK</span>
                <div className="mono" style={{ fontSize: '0.8rem' }}>{receipt.network.toUpperCase()}</div>
              </div>
              <div>
                <span className="eyebrow">BLOCK HEIGHT</span>
                <div className="mono" style={{ fontSize: '0.8rem' }}>#{receipt.blockHeight}</div>
              </div>
            </div>
          </div>

          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '1.25rem', textAlign: 'center', lineHeight: 1.6 }}>
            Please preserve this cryptographic receipt. The commitment and local salt will be required to verify or reveal your bid upon auction finalization.
          </div>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button className="btn btn-secondary" style={{ flex: 1 }} onClick={handleDownload}>
              <Download size={15} />
              <span>DOWNLOAD RECEIPT (.JSON)</span>
            </button>
            <button className="btn btn-primary" style={{ flex: 1 }} onClick={onClose}>
              <span>CONTINUE</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
