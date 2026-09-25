import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';
import { AdminPanel } from './components/AdminPanel';
import { LandingPage } from './LandingPage';
import { readRegisteredUsers, readTransactionAudits } from './lib/midnight/wallets';
import { useState, type FormEvent } from 'react';
import './styles.css';

function AdminRoute() {
  const [accessGranted, setAccessGranted] = useState(false);
  const [accessCode, setAccessCode] = useState('');
  const configuredCode = (import.meta as ImportMeta & { env?: Record<string, string> }).env?.VITE_ADMIN_ACCESS_CODE;
  function submit(event: FormEvent) {
    event.preventDefault();
    if (configuredCode && accessCode === configuredCode) setAccessGranted(true);
  }
  if (!accessGranted) return <div className="admin-route admin-route--gate"><section className="admin-gate"><span className="eyebrow">Private operator route</span><h1>Admin access</h1><p>This register is for the ProofFactor operator only. It is not part of the user platform.</p>{configuredCode ? <form onSubmit={submit}><label className="field">Access code<input type="password" value={accessCode} onChange={(event) => setAccessCode(event.target.value)} autoFocus /></label><button className="button button--primary" type="submit">Open register</button></form> : <p className="form-error">Set <code>VITE_ADMIN_ACCESS_CODE</code> in the local environment before opening this route.</p>}<a href="/">Return to product</a></section></div>;
  return <div className="admin-route"><header className="admin-route__header"><a href="/" className="landing-brand">ProofFactor</a><span>PREPROD / PRIVATE OPERATOR REGISTER</span><a href="/app">Open workspace</a></header><main><AdminPanel users={readRegisteredUsers()} audits={readTransactionAudits()} /></main></div>;
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {window.location.pathname === '/admin' ? <AdminRoute /> : window.location.pathname === '/app' ? <App /> : <LandingPage />}
  </StrictMode>,
);
