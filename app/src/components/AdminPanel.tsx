import { ShieldCheck, Users, WalletCards } from 'lucide-react';
import type { RegisteredUser, TransactionAudit } from '../domain/types';

interface Props {
  users: RegisteredUser[];
  audits: TransactionAudit[];
}

function shortAddress(address: string) {
  if (!address) return 'Demo wallet';
  return address.length > 20 ? `${address.slice(0, 10)}...${address.slice(-8)}` : address;
}

export function AdminPanel({ users, audits }: Props) {
  return (
    <section className="admin-panel" aria-label="Admin panel">
      <header className="admin-panel__hero"><div><span className="eyebrow">Local operations register</span><h2>Workspace administration</h2><p>Review named wallet sessions separately from public lifecycle activity. This demo never receives private invoice fields.</p></div><ShieldCheck size={28} /></header>
      <div className="admin-stats"><div><Users size={16} /><strong>{users.length}</strong><span>registered users</span></div><div><WalletCards size={16} /><strong>{users.filter((user) => !user.demo).length}</strong><span>connected wallets</span></div><div><ShieldCheck size={16} /><strong>{audits.length}</strong><span>public actions</span></div></div>
      <section className="admin-table-section"><header><div><h3>User register</h3><p>Names and wallet identifiers captured after explicit connection consent.</p></div><span className="eyebrow">{users.length} users</span></header><div className="admin-table-wrap"><table><thead><tr><th>Name</th><th>Wallet</th><th>Address</th><th>Role</th><th>Connected</th></tr></thead><tbody>{users.map((user) => <tr key={user.id}><td><strong>{user.displayName}</strong><small>{user.demo ? 'Demo session' : 'Injected wallet'}</small></td><td>{user.walletName}</td><td><code>{shortAddress(user.walletAddress)}</code></td><td>{user.role}</td><td>{user.connectedAt}</td></tr>)}</tbody></table>{users.length === 0 && <p className="admin-empty">No named wallet sessions yet. Connect a wallet from the landing page or workspace.</p>}</div></section>
      <section className="admin-table-section"><header><div><h3>Transaction activity</h3><p>Public lifecycle events are kept separate from the user register.</p></div><span className="eyebrow">{audits.length} actions</span></header><div className="admin-table-wrap"><table><thead><tr><th>User</th><th>Action</th><th>Invoice alias</th><th>Wallet address</th><th>Time</th></tr></thead><tbody>{audits.map((audit) => <tr key={audit.id}><td>{audit.userName}</td><td><span className="admin-action"><i />{audit.action}</span></td><td>{audit.invoiceAlias}</td><td><code>{shortAddress(audit.walletAddress)}</code></td><td>{audit.timestamp}</td></tr>)}</tbody></table>{audits.length === 0 && <p className="admin-empty">No transaction activity has been recorded in this browser session.</p>}</div></section>
    </section>
  );
}
