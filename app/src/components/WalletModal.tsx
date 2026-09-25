import React, { useEffect, useState } from 'react';
import { X, Wallet, ShieldCheck, Zap, AlertTriangle, ArrowRight } from 'lucide-react';
import {
  discoverMidnightWallets,
  InjectedMidnightWallet,
  connectInjectedWallet,
  createDemoWalletSession,
} from '../lib/midnight/walletConnector';
import { MidnightNetwork, WalletState } from '../domain/types';

interface WalletModalProps {
  network: MidnightNetwork;
  onClose: () => void;
  onConnected: (state: WalletState) => void;
}

export const WalletModal: React.FC<WalletModalProps> = ({
  network,
  onClose,
  onConnected,
}) => {
  const [wallets, setWallets] = useState<InjectedMidnightWallet[]>([]);
  const [connectingId, setConnectingId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    const list = discoverMidnightWallets();
    setWallets(list);
  }, []);

  const handleConnectInjected = async (wallet: InjectedMidnightWallet) => {
    setConnectingId(wallet.id);
    setErrorMsg(null);
    const result = await connectInjectedWallet(wallet, network);
    setConnectingId(null);
    if (result.connected) {
      onConnected(result);
      onClose();
    } else {
      setErrorMsg(result.error || 'Connection failed');
    }
  };

  const handleConnectDemo = () => {
    const demo = createDemoWalletSession(network);
    onConnected(demo);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Connect Midnight Wallet</h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Targeting <strong className="mono">{network.toUpperCase()}</strong> network
            </p>
          </div>
          <button className="btn btn-secondary btn-sm" onClick={onClose}>
            <X size={16} />
          </button>
        </div>

        {errorMsg && (
          <div style={{ padding: '0.75rem', background: 'rgba(255, 71, 87, 0.1)', border: '1px solid var(--accent-danger)', borderRadius: 'var(--radius-md)', marginBottom: '1rem', color: 'var(--accent-danger)', fontSize: '0.85rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <AlertTriangle size={16} />
            {errorMsg}
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
          {wallets.length === 0 ? (
            <div style={{ padding: '1rem', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', textAlign: 'center' }}>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                No injected Midnight wallets detected in <code className="mono">window.midnight</code>.
              </p>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Please install the 1AM or Midnight Lace extension, or launch the interactive sandbox below.
              </p>
            </div>
          ) : (
            wallets.map((w) => (
              <button
                key={w.id}
                className="btn btn-secondary"
                style={{ justifyContent: 'space-between', padding: '0.85rem 1rem', borderColor: w.is1AM ? 'var(--accent-cobalt)' : undefined }}
                onClick={() => handleConnectInjected(w)}
                disabled={connectingId !== null}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <ShieldCheck size={18} className={w.is1AM ? 'text-accent-cobalt' : ''} />
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{w.name}</div>
                    <div className="mono" style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                      API v{w.apiVersion} {w.is1AM && '• Preferred Provider'}
                    </div>
                  </div>
                </div>
                {connectingId === w.id ? (
                  <span className="mono" style={{ fontSize: '0.75rem' }}>CONNECTING...</span>
                ) : (
                  <ArrowRight size={16} />
                )}
              </button>
            ))
          )}
        </div>

        <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <span className="eyebrow">DEVELOPMENT SANDBOX</span>
            <span className="badge badge-amber">LOCAL COMPACT SIMULATOR</span>
          </div>
          <button
            className="btn btn-secondary"
            style={{ width: '100%', justifyContent: 'space-between', padding: '0.85rem 1rem', background: 'rgba(255, 184, 0, 0.05)', borderColor: 'rgba(255, 184, 0, 0.2)' }}
            onClick={handleConnectDemo}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Zap size={18} style={{ color: 'var(--accent-amber)' }} />
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>Launch Demo Simulation Wallet</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                  Evaluates full ZK circuit constraints in-browser without extensions
                </div>
              </div>
            </div>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};
