import React from 'react';
import { Shield, Radio, Wallet, LogOut, Sparkles, Terminal } from 'lucide-react';
import { MidnightNetwork, WalletState } from '../domain/types';

interface HeaderProps {
  wallet: WalletState;
  activeTab: 'auctions' | 'privacy' | 'assistant' | 'metrics';
  onSelectTab: (tab: 'auctions' | 'privacy' | 'assistant' | 'metrics') => void;
  onOpenWalletModal: () => void;
  onDisconnectWallet: () => void;
  onNetworkChange: (network: MidnightNetwork) => void;
}

export const Header: React.FC<HeaderProps> = ({
  wallet,
  activeTab,
  onSelectTab,
  onOpenWalletModal,
  onDisconnectWallet,
  onNetworkChange,
}) => {
  return (
    <header className="header-bar">
      <div className="brand-section">
        <div className="brand-logo">
          <Shield size={22} className="text-accent-cobalt" />
          <span>AEGISBID</span>
        </div>
        <span className="brand-tag">ZK-SEALED BID PROTOCOL</span>
        <span className="badge badge-mint">
          <Radio size={12} className="animate-pulse" />
          {wallet.network.toUpperCase()}
        </span>
      </div>

      <nav className="tabs-container" style={{ margin: 0, border: 'none' }}>
        <button
          className={`tab-btn ${activeTab === 'auctions' ? 'active' : ''}`}
          onClick={() => onSelectTab('auctions')}
        >
          <Terminal size={14} />
          AUCTIONS
        </button>
        <button
          className={`tab-btn ${activeTab === 'privacy' ? 'active' : ''}`}
          onClick={() => onSelectTab('privacy')}
        >
          <Shield size={14} />
          PRIVACY MATRIX
        </button>
        <button
          className={`tab-btn ${activeTab === 'assistant' ? 'active' : ''}`}
          onClick={() => onSelectTab('assistant')}
        >
          <Sparkles size={14} />
          GEMINI ARCHITECT
        </button>
        <button
          className={`tab-btn ${activeTab === 'metrics' ? 'active' : ''}`}
          onClick={() => onSelectTab('metrics')}
        >
          METRICS
        </button>
      </nav>

      <div className="nav-controls">
        <select
          className="form-select"
          style={{ padding: '0.35rem 0.6rem', fontSize: '0.75rem', fontFamily: 'var(--font-mono)' }}
          value={wallet.network}
          onChange={(e) => onNetworkChange(e.target.value as MidnightNetwork)}
        >
          <option value="preprod">Midnight Preprod</option>
          <option value="preview">Midnight Preview</option>
        </select>

        {wallet.connected ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span className={`badge ${wallet.isDemo ? 'badge-amber' : 'badge-cobalt'}`}>
              <Wallet size={12} />
              {wallet.is1AM ? '1AM' : wallet.isDemo ? 'DEMO' : 'CONNECTED'}
            </span>
            <span className="mono" style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
              {wallet.unshieldedAddress.slice(0, 10)}...{wallet.unshieldedAddress.slice(-6)}
            </span>
            <button
              className="btn btn-secondary btn-sm"
              onClick={onDisconnectWallet}
              title="Disconnect wallet session"
            >
              <LogOut size={13} />
            </button>
          </div>
        ) : (
          <button className="btn btn-primary btn-sm" onClick={onOpenWalletModal}>
            <Wallet size={14} />
            CONNECT WALLET
          </button>
        )}
      </div>
    </header>
  );
};
