import { useMemo, useRef, useState } from 'react';
import {
  BadgeCheck,
  Building2,
  Check,
  ChevronDown,
  CircleDollarSign,
  Clock3,
  Copy,
  EyeOff,
  Files,
  FlaskConical,
  LayoutDashboard,
  ListChecks,
  Map,
  Menu,
  Plus,
  Radio,
  ScanSearch,
  Send,
  WalletCards,
} from 'lucide-react';
import { BrandMark } from './components/BrandMark';
import { PrivacyTag } from './components/PrivacyTag';
import { RegisterInvoiceDialog } from './components/RegisterInvoiceDialog';
import { StatusBadge } from './components/StatusBadge';
import { TransactionDrawer } from './components/TransactionDrawer';
import { WalletDialog } from './components/WalletDialog';
import { demoInvoices, demoPolicies, initialActivity, roleLabels, transactionStages } from './domain/demo-data';
import { createDemoInvoice, isPolicyEligible, transitionInvoice } from './domain/demo-machine';
import type { ActivityItem, Invoice, NewInvoiceInput, RegisteredUser, Role, Section, TransactionAudit, TransactionStage } from './domain/types';
import { discoverInjectedWallets, saveRegisteredUser, saveTransactionAudit, type DiscoveredWallet, safeWalletLabel } from './lib/midnight/wallets';

const navItems: Array<{ id: Section; label: string; icon: typeof LayoutDashboard }> = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'invoices', label: 'Invoices', icon: Files },
  { id: 'policies', label: 'Policies', icon: ListChecks },
  { id: 'requests', label: 'Requests', icon: Send },
  { id: 'explorer', label: 'Explorer', icon: ScanSearch },
  { id: 'demo', label: 'Demo guide', icon: Map },
];

const roleCopy: Record<Role, { eyebrow: string; heading: string; body: string }> = {
  supplier: { eyebrow: 'Supplier operations', heading: 'Good morning, Northstar.', body: 'Register private commitments and request financing without disclosing commercial details.' },
  buyer: { eyebrow: 'Buyer review queue', heading: 'Review acknowledged invoices.', body: 'Match off-chain invoice data to its commitment before accepting or rejecting the public lifecycle.' },
  lender: { eyebrow: 'Lender decision queue', heading: 'Confirm proof-qualified requests.', body: 'Review policy evidence and pending locks without collecting the supplier’s private invoice.' },
  viewer: { eyebrow: 'Public explorer', heading: 'Inspect lifecycle integrity.', body: 'View public commitments and state transitions without gaining access to commercial invoice data.' },
};

function shortHash(value: string | null) {
  if (!value) return 'Not issued';
  return value.length <= 14 ? value : `${value.slice(0, 8)}…${value.slice(-4)}`;
}

function wait(milliseconds: number) {
  return new Promise((resolve) => window.setTimeout(resolve, milliseconds));
}

