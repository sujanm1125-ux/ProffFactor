import React from 'react';
import { Auction } from '../domain/types';
import { Shield, Clock, ArrowUpRight, Lock, CheckCircle } from 'lucide-react';

interface AuctionListProps {
  auctions: Auction[];
  onSelectBid: (auction: Auction) => void;
}

export const AuctionList: React.FC<AuctionListProps> = ({ auctions, onSelectBid }) => {
  const kanjiLotNumbers = ['第壱号案件', '第弐号案件', '第参号案件', '第四号案件', '第五号案件'];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '1.5rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.35rem' }}>
            <span className="hanko-seal">調達</span>
            <span className="eyebrow">OFFICIAL CONFIDENTIAL TENDER REGISTRY</span>
          </div>
          <h1 className="font-mincho" style={{ fontSize: '2rem', fontWeight: 700, letterSpacing: '0.04em' }}>
            公示調達・売却案件台帳 <span style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', fontWeight: 400 }}>Confidential Sealed-Bid Registry</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', maxWidth: '850px', marginTop: '0.4rem', lineHeight: 1.7 }}>
            全案件において Midnight 零知識証明によるフロントランニング防御と完全機密保全が適用されます。
            競合企業はもちろん、調達担当者に対しても開札期限まで貴社の提案金額は数学的に隠蔽されます。
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {auctions.map((auction, idx) => (
          <div key={auction.id} className="card card-bracketed" style={{ padding: '1.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1.25rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
                  <span className="hanko-seal hanko-seal-sm">{kanjiLotNumbers[idx] || `第${idx + 1}号`}</span>
                  <span className="badge badge-cobalt">{auction.category.toUpperCase()}</span>
                  <span className={`badge ${auction.status === 'Open' ? 'badge-mint' : 'badge-amber'}`}>
                    {auction.status === 'Open' ? '受付中 OPEN' : '開札・確定 SETTLED'}
                  </span>
                  <span className="mono" style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                    案件識別子: {auction.auctionIdHex.slice(0, 10)}...{auction.auctionIdHex.slice(-6)}
                  </span>
                </div>
                <h3 className="font-mincho" style={{ fontSize: '1.35rem', fontWeight: 700, letterSpacing: '0.02em' }}>
                  {auction.title}
                </h3>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginTop: '0.4rem', maxWidth: '780px', lineHeight: 1.6 }}>
                  {auction.description}
                </p>
              </div>

              <div style={{ textAlign: 'right' }}>
                <div className="eyebrow">最低予定価格 (RESERVE)</div>
                <div style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-primary)' }} className="mono">
                  {auction.reservePrice.toLocaleString()} {auction.currency}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                  現在 {auction.bidsCount} 社の封緘入札を受領
                </div>
              </div>
            </div>

            <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '1.1rem', marginTop: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', fontSize: '0.8rem', color: 'var(--text-secondary)', flexWrap: 'wrap' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Clock size={14} />
                  <span>締切ブロック: #{auction.biddingDeadlineBlock.toString()}</span>
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Lock size={14} style={{ color: 'var(--accent-matsuba)' }} />
                  <span>ZK制約: <code className="mono">提案額 &ge; 予定価格</code></span>
                </span>
                <span className="badge badge-shu">
                  【入札者保護】金額漏洩ゼロ保証
                </span>
              </div>

              {auction.status === 'Open' ? (
                <button className="btn btn-primary btn-sm" onClick={() => onSelectBid(auction)}>
                  <Shield size={14} />
                  <span>封緘入札を行う SEAL BID</span>
                  <ArrowUpRight size={14} />
                </button>
              ) : (
                <span className="badge badge-mint">
                  <CheckCircle size={12} />
                  <span>落札決定済 SETTLED</span>
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
