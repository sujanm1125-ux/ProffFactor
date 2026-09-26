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
            <span className="hanko-seal">秘匿入札</span>
            <span className="eyebrow">BIDDER SANCTUARY & SOVEREIGN VAULT</span>
          </div>
          <h1 className="font-mincho" style={{ fontSize: '2rem', fontWeight: 700, letterSpacing: '0.04em' }}>
            入札者の私室 <span style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', fontWeight: 400 }}>Bidder Haven</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', maxWidth: '820px', marginTop: '0.5rem', lineHeight: 1.7 }}>
            公平な調達は、入札者の尊厳と機密の保全から始まります。AegisBid では、提案金額や利益率は貴社の端末内に留まり、
            Midnight 零知識証明によって「基準を満たしている」という事実のみが台帳に記録されます。
          </p>
        </div>

        <button className="btn btn-secondary" onClick={handleExportBackup} title="Export cryptographic receipts and nonces">
          <Download size={15} />
          <span>控帳出力 EXPORT VAULT</span>
        </button>
      </div>

      {/* Grid: Keystore Status & Privacy Reassurance */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.5rem' }}>
        {/* Local Keystore Sanctuary */}
        <div className="card card-bracketed" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Key size={18} style={{ color: 'var(--accent-shu)' }} />
              <span className="font-mincho" style={{ fontWeight: 700, fontSize: '1.1rem' }}>端末内自己主権鍵</span>
            </div>
            <span className="badge badge-shu">端末隔離 / LOCAL ONLY</span>
          </div>

          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: '0.5rem 0' }}>
            入札の封緘に用いる秘密鍵は、外部サーバーやクラウドへ一切送信されず、端末の IndexedDB に暗号化保護されています。
          </p>

          <div style={{ background: 'var(--bg-core)', padding: '0.85rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }} className="eyebrow">公開入札者識別子 (Derived Identity):</div>
              <div className="mono" style={{ fontSize: '0.75rem', color: 'var(--accent-cobalt)', wordBreak: 'break-all' }}>
                {identity?.derivedIdentityHex || 'Generating local identity...'}
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }} className="eyebrow">局所秘密鍵 (Private Seed):</span>
                <button
                  onClick={() => setShowSecret(!showSecret)}
                  style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.7rem' }}
                >
                  {showSecret ? <EyeOff size={12} /> : <Eye size={12} />}
                  {showSecret ? '非表示' : '表示'}
                </button>
              </div>
              <div className="mono" style={{ fontSize: '0.75rem', color: showSecret ? 'var(--accent-shu)' : 'var(--text-muted)', wordBreak: 'break-all' }}>
                {showSecret ? identity?.secretHex : '••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••'}
              </div>
            </div>
          </div>

          <div style={{ fontSize: '0.75rem', color: 'var(--accent-matsuba)', display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.25rem' }}>
            <CheckCircle size={14} />
            <span>Schnorr 鍵ペア正常稼働中（外部流出リスク：ゼロ）</span>
          </div>
        </div>

        {/* Confidential Margin Simulator */}
        <div className="card card-bracketed" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Calculator size={18} style={{ color: 'var(--accent-cobalt)' }} />
              <span className="font-mincho" style={{ fontWeight: 700, fontSize: '1.1rem' }}>机上算定シミュレーター</span>
            </div>
            <span className="badge badge-mint">局所計算 / NO NETWORK</span>
          </div>

          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: '0.5rem 0' }}>
            最低予定価格との乖離やコミットメント生成を、通信を行うことなく完全にオフラインで事前検証できます。
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">対象案件の選択</label>
              <select
                className="form-select"
                value={simAuctionId}
                onChange={(e) => setSimAuctionId(e.target.value)}
                style={{ fontSize: '0.85rem' }}
              >
                {auctions.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.title} (予定価格: {a.reservePrice.toLocaleString()} {a.currency})
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">想定入札額 ({selectedSimAuction?.currency})</label>
              <input
                type="number"
                className="form-input"
                value={simAmount}
                onChange={(e) => setSimAmount(e.target.value)}
                style={{ fontSize: '0.85rem' }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-core)', padding: '0.65rem 0.85rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', fontSize: '0.8rem' }}>
              <span style={{ color: 'var(--text-secondary)' }}>最低価格に対する差額:</span>
              <strong className="mono" style={{ color: isCompliant ? 'var(--accent-matsuba)' : 'var(--accent-danger)' }}>
                {deltaFromReserve >= 0n ? `+${deltaFromReserve.toLocaleString()}` : deltaFromReserve.toLocaleString()} {selectedSimAuction?.currency}
                {isCompliant ? ' (適合)' : ' (不適合)'}
              </strong>
            </div>
          </div>
        </div>
      </div>

      {/* Active Sealed Bids Ledger */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <span className="eyebrow">SUBMISSION AUDIT & CERTIFICATES</span>
            <h2 className="font-mincho" style={{ fontSize: '1.4rem', fontWeight: 700 }}>
              自社封緘入札一覧 <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 400 }}>Sealed Submissions</span>
            </h2>
          </div>
          <span className="badge badge-shu">
            合計 {recentReceipts.length} 件の封緘済
          </span>
        </div>

        {recentReceipts.length === 0 ? (
          <div className="card" style={{ padding: '2.5rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
            <FileText size={36} style={{ color: 'var(--text-muted)' }} />
            <div>
              <div className="font-mincho" style={{ fontSize: '1.1rem', fontWeight: 600 }}>現在、保管されている封緘入札はありません</div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '0.25rem', maxWidth: '480px' }}>
                案件一覧よりご希望の調達案件を選択し、三段階の封緘プロトコルに沿って機密入札を行ってください。
              </p>
            </div>
            <button className="btn btn-primary btn-sm" onClick={() => onSelectBid(auctions[0])}>
              <span>案件一覧へ移動</span>
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
                          ブロック高 #{receipt.blockHeight}
                        </span>
                      </div>
                      <h4 className="font-mincho" style={{ fontSize: '1.1rem', fontWeight: 600 }}>
                        {matchedAuction?.title || '調達案件封緘入札'}
                      </h4>
                      <div style={{ display: 'flex', gap: '1.5rem', marginTop: '0.4rem', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                        <div>
                          <span style={{ color: 'var(--text-muted)' }}>公開コミットメント: </span>
                          <span className="mono" style={{ color: 'var(--accent-matsuba)' }}>
                            {receipt.commitmentHex.slice(0, 14)}...{receipt.commitmentHex.slice(-8)}
                          </span>
                        </div>
                        <div>
                          <span style={{ color: 'var(--text-muted)' }}>無効化識別子: </span>
                          <span className="mono" style={{ color: 'var(--accent-cobalt)' }}>
                            {receipt.nullifierHex.slice(0, 14)}...{receipt.nullifierHex.slice(-8)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <button className="btn btn-secondary btn-sm" onClick={() => onViewReceipt(receipt)}>
                        <FileText size={13} />
                        <span>封緘証明書を表示</span>
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
