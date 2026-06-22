'use client';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from './page.module.css';

// ── Role metadata ──────────────────────────────────────────
const ROLE_META: Record<string, { label: string; formPath: string; color: string }> = {
  manufacturer: { label: 'Local Manufacturer',       formPath: '/forms/manufacturer', color: '#0A6B6A' },
  nra:          { label: 'National Regulatory Authority', formPath: '/forms/nra',      color: '#10b981' },
  supplier:     { label: 'Central Medical Supply',    formPath: '/forms/supplier',     color: '#8b5cf6' },
};

const AFRICAN_COUNTRIES = [
  'Algeria', 'Angola', 'Benin', 'Botswana', 'Burkina Faso', 'Burundi', 'Cabo Verde', 
  'Cameroon', 'Central African Republic', 'Chad', 'Comoros', 'Congo (Brazzaville)', 
  'Congo (Kinshasa)', 'Djibouti', 'Egypt', 'Equatorial Guinea', 'Eritrea', 'Eswatini', 
  'Ethiopia', 'Gabon', 'Gambia', 'Ghana', 'Guinea', 'Guinea-Bissau', 'Ivory Coast', 
  'Kenya', 'Lesotho', 'Liberia', 'Libya', 'Madagascar', 'Malawi', 'Mali', 'Mauritania', 
  'Mauritius', 'Morocco', 'Mozambique', 'Namibia', 'Niger', 'Nigeria', 'Rwanda', 
  'Sao Tome and Principe', 'Senegal', 'Seychelles', 'Sierra Leone', 'Somalia', 
  'South Africa', 'South Sudan', 'Sudan', 'Tanzania', 'Togo', 'Tunisia', 'Uganda', 
  'Zambia', 'Zimbabwe'
];

// ── SVG Icons ──────────────────────────────────────────────
const IconArrowLeft = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
  </svg>
);
const IconCheck = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