export function App({ initialSection = 'overview' }: { initialSection?: Section }) {
  const [role, setRole] = useState<Role>('supplier');
  const [section, setSection] = useState<Section>(initialSection);
  const [invoices, setInvoices] = useState(demoInvoices);
  const [selectedInvoiceId, setSelectedInvoiceId] = useState(demoInvoices[0].id);
  const [activity, setActivity] = useState(initialActivity);
  const [registerOpen, setRegisterOpen] = useState(false);
  const [walletOpen, setWalletOpen] = useState(false);
  const [wallets, setWallets] = useState<DiscoveredWallet[]>([]);
  const [walletLabel, setWalletLabel] = useState('');
  const [walletAddress, setWalletAddress] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [demoWallet, setDemoWallet] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [stages, setStages] = useState<TransactionStage[]>(transactionStages);
  const [toast, setToast] = useState('');
  const [busy, setBusy] = useState(false);
  const toastTimer = useRef<number | null>(null);

  const selectedInvoice = invoices.find((invoice) => invoice.id === selectedInvoiceId) ?? invoices[0] ?? null;
  const acceptedCount = invoices.filter((invoice) => invoice.status === 'ACCEPTED').length;
  const pendingCount = invoices.filter((invoice) => invoice.status === 'PENDING_FINANCING').length;
  const actionableCount = role === 'supplier' ? acceptedCount : role === 'buyer' ? invoices.filter((invoice) => invoice.status === 'PROPOSED').length : role === 'lender' ? pendingCount : 0;

  const visibleInvoices = useMemo(() => {
    if (role === 'buyer') return invoices.filter((invoice) => ['PROPOSED', 'ACCEPTED', 'REJECTED', 'PAID'].includes(invoice.status));
    if (role === 'lender') return invoices.filter((invoice) => ['PENDING_FINANCING', 'FINANCED_CONFIRMED'].includes(invoice.status));
    return invoices;
  }, [invoices, role]);

  function notify(message: string) {
    setToast(message);
    if (toastTimer.current) window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(''), 3600);
  }

  function updateInvoice(id: string, updater: (invoice: Invoice) => Invoice, message: string) {
    setInvoices((current) => current.map((invoice) => invoice.id === id ? updater(invoice) : invoice));
    setActivity((current) => [{ id: crypto.randomUUID(), invoiceAlias: invoices.find((invoice) => invoice.id === id)?.alias ?? 'Invoice', message, timestamp: 'Just now' }, ...current]);
    recordAudit(invoices.find((invoice) => invoice.id === id)?.alias ?? 'Invoice', message);
    notify(message);
  }

  function recordAudit(invoiceAlias: string, action: string) {
    const audit: TransactionAudit = { id: crypto.randomUUID(), userName: displayName || 'Unidentified demo', walletAddress: walletAddress || 'Demo wallet', invoiceAlias, action, timestamp: 'Just now', demo: demoWallet };
    saveTransactionAudit(audit);
  }

  function openWalletChooser() {
    setWallets(discoverInjectedWallets());
    setWalletOpen(true);
  }

  async function chooseWallet(wallet: DiscoveredWallet | null, nextDisplayName: string) {
    setWalletOpen(false);
    if (!wallet) {
      setWalletLabel('Demo wallet');
      setWalletAddress('Demo wallet');
      setDisplayName(nextDisplayName);
      setDemoWallet(true);
      registerUser(nextDisplayName, 'Demo wallet', 'demo-wallet', 'Demo wallet', true);
      notify('Demo wallet connected. Chain submissions remain disabled.');
      return;
    }
    try {
      const connected = await wallet.connect('preprod');
      setWalletLabel(safeWalletLabel(wallet));
      setDisplayName(nextDisplayName);
      const address = connected?.getUnshieldedAddress ? await connected.getUnshieldedAddress() : '';
      setWalletAddress(address);
      registerUser(nextDisplayName, safeWalletLabel(wallet), wallet.id, address, false);
      setDemoWallet(false);
      notify(`${safeWalletLabel(wallet)} connected.`);
    } catch {
      notify('Wallet connection was cancelled or failed.');
    }
  }

  function registerUser(name: string, walletName: string, walletId: string, address: string, demo: boolean) {
    const user: RegisteredUser = { id: `${walletId}:${name.toLowerCase()}`, displayName: name, walletName, walletId, walletAddress: address, role, connectedAt: 'Just now', demo };
    saveRegisteredUser(user);
  }

  function registerInvoice(input: NewInvoiceInput) {
    const invoice = createDemoInvoice(input, invoices.length + 1);
    setInvoices((current) => [invoice, ...current]);
    setSelectedInvoiceId(invoice.id);
    setActivity((current) => [{ id: crypto.randomUUID(), invoiceAlias: invoice.alias, message: 'Demo commitment registered', timestamp: 'Just now' }, ...current]);
    setRegisterOpen(false);
    setSection('invoices');
    notify('Demo commitment created. No private values were published.');
  }

  function buyerDecision(accepted: boolean) {
    if (!selectedInvoice || selectedInvoice.status !== 'PROPOSED') return;
    updateInvoice(selectedInvoice.id, (invoice) => ({
      ...transitionInvoice(invoice, accepted ? 'ACCEPTED' : 'REJECTED'),
      nullifier: accepted ? `0x${invoice.commitment.slice(2, 10)}b7e4d901` : null,
    }), accepted ? 'Buyer acceptance recorded in demo state' : 'Invoice rejected by buyer');
  }

  function lenderDecision(confirmed: boolean) {
    if (!selectedInvoice || selectedInvoice.status !== 'PENDING_FINANCING') return;
    updateInvoice(selectedInvoice.id, (invoice) => transitionInvoice(invoice, confirmed ? 'FINANCED_CONFIRMED' : 'ACCEPTED'), confirmed ? 'Lender confirmation recorded; nullifier consumed' : 'Lender declined; pending lock released');
  }

  async function requestFinancing(invoice: Invoice, policyId = 'greenline-v3') {
    const policy = demoPolicies.find((item) => item.id === policyId);
    if (!policy) return;
    if (!walletLabel) {
      openWalletChooser();
      notify('Connect a compatible wallet or choose demo mode first.');
      return;
    }
    if (!isPolicyEligible(invoice, policy.minMinor, policy.maxMinor, policy.currency)) {
    if (!demoWallet) {
      notify('Wallet connected. Live contract transport is not configured yet; use demo wallet mode to run the local proof walkthrough.');
      return;
    }

      notify('This invoice does not satisfy the selected policy in demo state.');
      return;
    }
    setBusy(true);
    setDrawerOpen(true);
    setStages(transactionStages.map((stage, index) => ({ ...stage, state: index === 0 ? 'active' : 'waiting' })));
    for (let index = 0; index < transactionStages.length; index += 1) {
      await wait(650);
      setStages((current) => current.map((stage, stageIndex) => ({ ...stage, state: stageIndex <= index ? 'complete' : stageIndex === index + 1 ? 'active' : 'waiting' })));
    }
    updateInvoice(invoice.id, (current) => ({ ...transitionInvoice(current, 'PENDING_FINANCING'), policyId }), 'Demo financing request created; no chain transaction submitted');
    setBusy(false);
  }

  function markPaid() {
    if (!selectedInvoice || !['ACCEPTED', 'PENDING_FINANCING', 'FINANCED_CONFIRMED'].includes(selectedInvoice.status)) return;
    updateInvoice(selectedInvoice.id, (invoice) => transitionInvoice(invoice, 'PAID'), 'Buyer marked invoice paid');
  }

  const pageCopy = roleCopy[role];
  const activeLabel = navItems.find((item) => item.id === section)?.label ?? 'Overview';

  return (
    <div className="app-shell">
      <header className="topbar">
        <button className="brand-button" onClick={() => setSection('overview')}><BrandMark /></button>
        <div className="topbar__actions">
          <span className="network-pill"><span />PREPROD</span>
          <span className="privacy-workspace"><EyeOff size={14} />PRIVATE WORKSPACE</span>
          <label className="role-select"><span className="sr-only">Selected role</span><select value={role} onChange={(event) => { setRole(event.target.value as Role); setSection('overview'); }}><option value="supplier">Supplier</option><option value="buyer">Buyer</option><option value="lender">Lender</option><option value="viewer">Public viewer</option></select><ChevronDown size={14} /></label>
          <button className={`wallet-button ${walletLabel ? 'wallet-button--connected' : ''}`} onClick={openWalletChooser} aria-label={walletLabel ? `Wallet connected: ${walletLabel}` : 'Connect wallet'}><WalletCards size={16} /><span>{walletLabel || 'Connect wallet'}</span></button>
        </div>
      </header>

      <div className="workspace">
        <aside className="sidebar">
          <nav aria-label="Primary navigation">
            {navItems.map((item) => <button key={item.id} className={section === item.id ? 'nav-item nav-item--active' : 'nav-item'} onClick={() => setSection(item.id)}><item.icon size={18} /><span>{item.label}</span>{item.id === 'invoices' && actionableCount > 0 && <b>{actionableCount}</b>}</button>)}
          </nav>
          <div className="workspace-identity"><span className="eyebrow">Workspace</span><strong>{role === 'viewer' ? 'Public registry' : role === 'lender' ? 'Greenline Capital' : role === 'buyer' ? 'Juniper Works' : 'Northstar Supply'}</strong><code>{role === 'viewer' ? 'PUBLIC-PREPROD' : `DEMO-${role.toUpperCase()}-04`}</code></div>
        </aside>

        <main className="main-content" id="main-content">
          <div className="page-header"><div><p className="eyebrow">{pageCopy.eyebrow} / {activeLabel}</p><h1>{pageCopy.heading}</h1><p>{pageCopy.body}</p></div>{role === 'supplier' && <button className="button button--primary" onClick={() => setRegisterOpen(true)}><Plus size={17} />Register invoice</button>}</div>

          <PriorityBand role={role} acceptedCount={acceptedCount} pendingCount={pendingCount} actionableCount={actionableCount} onSelect={(status) => { const found = invoices.find((invoice) => invoice.status === status); if (found) setSelectedInvoiceId(found.id); setSection('invoices'); }} />

          <section className="work-grid">
            <InvoiceQueue role={role} invoices={visibleInvoices} selectedId={selectedInvoice?.id ?? ''} onSelect={setSelectedInvoiceId} onAction={(invoice) => requestFinancing(invoice)} busy={busy} />
            <EvidencePanel invoice={selectedInvoice} role={role} onBuyerDecision={buyerDecision} onLenderDecision={lenderDecision} onMarkPaid={markPaid} onCopy={() => { if (selectedInvoice) void navigator.clipboard?.writeText(selectedInvoice.commitment); notify('Public commitment copied.'); }} />
          </section>

          {section === 'policies' ? <PoliciesSection selectedInvoice={selectedInvoice} onCheck={(policyId) => selectedInvoice && requestFinancing(selectedInvoice, policyId)} /> : section === 'requests' ? <RequestsSection invoices={invoices} onSelect={(invoice) => { setSelectedInvoiceId(invoice.id); setRole('lender'); }} /> : section === 'explorer' ? <ExplorerSection invoices={invoices} /> : section === 'demo' ? <DemoGuide /> : <PoliciesSection selectedInvoice={selectedInvoice} compact onCheck={(policyId) => selectedInvoice && requestFinancing(selectedInvoice, policyId)} />}

          <section className="activity-panel"><header><div><h2>Recent lifecycle activity</h2><p>Demo-safe aliases and public state changes only.</p></div><Radio size={17} /></header><div>{activity.slice(0, 4).map((item) => <article key={item.id}><span className="activity-marker" /><div><strong>{item.invoiceAlias}</strong><p>{item.message}</p></div><time>{item.timestamp}</time></article>)}</div></section>

          <div className="testnet-notice"><FlaskConical size={17} /><p><strong>Preprod · Synthetic data only.</strong> ProofFactor demonstrates verification and lifecycle state transitions. This MVP does not transfer funds or prove delivery of goods.</p></div>
        </main>
      </div>

      <nav className="mobile-nav" aria-label="Mobile navigation"><button onClick={() => setSection('overview')}><LayoutDashboard />Overview</button><button onClick={() => setSection('invoices')}><Files />Work</button><button onClick={() => setSection('explorer')}><ScanSearch />Explorer</button><button onClick={() => setSection('demo')}><Menu />More</button></nav>

      <RegisterInvoiceDialog open={registerOpen} onClose={() => setRegisterOpen(false)} onSubmit={registerInvoice} />
      <WalletDialog open={walletOpen} wallets={wallets} onClose={() => setWalletOpen(false)} onSelect={chooseWallet} />
      <TransactionDrawer open={drawerOpen} invoice={selectedInvoice} stages={stages} onClose={() => !busy && setDrawerOpen(false)} />
      {toast && <div className="toast" role="status"><Check size={16} />{toast}</div>}
    </div>
  );
}

