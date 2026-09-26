import React, { useState, useEffect } from 'react';
import { Shield, Lock, Key, Download, CheckCircle, Calculator, AlertCircle, Eye, EyeOff, FileText, ArrowRight } from 'lucide-react';
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

  // Real-time calculation of simulated commitment without network request
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
      note: 'AegisBid Sovereign Nonce & Sealing Receipt Vault',
    };
    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `aegisbid-bidder-vault-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Editorial Header / Bidder Manifesto */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1.5rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '1.75rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.4rem' }}>
            <span className="hanko-seal">秘匿</span>
            <span className="eyebrow">BIDDER SANCTUARY &bull; SOVEREIGN KEY VAULT</span>
          </div>
          <h1 className="font-mincho" style={{ fontSize: '2.2rem', fontWeight: 700, letterSpacing: '-0.01em' }}>
            Bidder Haven &amp; Sovereign Vault <span style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', fontWeight: 400 }}>/ 入札者の私室</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.98rem', maxWidth: '820px', marginTop: '0.5rem', lineHeight: 1.7 }}>
            Equitable procurement begins with vendor dignity and margin secrecy. In AegisBid, your target valuations
            remain strictly inside your physical machine. Midnight zero-knowledge circuits attest to your qualifications
            without handing over your trade secrets.
          </p>
        </div>

        <button className="btn btn-secondary" onClick={handleExportBackup} title="Export cryptographic receipts and nonces">
          <Download size={15} />
          <span>EXPORT VAULT (.JSON)</span>
        </button>
      </div>

      {/* Grid: Keystore Status & Privacy Reassurance */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.5rem' }}>
        {/* Local Keystore Sanctuary */}
        <div className="card card-bracketed" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Key size={18} style={{ color: 'var(--accent-shu)' }} />
              <span className="font-mincho" style={{ fontWeight: 700, fontSize: '1.15rem' }}>Local Key Enclave</span>
            </div>
            <span className="badge badge-shu">LOCAL MEMORY ONLY</span>
          </div>

          <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', margin: '0.5rem 0', lineHeight: 1.6 }}>
            The secret keys used to blind and sign your bids never leave your local browser storage (IndexedDB). No cloud or operator can access them.
          </p>

          <div style={{ background: 'var(--bg-core)', padding: '0.85rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }} className="eyebrow">DERIVED BIDDER IDENTITY:</div>
              <div className="mono" style={{ fontSize: '0.75rem', color: 'var(--accent-cobalt)', wordBreak: 'break-all' }}>
                {identity?.derivedIdentityHex || 'Generating local identity...'}
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }} className="eyebrow">LOCAL SECRET SEED:</span>
                <button
                  onClick={() => setShowSecret(!showSecret)}
                  style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.7rem' }}
                >
                  {showSecret ? <EyeOff size={12} /> : <Eye size={12} />}
                  {showSecret ? 'Hide' : 'Reveal'}
                </button>
              </div>
              <div className="mono" style={{ fontSize: '0.75rem', color: showSecret ? 'var(--accent-shu)' : 'var(--text-muted)', wordBreak: 'break-all' }}>
                {showSecret ? identity?.secretHex : '••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••'}
              </div>
            </div>
          </div>

          <div style={{ fontSize: '0.78rem', color: 'var(--accent-matsuba)', display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.25rem' }}>
            <CheckCircle size={14} />
            <span>Schnorr &amp; Pedersen keypairs operational (Zero cloud leakage)</span>
          </div>
        </div>

        {/* Confidential Margin Simulator */}
        <div className="card card-bracketed" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Calculator size={18} style={{ color: 'var(--accent-cobalt)' }} />
              <span className="font-mincho" style={{ fontWeight: 700, fontSize: '1.15rem' }}>Confidential Margin Simulator</span>
            </div>
            <span className="badge badge-mint">OFFLINE SIMULATION</span>
          </div>

          <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', margin: '0.5rem 0', lineHeight: 1.6 }}>
            Model pricing headroom and commitment generation offline without emitting any network packets.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Target Tender Lot</label>
              <select
                className="form-select"
                value={simAuctionId}
                onChange={(e) => setSimAuctionId(e.target.value)}
                style={{ fontSize: '0.85rem' }}
              >
                {auctions.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.title} (Reserve: {a.reservePrice.toLocaleString()} {a.currency})
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Simulated Valuation ({selectedSimAuction?.currency})</label>
              <input
                type="number"
                className="form-input"
                value={simAmount}
                onChange={(e) => setSimAmount(e.target.value)}
                style={{ fontSize: '0.85rem' }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-core)', padding: '0.65rem 0.85rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', fontSize: '0.82rem' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Variance from Reserve:</span>
              <strong className="mono" style={{ color: isCompliant ? 'var(--accent-matsuba)' : 'var(--accent-danger)' }}>
                {deltaFromReserve >= 0n ? `+${deltaFromReserve.toLocaleString()}` : deltaFromReserve.toLocaleString()} {selectedSimAuction?.currency}
                {isCompliant ? ' (Compliant)' : ' (Below Reserve)'}
              </strong>
            </div>
          </div>
        </div>
      </div>

      {/* Active Sealed Bids Ledger */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <span className="eyebrow">SUBMISSION AUDIT &amp; CERTIFICATES</span>
            <h2 className="font-mincho" style={{ fontSize: '1.4rem', fontWeight: 700 }}>
              Sealed Submissions Ledger <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 400 }}>/ 封緘台帳</span>
            </h2>
          </div>
          <span className="badge badge-shu">
            {recentReceipts.length} SEALED SUBMISSIONS RECORDED
          </span>
        </div>

        {recentReceipts.length === 0 ? (
          <div className="card" style={{ padding: '2.5rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
            <FileText size={36} style={{ color: 'var(--text-muted)' }} />
            <div>
              <div className="font-mincho" style={{ fontSize: '1.15rem', fontWeight: 600 }}>No sealed submissions on this device yet</div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginTop: '0.25rem', maxWidth: '480px' }}>
                Select an active lot from the Tenders registry to formulate your valuation under the client-side Three-Stage Sealing Protocol.
              </p>
            </div>
            <button className="btn btn-primary btn-sm" onClick={() => onSelectBid(auctions[0])}>
              <span>EXPLORE TENDERS</span>
              <ArrowRight size={14} />
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {recentReceipts.map((receipt, index) => {
              const matchedAuction = auctions.find((a) => a.auctionIdHex === receipt.auctionIdHex);
              return (
                <div key={receipt.transactionId || index} className="card" style={{ padding: '1.25rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                        <span className="hanko-seal hanko-seal-sm">済</span>
                        <span className="badge badge-mint">PROOF VERIFIED</span>
                        <span className="mono" style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          Block Height #{receipt.blockHeight}
                        </span>
                      </div>
                      <h4 className="font-mincho" style={{ fontSize: '1.15rem', fontWeight: 600 }}>
                        {matchedAuction?.title || 'Sealed Tender Submission'}
                      </h4>
                      <div style={{ display: 'flex', gap: '1.5rem', marginTop: '0.4rem', fontSize: '0.78rem', color: 'var(--text-secondary)', flexWrap: 'wrap' }}>
                        <div>
                          <span style={{ color: 'var(--text-muted)' }}>Public Commitment: </span>
                          <span className="mono" style={{ color: 'var(--accent-matsuba)' }}>
                            {receipt.commitmentHex.slice(0, 14)}...{receipt.commitmentHex.slice(-8)}
                          </span>
                        </div>
                        <div>
                          <span style={{ color: 'var(--text-muted)' }}>Nullifier: </span>
                          <span className="mono" style={{ color: 'var(--accent-cobalt)' }}>
                            {receipt.nullifierHex.slice(0, 14)}...{receipt.nullifierHex.slice(-8)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <button className="btn btn-secondary btn-sm" onClick={() => onViewReceipt(receipt)}>
                        <FileText size={13} />
                        <span>VIEW SEALING CERTIFICATE</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
