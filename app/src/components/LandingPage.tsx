import React from 'react';
import {
  Shield,
  Lock,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Key,
  Cpu,
  FileCheck,
  EyeOff,
  Sparkles,
  Database,
  ArrowUpRight,
} from 'lucide-react';
import { Auction, WalletState } from '../domain/types';

interface LandingPageProps {
  wallet: WalletState;
  auctions: Auction[];
  onNavigateTab: (tab: 'auctions' | 'bidder' | 'privacy' | 'assistant' | 'metrics') => void;
  onSelectBid: (auction: Auction) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  wallet,
  auctions,
  onNavigateTab,
  onSelectBid,
}) => {
  const activeAuctions = auctions.filter((a) => a.status === 'Open').slice(0, 2);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4.5rem' }}>
      {/* Editorial Masthead & Hero Section */}
      <section style={{ position: 'relative', paddingTop: '1.5rem', paddingBottom: '2.5rem', borderBottom: '1px solid var(--border-subtle)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
          <span className="hanko-seal">密印</span>
          <span className="eyebrow" style={{ color: 'var(--accent-shu)' }}>
            ISSUE 01 &bull; MIDNIGHT PREPROD &bull; ZERO-KNOWLEDGE TENDER PROTOCOL
          </span>
        </div>

        <div style={{ maxWidth: '920px' }}>
          <h1
            className="font-mincho"
            style={{
              fontSize: 'clamp(2.4rem, 5vw, 3.8rem)',
              lineHeight: 1.15,
              fontWeight: 700,
              letterSpacing: '-0.01em',
              color: 'var(--text-primary)',
              marginBottom: '1.5rem',
            }}
          >
            The Architecture of <span style={{ color: 'var(--accent-shu)' }}>Sealed Intent</span>.
          </h1>

          <p
            style={{
              fontSize: '1.15rem',
              lineHeight: 1.7,
              color: 'var(--text-secondary)',
              maxWidth: '780px',
              marginBottom: '2.25rem',
            }}
          >
            A high-stakes procurement protocol engineered for Midnight Network. Protecting bidder margins,
            eliminating front-running, and mathematically proving reserve compliance without ever disclosing
            trade secrets or pricing power.
          </p>

          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <button
              className="btn btn-primary"
              style={{ padding: '0.85rem 1.75rem', fontSize: '0.95rem' }}
              onClick={() => onNavigateTab('auctions')}
            >
              <span>EXPLORE OPEN TENDERS</span>
              <ArrowRight size={16} />
            </button>

            <button
              className="btn btn-secondary"
              style={{ padding: '0.85rem 1.75rem', fontSize: '0.95rem' }}
              onClick={() => onNavigateTab('bidder')}
            >
              <Key size={16} style={{ color: 'var(--accent-shu)' }} />
              <span>ENTER BIDDER HAVEN</span>
            </button>
          </div>
        </div>

        {/* Protocol Metric Strip */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '1.5rem',
            marginTop: '3.5rem',
            paddingTop: '2rem',
            borderTop: '1px solid var(--border-subtle)',
          }}
        >
          <div>
            <div className="eyebrow">WITNESS ISOLATION</div>
            <div className="font-mincho" style={{ fontSize: '1.6rem', fontWeight: 700, marginTop: '0.35rem' }}>
              100% Client-Side
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
              Secret keys and blinding salts never touch network sockets.
            </p>
          </div>

          <div>
            <div className="eyebrow">LEAKAGE SURFACE</div>
            <div className="font-mincho" style={{ fontSize: '1.6rem', fontWeight: 700, marginTop: '0.35rem', color: 'var(--accent-matsuba)' }}>
              0 Bytes Disclosed
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
              Zero-knowledge proof evaluates reserve criteria without revealing values.
            </p>
          </div>

          <div>
            <div className="eyebrow">VERIFIER RUNTIME</div>
            <div className="font-mincho" style={{ fontSize: '1.6rem', fontWeight: 700, marginTop: '0.35rem' }}>
              Compact 0.31.1
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
              Deterministic Snark proving key compiled and verified on Midnight Preprod.
            </p>
          </div>

          <div>
            <div className="eyebrow">BIDDER SOVEREIGNTY</div>
            <div className="font-mincho" style={{ fontSize: '1.6rem', fontWeight: 700, marginTop: '0.35rem', color: 'var(--accent-shu)' }}>
              Anti-Front-Running
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
              Procurement desk cannot peek, tip competitors, or squeeze margin.
            </p>
          </div>
        </div>
      </section>

      {/* The Bidder's Dilemma (The Editorial Essay & Comparison) */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        <div style={{ maxWidth: '820px' }}>
          <span className="eyebrow">THE BIDDER&apos;S DILEMMA &bull; ESSAY</span>
          <h2 className="font-mincho" style={{ fontSize: '2.2rem', fontWeight: 700, margin: '0.5rem 0 1rem' }}>
            Why Traditional Tenders Compromise the Vendor
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.8 }}>
            In traditional procurement, submitting an unencrypted or operator-managed bid requires vendors
            to surrender commercial leverage before contracts are awarded. Bidders routinely suffer from three
            systemic vulnerabilities:
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
          <div className="card" style={{ padding: '2rem', borderLeft: '3px solid var(--accent-danger)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.75rem' }}>
              <AlertTriangle size={18} style={{ color: 'var(--accent-danger)' }} />
              <h3 className="font-mincho" style={{ fontSize: '1.2rem', fontWeight: 700 }}>
                1. Insider Front-Running
              </h3>
            </div>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
              When tenders are visible to procurement administrators, dishonest operators can leak quotes
              to favored suppliers, allowing competitors to underbid by negligible fractions right before deadlines.
            </p>
          </div>

          <div className="card" style={{ padding: '2rem', borderLeft: '3px solid var(--accent-yamabuki)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.75rem' }}>
              <EyeOff size={18} style={{ color: 'var(--accent-yamabuki)' }} />
              <h3 className="font-mincho" style={{ fontSize: '1.2rem', fontWeight: 700 }}>
                2. Margin Espionage
              </h3>
            </div>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
              Even if a vendor wins, the buyer now knows the supplier&apos;s exact cost structure and lowest
              acceptable margin, weakening vendor bargaining power across all subsequent enterprise renewals.
            </p>
          </div>

          <div className="card" style={{ padding: '2rem', borderLeft: '3px solid var(--accent-matsuba)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.75rem' }}>
              <Shield size={18} style={{ color: 'var(--accent-matsuba)' }} />
              <h3 className="font-mincho" style={{ fontSize: '1.2rem', fontWeight: 700 }}>
                3. The AegisBid Resolution
              </h3>
            </div>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
              AegisBid replaces trusted operators with Midnight zero-knowledge circuits. You commit to your bid
              cryptographically, prove you satisfy reserve thresholds, and never reveal the valuation until settlement.
            </p>
          </div>
        </div>
      </section>

      {/* The Three Pillars of Cryptographic Sealing */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
        <div>
          <span className="eyebrow">CORE ARCHITECTURE &bull; 03 PILLARS</span>
          <h2 className="font-mincho" style={{ fontSize: '2.2rem', fontWeight: 700, margin: '0.5rem 0' }}>
            The Three Pillars of Sovereign Bidding
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', maxWidth: '780px' }}>
            A disciplined separation of concerns: private witness computation takes place exclusively in local
            browser memory, while the public ledger records unforgeable zero-knowledge state anchors.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
          {/* Pillar 01 */}
          <div className="card card-bracketed" style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <span className="kanji-step">壱</span>
              <span className="badge badge-mint">LOCAL ENCLAVE</span>
            </div>
            <h3 className="font-mincho" style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '0.5rem' }}>
              Private Valuation Enclave
            </h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
              The bidder enters their target price and generates 256 bits of cryptographic entropy (salt).
              Calculations are performed in memory; the secret valuation never leaves the vendor&apos;s physical machine.
            </p>
          </div>

          {/* Pillar 02 */}
          <div className="card card-bracketed" style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <span className="kanji-step">弐</span>
              <span className="badge badge-shu">PEDERSEN & POSEIDON</span>
            </div>
            <h3 className="font-mincho" style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '0.5rem' }}>
              Dual Cryptographic Anchors
            </h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
              The commitment hides the price behind computationally binding hash commitments. Meanwhile, a Poseidon
              nullifier binds the bidder&apos;s private key to the auction ID, preventing replay attacks without deanonymization.
            </p>
          </div>

          {/* Pillar 03 */}
          <div className="card card-bracketed" style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <span className="kanji-step">参</span>
              <span className="badge badge-cobalt">COMPACT ZK PROOF</span>
            </div>
            <h3 className="font-mincho" style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '0.5rem' }}>
              Zero-Knowledge Verification
            </h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
              Midnight Compact 0.31.1 compiles the constraint <code className="mono">bidAmount &gt;= reservePrice</code>.
              The network verifies compliance with mathematical certainty before writing the commitment to the public state map.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Active Tenders Preview */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '3rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <span className="eyebrow">REGISTRY SPOTLIGHT</span>
            <h2 className="font-mincho" style={{ fontSize: '2rem', fontWeight: 700 }}>
              Confidential Sealed-Bid Registry
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginTop: '0.25rem' }}>
              Select a tender to initiate the client-side Three-Stage Sealing Ceremony.
            </p>
          </div>

          <button className="btn btn-secondary btn-sm" onClick={() => onNavigateTab('auctions')}>
            <span>VIEW ALL TENDERS</span>
            <ArrowRight size={14} />
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.5rem' }}>
          {activeAuctions.map((auction, idx) => (
            <div key={auction.id} className="card card-bracketed" style={{ padding: '1.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                <span className="hanko-seal hanko-seal-sm">LOT 0{idx + 1} / {idx === 0 ? '壱' : '弐'}</span>
                <span className="badge badge-mint">ACCEPTING BIDS</span>
              </div>

              <h3 className="font-mincho" style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                {auction.title}
              </h3>

              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1.25rem' }}>
                {auction.description}
              </p>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-core)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', marginBottom: '1.25rem' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Minimum Reserve:</span>
                <strong className="mono" style={{ fontSize: '1rem', color: 'var(--text-primary)' }}>
                  {auction.reservePrice.toLocaleString()} {auction.currency}
                </strong>
              </div>

              <button
                className="btn btn-primary"
                style={{ width: '100%', padding: '0.75rem' }}
                onClick={() => onSelectBid(auction)}
              >
                <Shield size={14} />
                <span>SEAL BID CONFIDENTIALLY</span>
                <ArrowUpRight size={14} />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Editorial Colophon / Bidder Guarantee Manifesto */}
      <section
        style={{
          background: 'linear-gradient(135deg, rgba(214, 63, 40, 0.06) 0%, rgba(16, 20, 28, 0.95) 100%)',
          border: '1px solid rgba(214, 63, 40, 0.25)',
          borderRadius: 'var(--radius-md)',
          padding: '2.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.25rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span className="hanko-seal">誓約</span>
          <span className="eyebrow" style={{ color: 'var(--accent-shu)' }}>THE AEGISBID MANIFESTO &bull; DIGNITY IN PROCUREMENT</span>
        </div>

        <blockquote className="font-mincho" style={{ fontSize: '1.25rem', lineHeight: 1.7, color: 'var(--text-primary)', fontStyle: 'normal' }}>
          &ldquo;Trade secrets are the lifeblood of technological enterprise. When vendors are forced to bargain
          without secrecy, innovation suffers. Zero-knowledge cryptography is not merely a tool for privacy;
          it is an instrument of commercial dignity.&rdquo;
        </blockquote>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '1.25rem' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            AegisBid v1.0 &bull; Powered by Midnight Network &amp; Google Gemini Proof Planner
          </span>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button className="btn btn-secondary btn-sm" onClick={() => onNavigateTab('privacy')}>
              <span>VIEW PRIVACY MATRIX</span>
            </button>
            <button className="btn btn-primary btn-sm" onClick={() => onNavigateTab('bidder')}>
              <span>OPEN BIDDER STUDIO</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