function PriorityBand({ role, acceptedCount, pendingCount, actionableCount, onSelect }: { role: Role; acceptedCount: number; pendingCount: number; actionableCount: number; onSelect: (status: Invoice['status']) => void }) {
  return <section className="priority-band"><div><span className="priority-dot" /><div><h2>{actionableCount} {actionableCount === 1 ? 'invoice needs' : 'invoices need'} action</h2><p>{role === 'supplier' ? 'Start with an accepted invoice ready for a private policy check.' : role === 'buyer' ? 'Review proposed commitments before suppliers can request financing.' : role === 'lender' ? 'Confirm or decline requests currently locked to your policy.' : 'Public records expose lifecycle integrity—not invoice contents.'}</p></div></div><button onClick={() => onSelect('ACCEPTED')}><span className="eyebrow">Accepted</span><strong><span className="dot dot--success" />{acceptedCount} ready</strong></button><button onClick={() => onSelect('PENDING_FINANCING')}><span className="eyebrow">Pending financing</span><strong><span className="dot dot--pending" />{pendingCount} awaiting lender</strong></button></section>;
}

function InvoiceQueue({ role, invoices, selectedId, onSelect, onAction, busy }: { role: Role; invoices: Invoice[]; selectedId: string; onSelect: (id: string) => void; onAction: (invoice: Invoice) => void; busy: boolean }) {
  return <section className="panel invoice-queue"><header className="panel__header"><div><h2>{role === 'lender' ? 'Financing requests' : role === 'buyer' ? 'Buyer review queue' : 'Recent invoices'}</h2><p>Decision queue · private values excluded</p></div><span className="eyebrow">{invoices.length} records</span></header><div className="table-wrap"><table><thead><tr><th>Invoice alias</th><th>Counterparty</th><th>Lifecycle</th><th>Due window</th><th>Updated</th><th>Next action</th></tr></thead><tbody>{invoices.map((invoice) => <tr key={invoice.id} className={selectedId === invoice.id ? 'selected' : ''} onClick={() => onSelect(invoice.id)} tabIndex={0} onKeyDown={(event) => { if (event.key === 'Enter') onSelect(invoice.id); }}><td><strong>{invoice.alias}</strong><code>{shortHash(invoice.commitment)}</code></td><td>{role === 'buyer' ? invoice.supplierAlias : invoice.buyerAlias}</td><td><StatusBadge status={invoice.status} /></td><td><code>{invoice.dueWindow}</code></td><td><span className="muted">{invoice.updatedAt}</span></td><td>{role === 'supplier' && invoice.status === 'ACCEPTED' ? <button disabled={busy} className="button button--small button--secondary" onClick={(event) => { event.stopPropagation(); onAction(invoice); }}>Check privately</button> : <span className="muted">{invoice.status === 'PENDING_FINANCING' ? 'Await lender' : invoice.status === 'PROPOSED' ? 'Await buyer' : 'Open details'}</span>}</td></tr>)}</tbody></table></div>{invoices.length === 0 && <div className="empty-state"><strong>No records for this role.</strong><p>Switch roles or create a new synthetic invoice.</p></div>}</section>;
}

