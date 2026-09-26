import React, { useState, useEffect } from 'react';
import { Key, Download, Calculator, Eye, EyeOff, FileText, ArrowRight } from 'lucide-react';
import { Auction, FinalizedReceipt, WalletState } from '../domain/types';
import { getOrCreateDefaultIdentity, LocalBidderSecret, computeClientCommitment } from '../domain/privateState';

interface BidderHavenProps {
  wallet: WalletState;
  auctions: Auction[];
  recentReceipts: FinalizedReceipt[];
  onSelectBid: (auction: Auction) => void;
  onViewReceipt: (receipt: FinalizedReceipt) => void;
}

export const BidderHaven: React.FC<BidderHavenProps> = ({
  wallet,
  auctions,
  recentReceipts,
  onSelectBid,
  onViewReceipt,
}) => {
  const [identity, setIdentity] = useState<LocalBidderSecret | null>(null);
  const [simAuctionId, setSimAuctionId] = useState<string>(auctions[0]?.id || '');
  const [simAmount, setSimAmount] = useState<string>('150000');
  const [simCommitment, setSimCommitment] = useState<string>('');
  const [showSecret, setShowSecret] = useState<boolean>(false);

  useEffect(() => {
    getOrCreateDefaultIdentity().then(setIdentity);
  }, []);

  const selectedSimAuction = auctions.find((a) => a.id === simAuctionId) || auctions[0];
  const simValuation = BigInt(simAmount || '0');
  const reserveThreshold = selectedSimAuction ? selectedSimAuction.reservePrice : 0n;
  const isCompliant = selectedSimAuction ? simValuation >= reserveThreshold : false;
  const deltaFromReserve = selectedSimAuction ? simValuation - reserveThreshold : 0n;

  useEffect(() => {
    if (identity && selectedSimAuction && simValuation > 0n) {
      computeClientCommitment(
        selectedSimAuction.auctionIdHex,
        identity.derivedIdentityHex,
        simValuation,
        '0000000000000000000000000000000000000000000000000000000000000001'
      ).then(setSimCommitment);
    }
  }, [identity, selectedSimAuction, simValuation]);

  const handleExportBackup = () => {
    const backupData = {
      timestamp: new Date().toISOString(),
      bidderIdentityHex: identity?.derivedIdentityHex,
      network: wallet.network,
      receipts: recentReceipts,
    };
    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `aegisbid-vault-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="brutalist-grid" style={{ width: '100vw', padding: '0', margin: '0' }}>
      
      {/* Left: Active Bidding Terminal */}
      <div className="grid-col" style={{ gridColumn: 'span 2', padding: '4rem', display: 'flex', flexDirection: 'column', gap: '3rem', borderRight: '2px solid var(--border-strong)', backgroundColor: 'var(--bg-core)' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '2rem', borderBottom: '2px solid var(--border-strong)', paddingBottom: '1.5rem' }}>
          <div>
            <span className="eyebrow" style={{ display: 'block', marginBottom: '1rem', color: 'var(--accent-vermilion)' }}>
              TERMINAL // 01
            </span>
            <h1 className="font-display" style={{ fontSize: 'clamp(3rem, 5vw, 6rem)', color: 'var(--text-primary)', lineHeight: 0.9, textTransform: 'uppercase' }}>
              Active<br />Bidding<br />Terminal
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.25rem', marginTop: '2rem', maxWidth: '80%' }}>
              Cryptographic keys and valuations secured in local memory. Model margins offline.
            </p>
          </div>
          <button className="btn btn-secondary" onClick={handleExportBackup} title="Export vault" style={{ borderColor: 'var(--accent-vermilion)', color: 'var(--accent-vermilion)' }}>
            <Download size={16} />
            Export Vault
          </button>
        </div>

        {/* Local Key Identity */}
        <div style={{ border: '2px solid var(--text-primary)', padding: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h2 className="font-display" style={{ fontSize: '2rem', display: 'flex', alignItems: 'center', gap: '1rem', textTransform: 'uppercase' }}>
              <Key size={24} /> Key Identity
            </h2>
            <span className="badge" style={{ backgroundColor: 'var(--accent-vermilion)', color: '#fff' }}>LOCAL ONLY</span>
          </div>

          <div style={{ borderTop: '2px solid var(--border-strong)', paddingTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div>
              <span className="eyebrow">DERIVED PUBLIC IDENTITY</span>
              <div className="mono" style={{ marginTop: '0.5rem', wordBreak: 'break-all', fontSize: '1.1rem', backgroundColor: '#000', color: '#fff', padding: '1rem' }}>
                {identity?.derivedIdentityHex || 'Generating...'}
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <span className="eyebrow">SECRET ENTROPY SEED</span>
                <button
                  onClick={() => setShowSecret(!showSecret)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                  className="eyebrow"
                >
                  {showSecret ? <><EyeOff size={14} /> HIDE</> : <><Eye size={14} /> REVEAL</>}
                </button>
              </div>
              <div className="mono" style={{ color: showSecret ? 'var(--accent-vermilion)' : 'var(--text-muted)', wordBreak: 'break-all', fontSize: '1.1rem', border: '1px dashed var(--text-primary)', padding: '1rem' }}>
                {showSecret ? identity?.secretHex : '••••••••••••••••••••••••••••••••••••••••••••••••'}
              </div>
            </div>
          </div>
        </div>

        {/* Offline Margin Simulator */}
        <div style={{ border: '2px solid var(--text-primary)', padding: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h2 className="font-display" style={{ fontSize: '2rem', display: 'flex', alignItems: 'center', gap: '1rem', textTransform: 'uppercase' }}>
              <Calculator size={24} /> Simulator
            </h2>
            <span className="badge" style={{ backgroundColor: '#000', color: '#fff' }}>OFFLINE CIRCUIT</span>
          </div>

          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
            <label className="form-label" style={{ fontSize: '1rem', textTransform: 'uppercase' }}>Target Procurement Lot</label>
            <select
              className="form-select"
              value={simAuctionId}
              onChange={(e) => setSimAuctionId(e.target.value)}
              style={{ fontSize: '1.2rem', padding: '1rem', border: '2px solid #000', borderRadius: '0' }}
            >
              {auctions.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.title} (Res: {a.reservePrice.toLocaleString()} {a.currency})
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label" style={{ fontSize: '1rem', textTransform: 'uppercase' }}>Simulated Valuation ({selectedSimAuction?.currency})</label>
            <input
              type="number"
              className="form-input"
              value={simAmount}
              onChange={(e) => setSimAmount(e.target.value)}
              style={{ fontSize: '1.5rem', padding: '1rem', border: '2px solid #000', borderRadius: '0', width: '100%' }}
            />
          </div>

          <div style={{ 
            marginTop: '2rem', 
            paddingTop: '1.5rem', 
            borderTop: '2px solid #000',
            display: 'flex', 
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: isCompliant ? '#000' : 'var(--accent-vermilion)',
            color: '#fff',
            padding: '1rem'
          }}>
            <span className="eyebrow" style={{ color: '#fff' }}>VARIANCE</span>
            <strong className="mono" style={{ fontSize: '1.5rem' }}>
              {deltaFromReserve >= 0n ? `+${deltaFromReserve.toLocaleString()}` : deltaFromReserve.toLocaleString()} 
              {isCompliant ? ' [PASS]' : ' [FAIL]'}
            </strong>
          </div>
        </div>
      </div>

      {/* Right: Receipt Ledger */}
      <div className="grid-col" style={{ gridColumn: 'span 2', padding: '0', display: 'flex', flexDirection: 'column', backgroundColor: '#000', color: '#fff', position: 'relative', overflow: 'hidden' }}>
        
        {/* Background Brutalist Image */}
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0.3, backgroundImage: 'url(/crypto_receipt_ledger.jpg)', backgroundSize: 'cover', backgroundPosition: 'center', zIndex: 0 }}></div>

        <div style={{ position: 'relative', zIndex: 1, padding: '4rem', height: '100%', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', borderBottom: '2px solid rgba(255,255,255,0.2)', paddingBottom: '1rem', marginBottom: '3rem' }}>
            <h2 className="font-display" style={{ fontSize: 'clamp(2rem, 4vw, 4rem)', textTransform: 'uppercase', lineHeight: 1 }}>Receipt<br/>Ledger</h2>
            <span className="eyebrow" style={{ color: 'var(--accent-vermilion)' }}>{recentReceipts.length} RECORDED</span>
          </div>

          <div style={{ flex: 1, overflowY: 'auto' }}>
            {recentReceipts.length === 0 ? (
              <div style={{ border: '2px dashed rgba(255,255,255,0.3)', padding: '4rem', textAlign: 'center' }}>
                <FileText size={48} style={{ color: 'rgba(255,255,255,0.3)', margin: '0 auto 1.5rem' }} />
                <div className="font-display" style={{ fontSize: '2rem', marginBottom: '1rem', textTransform: 'uppercase' }}>No Submissions</div>
                <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: '2rem', fontSize: '1.2rem' }}>
                  Zero-knowledge proofs pending.
                </p>
                <button className="btn" onClick={() => onSelectBid(auctions[0])} style={{ backgroundColor: '#fff', color: '#000', borderRadius: 0, padding: '1rem 2rem', fontSize: '1.1rem', fontWeight: 'bold' }}>
                  VIEW TENDERS <ArrowRight size={20} style={{ marginLeft: '0.5rem', verticalAlign: 'middle' }} />
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                {recentReceipts.map((receipt, index) => {
                  const matchedAuction = auctions.find((a) => a.auctionIdHex === receipt.auctionIdHex);
                  return (
                    <div key={receipt.transactionId || index} style={{ border: '2px solid rgba(255,255,255,0.5)', padding: '2rem', backgroundColor: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(4px)' }}>
                      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1rem' }}>
                        <span className="badge" style={{ backgroundColor: 'var(--accent-vermilion)', color: '#fff' }}>PROVEN VALID</span>
                        <span className="eyebrow" style={{ color: 'rgba(255,255,255,0.6)' }}>BLOCK #{receipt.blockHeight}</span>
                      </div>
                      <h4 className="font-display" style={{ fontSize: '2rem', marginBottom: '1rem', textTransform: 'uppercase' }}>
                        {matchedAuction?.title || 'Unknown Submission'}
                      </h4>
                      <div className="mono" style={{ color: 'rgba(255,255,255,0.8)', fontSize: '1rem', wordBreak: 'break-all', marginBottom: '1.5rem', padding: '1rem', border: '1px solid rgba(255,255,255,0.2)' }}>
                        TX: {receipt.transactionId}
                      </div>
                      <button className="btn" onClick={() => onViewReceipt(receipt)} style={{ width: '100%', backgroundColor: '#fff', color: '#000', borderRadius: 0, padding: '1rem', fontWeight: 'bold', fontSize: '1.1rem' }}>
                        <FileText size={18} style={{ marginRight: '0.5rem', verticalAlign: 'middle' }} /> INSPECT RECEIPT
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
