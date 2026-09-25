import React from 'react';
import { Auction } from '../domain/types';
import { Shield, Clock, ArrowUpRight, Lock, CheckCircle } from 'lucide-react';

interface AuctionListProps {
  auctions: Auction[];
  onSelectBid: (auction: Auction) => void;
}

export const AuctionList: React.FC<AuctionListProps> = ({ auctions, onSelectBid }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <span className="eyebrow">ACTIVE PROCUREMENTS & LIQUIDATIONS</span>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Confidential Sealed-Bid Registry</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            Submit bids with zero-knowledge cryptographic proofs. Competing vendors cannot observe your bid valuation.
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {auctions.map((auction) => (
          <div key={auction.id} className="card" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                  <span className="badge badge-cobalt">{auction.category.toUpperCase()}</span>
                  <span className={`badge ${auction.status === 'Open' ? 'badge-mint' : 'badge-amber'}`}>
                    {auction.status.toUpperCase()}
                  </span>
                  <span className="mono" style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    ID: {auction.auctionIdHex.slice(0, 10)}...{auction.auctionIdHex.slice(-6)}
                  </span>
                </div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>{auction.title}</h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '0.25rem', maxWidth: '750px' }}>
                  {auction.description}
                </p>
              </div>

              <div style={{ textAlign: 'right' }}>
                <div className="eyebrow">MINIMUM RESERVE</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 800 }} className="mono">
                  {auction.reservePrice.toLocaleString()} {auction.currency}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                  {auction.bidsCount} sealed {auction.bidsCount === 1 ? 'bid' : 'bids'} committed
                </div>
              </div>
            </div>

            <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '1rem', marginTop: '0.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Clock size={14} />
                  Deadline: Block #{auction.biddingDeadlineBlock.toString()}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Lock size={14} style={{ color: 'var(--accent-mint)' }} />
                  ZK Policy: <code className="mono">bidAmount &gt;= reserve</code>
                </span>
              </div>

              {auction.status === 'Open' ? (
                <button className="btn btn-primary btn-sm" onClick={() => onSelectBid(auction)}>
                  <Shield size={14} />
                  PLACE SEALED BID
                  <ArrowUpRight size={14} />
                </button>
              ) : (
                <span className="badge badge-mint">
                  <CheckCircle size={12} />
                  AUCTION SETTLED
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
