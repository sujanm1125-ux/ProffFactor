import React from 'react';
import { Auction } from '../domain/types';
import { Shield, Clock, ArrowUpRight, Lock, CheckCircle } from 'lucide-react';

interface AuctionListProps {
  auctions: Auction[];
  onSelectBid: (auction: Auction) => void;
}

export const AuctionList: React.FC<AuctionListProps> = ({ auctions, onSelectBid }) => {
  const kanjiMarkers = ['壱', '弐', '参', '四', '五'];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '1.5rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.35rem' }}>
            <span className="hanko-seal">調達</span>
            <span className="eyebrow">OFFICIAL CONFIDENTIAL TENDER REGISTRY</span>
          </div>
          <h1 className="font-mincho" style={{ fontSize: '2.2rem', fontWeight: 700, letterSpacing: '-0.01em' }}>
            Confidential Sealed-Bid Registry
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.98rem', maxWidth: '850px', marginTop: '0.4rem', lineHeight: 1.7 }}>
            Every procurement lot enforces client-side zero-knowledge proofs on Midnight Network.
            Neither competing bidders nor the procurement desk can inspect your bid valuation before the deadline.
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {auctions.map((auction, idx) => (
          <div key={auction.id} className="card card-bracketed" style={{ padding: '1.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1.25rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
                  <span className="hanko-seal hanko-seal-sm">LOT 0{idx + 1} / {kanjiMarkers[idx] || idx + 1}</span>
                  <span className="badge badge-cobalt">{auction.category.toUpperCase()}</span>
                  <span className={`badge ${auction.status === 'Open' ? 'badge-mint' : 'badge-amber'}`}>
                    {auction.status === 'Open' ? 'OPEN' : 'SETTLED'}
                  </span>
                  <span className="mono" style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                    ID: {auction.auctionIdHex.slice(0, 10)}...{auction.auctionIdHex.slice(-6)}
                  </span>
                </div>
                <h3 className="font-mincho" style={{ fontSize: '1.35rem', fontWeight: 700, letterSpacing: '0.01em' }}>
                  {auction.title}
                </h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '0.4rem', maxWidth: '780px', lineHeight: 1.6 }}>
                  {auction.description}
                </p>
              </div>

              <div style={{ textAlign: 'right' }}>
                <div className="eyebrow">MINIMUM RESERVE</div>
                <div style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-primary)' }} className="mono">
                  {auction.reservePrice.toLocaleString()} {auction.currency}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                  {auction.bidsCount} sealed {auction.bidsCount === 1 ? 'bid' : 'bids'} committed
                </div>
              </div>
            </div>

            <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '1.1rem', marginTop: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', fontSize: '0.8rem', color: 'var(--text-secondary)', flexWrap: 'wrap' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Clock size={14} />
                  <span>Deadline: Block #{auction.biddingDeadlineBlock.toString()}</span>
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Lock size={14} style={{ color: 'var(--accent-matsuba)' }} />
                  <span>ZK Policy: <code className="mono">bidAmount &gt;= reserve</code></span>
                </span>
                <span className="badge badge-shu">
                  ZERO PRICE EXPOSURE GUARANTEED
                </span>
              </div>

              {auction.status === 'Open' ? (
                <button className="btn btn-primary btn-sm" onClick={() => onSelectBid(auction)}>
                  <Shield size={14} />
                  <span>PLACE SEALED BID</span>
                  <ArrowUpRight size={14} />
                </button>
              ) : (
                <span className="badge badge-mint">
                  <CheckCircle size={12} />
                  <span>AUCTION SETTLED</span>
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
