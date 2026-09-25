import { Check, LoaderCircle, X } from 'lucide-react';
import type { Invoice, TransactionStage } from '../domain/types';
import { PrivacyTag } from './PrivacyTag';

interface Props {
  open: boolean;
  invoice: Invoice | null;
  stages: TransactionStage[];
  onClose: () => void;
}

export function TransactionDrawer({ open, invoice, stages, onClose }: Props) {
  if (!open || !invoice) return null;
  return (
    <aside className="transaction-drawer" aria-labelledby="transaction-title">
      <header className="transaction-drawer__header">
        <div><p className="eyebrow">Transaction progress</p><h2 id="transaction-title">Private policy check</h2></div>
        <button className="icon-button" type="button" onClick={onClose} aria-label="Close transaction progress"><X /></button>
      </header>
      <div className="transaction-drawer__body">
        <div className="local-summary"><div><strong>{invoice.alias}</strong><PrivacyTag level="LOCAL ONLY" /></div><p>Private invoice fields are prepared locally. Only proof outputs and required public state are submitted.</p></div>
        <ol className="progress-list" aria-live="polite">
          {stages.map((stage, index) => (
            <li className={`progress-step progress-step--${stage.state}`} key={stage.id}>
              <span className="progress-step__marker" aria-hidden="true">
                {stage.state === 'complete' ? <Check size={14} /> : stage.state === 'active' ? <LoaderCircle className="spin" size={14} /> : index + 1}
              </span>
              <div><strong>{stage.label}</strong><p>{stage.description}</p>{stage.id === 'proof' && <PrivacyTag level="PROVED, NOT SHARED" />}</div>
            </li>
          ))}
        </ol>
        <div className="technical-note"><span className="eyebrow">If proof generation fails</span><p>Verify the local invoice opening and retry. No transaction is submitted before wallet approval.</p></div>
      </div>
    </aside>
  );
}