function EvidencePanel({ invoice, role, onBuyerDecision, onLenderDecision, onMarkPaid, onCopy }: { invoice: Invoice | null; role: Role; onBuyerDecision: (accepted: boolean) => void; onLenderDecision: (confirmed: boolean) => void; onMarkPaid: () => void; onCopy: () => void }) {
  if (!invoice) return <aside className="panel evidence-panel empty-state">Select an invoice to inspect its public evidence.</aside>;
  const lifecycle = ['PROPOSED', 'ACCEPTED', 'PENDING_FINANCING', 'FINANCED_CONFIRMED', 'PAID'] as const;
  const activeIndex = Math.max(0, lifecycle.indexOf(invoice.status as (typeof lifecycle)[number]));
  return <aside className="panel evidence-panel"><header className="panel__header"><div><h2>{invoice.alias} evidence</h2><p>Selected invoice</p></div>{invoice.proofVerified ? <PrivacyTag level="PROVED, NOT SHARED" /> : <PrivacyTag level="PRIVATE INPUT" />}</header><div className="evidence-panel__body"><ol className="lifecycle" aria-label="Invoice lifecycle">{lifecycle.map((status, index) => <li key={status} className={index <= activeIndex ? 'complete' : ''}><span /><small>{status.replace('_', ' ')}</small></li>)}</ol><div className="evidence-rows"><div><span>Buyer acknowledged invoice</span><strong><BadgeCheck size={15} />{['ACCEPTED', 'PENDING_FINANCING', 'FINANCED_CONFIRMED', 'PAID'].includes(invoice.status) ? 'Verified' : 'Pending'}</strong></div><div><span>Canonical data matches commitment</span><strong>{invoice.proofVerified ? 'Proved privately' : 'Not proved yet'}</strong></div><div><span>Exact invoice amount</span><strong className="muted">Not disclosed</strong></div><div><span>Stable nullifier</span><strong>{invoice.nullifier ? 'Bound' : 'Not issued'}</strong></div></div><div className="public-metadata"><div><span className="eyebrow">Public metadata</span><PrivacyTag level="PUBLIC ON-CHAIN" /></div><div><code>{shortHash(invoice.commitment)}</code><button className="icon-button" onClick={onCopy} aria-label="Copy public commitment"><Copy size={15} /></button></div></div><p className="disclosure-note"><strong>Disclosure boundary:</strong> workspace aliases are demo labels. Public state contains a commitment and lifecycle metadata—not private invoice values or legal identities.</p><div className="evidence-actions">{role === 'buyer' && invoice.status === 'PROPOSED' && <><button className="button button--secondary button--danger" onClick={() => onBuyerDecision(false)}>Reject</button><button className="button button--primary" onClick={() => onBuyerDecision(true)}>Accept invoice</button></>}{role === 'lender' && invoice.status === 'PENDING_FINANCING' && <><button className="button button--secondary" onClick={() => onLenderDecision(false)}>Decline & release</button><button className="button button--primary" onClick={() => onLenderDecision(true)}>Confirm financing</button></>}{role === 'buyer' && ['ACCEPTED', 'PENDING_FINANCING', 'FINANCED_CONFIRMED'].includes(invoice.status) && <button className="button button--secondary" onClick={onMarkPaid}>Mark paid</button>}</div></div></aside>;
}

