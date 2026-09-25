import {
  ArrowRight,
  Check,
  CircleArrowUp,
  FileCheck2,
  Eye,
  Hash,
  LockKeyhole,
  Menu,
  Network,
  Printer,
  ShieldCheck,
} from 'lucide-react';
import { Fragment, useEffect, useState, type CSSProperties } from 'react';
import { BrandMark } from './components/BrandMark';
import { WalletDialog } from './components/WalletDialog';
import { discoverInjectedWallets, safeWalletLabel, type DiscoveredWallet } from './lib/midnight/wallets';

const roles = [
  {
    label: 'Supplier',
    title: 'Unlock working capital without opening the books.',
    body: 'Commit the invoice locally, then prove eligibility without sharing amount, customer relationship, or margin.',
    icon: LockKeyhole,
  },
  {
    label: 'Buyer',
    title: 'Attest to the invoice you actually reviewed.',
    body: 'Recompute the commitment off-chain and record an authenticated acceptance that lenders can trust.',
    icon: Check,
  },
  {
    label: 'Lender',
    title: 'Make a decision on facts, not a data room.',
    body: 'Publish a funding policy and confirm proof-qualified requests without receiving the private invoice.',
    icon: ShieldCheck,
  },
];

const proofSteps = [
  { label: 'Supplier', detail: 'Commits the invoice locally.', publicFact: 'Commitment registered' },
  { label: 'Buyer attests', detail: 'Matches the invoice off-chain.', publicFact: 'Buyer acceptance verified' },
  { label: 'Lender verifies', detail: 'Checks policy predicates privately.', publicFact: 'Amount range proved' },
];

const benchSteps = [
  { label: 'Open commitment', query: 'Does the private invoice match the registered commitment?', result: 'COMMITMENT MATCHED', detail: 'Invoice fields and supplier salt recompute to the public commitment.', icon: Hash },
  { label: 'Check policy', query: 'Is this invoice inside the lender policy?', result: 'POLICY ELIGIBLE', detail: 'Amount, currency, and due date satisfy the selected public bounds.', icon: FileCheck2 },
  { label: 'Lock financing', query: 'Has this receivable already been financed?', result: 'NULLIFIER UNUSED', detail: 'The buyer-issued stable nullifier is checked before the pending lock.', icon: ShieldCheck },
];

const signalCards = [
  { label: 'Private state', value: 'Invoice fields', detail: 'Amount, dates, line items, and margins remain witness data for the proving party.', icon: LockKeyhole },
  { label: 'Contract state', value: 'Commitment + policy', detail: 'The Compact contract binds the claim to a buyer, policy, and lifecycle without storing the source file.', icon: Network },
  { label: 'Public signal', value: 'Proof result', detail: 'Observers can verify the state transition, policy identity, and nullifier status without reconstructing the invoice.', icon: ShieldCheck },
];

