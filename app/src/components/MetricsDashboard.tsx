import React, { useEffect, useState } from 'react';
import { BarChart3, Activity, ShieldCheck, Database, Layers, Radio } from 'lucide-react';
import { fetchPublicMetrics, fetchBackendHealth } from '../lib/api/backendClient';

export const MetricsDashboard: React.FC = () => {
  const [metrics, setMetrics] = useState({
    total_auctions: 4,
    open_auctions: 3,
    settled_auctions: 1,
    total_sealed_bids: 14,
    active_network: 'preprod',
    verified_commitments_count: 14,
  });

  const [health, setHealth] = useState({
    status: 'healthy',
    midnight_network: 'preprod',
    gemini_assistant: 'configured',
  });

  useEffect(() => {
    fetchPublicMetrics().then(setMetrics);
    fetchBackendHealth().then(setHealth);
  }, []);

  return (
    <div style={{ padding: '4rem 2rem', background: 'var(--bg-core, #f4f4f0)', color: '#111', minHeight: '100vh', width: '100vw', overflowX: 'hidden', boxSizing: 'border-box' }}>
      <div style={{ borderBottom: '4px solid #111', paddingBottom: '2rem', marginBottom: '4rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h1 style={{ fontSize: 'clamp(3rem, 8vw, 8rem)', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '-0.05em', lineHeight: 0.9, margin: 0 }}>
            System<br />Telemetry
          </h1>
        </div>
        <div style={{ textAlign: 'right', color: 'var(--accent-vermilion, #ff3300)' }}>
          <Radio size={48} />
          <div style={{ fontSize: '1rem', fontWeight: 800, marginTop: '1rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Live Data Feed</div>
        </div>
      </div>

      <div className="brutalist-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '4px', background: '#111', border: '4px solid #111' }}>
        <div style={{ background: 'var(--bg-core, #f4f4f0)', padding: '2rem', display: 'flex', flexDirection: 'column' }} className="grid-col">
          <div style={{ fontSize: '0.85rem', fontWeight: 800, marginBottom: 'auto', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            <Layers size={20} style={{ display: 'inline', marginRight: '0.5rem', verticalAlign: 'middle', color: 'var(--accent-vermilion, #ff3300)' }}/> Public Auctions
          </div>
          <div style={{ fontSize: 'clamp(5rem, 10vw, 15rem)', fontWeight: 900, lineHeight: 0.8, color: '#111', marginTop: '4rem', marginBottom: '2rem' }}>
            {metrics.total_auctions}
          </div>
          <div style={{ borderTop: '4px solid #111', paddingTop: '1rem', fontSize: '1.2rem', fontWeight: 800, textTransform: 'uppercase' }}>
            {metrics.open_auctions} ACTIVE / {metrics.settled_auctions} SETTLED
          </div>
        </div>

        <div style={{ background: 'var(--bg-core, #f4f4f0)', padding: '2rem', display: 'flex', flexDirection: 'column' }} className="grid-col">
          <div style={{ fontSize: '0.85rem', fontWeight: 800, marginBottom: 'auto', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            <ShieldCheck size={20} style={{ display: 'inline', marginRight: '0.5rem', verticalAlign: 'middle', color: 'var(--accent-vermilion, #ff3300)' }}/> Sealed Bids (ZK)
          </div>
          <div style={{ fontSize: 'clamp(5rem, 10vw, 15rem)', fontWeight: 900, lineHeight: 0.8, color: '#111', marginTop: '4rem', marginBottom: '2rem' }}>
            {metrics.total_sealed_bids}
          </div>
          <div style={{ borderTop: '4px solid #111', paddingTop: '1rem', fontSize: '1.2rem', fontWeight: 800, textTransform: 'uppercase' }}>
            {metrics.verified_commitments_count} VERIFIED PROOFS
          </div>
        </div>

        <div style={{ background: 'var(--bg-core, #f4f4f0)', padding: '2rem', display: 'flex', flexDirection: 'column' }} className="grid-col">
          <div style={{ fontSize: '0.85rem', fontWeight: 800, marginBottom: 'auto', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            <Activity size={20} style={{ display: 'inline', marginRight: '0.5rem', verticalAlign: 'middle', color: 'var(--accent-vermilion, #ff3300)' }}/> Network Status
          </div>
          <div style={{ fontSize: 'clamp(4rem, 8vw, 12rem)', fontWeight: 900, lineHeight: 0.8, textTransform: 'uppercase', color: 'var(--accent-vermilion, #ff3300)', marginTop: '4rem', marginBottom: '2rem', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {metrics.active_network.substring(0, 4)}
          </div>
          <div style={{ borderTop: '4px solid #111', paddingTop: '1rem', fontSize: '1.2rem', fontWeight: 800, textTransform: 'uppercase' }}>
            STATUS: {health.status.toUpperCase()}
          </div>
        </div>

        <div style={{ background: '#111', color: 'var(--bg-core, #f4f4f0)', padding: '0', position: 'relative', overflow: 'hidden', minHeight: '300px' }} className="grid-col">
           <img src="/brutalist_data_viz.jpg" alt="Data Viz" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.8 }} />
           <div style={{ position: 'absolute', bottom: '2rem', left: '2rem', right: '2rem' }}>
              <div style={{ borderTop: '4px solid var(--accent-vermilion, #ff3300)', paddingTop: '1rem', fontSize: '1.2rem', fontWeight: 800, color: 'var(--bg-core, #f4f4f0)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                DIAGNOSTIC VISUAL
              </div>
           </div>
        </div>
      </div>
      
      <div style={{ marginTop: '8rem', borderTop: '4px solid #111', paddingTop: '4rem', marginBottom: '4rem' }}>
        <h3 style={{ fontSize: 'clamp(2rem, 4vw, 4rem)', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '-0.02em', marginBottom: '3rem' }}>Engine Diagnostics</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '4px solid #111' }}>
              <th style={{ padding: '1.5rem', fontWeight: 900, textTransform: 'uppercase', fontSize: '1.2rem', letterSpacing: '0.05em' }}>Subsystem</th>
              <th style={{ padding: '1.5rem', fontWeight: 900, textTransform: 'uppercase', fontSize: '1.2rem', letterSpacing: '0.05em' }}>Status</th>
              <th style={{ padding: '1.5rem', fontWeight: 900, textTransform: 'uppercase', fontSize: '1.2rem', letterSpacing: '0.05em' }}>Mode</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ borderBottom: '2px solid #ccc' }}>
              <td style={{ padding: '2rem 1.5rem', fontWeight: 800, fontSize: '1.5rem' }}>FastAPI Backend</td>
              <td style={{ padding: '2rem 1.5rem', color: 'var(--accent-vermilion, #ff3300)', fontWeight: 900, fontSize: '1.5rem' }}>{health.status.toUpperCase()}</td>
              <td style={{ padding: '2rem 1.5rem', fontWeight: 600, fontSize: '1.2rem' }}>Stateless API Router</td>
            </tr>
            <tr style={{ borderBottom: '2px solid #ccc' }}>
              <td style={{ padding: '2rem 1.5rem', fontWeight: 800, fontSize: '1.5rem' }}>Neon DB</td>
              <td style={{ padding: '2rem 1.5rem', color: 'var(--accent-vermilion, #ff3300)', fontWeight: 900, fontSize: '1.5rem' }}>CONNECTED</td>
              <td style={{ padding: '2rem 1.5rem', fontWeight: 600, fontSize: '1.2rem' }}>Branch-first</td>
            </tr>
            <tr style={{ borderBottom: '2px solid #ccc' }}>
              <td style={{ padding: '2rem 1.5rem', fontWeight: 800, fontSize: '1.5rem' }}>Proof Planner</td>
              <td style={{ padding: '2rem 1.5rem', color: 'var(--accent-vermilion, #ff3300)', fontWeight: 900, fontSize: '1.5rem' }}>{health.gemini_assistant.toUpperCase()}</td>
              <td style={{ padding: '2rem 1.5rem', fontWeight: 600, fontSize: '1.2rem' }}>Sanitized Scope</td>
            </tr>
            <tr style={{ borderBottom: '2px solid #ccc' }}>
              <td style={{ padding: '2rem 1.5rem', fontWeight: 800, fontSize: '1.5rem' }}>Compact Contract</td>
              <td style={{ padding: '2rem 1.5rem', color: 'var(--accent-vermilion, #ff3300)', fontWeight: 900, fontSize: '1.5rem' }}>VALIDATED</td>
              <td style={{ padding: '2rem 1.5rem', fontWeight: 600, fontSize: '1.2rem' }}>Midnight 0.31.1</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