function PoliciesSection({ selectedInvoice, compact = false, onCheck }: { selectedInvoice: Invoice | null; compact?: boolean; onCheck: (policyId: string) => void }) {
  return <section className={`panel policies-panel ${compact ? 'policies-panel--compact' : ''}`}><header className="panel__header"><div><h2>Available lender policies</h2><p>Public terms; eligibility is checked against private invoice facts.</p></div><span className="eyebrow">{demoPolicies.filter((policy) => policy.active).length} active</span></header><div className="policy-grid">{demoPolicies.slice(0, compact ? 2 : 3).map((policy) => <article key={policy.id}><div className="policy-icon"><Building2 size={18} /></div><div><h3>{policy.lenderAlias}</h3><p><code>{policy.currency}</code> · public range · up to {policy.maxRemainingDays} days</p></div><button className="button button--small button--secondary" disabled={!selectedInvoice || selectedInvoice.status !== 'ACCEPTED'} onClick={() => onCheck(policy.id)}>Check privately</button></article>)}</div></section>;
}

function RequestsSection({ invoices, onSelect }: { invoices: Invoice[]; onSelect: (invoice: Invoice) => void }) {
  const requests = invoices.filter((invoice) => ['PENDING_FINANCING', 'FINANCED_CONFIRMED'].includes(invoice.status));
  return <section className="panel cards-section"><header className="panel__header"><div><h2>Financing request queue</h2><p>Requests show proof results and public lifecycle state—not invoice documents.</p></div><CircleDollarSign size={18} /></header><div className="cards-grid">{requests.map((invoice) => <button key={invoice.id} onClick={() => onSelect(invoice)}><StatusBadge status={invoice.status} /><h3>{invoice.alias}</h3><p>Policy {invoice.policyId ?? 'unassigned'} · {invoice.currency}</p><code>{shortHash(invoice.nullifier)}</code></button>)}</div></section>;
}