export function LandingPage() {
  const [proofOpen, setProofOpen] = useState(false);
  const [proofStep, setProofStep] = useState(2);
  const [benchStep, setBenchStep] = useState(1);
  const [privacyFocus, setPrivacyFocus] = useState<'private' | 'public'>('private');
  const [lifecycleFocus, setLifecycleFocus] = useState(2);
  const [signalFocus, setSignalFocus] = useState(1);
  const [printing, setPrinting] = useState(false);
  const [walletOpen, setWalletOpen] = useState(false);
  const [wallets, setWallets] = useState<DiscoveredWallet[]>([]);
  const [walletLabel, setWalletLabel] = useState('');

  function runPrintProof() {
    if (printing) return;
    setPrinting(true);
    window.setTimeout(() => setPrinting(false), 1900);
  }

  function openWalletChooser() {
    setWallets(discoverInjectedWallets());
    setWalletOpen(true);
  }

  async function chooseWallet(wallet: DiscoveredWallet | null) {
    setWalletOpen(false);
    if (!wallet) {
      setWalletLabel('Demo wallet');
      return;
    }
    try {
      await wallet.connect('preprod');
      setWalletLabel(safeWalletLabel(wallet));
    } catch {
      setWalletLabel('Connection failed');
    }
  }

  useEffect(() => {
    const revealItems = document.querySelectorAll<HTMLElement>('.landing-reveal');
    if (!('IntersectionObserver' in window)) {
      revealItems.forEach((item) => item.classList.add('is-visible'));
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.16 });

    revealItems.forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, []);


  return (
    <div className="landing-page">
      <header className="landing-nav">
        <a className="landing-brand" href="/" aria-label="ProofFactor home"><BrandMark /></a>
        <nav className="landing-links" aria-label="Landing page navigation">
          <a href="#how-it-works">How it works</a>
          <a href="#privacy">Privacy model</a>
          <a href="#roles">For teams</a>
        </nav>
        <div className="landing-actions">
          <span className="landing-nav__status"><i /> PREPROD / DEMO</span>
          <button className={`landing-wallet ${walletLabel ? 'is-connected' : ''}`} onClick={openWalletChooser}><span />{walletLabel || 'Connect wallet'}</button>
          <a className="landing-text-link landing-nav__cta" href="/app">Open workspace <ArrowRight size={15} /></a>
          <a className="landing-menu" href="/app" aria-label="Open ProofFactor workspace"><Menu size={20} /></a>
        </div>
      </header>

      <main>
        <section className="landing-hero">
          <div className="browser-shell" aria-label="ProofFactor private invoice verification flow">
            <div className="browser-shell__toolbar">
              <span className="browser-shell__dots"><i /><i /><i /></span>
              <span className="browser-shell__address">proofactor.com/private_registry</span>
            </div>
            <div className="browser-shell__header">
              <span>PROOFFACTOR / PRIVATE REGISTRY</span>
              <span>PREPROD DEMO</span>
            </div>

            <div className="browser-shell__content">
              <h1 className="landing-hero__title">A receivable<br /><em>without exposure.</em></h1>

              <div className="browser-shell__body">
                <div className={`proof-visual ${printing ? 'proof-visual--printing' : ''}`}>
                  <div className="proof-visual__invoice">
                    <div className="proof-visual__stamp"><ShieldCheck size={24} /><span>PROOF<br />VALID</span></div>
                    <span className="eyebrow">Invoice commitment</span>
                    <code>0x7a3c5d8f224af6b491e2</code>
                    <div className="proof-visual__redacted"><span /><span /><span /></div>
                    <div className="proof-visual__invoice-rows"><span /><span /><span /><span /></div>
                    <div className="proof-visual__facts"><span><Eye size={13} /> Amount hidden</span><span><Network size={13} /> Policy matched</span></div>
                  </div>
                </div>

                <div className="proof-summary">
                  <div className="proof-summary__header">
                    <span>Live Proof Trace</span>
                    <strong>3 / 3 checks passed</strong>
                  </div>
                  <ul>
                    <li>✓ ZK-Circuit Verified</li>
                    <li>✓ Policy Match Confirmed</li>
                    <li>✓ Hash Integrity OK</li>
                  </ul>
                  <div className="proof-summary__box">
                    <button type="button" className="proof-summary__inspect" onClick={runPrintProof} disabled={printing}>
                      {printing ? 'Printing proof...' : 'Inspect Proof'} <ArrowRight size={15} />
                    </button>
                  </div>
                </div>
              </div>

              <div className="browser-shell__steps">
                <div className="browser-shell__step">
                  <div className="browser-shell__icon"><LockKeyhole size={22} /></div>
                  <span>Supplier</span>
                </div>
                <div className="browser-shell__step">
                  <div className="browser-shell__icon"><ShieldCheck size={22} /></div>
                  <span>Buyer attests</span>
                </div>
                <div className="browser-shell__step">
                  <div className="browser-shell__icon"><Network size={22} /></div>
                  <span>Lender verifies</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="landing-inline-cta landing-reveal">
          <div className="landing-inline-cta__copy">
            <span className="landing-kicker"><span /> Built for sensitive receivables</span>
            <h2>Bring the proof,<br /><em>not the paperwork.</em></h2>
          </div>
          <div className="landing-inline-cta__actions">
            <a className="landing-button landing-button--dark" href="/app">Open workspace <ArrowRight size={15} /></a>
            <button type="button" className="landing-button landing-button--quiet" onClick={runPrintProof} disabled={printing}>{printing ? 'Printing proof...' : 'Run print proof'}</button>
          </div>
        </section>
      </main>

      <footer className="landing-footer"><BrandMark /><span>Finance the invoice, not the company&apos;s secrets.</span><span>Midnight · Preprod concept</span></footer>
      <WalletDialog open={walletOpen} wallets={wallets} onClose={() => setWalletOpen(false)} onSelect={chooseWallet} collectDisplayName={false} />
    </div>
  );
}
