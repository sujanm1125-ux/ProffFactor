import React, { useState, useEffect } from 'react';
import { Shield, EyeOff, Lock, CheckCircle, RefreshCw, Key, Database } from 'lucide-react';
import {
  LocalBidderSecret,
  loadStoredIdentities,
  rotateIdentity,
  getOrCreateDefaultIdentity,
} from '../domain/privateState';

export const PrivacyBoundaryView: React.FC = () => {
  const [currentIdentity, setCurrentIdentity] = useState<LocalBidderSecret | null>(null);
  const [identities, setIdentities] = useState<LocalBidderSecret[]>([]);

  useEffect(() => {
    getOrCreateDefaultIdentity().then((ident) => {
      setCurrentIdentity(ident);
      setIdentities(loadStoredIdentities());
    });
  }, []);

  const handleRotate = async () => {
    const rotated = await rotateIdentity();
    setCurrentIdentity(rotated);
    setIdentities(loadStoredIdentities());
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Intro */}
      <div>
        <span className="eyebrow">ZERO-KNOWLEDGE ARCHITECTURE</span>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, margin: '0.25rem 0 0.5rem' }}>
          Cryptographic Privacy Boundary
        </h1>
        <p style={{ color: 'var(--text-secondary)', maxWidth: '800px', fontSize: '0.95rem' }}>
          Conventional smart contracts publish bid amounts and bidder addresses, exposing trade secrets and enabling front-running.
          AegisBid utilizes Midnight’s <strong>Compact smart contract</strong> to evaluate bid eligibility inside zero-knowledge SNARK proofs.
          Confidential valuations never touch the public network.
        </p>
      </div>

      {/* Observation Table */}
      <div className="card">
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Shield size={18} className="text-accent-cobalt" />
          Observer Disclosure Matrix
        </h3>
        <table className="privacy-table">
          <thead>
            <tr>
              <th>Entity / Attribute</th>
              <th>Network Visibility</th>
              <th>Storage Location</th>
              <th>Guaranteed Protection</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Exact Bid Valuation</strong></td>
              <td><span className="badge badge-amber"><EyeOff size={12} /> CONFIDENTIAL</span></td>
              <td>Local Client Memory Only</td>
              <td>Evaluated in ZK; never published during bidding phase.</td>
            </tr>
            <tr>
              <td><strong>Bidder Secret Key</strong></td>
              <td><span className="badge badge-amber"><Lock size={12} /> PRIVATE WITNESS</span></td>
              <td>Browser IndexedDB / Session</td>
              <td>Generates pseudonymous commitments; never leaves device.</td>
            </tr>
            <tr>
              <td><strong>Salt Entropy (32-bytes)</strong></td>
              <td><span className="badge badge-amber"><Lock size={12} /> PRIVATE WITNESS</span></td>
              <td>Local Client Memory</td>
              <td>Blinds the commitment against dictionary attacks.</td>
            </tr>
            <tr>
              <td><strong>Bid Commitment Hash</strong></td>
              <td><span className="badge badge-mint"><CheckCircle size={12} /> PUBLIC LEDGER</span></td>
              <td>Midnight State Map</td>
              <td>Unforgeable cryptographic anchor verifying compliance.</td>
            </tr>
            <tr>
              <td><strong>Bid Nullifier</strong></td>
              <td><span className="badge badge-mint"><CheckCircle size={12} /> PUBLIC LEDGER</span></td>
              <td>Midnight State Set</td>
              <td>Prevents multiple bids per secret identity without revealing identity.</td>
            </tr>
            <tr>
              <td><strong>Reserve Compliance</strong></td>
              <td><span className="badge badge-mint"><CheckCircle size={12} /> PROVEN IN CIRCUIT</span></td>
              <td>ZK SNARK Verification</td>
              <td>Mathematical proof that bid &gt;= reserve threshold.</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Local Private State Manager */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Key size={18} className="text-accent-cobalt" />
              Local Private State (Isolated on this Device)
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Ephemeral secret identities used to generate unshielded nullifiers and sealed commitments.
            </p>
          </div>
          <button className="btn btn-secondary btn-sm" onClick={handleRotate}>
            <RefreshCw size={13} />
            ROTATE IDENTITY SECRET
          </button>
        </div>

        {currentIdentity && (
          <div style={{ background: 'var(--bg-elevated)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div>
              <span className="eyebrow">ACTIVE EPHEMERAL SECRET (NEVER TRANSMITTED)</span>
              <div className="mono" style={{ fontSize: '0.8rem', color: 'var(--accent-amber)', wordBreak: 'break-all' }}>
                {currentIdentity.secretHex}
              </div>
            </div>
            <div>
              <span className="eyebrow">DERIVED PUBLIC IDENTITY (SHIELDED DOMAIN)</span>
              <div className="mono" style={{ fontSize: '0.8rem', color: 'var(--accent-mint)', wordBreak: 'break-all' }}>
                {currentIdentity.derivedIdentityHex}
              </div>
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Total identities stored in local browser vault: {identities.length}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