// ── Inner component ──────────────────────────────────────────
function AuthPageInner() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Read role and tab from URL params
  const roleParam = searchParams.get('role') || '';
  const tabParam  = searchParams.get('tab') as 'signin' | 'register' | null;

  // Default to 'register' unless URL says 'signin'
  const [mode, setMode] = useState<'signin' | 'register'>(
    tabParam === 'signin' ? 'signin' : 'register'
  );

  // Sign In State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Register State
  const [regFirstName, setRegFirstName] = useState('');
  const [regLastName, setRegLastName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regJobTitle, setRegJobTitle] = useState('');
  const [regOrg, setRegOrg] = useState('');
  const [regCountry, setRegCountry] = useState('Rwanda');
  const [regPhone, setRegPhone] = useState('');

  // Flow State
  const [regSubmitted, setRegSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Persist role selection
  useEffect(() => {
    if (roleParam) {
      localStorage.setItem('vax2040_selected_role', roleParam);
    }
  }, [roleParam]);

  const roleMeta = ROLE_META[roleParam] || null;

  function getRedirectPath() {
    const savedRole = roleParam || localStorage.getItem('vax2040_selected_role') || '';
    return ROLE_META[savedRole]?.formPath || '/';
  }

  function handleSignIn(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim() || !password.trim()) { 
      setError('Please enter your email and password.'); 
      return; 
    }
    setError('');
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      // For demo, just log them in
      localStorage.setItem('vax2040_partner_user', JSON.stringify({ email, role: roleParam }));
      router.push(getRedirectPath());
    }, 800);
  }

  function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    if (!regFirstName || !regLastName || !regEmail || !regOrg || !regJobTitle) { 
      setError('Please fill in all required fields.'); 
      return; 
    }
    setError('');
    setLoading(true);
    setTimeout(() => { setLoading(false); setRegSubmitted(true); }, 1200);
  }

  function resetMode(m: 'signin' | 'register') {
    setMode(m);
    setRegSubmitted(false);
    setError('');
    // Clear forms (optional)
    setEmail(''); setPassword('');
  }

  return (
    <div className={styles.container}>
      
      {/* ── Left Panel (Blue Branding, matches select-role) ── */}
      <aside className={styles.leftSide}>
        <div className={styles.leftContent}>
          <img src="/logoA.png" alt="VAX2040 Logo" className={styles.logo} />

          <div className={styles.leftBadge}>
            <span className={styles.leftBadgeDot} />
            VAX PHARMA 2040 · Kigali, Rwanda
          </div>

          <h1 className={styles.projectTitle}>
            Africa Pharmaceutical<br />
            Sovereignty Data Collection
          </h1>

          <div className={styles.leftDivider} />

          <p className={styles.projectSubtitle}>
            We are tracking Africa's progress toward making <strong>60% of its own medicines and vaccines by 2040</strong>.
            This is an independent research centre that measures how well African countries are building their own
            pharmaceutical industries.
          </p>
        </div>
      </aside>

      {/* ── Right Panel (Forms) ── */}
      <main className={styles.rightSide}>
        <div className={styles.rightContent}>

          <Link href="/select-role" className={styles.backLink}>
            <IconArrowLeft /> Back to Role Selection
          </Link>

          {/* Role badge */}
          {roleMeta && (
            <div className={styles.roleBadge} style={{ borderColor: roleMeta.color + '40', background: roleMeta.color + '0A' }}>
              <span className={styles.roleDot} style={{ background: roleMeta.color }} />
              <span style={{ color: roleMeta.color, fontWeight: 700 }}>
                You are requesting access as: {roleMeta.label}
              </span>
            </div>
          )}

          {/* Mode switcher */}
          <div className={styles.modeSwitcher}>
            <button
              className={`${styles.modeBtn} ${mode === 'register' ? styles.modeBtnActive : ''}`}
              onClick={() => resetMode('register')}
            >
              Register / Request Access
            </button>
            <button
              className={`${styles.modeBtn} ${mode === 'signin' ? styles.modeBtnActive : ''}`}
              onClick={() => resetMode('signin')}
            >
              Sign In
            </button>
          </div>

          {error && (
            <div className={styles.errorAlert}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              {error}
            </div>
          )}

          {/* ── Register Flow ── */}
          {mode === 'register' && !regSubmitted && (
            <form onSubmit={handleRegister} className={styles.form}>
              <div>
                <h2 className={styles.formTitle}>Create Your Account</h2>
                <p className={styles.formDesc}>
                  Register to submit data on behalf of your organisation. Our team will review and approve your account within 24–48 hours.
                </p>
              </div>

              <div className={styles.fieldGroup}>
                <div className={styles.field}>
                  <label className={styles.label}>First Name <span className={styles.required}>*</span></label>
                  <input type="text" placeholder="Alice" className={styles.input}
                    value={regFirstName} onChange={(e) => setRegFirstName(e.target.value)} required />
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>Last Name <span className={styles.required}>*</span></label>
                  <input type="text" placeholder="Uwamahoro" className={styles.input}
                    value={regLastName} onChange={(e) => setRegLastName(e.target.value)} required />
                </div>
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Official Work Email <span className={styles.required}>*</span></label>
                <input type="email" placeholder="alice@ministry.gov.rw" className={styles.input}
                  value={regEmail} onChange={(e) => setRegEmail(e.target.value)} required />
              </div>

              <div className={styles.fieldGroup}>
                <div className={styles.field}>
                  <label className={styles.label}>Organisation Name <span className={styles.required}>*</span></label>
                  <input type="text" placeholder="e.g. Rwanda FDA" className={styles.input}
                    value={regOrg} onChange={(e) => setRegOrg(e.target.value)} required />
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>Job Title <span className={styles.required}>*</span></label>
                  <input type="text" placeholder="e.g. Director" className={styles.input}
                    value={regJobTitle} onChange={(e) => setRegJobTitle(e.target.value)} required />
                </div>
              </div>

              <div className={styles.fieldGroup}>
                <div className={styles.field}>
                  <label className={styles.label}>Country <span className={styles.required}>*</span></label>
                  <select className={styles.select} value={regCountry} onChange={(e) => setRegCountry(e.target.value)} required>
                    {AFRICAN_COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>Phone Number <span className={styles.optional}>(optional)</span></label>
                  <input type="tel" placeholder="+250 788 123 456" className={styles.input}
                    value={regPhone} onChange={(e) => setRegPhone(e.target.value)} />
                </div>
              </div>

              <button type="submit" className={styles.btnPrimary} disabled={loading}>
                {loading ? <><span className={styles.btnSpinner} /> Submitting...</> : <>Submit Registration Request</>}
              </button>
            </form>
          )}

          {/* Success Screen for Registration */}
          {mode === 'register' && regSubmitted && (
            <div className={styles.successScreen}>
              <div className={styles.successIcon}><IconCheck /></div>
              <h3 className={styles.successTitle}>Request Submitted!</h3>
              <p className={styles.successDesc}>
                Your access request for <strong>{regOrg}</strong> has been submitted successfully.
                The VAX2040 team will review your details and activate your account within 24–48 hours.
                You will receive an email once your account is ready.
              </p>
              <button className={styles.btnGhost} onClick={() => resetMode('signin')}>
                <IconArrowLeft /> Return to Sign In
              </button>
            </div>
          )}

          {/* ── Sign In Flow ── */}
          {mode === 'signin' && (
            <form onSubmit={handleSignIn} className={styles.form}>
              <div>
                <h2 className={styles.formTitle}>Welcome Back</h2>
                <p className={styles.formDesc}>
                  Please sign in to access your data collection dashboard.
                </p>
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Email Address</label>
                <input type="email" placeholder="alice@ministry.gov.rw" className={styles.input}
                  value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Password</label>
                <input type="password" placeholder="••••••••" className={styles.input}
                  value={password} onChange={(e) => setPassword(e.target.value)} required />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '-8px' }}>
                <a href="#" style={{ fontSize: '0.85rem', color: '#0A6B6A', textDecoration: 'none', fontWeight: 600 }}>Forgot Password?</a>
              </div>

              <button type="submit" className={styles.btnPrimary} disabled={loading}>
                {loading ? <><span className={styles.btnSpinner} /> Signing In...</> : <>Sign In</>}
              </button>
            </form>
          )}

        </div>
      </main>
    </div>
  );
}

// ── Outer wrapper with Suspense (required for useSearchParams) ──
export default function AuthPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading...</div>}>
      <AuthPageInner />
    </Suspense>
  );
}
