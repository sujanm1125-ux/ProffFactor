import { EyeOff, Radio } from 'lucide-react';
import type { PrivacyLevel } from '../domain/types';

export function PrivacyTag({ level }: { level: PrivacyLevel }) {
  const isPublic = level === 'PUBLIC ON-CHAIN';
  const Icon = isPublic ? Radio : EyeOff;
  return (
    <span className={`privacy-tag ${isPublic ? 'privacy-tag--public' : ''}`} title={privacyDescription[level]}>
      <Icon size={12} aria-hidden="true" />
      {level}
    </span>
  );
}

const privacyDescription: Record<PrivacyLevel, string> = {
  'LOCAL ONLY': 'This value remains in the local demo workspace and is not submitted.',
  'PROVED, NOT SHARED': 'The proof checks this fact without disclosing the private value.',
  'PUBLIC ON-CHAIN': 'This metadata is intended to be visible in contract state.',
};
