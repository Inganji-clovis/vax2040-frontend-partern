'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from './page.module.css';

// ── Icons ──────────────────────────────────────────────────
const IconFactory = () => (
  <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 20V9l6-4v4l6-4v4l6-4v15H2z" />
    <line x1="6" y1="20" x2="6" y2="14" />
    <line x1="10" y1="20" x2="10" y2="14" />
    <line x1="14" y1="20" x2="14" y2="14" />
    <line x1="18" y1="20" x2="18" y2="14" />
  </svg>
);

const IconShield = () => (
  <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <polyline points="9 12 11 14 15 10" />
  </svg>
);

const IconTruck = () => (
  <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="1" y="3" width="15" height="13" rx="1" />
    <path d="M16 8h4l3 5v4h-7V8z" />
    <circle cx="5.5" cy="18.5" r="2.5" />
    <circle cx="18.5" cy="18.5" r="2.5" />
  </svg>
);

const IconFinance = () => (
  <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="2" x2="12" y2="22" />
    <path d="M17 6H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
  </svg>
);

const IconArrow = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);

const IconHome = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);

// ── Role definitions ───────────────────────────────────────
const ROLES = [
  {
    id: 'manufacturer',
    number: 'Form 01',
    title: 'Local Manufacturer',
    desc: 'You make medicines or vaccines in Africa. Use this form to share your factory details, how much you produce, and where your materials come from.',
    target: 'Production Director / Plant Manager',
    cardClass: styles.cardManufacturer,
    iconWrapClass: styles.iconManufacturer,
    icon: <IconFactory />,
  },
  {
    id: 'nra',
    number: 'Form 02',
    title: 'National Regulatory Authority',
    desc: 'You are a government health regulator. Use this form to report how your country approves medicines, supports local producers, and monitors safety.',
    target: 'Regulatory Officer / Data Analyst',
    cardClass: styles.cardNra,
    iconWrapClass: styles.iconNra,
    icon: <IconShield />,
  },
  {
    id: 'supplier',
    number: 'Form 03',
    title: 'Central Medical Supply',
    desc: 'You manage buying and distributing medicines for your country. Use this form to share how much you buy locally, from abroad, and how reliable deliveries are.',
    target: 'Procurement Director / Logistics Manager',
    cardClass: styles.cardSupplier,
    iconWrapClass: styles.iconSupplier,
    icon: <IconTruck />,
  },
  {
    id: 'finance',
    number: 'Form 04',
    title: 'National Finance & Planning Authority',
    desc: 'You manage national budgets, development finance, fiscal policy, or public procurement guarantees. Use this form to share finance and market support data.',
    target: 'Director of Macro-Economic Policy or Development Finance',
    cardClass: styles.cardFinance,
    iconWrapClass: styles.iconFinance,
    icon: <IconFinance />,
  },
];

// ── Component ──────────────────────────────────────────────
export default function SelectRolePage() {
  const router = useRouter();

  function handleRoleSelect(roleId: string) {
    // Save the chosen role so auth page and form pages can use it
    localStorage.setItem('vax2040_selected_role', roleId);
    router.push(`/auth?role=${roleId}&tab=register`);
  }

  return (
    <div className={styles.page}>
      
      {/* ── Left Panel: Blue Branding ── */}
      <aside className={styles.leftPanel}>
        <div className={styles.leftInner}>
          <div className={styles.logoWrap}>
            <img src="/logoA.png" alt="VAX2040 Logo" />
          </div>

          <div className={styles.leftBadge}>
            <span className={styles.leftBadgeDot} />
            VAX PHARMA 2040 · Kigali, Rwanda
          </div>

          <h1 className={styles.leftTitle}>
            Africa Pharmaceutical<br />
            Sovereignty Data Collection
          </h1>

          <div className={styles.leftDivider} />

          <p className={styles.leftSub}>
            We are tracking Africa's progress toward making <strong>60% of its own medicines and vaccines by 2040</strong>.
            This is an independent research centre that measures how well African countries are building their own
            pharmaceutical industries.
          </p>

          <div className={styles.leftMeta}>
            4 recipient units per country · Data is kept confidential and used for research only
          </div>
        </div>
      </aside>

      {/* ── Right Panel: Forms/Cards ── */}
      <main className={styles.rightPanel}>
        
        {/* Top bar with Home and Sign in */}
        <div className={styles.topBar}>
          <Link href="/" className={styles.homeLink}>
            <IconHome /> Return to Home
          </Link>
          <div className={styles.signinLink}>
            Already have an account? <Link href="/auth?tab=signin">Sign in here</Link>
          </div>
        </div>

        {/* Prompt */}
        <div className={styles.prompt}>
          <h2 className={styles.promptTitle}>Who are you?</h2>
          <p className={styles.promptSub}>Pick the card that matches your role to get started.</p>
        </div>

        {/* Role Cards */}
        <div className={styles.cards}>
          {ROLES.map((role) => (
            <button
              key={role.id}
              className={`${styles.card} ${role.cardClass}`}
              onClick={() => handleRoleSelect(role.id)}
            >
              <div className={`${styles.iconWrap} ${role.iconWrapClass}`}>
                {role.icon}
              </div>

              <div className={styles.cardBody}>
                <div className={styles.cardMeta}>{role.number}</div>
                <h3 className={styles.cardTitle}>{role.title}</h3>
                <p className={styles.cardDesc}>{role.desc}</p>
                <div className={styles.cardTarget}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="4"/><line x1="21.17" y1="8" x2="12" y2="8"/><line x1="3.95" y1="6.06" x2="8.54" y2="14"/><line x1="10.88" y1="21.94" x2="15.46" y2="14"/></svg>
                  For: {role.target}
                </div>
              </div>

              <div className={styles.cardArrow}>
                <IconArrow />
              </div>
            </button>
          ))}
        </div>

      </main>
    </div>
  );
}