function ExplorerSection({ invoices }: { invoices: Invoice[] }) {
  return <section className="panel explorer"><header className="panel__header"><div><h2>Preprod public explorer</h2><p>Only intentionally public registry fields are shown.</p></div><PrivacyTag level="PUBLIC ON-CHAIN" /></header><div className="explorer-list">{invoices.map((invoice) => <article key={invoice.id}><Radio size={16} /><div><strong>{shortHash(invoice.commitment)}</strong><span>Lifecycle record · synthetic demo</span></div><StatusBadge status={invoice.status} /><code>{invoice.nullifier ? `N:${shortHash(invoice.nullifier)}` : 'Nullifier pending'}</code></article>)}</div></section>;
}

function DemoGuide() {
  return <section className="panel demo-guide"><header className="panel__header"><div><h2>Three-role demo path</h2><p>Use synthetic records to demonstrate the complete privacy-preserving lifecycle.</p></div><FlaskConical size={18} /></header><ol><li><span>01</span><div><strong>Supplier registers</strong><p>Create a local invoice opening and publish only its commitment.</p></div></li><li><span>02</span><div><strong>Buyer acknowledges</strong><p>Recompute the commitment locally, then record authenticated acceptance and a stable nullifier.</p></div></li><li><span>03</span><div><strong>Supplier proves eligibility</strong><p>Prove policy predicates and atomically create a pending financing lock.</p></div></li><li><span>04</span><div><strong>Lender confirms</strong><p>Confirm the locked request and consume the nullifier exactly once.</p></div></li></ol></section>;
}
