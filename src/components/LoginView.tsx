'use client';
import { useState } from 'react';
import styles from './LoginView.module.css';

export interface PartnerUser {
  email: string;
  org: string;
}

interface Props {
  onLoginSuccess: (user: PartnerUser) => void;
  onCancel: () => void;
}

const PARTNER_ORGS = [
  'Rwanda Ministry of Health',
  'Institut Pasteur de Dakar',
  'Aspen Pharmacare SA',
  'Macleods Pharmaceuticals',
  'BioNTech Rwanda',
  'Kenya MoH Partner',
  'SA Stats Dept',
  'Senegal Health Agency',
];

// SVG Icons
const IconMail = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
);
const IconBuilding = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2" /><path d="M3 9h18M9 21V9" />
  </svg>
);
const IconKey = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m21 2-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0 3 3L22 7l-3-3m-3.5 3.5L19 4" />
  </svg>
);
const IconUser = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
  </svg>
);
const IconArrowLeft = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
  </svg>
);
const IconSend = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
  </svg>
);
const IconCheck = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

export default function LoginView({ onLoginSuccess, onCancel }: Props) {
  const [mode, setMode] = useState<'signin' | 'register'>('signin');
  const [email, setEmail] = useState('');
  const [org, setOrg] = useState(PARTNER_ORGS[0]);
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regOrg, setRegOrg] = useState('');
  const [regReg, setRegReg] = useState('');
  const [magicCode, setMagicCode] = useState('');
  const [codeSent, setCodeSent] = useState(false);
  const [regSubmitted, setRegSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function handleSendCode(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) { setError('Please enter a valid email address.'); return; }
    setError('');
    setLoading(true);
    setTimeout(() => { setLoading(false); setCodeSent(true); }, 900);
  }

  function handleVerifyCode(e: React.FormEvent) {
    e.preventDefault();
    if (magicCode !== '123456') { setError('Invalid code. Use "123456" to sign in.'); return; }
    setLoading(true);
    setTimeout(() => { setLoading(false); onLoginSuccess({ email: email.trim(), org }); }, 500);
  }

  function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    if (!regName || !regEmail || !regOrg) { setError('Please fill in all required fields.'); return; }
    setError('');
    setLoading(true);
    setTimeout(() => { setLoading(false); setRegSubmitted(true); }, 1200);
  }

  function resetMode(m: 'signin' | 'register') {
    setMode(m);
    setCodeSent(false);
    setRegSubmitted(false);
    setError('');
    setEmail(''); setMagicCode('');
    setRegName(''); setRegEmail(''); setRegOrg(''); setRegReg('');
  }

  return (
    <div className={styles.overlay} onClick={(e) => e.target === e.currentTarget && onCancel()}>
      <div className={`${styles.card} animate-fade-up`}>
        {/* Header */}
        <div className={styles.header}>
          <img src="/logoA.png" alt="VAX2040 Logo" className={styles.logo} />
          <span className={styles.modeBadge}>
            {mode === 'signin' ? 'Partner Sign In' : 'Request Access'}
          </span>
        </div>

        {/* Mode Switcher */}
        <div className={styles.modeSwitcher}>
          <button className={`${styles.modeBtn} ${mode === 'signin' ? styles.modeBtnActive : ''}`} onClick={() => resetMode('signin')}>
            Sign In
          </button>
          <button className={`${styles.modeBtn} ${mode === 'register' ? styles.modeBtnActive : ''}`} onClick={() => resetMode('register')}>
            Request Access
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className={styles.errorAlert}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            {error}
          </div>
        )}

        {/* ── Sign In Flow ─────────────────────────────── */}
        {mode === 'signin' && !codeSent && (
          <form onSubmit={handleSendCode} className={styles.form}>
            <p className={styles.formDesc}>Enter your registered corporate email to receive a magic link code.</p>
            <div className={styles.field}>
              <label className={styles.label}><IconMail /> Corporate Email</label>
              <input type="email" placeholder="reporter@biontech.rw" className={styles.input}
                value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className={styles.field}>
              <label className={styles.label}><IconBuilding /> Organisation</label>
              <select className={styles.select} value={org} onChange={(e) => setOrg(e.target.value)}>
                {PARTNER_ORGS.map((o) => <option key={o} value={o}>{o}</option>)}
              </select>
            </div>
            <button type="submit" className={styles.btnPrimary} disabled={loading}>
              {loading ? <><span className={styles.btnSpinner} /> Sending...</> : <><IconSend /> Send Magic Code</>}
            </button>
          </form>
        )}

        {mode === 'signin' && codeSent && (
          <form onSubmit={handleVerifyCode} className={styles.form}>
            <div className={styles.successAlert}>
              <IconCheck />
              Magic code sent to <strong>{email}</strong>. Use demo code: <strong>123456</strong>
            </div>
            <div className={styles.field}>
              <label className={styles.label}><IconKey /> Verification Code</label>
              <input type="text" placeholder="Enter 6-digit code" className={styles.input}
                value={magicCode} onChange={(e) => setMagicCode(e.target.value)} required maxLength={6} />
            </div>
            <button type="submit" className={styles.btnPrimary} disabled={loading}>
              {loading ? <><span className={styles.btnSpinner} /> Verifying...</> : <><IconCheck /> Verify & Sign In</>}
            </button>
            <button type="button" className={styles.btnGhost} onClick={() => setCodeSent(false)}>
              <IconArrowLeft /> Use a different email
            </button>
          </form>
        )}

        {/* ── Register Flow ────────────────────────────── */}
        {mode === 'register' && !regSubmitted && (
          <form onSubmit={handleRegister} className={styles.form}>
            <p className={styles.formDesc}>Request partner access to submit pharmaceutical production data on behalf of your organisation.</p>
            <div className={styles.field}>
              <label className={styles.label}><IconUser /> Full Name <span className={styles.required}>*</span></label>
              <input type="text" placeholder="Dr. Alice Uwamahoro" className={styles.input}
                value={regName} onChange={(e) => setRegName(e.target.value)} required />
            </div>
            <div className={styles.field}>
              <label className={styles.label}><IconMail /> Work Email <span className={styles.required}>*</span></label>
              <input type="email" placeholder="alice@ministry.gov.rw" className={styles.input}
                value={regEmail} onChange={(e) => setRegEmail(e.target.value)} required />
            </div>
            <div className={styles.field}>
              <label className={styles.label}><IconBuilding /> Organisation Name <span className={styles.required}>*</span></label>
              <input type="text" placeholder="Rwanda FDA / BioNTech Kigali" className={styles.input}
                value={regOrg} onChange={(e) => setRegOrg(e.target.value)} required />
            </div>
            <div className={styles.field}>
              <label className={styles.label}><IconKey /> Registration Number <span className={styles.optional}>(optional)</span></label>
              <input type="text" placeholder="e.g. RDB-2024-00123" className={styles.input}
                value={regReg} onChange={(e) => setRegReg(e.target.value)} />
            </div>
            <button type="submit" className={styles.btnPrimary} disabled={loading}>
              {loading ? <><span className={styles.btnSpinner} /> Submitting...</> : <>Submit Access Request</>}
            </button>
          </form>
        )}

        {mode === 'register' && regSubmitted && (
          <div className={styles.successScreen}>
            <div className={styles.successIcon}>
              <IconCheck />
            </div>
            <h3 className={styles.successTitle}>Request Submitted</h3>
            <p className={styles.successDesc}>
              Your access request for <strong>{regOrg}</strong> has been submitted. The VAX2040 admin team will review and activate your account within 24–48 hours.
            </p>
            <button className={styles.btnGhost} onClick={() => resetMode('signin')}>
              <IconArrowLeft /> Back to Sign In
            </button>
          </div>
        )}

        {/* Footer */}
        <div className={styles.footer}>
          <button className={styles.backBtn} onClick={onCancel}>
            <IconArrowLeft /> Back to Public Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
