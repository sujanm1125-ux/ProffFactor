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
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <CheckCircle size={22} className="text-accent-mint" />
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>ZK Proof Receipt</h2>
          </div>
          <button className="btn btn-secondary btn-sm" onClick={onClose}>
            <X size={16} />
          </button>
        </div>

        <div style={{ padding: '0.85rem', background: 'rgba(0, 229, 153, 0.08)', border: '1px solid rgba(0, 229, 153, 0.3)', borderRadius: 'var(--radius-md)', marginBottom: '1.25rem' }}>
          <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--accent-mint)' }}>
            Zero-Knowledge Verification Confirmed
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
            The Compact circuit <code className="mono">submitSealedBid</code> evaluated successfully.
            Your bid amount was mathematically proven to satisfy reserve criteria without public disclosure.
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem', background: 'var(--bg-elevated)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
          <div>
            <span className="eyebrow">TRANSACTION ID</span>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.2rem' }}>
              <span className="mono" style={{ fontSize: '0.8rem', wordBreak: 'break-all' }}>{receipt.transactionId}</span>
              <button className="btn btn-secondary btn-sm" onClick={() => copyToClipboard(receipt.transactionId)}>
                <Copy size={12} />
              </button>
            </div>
          </div>

          <div>
            <span className="eyebrow">PUBLIC COMMITMENT</span>
            <div className="mono" style={{ fontSize: '0.8rem', color: 'var(--accent-mint)', wordBreak: 'break-all', marginTop: '0.2rem' }}>
              {receipt.commitmentHex}
            </div>
          </div>

          <div>
            <span className="eyebrow">NULLIFIER (REPLAY DEFENSE)</span>
            <div className="mono" style={{ fontSize: '0.8rem', color: 'var(--accent-cobalt)', wordBreak: 'break-all', marginTop: '0.2rem' }}>
              {receipt.nullifierHex}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem', marginTop: '0.5rem' }}>
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

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button className="btn btn-secondary" style={{ flex: 1 }} onClick={handleDownload}>
            <Download size={15} />
            DOWNLOAD RECEIPT (.JSON)
          </button>
          <button className="btn btn-primary" style={{ flex: 1 }} onClick={onClose}>
            CONTINUE
          </button>
        </div>
      </div>
    </div>
  );
};
