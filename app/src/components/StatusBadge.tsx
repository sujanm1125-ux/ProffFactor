import { Check, Circle, Clock3, X } from 'lucide-react';
import { statusLabels } from '../domain/demo-data';
import type { InvoiceStatus } from '../domain/types';

const statusTone: Record<InvoiceStatus, string> = {
  PROPOSED: 'info',
  ACCEPTED: 'success',
  PENDING_FINANCING: 'pending',
  FINANCED_CONFIRMED: 'success',
  PAID: 'success',
  REJECTED: 'danger',
  CANCELLED: 'neutral',
  EXPIRED: 'danger',
};

export function StatusBadge({ status }: { status: InvoiceStatus }) {
  const Icon = status === 'PENDING_FINANCING' ? Clock3 : status === 'REJECTED' || status === 'EXPIRED' ? X : status === 'PROPOSED' ? Circle : Check;
  return (
    <span className={`status-badge status-badge--${statusTone[status]}`}>
      <span className="status-badge__dot" aria-hidden="true" />
      <Icon size={12} aria-hidden="true" />
      {statusLabels[status]}
    </span>
  );
}
