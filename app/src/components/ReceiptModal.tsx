import React from 'react';
import { X, Download, ShieldCheck, Copy } from 'lucide-react';
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
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem', borderBottom: '2px solid var(--border-strong)', paddingBottom: '1rem' }}>
          <div>
            <span className="eyebrow">CRYPTOGRAPHIC RECEIPT</span>
            <h2 className="font-display" style={{ fontSize: '2rem' }}>
              Submission Certificate
            </h2>
          </div>
          <button className="btn btn-secondary btn-sm" onClick={onClose} style={{ border: 'none' }}>
            <X size={20} />
          </button>
        </div>

        <div style={{ padding: '1.5rem', border: '1px solid var(--status-success)', marginBottom: '2rem' }}>
          <div style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--status-success)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ShieldCheck size={18} /> ZK Verification Confirmed
          </div>
          <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '0.5rem', lineHeight: 1.6 }}>
            The <span className="mono">submitSealedBid</span> circuit evaluated successfully. Your inputs were mathematically proven and discarded.
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '2rem', padding: '1.5rem', border: '1px solid var(--border-medium)' }}>
          <div>
            <span className="eyebrow">TRANSACTION ID</span>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem' }}>
              <span className="mono" style={{ wordBreak: 'break-all' }}>{receipt.transactionId}</span>
              <button className="btn btn-secondary btn-sm" onClick={() => copyToClipboard(receipt.transactionId)} title="Copy">
                <Copy size={14} />
              </button>
            </div>
          </div>

          <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '1.5rem' }}>
            <span className="eyebrow">PUBLIC COMMITMENT</span>
            <div className="mono" style={{ wordBreak: 'break-all', marginTop: '0.5rem' }}>
              {receipt.commitmentHex}
            </div>
          </div>

          <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '1.5rem' }}>
            <span className="eyebrow">NULLIFIER</span>
            <div className="mono" style={{ wordBreak: 'break-all', marginTop: '0.5rem' }}>
              {receipt.nullifierHex}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '1.5rem' }}>
            <div>
              <span className="eyebrow">CIRCUIT</span>
              <div className="mono">{receipt.circuitName}</div>
            </div>
            <div>
              <span className="eyebrow">NETWORK</span>
              <div className="mono">{receipt.network.toUpperCase()}</div>
            </div>
            <div>
              <span className="eyebrow">BLOCK HEIGHT</span>
              <div className="mono">#{receipt.blockHeight}</div>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '1rem' }}>
          <button className="btn btn-secondary" style={{ flex: 1 }} onClick={handleDownload}>
            <Download size={16} /> Download .json
          </button>
          <button className="btn btn-primary" style={{ flex: 1 }} onClick={onClose}>
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};
