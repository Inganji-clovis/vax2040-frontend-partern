'use client';
import { useState } from 'react';
import styles from '../page.module.css';

const IconArrow = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
);
const IconArrowDown = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
);
const IconDatabase = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg>
);
const IconBook = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
);
const IconPartnership = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
);
const IconFinance = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
);
const IconFactory = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 20V8l5-4 5 4v12"/><path d="M7 20V12h3v8"/><path d="M14 16l4-4 4 4"/><path d="M18 12v8"/></svg>
);
const IconShield = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
);
const IconTruck = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 3h15v13H1z"/><path d="M16 8h4l3 3v5h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>
);
const IconCheck = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
);
const IconUser = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
);

export default function DonatePage() {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  return (
    <div className={styles.root}>
      {/* ── NAVBAR (Same as home) ─────────────────────────────────── */}
      <nav className={styles.nav}>
        <div className={styles.navWrap}>
          <div className={styles.navBrand}>
            <img src="/logoA.png" alt="VAX2040 Logo" className={styles.navLogo} />
          </div>

          <div className={styles.navCenter}>
            {/* Home */}
            <a href="/" className={styles.navItem}>
              Home
            </a>

            {/* Platform Dropdown */}
            <div className={styles.navDropdown} onMouseEnter={() => setActiveDropdown('platform')} onMouseLeave={() => setActiveDropdown(null)}>
              <a href="/platform" className={styles.navItem}>
                Platform <IconArrowDown />
              </a>
              {activeDropdown === 'platform' && (
                <div className={styles.navDropdownMenu}>
                  <a href="/platform" className={styles.navDropdownItem}>Overview</a>
                  <a href="/platform/how-it-works" className={styles.navDropdownItem}>How VAX2040 Works</a>
                  <a href="/methodology" className={styles.navDropdownItem}>Methodology</a>
                  <a href="/platform/data-confidence" className={styles.navDropdownItem}>Data Confidence</a>
                  <a href="/platform/verification-process" className={styles.navDropdownItem}>Verification Process</a>
                </div>
              )}
            </div>

            {/* Intelligence Dropdown */}
            <div className={styles.navDropdown} onMouseEnter={() => setActiveDropdown('intelligence')} onMouseLeave={() => setActiveDropdown(null)}>
              <a href="/dashboard" className={styles.navItem}>
                Intelligence <IconArrowDown />
              </a>
              {activeDropdown === 'intelligence' && (
                <div className={styles.navDropdownMenu}>
                  <a href="/dashboard" className={styles.navDropdownItem}>Africa Dashboard</a>
                  <a href="/intelligence/medicine-production" className={styles.navDropdownItem}>Medicine Production</a>
                  <a href="/intelligence/vaccine-manufacturing" className={styles.navDropdownItem}>Vaccine Manufacturing</a>
                  <a href="/intelligence/regional-insights" className={styles.navDropdownItem}>Regional Insights</a>
                  <a href="/intelligence/manufacturing-readiness" className={styles.navDropdownItem}>Manufacturing Readiness</a>
                  <a href="/intelligence/research-gaps" className={styles.navDropdownItem}>Research Gaps</a>
                </div>
              )}
            </div>

            {/* Countries Dropdown */}
            <div className={styles.navDropdown} onMouseEnter={() => setActiveDropdown('countries')} onMouseLeave={() => setActiveDropdown(null)}>
              <a href="/countries" className={styles.navItem}>
                Countries <IconArrowDown />
              </a>
              {activeDropdown === 'countries' && (
                <div className={styles.navDropdownMenu}>
                  <a href="/countries" className={styles.navDropdownItem}>All Countries</a>
                  <a href="/countries?region=east-africa" className={styles.navDropdownItem}>East Africa</a>
                  <a href="/countries?region=west-africa" className={styles.navDropdownItem}>West Africa</a>
                  <a href="/countries?region=central-africa" className={styles.navDropdownItem}>Central Africa</a>
                  <a href="/countries?region=north-africa" className={styles.navDropdownItem}>North Africa</a>
                  <a href="/countries?region=southern-africa" className={styles.navDropdownItem}>Southern Africa</a>
                  <a href="/countries/compare" className={styles.navDropdownItem}>Compare Countries</a>
                </div>
              )}
            </div>

            {/* Research Dropdown */}
            <div className={styles.navDropdown} onMouseEnter={() => setActiveDropdown('research')} onMouseLeave={() => setActiveDropdown(null)}>
              <a href="/research" className={styles.navItem}>
                Research <IconArrowDown />
              </a>
              {activeDropdown === 'research' && (
                <div className={styles.navDropdownMenu}>
                  <a href="/research" className={styles.navDropdownItem}>Research Database</a>
                  <a href="/research/indicators" className={styles.navDropdownItem}>Indicators</a>
                  <a href="/sources" className={styles.navDropdownItem}>Source Library</a>
                  <a href="/reports" className={styles.navDropdownItem}>Reports</a>
                  <a href="/research/data-updates" className={styles.navDropdownItem}>Data Updates</a>
                </div>
              )}
            </div>

            {/* Resources Dropdown */}
            <div className={styles.navDropdown} onMouseEnter={() => setActiveDropdown('resources')} onMouseLeave={() => setActiveDropdown(null)}>
              <a href="/about" className={styles.navItem}>
                Resources <IconArrowDown />
              </a>
              {activeDropdown === 'resources' && (
                <div className={styles.navDropdownMenu}>
                  <a href="/about" className={styles.navDropdownItem}>About VAX2040</a>
                  <a href="/use-cases" className={styles.navDropdownItem}>Use Cases</a>
                  <a href="/faq" className={styles.navDropdownItem}>FAQ</a>
                  <a href="/contact" className={styles.navDropdownItem}>Contact</a>
                  <a href="/help" className={styles.navDropdownItem}>Help Center</a>
                </div>
              )}
            </div>
          </div>

          <div className={styles.navActions}>
            <a href="/donate" className={styles.navCTA} style={{ padding: '12px 20px', textDecoration: 'none' }}>
              Donate
            </a>
            <button className={styles.navSignIn} title="Sign In" aria-label="Sign In">
              <IconUser />
            </button>
          </div>
        </div>
      </nav>

      {/* ── HERO ───────────────────────────────────────────────────── */}
      <section style={{
        background: '#FAFAFA',
        padding: '80px 80px 60px',
        maxWidth: '1360px',
        margin: '0 auto',
        width: '100%'
      }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: '0.72rem',
          fontWeight: 700,
          color: '#085453',
          background: 'rgba(10, 107, 106,0.07)',
          border: '1px solid rgba(10, 107, 106,0.18)',
          padding: '5px 14px',
          borderRadius: '999px',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          marginBottom: '28px'
        }}>
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#0A6B6A' }} />
          Support VAX2040
        </div>
        <h1 style={{
          fontFamily: 'var(--font-heading)',
          fontSize: '3.4rem',
          fontWeight: 800,
          lineHeight: 1.1,
          letterSpacing: '-0.01em',
          color: '#0F172A',
          marginBottom: '20px'
        }}>
          Support VAX2040
        </h1>
        <p style={{
          fontSize: '1.1rem',
          color: '#64748B',
          lineHeight: 1.8,
          maxWidth: '700px',
          marginBottom: '16px'
        }}>
          Help strengthen Africa’s pharmaceutical sovereignty through data, evidence, institutional cooperation, and future financial support.
        </p>
        <p style={{
          fontSize: '0.95rem',
          color: '#475569',
          lineHeight: 1.7,
          maxWidth: '650px'
        }}>
          Your contribution helps VAX2040 improve the quality, coverage, and credibility of Africa medicine and vaccine self-sufficiency tracking.
        </p>
      </section>

      {/* ── Contribution Options Section ───────────────────────────── */}
      <section style={{
        background: '#fff',
        padding: '60px 80px',
        maxWidth: '1360px',
        margin: '0 auto',
        width: '100%'
      }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px' }}>
          {/* Donate Data */}
          <div style={{
            background: '#fff',
            border: '1px solid rgba(15,23,42,0.08)',
            borderRadius: '16px',
            padding: '28px',
            transition: 'all 0.25s ease',
            cursor: 'pointer'
          }} onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-4px)';
            e.currentTarget.style.boxShadow = '0 16px 40px rgba(10, 107, 106,0.15)';
          }} onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
          }}>
            <div style={{ color: '#0A6B6A', marginBottom: '18px' }}>
              <IconDatabase />
            </div>
            <h3 style={{
              fontSize: '1.15rem',
              fontWeight: 700,
              color: '#0F172A',
              marginBottom: '10px',
              fontFamily: 'var(--font-sans)'
            }}>
              Donate Data
            </h3>
            <p style={{
              fontSize: '0.92rem',
              color: '#64748B',
              lineHeight: 1.6,
              marginBottom: '22px'
            }}>
              Share structured country-level data from local manufacturers, regulatory authorities, or central medical supply institutions.
            </p>
            <a href="/donate/data" style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 20px',
              background: '#0A6B6A',
              color: '#fff',
              border: 'none',
              borderRadius: '10px',
              fontSize: '0.9rem',
              fontWeight: 700,
              cursor: 'pointer',
              textDecoration: 'none',
              transition: 'all 0.2s ease'
            }} onMouseEnter={(e) => { e.currentTarget.style.background = '#085453'; }}
               onMouseLeave={(e) => { e.currentTarget.style.background = '#0A6B6A'; }}>
              Start Data Donation <IconArrow />
            </a>
          </div>

          {/* Donate Evidence */}
          <div style={{
            background: '#fff',
            border: '1px solid rgba(15,23,42,0.08)',
            borderRadius: '16px',
            padding: '28px',
            transition: 'all 0.25s ease',
            cursor: 'pointer'
          }} onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-4px)';
            e.currentTarget.style.boxShadow = '0 16px 40px rgba(10, 107, 106,0.15)';
          }} onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
          }}>
            <div style={{ color: '#0A6B6A', marginBottom: '18px' }}>
              <IconBook />
            </div>
            <h3 style={{
              fontSize: '1.15rem',
              fontWeight: 700,
              color: '#0F172A',
              marginBottom: '10px',
              fontFamily: 'var(--font-sans)'
            }}>
              Donate Evidence
            </h3>
            <p style={{
              fontSize: '0.92rem',
              color: '#64748B',
              lineHeight: 1.6,
              marginBottom: '22px'
            }}>
              Submit reports, policy documents, procurement records, regulatory documents, research papers, or verified public sources.
            </p>
            <a href="/donate/evidence" style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 20px',
              background: '#0A6B6A',
              color: '#fff',
              border: 'none',
              borderRadius: '10px',
              fontSize: '0.9rem',
              fontWeight: 700,
              cursor: 'pointer',
              textDecoration: 'none',
              transition: 'all 0.2s ease'
            }} onMouseEnter={(e) => { e.currentTarget.style.background = '#085453'; }}
               onMouseLeave={(e) => { e.currentTarget.style.background = '#0A6B6A'; }}>
              Submit Evidence <IconArrow />
            </a>
          </div>

          {/* Strategic Partnership */}
          <div style={{
            background: '#fff',
            border: '1px solid rgba(15,23,42,0.08)',
            borderRadius: '16px',
            padding: '28px',
            transition: 'all 0.25s ease',
            cursor: 'pointer'
          }} onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-4px)';
            e.currentTarget.style.boxShadow = '0 16px 40px rgba(10, 107, 106,0.15)';
          }} onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
          }}>
            <div style={{ color: '#0A6B6A', marginBottom: '18px' }}>
              <IconPartnership />
            </div>
            <h3 style={{
              fontSize: '1.15rem',
              fontWeight: 700,
              color: '#0F172A',
              marginBottom: '10px',
              fontFamily: 'var(--font-sans)'
            }}>
              Strategic Partnership
            </h3>
            <p style={{
              fontSize: '0.92rem',
              color: '#64748B',
              lineHeight: 1.6,
              marginBottom: '22px'
            }}>
              Work with VAX2040 as an institution, manufacturer, research organization, development partner, donor, or policy stakeholder.
            </p>
            <a href="/partner-access" style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 20px',
              background: '#0A6B6A',
              color: '#fff',
              border: 'none',
              borderRadius: '10px',
              fontSize: '0.9rem',
              fontWeight: 700,
              cursor: 'pointer',
              textDecoration: 'none',
              transition: 'all 0.2s ease'
            }} onMouseEnter={(e) => { e.currentTarget.style.background = '#085453'; }}
               onMouseLeave={(e) => { e.currentTarget.style.background = '#0A6B6A'; }}>
              Request Partner Access <IconArrow />
            </a>
          </div>

          {/* Financial Support */}
          <div style={{
            background: '#fff',
            border: '1px solid rgba(15,23,42,0.08)',
            borderRadius: '16px',
            padding: '28px',
            transition: 'all 0.25s ease',
            cursor: 'pointer',
            opacity: 0.8
          }} onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-4px)';
            e.currentTarget.style.boxShadow = '0 16px 40px rgba(10, 107, 106,0.15)';
          }} onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
          }}>
            <div style={{ color: '#64748B', marginBottom: '18px' }}>
              <IconFinance />
            </div>
            <h3 style={{
              fontSize: '1.15rem',
              fontWeight: 700,
              color: '#0F172A',
              marginBottom: '10px',
              fontFamily: 'var(--font-sans)'
            }}>
              Financial Support
            </h3>
            <p style={{
              fontSize: '0.92rem',
              color: '#64748B',
              lineHeight: 1.6,
              marginBottom: '22px'
            }}>
              Support future research operations, data validation, country coverage, reporting tools, and platform development.
            </p>
            <button style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 20px',
              background: '#E2E8F0',
              color: '#64748B',
              border: 'none',
              borderRadius: '10px',
              fontSize: '0.9rem',
              fontWeight: 700,
              cursor: 'not-allowed',
              textDecoration: 'none'
            }} disabled>
              Coming Soon
            </button>
          </div>
        </div>
      </section>

      {/* ── Data Donation Preview Section ──────────────────────────── */}
      <section style={{
        background: '#FAFAFA',
        padding: '60px 80px',
        maxWidth: '1360px',
        margin: '0 auto',
        width: '100%'
      }}>
        <h2 style={{
          fontFamily: 'var(--font-heading)',
          fontSize: '2rem',
          fontWeight: 800,
          color: '#0F172A',
          marginBottom: '40px'
        }}>
          Three Core Data Donation Pathways
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
          {/* Local Pharmaceutical Manufacturer */}
          <div style={{
            background: '#fff',
            border: '1px solid rgba(15,23,42,0.08)',
            borderRadius: '16px',
            padding: '32px'
          }}>
            <div style={{
              background: 'rgba(10, 107, 106,0.1)',
              width: '56px', height: '56px',
              borderRadius: '12px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#0A6B6A',
              marginBottom: '20px'
            }}>
              <IconFactory />
            </div>
            <h3 style={{
              fontSize: '1.15rem', fontWeight: 700, color: '#0F172A',
              marginBottom: '6px', fontFamily: 'var(--font-sans)'
            }}>
              Local Pharmaceutical Manufacturer
            </h3>
            <p style={{
              fontSize: '0.85rem', fontWeight: 600, color: '#085453',
              marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.03em'
            }}>
              Target Respondent: Production Director / Plant Manager
            </p>
            <p style={{
              fontSize: '0.92rem', color: '#64748B', lineHeight: 1.6, marginBottom: '22px'
            }}>
              Submit facility profile, licensing status, production output, sourcing independence, and market/export reach.
            </p>
            <a href="/donate/data/local-manufacturer" style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 18px',
              border: '1.5px solid rgba(10, 107, 106,0.3)',
              color: '#0A6B6A',
              background: 'transparent',
              borderRadius: '10px',
              fontSize: '0.88rem',
              fontWeight: 700,
              cursor: 'pointer',
              textDecoration: 'none',
              transition: 'all 0.2s ease'
            }} onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(10, 107, 106,0.08)';
              e.currentTarget.style.borderColor = '#0A6B6A';
            }} onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.borderColor = 'rgba(10, 107, 106,0.3)';
            }}>
              Open Manufacturer Form <IconArrow />
            </a>
          </div>

          {/* National Regulatory Authority */}
          <div style={{
            background: '#fff',
            border: '1px solid rgba(15,23,42,0.08)',
            borderRadius: '16px',
            padding: '32px'
          }}>
            <div style={{
              background: 'rgba(10, 107, 106,0.1)',
              width: '56px', height: '56px',
              borderRadius: '12px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#0A6B6A',
              marginBottom: '20px'
            }}>
              <IconShield />
            </div>
            <h3 style={{
              fontSize: '1.15rem', fontWeight: 700, color: '#0F172A',
              marginBottom: '6px', fontFamily: 'var(--font-sans)'
            }}>
              National Regulatory Authority
            </h3>
            <p style={{
              fontSize: '0.85rem', fontWeight: 600, color: '#085453',
              marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.03em'
            }}>
              Target Respondent: Regulatory Officer / Data Analyst
            </p>
            <p style={{
              fontSize: '0.92rem', color: '#64748B', lineHeight: 1.6, marginBottom: '22px'
            }}>
              Submit regulatory maturity, marketing authorization data, local manufacturing incentives, inspections, and oversight information.
            </p>
            <a href="/donate/data/regulatory-authority" style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 18px',
              border: '1.5px solid rgba(10, 107, 106,0.3)',
              color: '#0A6B6A',
              background: 'transparent',
              borderRadius: '10px',
              fontSize: '0.88rem',
              fontWeight: 700,
              cursor: 'pointer',
              textDecoration: 'none',
              transition: 'all 0.2s ease'
            }} onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(10, 107, 106,0.08)';
              e.currentTarget.style.borderColor = '#0A6B6A';
            }} onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.borderColor = 'rgba(10, 107, 106,0.3)';
            }}>
              Open NRA Form <IconArrow />
            </a>
          </div>

          {/* Central Medical Supply */}
          <div style={{
            background: '#fff',
            border: '1px solid rgba(15,23,42,0.08)',
            borderRadius: '16px',
            padding: '32px'
          }}>
            <div style={{
              background: 'rgba(10, 107, 106,0.1)',
              width: '56px', height: '56px',
              borderRadius: '12px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#0A6B6A',
              marginBottom: '20px'
            }}>
              <IconTruck />
            </div>
            <h3 style={{
              fontSize: '1.15rem', fontWeight: 700, color: '#0F172A',
              marginBottom: '6px', fontFamily: 'var(--font-sans)'
            }}>
              Central Medical Supply
            </h3>
            <p style={{
              fontSize: '0.85rem', fontWeight: 600, color: '#085453',
              marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.03em'
            }}>
              Target Respondent: Procurement Director / Logistics Manager
            </p>
            <p style={{
              fontSize: '0.92rem', color: '#64748B', lineHeight: 1.6, marginBottom: '22px'
            }}>
              Submit procurement portfolio data, local/import sourcing split, product category breakdown, tender preferences, and supply chain reliability.
            </p>
            <a href="/donate/data/central-medical-supply" style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 18px',
              border: '1.5px solid rgba(10, 107, 106,0.3)',
              color: '#0A6B6A',
              background: 'transparent',
              borderRadius: '10px',
              fontSize: '0.88rem',
              fontWeight: 700,
              cursor: 'pointer',
              textDecoration: 'none',
              transition: 'all 0.2s ease'
            }} onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(10, 107, 106,0.08)';
              e.currentTarget.style.borderColor = '#0A6B6A';
            }} onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.borderColor = 'rgba(10, 107, 106,0.3)';
            }}>
              Open Medical Supply Form <IconArrow />
            </a>
          </div>
        </div>
      </section>

      {/* ── Trust and Review Section ───────────────────────────────── */}
      <section style={{
        background: '#fff',
        padding: '60px 80px',
        maxWidth: '1360px',
        margin: '0 auto',
        width: '100%'
      }}>
        <h2 style={{
          fontFamily: 'var(--font-heading)',
          fontSize: '2rem',
          fontWeight: 800,
          color: '#0F172A',
          marginBottom: '32px'
        }}>
          How submissions are handled
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
          {[
            { text: 'Submissions are reviewed by VAX2040 Data Curators.' },
            { text: 'Submitted data is not automatically published.' },
            { text: 'Evidence and source quality are checked before being used in public analysis.' },
            { text: 'Sensitive or institutional data can be marked for restricted review.' },
            { text: 'Public dashboards should only display verified or clearly labeled information.' }
          ].map((item, idx) => (
            <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', padding: '16px 0' }}>
              <div style={{
                background: 'rgba(10, 107, 106,0.1)',
                color: '#0A6B6A',
                width: '24px', height: '24px',
                borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
                marginTop: '2px'
              }}>
                <IconCheck />
              </div>
              <p style={{
                fontSize: '0.98rem',
                color: '#374151',
                lineHeight: 1.6,
                margin: 0
              }}>
                {item.text}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Call to Action Section ─────────────────────────────────── */}
      <section style={{
        background: 'linear-gradient(135deg, #0A6B6A 0%, #085453 100%)',
        padding: '70px 80px',
        maxWidth: '1360px',
        margin: '0 auto',
        width: '100%',
        borderRadius: '24px',
        marginBottom: '80px',
        marginTop: '20px'
      }}>
        <h2 style={{
          fontFamily: 'var(--font-heading)',
          fontSize: '2.2rem',
          fontWeight: 800,
          color: '#fff',
          marginBottom: '32px',
          textAlign: 'center'
        }}>
          Ready to support the VAX2040 mission?
        </h2>

        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '16px',
          flexWrap: 'wrap'
        }}>
          <a href="/donate/data" style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '14px 28px',
            background: '#fff',
            color: '#0A6B6A',
            border: 'none',
            borderRadius: '12px',
            fontSize: '0.98rem',
            fontWeight: 700,
            cursor: 'pointer',
            textDecoration: 'none',
            transition: 'all 0.2s ease',
            boxShadow: '0 8px 24px rgba(0,0,0,0.2)'
          }} onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,0,0,0.25)'; }}
             onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.2)'; }}>
            Donate Data <IconArrow />
          </a>

          <a href="/donate/evidence" style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '14px 28px',
            background: 'rgba(255,255,255,0.15)',
            color: '#fff',
            border: '1.5px solid rgba(255,255,255,0.5)',
            borderRadius: '12px',
            fontSize: '0.98rem',
            fontWeight: 700,
            cursor: 'pointer',
            textDecoration: 'none',
            transition: 'all 0.2s ease'
          }} onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.25)'; }}
             onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.15)'; }}>
            Submit Evidence <IconArrow />
          </a>

          <a href="/partner-access" style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '14px 28px',
            background: 'rgba(255,255,255,0.15)',
            color: '#fff',
            border: '1.5px solid rgba(255,255,255,0.5)',
            borderRadius: '12px',
            fontSize: '0.98rem',
            fontWeight: 700,
            cursor: 'pointer',
            textDecoration: 'none',
            transition: 'all 0.2s ease'
          }} onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.25)'; }}
             onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.15)'; }}>
            Request Partner Access <IconArrow />
          </a>
        </div>
      </section>
    </div>
  );
}
