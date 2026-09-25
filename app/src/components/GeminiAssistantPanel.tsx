import React, { useState } from 'react';
import { Sparkles, Shield, Send, CheckCircle, HelpCircle } from 'lucide-react';
import { GeminiPlan } from '../domain/types';
import { requestAssistantPlan } from '../lib/api/backendClient';

export const GeminiAssistantPanel: React.FC = () => {
  const [prompt, setPrompt] = useState(
    'Procurement of 500 radiation-hardened satellite communication transceivers. Minimum vendor reserve is 120,000 tDUST.'
  );
  const [category, setCategory] = useState('procurement');
  const [reserve, setReserve] = useState(120000);
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState<GeminiPlan | null>(null);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    setLoading(true);
    const result = await requestAssistantPlan(prompt, category, reserve);
    setPlan(result);
    setLoading(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
          <span className="eyebrow">AI PROOF PLANNER</span>
          <span className="badge badge-cobalt">STRICT PRIVACY BOUNDARY ENFORCED</span>
        </div>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Gemini Procurement Architect</h1>
        <p style={{ color: 'var(--text-secondary)', maxWidth: '800px', fontSize: '0.95rem' }}>
          Convert natural language procurement specifications into formal Compact zero-knowledge proof plans.
          <strong> Privacy Guarantee:</strong> Gemini runs strictly on sanitized public requirements.
          Private keys, seed phrases, exact bidder valuations, and salts are never submitted to the AI model.
        </p>
      </div>

      <form className="card" onSubmit={handleGenerate}>
        <div className="form-group">
          <label className="form-label">Public RFP / Auction Description (Zero confidential data)</label>
          <textarea
            className="form-textarea"
            rows={3}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe public tender or liquidation requirements..."
            required
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="form-group">
            <label className="form-label">Category</label>
            <select
              className="form-select"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="procurement">Government / Enterprise Procurement</option>
              <option value="liquidation">Confidential Asset Liquidation</option>
              <option value="otc-block">OTC Block Trade Auction</option>
              <option value="spectrum-license">Frequency / Spectrum License</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Minimum Reserve Threshold (tDUST)</label>
            <input
              type="number"
              className="form-input"
              value={reserve}
              onChange={(e) => setReserve(Number(e.target.value))}
              min={1000}
            />
          </div>
        </div>

        <button type="submit" className="btn btn-primary" disabled={loading} style={{ alignSelf: 'flex-start' }}>
          <Sparkles size={16} />
          {loading ? 'GENERATING PROOF PLAN...' : 'GENERATE ZK PROOF PLAN'}
        </button>
      </form>

      {plan && (
        <div className="card" style={{ borderLeft: '4px solid var(--accent-cobalt)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="eyebrow">STRUCTURED PROOF PLAN</span>
            {plan.fallbackUsed && (
              <span className="badge badge-amber">DETERMINISTIC FALLBACK ENGINE</span>
            )}
          </div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>{plan.recommendedTitle}</h2>

          <div style={{ background: 'var(--bg-elevated)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
            <span className="eyebrow">PROTOCOL EXECUTION SUMMARY</span>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-primary)', marginTop: '0.35rem' }}>
              {plan.proofPlanSummary}
            </p>
          </div>

          <div>
            <span className="eyebrow">DISCLOSURE SCOPE ANALYSIS</span>
            <table className="privacy-table">
              <thead>
                <tr>
                  <th>Parameter</th>
                  <th>Visibility</th>
                  <th>Storage</th>
                  <th>Justification</th>
                </tr>
              </thead>
              <tbody>
                {plan.privacyAnalysis.map((item, idx) => (
                  <tr key={idx}>
                    <td className="mono">{item.field_name}</td>
                    <td>
                      <span className={`badge ${item.visibility === 'PRIVATE' ? 'badge-amber' : 'badge-mint'}`}>
                        {item.visibility}
                      </span>
                    </td>
                    <td style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{item.storage_location}</td>
                    <td style={{ fontSize: '0.8rem' }}>{item.zk_justification}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.75rem' }}>
            <strong>Compliance Note:</strong> {plan.complianceNotes}
          </div>
        </div>
      )}
    </div>
  );
};
