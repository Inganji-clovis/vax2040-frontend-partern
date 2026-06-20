'use client';
import { useState, useEffect } from 'react';
import styles from './page.module.css';
import LoginView, { PartnerUser } from '../components/LoginView';
import DataEntryView from '../components/DataEntryView';
import TrendChart from '../components/TrendChart';
import { getWorldBankData, getWHOData, getOverrides, createOverride, updateOverride, deleteOverride } from '../lib/api';
import { DashboardPayload, WHOIndicatorPayload, ManualEntry } from '../lib/types';
import { COUNTRIES } from '../lib/constants';
import AnimatedAfricaMap from '../components/AnimatedAfricaMap';
import {
  IconArrow,
  IconArrowDown,
  IconShield,
  IconCheck,
  IconUser,
  IconLogOut,
  IconUpload
} from '../lib/icons';

function fmtVal(val: number | null) {
  if (val === null || val === 0) return 'N/A';
  if (val >= 1_000_000_000) return `$${(val / 1_000_000_000).toFixed(1)}B`;
  if (val >= 1_000_000) return `$${(val / 1_000_000).toFixed(1)}M`;
  return `$${val.toLocaleString()}`;
}

export default function PublicPage() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'entry'>('dashboard');
  const [trendsTab, setTrendsTab] = useState<'imports' | 'production'>('imports');
  const [focusCountry, setFocusCountry] = useState('RWA');
  const [partnerUser, setPartnerUser] = useState<PartnerUser | null>(null);
  const [showLogin, setShowLogin] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [worldbankData, setWorldbankData] = useState<DashboardPayload | null>(null);
  const [manualEntries, setManualEntries] = useState<ManualEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  async function refreshData() {
    setLoading(true);
    try {
      const opts = { partnerOrg: partnerUser?.org || undefined };
      const [wb, , ovs] = await Promise.all([getWorldBankData(opts), getWHOData(opts), getOverrides(opts)]);
      setWorldbankData(wb);
      setManualEntries(ovs);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }

  useEffect(() => {
    setIsMounted(true);
    const stored = localStorage.getItem('vax2040_partner_user');
    if (stored) { try { setPartnerUser(JSON.parse(stored)); } catch {} }
  }, []);

  useEffect(() => { if (isMounted) refreshData(); }, [partnerUser, isMounted]);

  function handleLoginSuccess(user: PartnerUser) {
    setPartnerUser(user);
    localStorage.setItem('vax2040_partner_user', JSON.stringify(user));
    setShowLogin(false);
    setActiveTab('entry');
  }
  function handleLogout() {
    setPartnerUser(null);
    localStorage.removeItem('vax2040_partner_user');
    setActiveTab('dashboard');
  }
  async function handleAddEntries(newEntries: Omit<ManualEntry, 'id' | 'timestamp'>[]) {
    try { await createOverride(newEntries, { partnerOrg: partnerUser?.org }); await refreshData(); } catch { alert('Failed to save.'); }
  }
  async function handleUpdateEntry(updated: ManualEntry) {
    try { await updateOverride(updated.id, updated, { partnerOrg: partnerUser?.org }); await refreshData(); } catch { alert('Failed to update.'); }
  }
  async function handleDeleteEntry(id: string) {
    try { await deleteOverride(id, { partnerOrg: partnerUser?.org }); await refreshData(); } catch { alert('Failed to delete.'); }
  }

  function getMetrics(code: string) {
    if (!worldbankData) return { vLocal: 0, vImport: 0, vLocalPct: 0, mLocal: 0, mImport: 0, mLocalPct: 0 };
    const getVal = (payload: any) => {
      if (!payload) return 0;
      const pts = payload.data.filter((d: any) => d.countryCode === code && d.value !== null).sort((a: any, b: any) => Number(b.year) - Number(a.year));
      return pts[0]?.value || 0;
    };
    const vL = getVal(worldbankData.vaccineLocalProduction);
    const vI = getVal(worldbankData.vaccineImports);
    const mL = getVal(worldbankData.medicineLocalProduction);
    const mI = getVal(worldbankData.medicineImports);
    const tV = vL + vI, tM = mL + mI;
    return {
      vLocal: vL, vImport: vI, vLocalPct: tV > 0 ? (vL / tV) * 100 : 0,
      mLocal: mL, mImport: mI, mLocalPct: tM > 0 ? (mL / tM) * 100 : 0,
    };
  }

  const focusMetrics = getMetrics(focusCountry);
  const focusCountryObj = COUNTRIES.find(c => c.code === focusCountry) || COUNTRIES[0];
  const approvedEntries = manualEntries.filter(m => m.status === 'approved');

  if (!isMounted) return (
    <div className={styles.splash}>
      <div className={styles.splashSpinner} />
    </div>
  );

  return (
    <div className={styles.root}>

      {/* ── NAVBAR ──────────────────────────────────────────── */}
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

            {/* Partner Portal (keep existing functionality) */}
            {partnerUser && (
              <div className={styles.navDropdown} onMouseEnter={() => setActiveDropdown('partner')} onMouseLeave={() => setActiveDropdown(null)}>
                <button className={`${styles.navItem} ${activeTab === 'entry' ? styles.navItemActive : ''}`} onClick={() => setActiveTab('entry')}>
                  Partner Portal <IconArrowDown />
                </button>
                {activeDropdown === 'partner' && (
                  <div className={styles.navDropdownMenu}>
                    <button className={styles.navDropdownItem} onClick={() => setActiveTab('entry')}>Submit Data</button>
                    <a href="#" className={styles.navDropdownItem}>My Submissions</a>
                    <a href="#" className={styles.navDropdownItem}>Dashboard</a>
                    <a href="#" className={styles.navDropdownItem}>Settings</a>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className={styles.navActions}>
            {partnerUser ? (
              <div className={styles.navUser}>
                <div className={styles.navUserAvatar}>{partnerUser.org[0]}</div>
                <span className={styles.navUserName}>{partnerUser.org.split(' ')[0]}</span>
                <button className={styles.navSignOut} onClick={handleLogout} title="Sign out"><IconLogOut /></button>
              </div>
            ) : (
              <button className={styles.navSignIn} onClick={() => setShowLogin(true)} title="Sign In" aria-label="Sign In" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                Login <IconUser />
              </button>
            )}
          </div>
        </div>
      </nav>

      {loading && <div className={styles.loadBar}><div className={styles.loadBarFill} /></div>}

      <main>
        {activeTab === 'dashboard' && (
          <>
            {/* ── HERO ──────────────────────────────────────── */}
            <section className={styles.hero}>
              {/* Left: Text content */}
              <div className={styles.heroLeft}>
                <div className={styles.heroPill}>
                  <span className={styles.heroPillDot} />
                  Independent Research Observatory
                </div>

                <h1 className={styles.heroH1}>
                  Tracking Africa's Progress<br />
                  Toward <span className={styles.heroAccent}>Medicine and Vaccine</span><br />Self-Sufficiency
                </h1>

                <p className={styles.heroP}>
                  VAX2040 is an independent intelligence and research platform tracking Africa's journey toward achieving 60% local manufacturing of medicines and vaccines by 2040. Explore country-level intelligence on manufacturing capacity, regulatory maturity, procurement patterns, supply chain readiness, and evidence-backed pharmaceutical sovereignty indicators.
                </p>

                <div className={styles.heroActions}>
                  <a href="/dashboard" className={styles.heroBtnPrimary} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                    Explore Dashboard <IconArrow />
                  </a>
                  <a href="/countries" className={styles.heroBtnSecondary} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                    View Countries
                  </a>
                  <a href="/methodology" className={styles.heroBtnSecondary} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                    Read Methodology
                  </a>
                </div>
              </div>

              {/* Right: Animated Africa Map */}
              <div className={styles.heroImagePanel}>
                <AnimatedAfricaMap />
              </div>
            </section>

            {/* ── Quick Trust Metrics ─────────────────────────────── */}
            <section className={styles.section}>
              <span className={styles.eyebrow}>Quick Stats</span>
              <h2 className={styles.sectionTitle}>Africa Pharmaceutical Sovereignty Intelligence at a Glance</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginTop: '24px' }}>
                {[
                  { value: '54+', label: 'Countries Tracked' },
                  { value: '3', label: 'Data Collection Pathways' },
                  { value: '4+', label: 'Evidence Sources' },
                  { value: 'Target Coverage', label: 'Local Manufacturers Mapped' },
                  { value: 'Target Coverage', label: 'Regulatory Authorities Covered' },
                  { value: 'Target Coverage', label: 'Central Medical Supply Institutions Included' }
                ].map((stat, idx) => (
                  <div key={idx} style={{ background: 'white', border: '1px solid rgba(15,23,42,0.07)', borderRadius: '12px', padding: '20px', boxShadow: '0 2px 8px rgba(15,23,42,0.04)' }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1e88e5', marginBottom: '4px' }}>{stat.value}</div>
                    <div style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 500 }}>{stat.label}</div>
                  </div>
                ))}
              </div>
            </section>

            {/* ── Why VAX2040 Matters ──────────────────────────────────── */}
            <section className={styles.section}>
              <span className={styles.eyebrow}>Why It Matters</span>
              <h2 className={styles.sectionTitle}>Why VAX2040 Matters</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px', marginTop: '32px' }}>
                {[
                  { 
                    title: 'Import Dependency Visibility', 
                    desc: 'Many African countries still rely heavily on imported medicines, vaccines, active pharmaceutical ingredients, and packaging materials. VAX2040 helps make this dependency measurable.',
                    image: '/images/pharma-logistics.svg',
                    alt: 'Pharmaceutical import logistics and cargo'
                  },
                  { 
                    title: 'Local Production Readiness', 
                    desc: 'Manufacturing capacity differs across countries. VAX2040 tracks facility readiness, production output, sourcing independence, and market reach.',
                    image: '/images/pharma-manufacturing.svg',
                    alt: 'Pharmaceutical cleanroom manufacturing'
                  },
                  { 
                    title: 'Regulatory Efficiency', 
                    desc: 'Regulatory maturity, marketing authorization timelines, fast-track pathways, and local facility inspections all influence pharmaceutical sovereignty.',
                    image: '/images/regulatory-review.svg',
                    alt: 'Regulatory document review and quality inspection'
                  },
                  { 
                    title: 'Procurement and Supply Chain Signals', 
                    desc: 'Public procurement behavior, local sourcing percentages, lead times, tender preferences, and stockout patterns show whether local manufacturing is being supported.',
                    image: '/images/medical-warehouse.svg',
                    alt: 'Medical warehouse inventory and supply chain'
                  }
                ].map((item, idx) => (
                  <div key={idx} style={{ background: 'white', border: '1px solid rgba(15,23,42,0.07)', borderRadius: '14px', overflow: 'hidden', boxShadow: '0 4px 16px rgba(15,23,42,0.08)', display: 'flex', flexDirection: 'column', height: '100%' }}>
                    <div style={{ width: '100%', height: '200px', overflow: 'hidden', flexShrink: 0 }}>
                      <img 
                        src={item.image} 
                        alt={item.alt}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                      />
                    </div>
                    <div style={{ padding: '24px', flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                      <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a', marginBottom: '10px' }}>{item.title}</h3>
                      <p style={{ fontSize: '0.875rem', color: '#64748b', lineHeight: '1.7', marginBottom: 0, flexGrow: 1 }}>{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* ── METRICS BAND ─────────────────────────────── */}
            <section className={styles.metricsBand} id="metrics">
              <div className={styles.metricsBandInner}>

                {/* Country selector pills */}
                <div className={styles.metricsCountries}>
                  <span className={styles.metricsCountriesLabel}>Select country</span>
                  <div className={styles.pillsRowDark}>
                    {COUNTRIES.map(c => {
                      const m = getMetrics(c.code);
                      return (
                        <button
                          key={c.code}
                          className={`${styles.pillDark} ${focusCountry === c.code ? styles.pillDarkActive : ''}`}
                          onClick={() => setFocusCountry(c.code)}
                        >
                          <span>{c.flag}</span>
                          <span>{c.code}</span>
                          <span className={styles.pillDarkPct}>{m.vLocalPct.toFixed(0)}%</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Divider */}
                <div className={styles.metricsVDivider} />

                {/* Ring */}
                <div className={styles.metricsRing}>
                  <div className={styles.ringWrap} style={{ width: 100, height: 100 }}>
                    <svg width="100" height="100" viewBox="0 0 100 100" style={{ transform: 'rotate(-90deg)' }}>
                      <circle cx="50" cy="50" r="40" strokeWidth="7" fill="transparent" stroke="rgba(30,136,229,0.15)" />
                      <circle
                        cx="50" cy="50" r="40" strokeWidth="8" fill="transparent"
                        stroke="#1e88e5"
                        strokeLinecap="round"
                        strokeDasharray={`${2 * Math.PI * 40}`}
                        strokeDashoffset={`${2 * Math.PI * 40 * (1 - Math.min(60, focusMetrics.vLocalPct) / 100)}`}
                        style={{ transition: 'stroke-dashoffset 0.8s ease' }}
                      />
                    </svg>
                    <div className={styles.ringInner}>
                      <span className={styles.ringNumDark}>{focusMetrics.vLocalPct.toFixed(1)}%</span>
                    </div>
                  </div>
                  <div className={styles.metricsRingMeta}>
                    <span className={styles.metricsRingTitle}>Local Share</span>
                    <span className={styles.metricsRingTarget}>Target <strong>60%</strong> · 2040</span>
                    <span className={styles.metricsRingCountry}>{focusCountryObj.flag} {focusCountryObj.name}</span>
                  </div>
                </div>

                {/* Divider */}
                <div className={styles.metricsVDivider} />

                {/* Stats */}
                <div className={styles.metricsStats}>
                  <div className={styles.metricsStat}>
                    <span className={styles.metricsStatVal}>{fmtVal(focusMetrics.vLocal)}</span>
                    <span className={styles.metricsStatLabel}>Vaccine Local Production</span>
                  </div>
                  <div className={styles.metricsStatDivider} />
                  <div className={styles.metricsStat}>
                    <span className={styles.metricsStatVal}>{fmtVal(focusMetrics.vImport)}</span>
                    <span className={styles.metricsStatLabel}>Vaccine Imports</span>
                  </div>
                  <div className={styles.metricsStatDivider} />
                  <div className={styles.metricsStat}>
                    <span className={styles.metricsStatVal}>{fmtVal(focusMetrics.mLocal)}</span>
                    <span className={styles.metricsStatLabel}>Medicine Local Production</span>
                  </div>
                  <div className={styles.metricsStatDivider} />
                  <div className={styles.metricsStat}>
                    <span className={styles.metricsStatVal}>{fmtVal(focusMetrics.mImport)}</span>
                    <span className={styles.metricsStatLabel}>Medicine Imports</span>
                  </div>
                </div>
              </div>
            </section>

            {/* ── SECTION DIVIDER ─────────────────────────── */}
            <div className={styles.sectionDivider} id="trends" />

            {/* ── TRENDS CHARTS ───────────────────────────── */}
            {worldbankData && (
              <section className={styles.section}>
                <div className={styles.sectionHead}>
                  <div>
                    <span className={styles.eyebrow}>Live Data · 2014–2023</span>
                    <h2 className={styles.sectionTitle}>Pharmaceutical Trade Trends</h2>
                    <p className={styles.sectionSub}>
                      Comparing local manufacturing capacity against import dependency across all tracked nations. Click a country pill above to highlight its trend line.
                    </p>
                  </div>
                  <div className={styles.tabGroup}>
                    <button className={`${styles.tab} ${trendsTab === 'imports' ? styles.tabActive : ''}`} onClick={() => setTrendsTab('imports')}>
                      Imports
                    </button>
                    <button className={`${styles.tab} ${trendsTab === 'production' ? styles.tabActive : ''}`} onClick={() => setTrendsTab('production')}>
                      Local Production
                    </button>
                  </div>
                </div>

                <div className={styles.chartsRow}>
                  {trendsTab === 'imports' ? (
                    <>
                      <TrendChart payload={worldbankData.vaccineImports} title="Vaccine Imports (USD)" focusCountry={focusCountry} />
                      <TrendChart payload={worldbankData.medicineImports} title="Medicine Imports (USD)" focusCountry={focusCountry} />
                    </>
                  ) : (
                    <>
                      <TrendChart payload={worldbankData.vaccineLocalProduction} title="Vaccine Local Production (USD)" focusCountry={focusCountry} />
                      <TrendChart payload={worldbankData.medicineLocalProduction} title="Medicine Local Production (USD)" focusCountry={focusCountry} />
                    </>
                  )}
                </div>
              </section>
            )}

            {/* ── ABOUT + CTA BLOCK ────────────────────────── */}
            <section className={styles.section} id="about">
              <div className={styles.splitSection}>
                <div className={styles.splitLeft}>
                  <span className={styles.eyebrow}>About the Initiative</span>
                  <h2 className={styles.sectionTitle}>Transparent Data.<br />Stronger Pharma Sovereignty.</h2>
                  <p className={styles.sectionSub}>
                    VAX2040 aggregates pharmaceutical trade and production data from global authoritative sources, blended with verified submissions from trusted VAX2040 partners and licensed manufacturers. Our mission is to provide African governments and industry partners with accurate intelligence to drive the AU's 60% local production goal.
                  </p>
                  <ul className={styles.featureList}>
                    <li><IconCheck /> World Bank Open Data — import/export baselines</li>
                    <li><IconCheck /> WHO GHO — health workforce and expenditure</li>
                    <li><IconCheck /> UN Comtrade — HS 3002.20 / 3004 commodity flows</li>
                    <li><IconCheck /> Partner submissions — verified factory-level overrides</li>
                  </ul>
                </div>
                <div className={styles.splitRight}>
                  <div className={styles.ctaCard}>
                    <div className={styles.ctaCardIcon}>
                      <IconUpload />
                    </div>
                    <h3 className={styles.ctaCardTitle}>Are you a pharmaceutical manufacturer or partner?</h3>
                    <p className={styles.ctaCardDesc}>
                      Submit your facility's production data to be verified and blended into the public dataset — contributing to the AU's pharmaceutical intelligence base.
                    </p>
                    <button className={styles.ctaCardBtn} onClick={() => setShowLogin(true)}>
                      Request Partner Access <IconArrow />
                    </button>
                    <div className={styles.ctaCardNote}>
                      <IconShield /> Submissions reviewed by VAX2040 Data Curators within 48h
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* ── What the Platform Tracks ───────────────────────── */}
            <section className={styles.section}>
              <span className={styles.eyebrow}>What We Track</span>
              <h2 className={styles.sectionTitle}>What the Platform Tracks</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', marginTop: '32px' }}>
                {[
                  { 
                    title: 'Medicine Manufacturing Capacity', 
                    desc: 'Tracks installed capacity, output, and operational status of medicine production facilities.',
                    image: '/images/pharma-manufacturing.svg',
                    alt: 'Pharmaceutical tablet and capsule production line'
                  },
                  { 
                    title: 'Vaccine Production Readiness', 
                    desc: 'Assesses facility readiness, cold chain capacity, and vaccine manufacturing capabilities.',
                    image: '/images/pharma-manufacturing.svg',
                    alt: 'Vaccine vial production and sterile manufacturing'
                  },
                  { 
                    title: 'Regulatory Maturity', 
                    desc: 'Evaluates WHO GBT maturity levels, marketing authorization timelines, and inspection frameworks.',
                    image: '/images/regulatory-review.svg',
                    alt: 'Regulatory document review and quality assurance'
                  },
                  { 
                    title: 'Procurement and Supply Chain', 
                    desc: 'Monitors public procurement behavior, local sourcing, lead times, and stockout patterns.',
                    image: '/images/medical-warehouse.svg',
                    alt: 'Medical warehouse inventory and logistics'
                  },
                  { 
                    title: 'Market Reach and Export Potential', 
                    desc: 'Maps domestic and African export market access for locally produced pharmaceuticals.',
                    image: '/images/pharma-logistics.svg',
                    alt: 'Pharmaceutical product distribution and export'
                  },
                  { 
                    title: 'Policy and Investment Signals', 
                    desc: 'Tracks policy incentives, investment flows, and strategic partnerships in the sector.',
                    image: '/images/regulatory-review.svg',
                    alt: 'Policy and investment strategy meeting'
                  }
                ].map((item, idx) => (
                  <div key={idx} style={{ background: 'white', border: '1px solid rgba(15,23,42,0.07)', borderRadius: '14px', overflow: 'hidden', boxShadow: '0 4px 16px rgba(15,23,42,0.08)', display: 'flex', flexDirection: 'column', height: '100%' }}>
                    <div style={{ width: '100%', height: '180px', overflow: 'hidden', flexShrink: 0 }}>
                      <img 
                        src={item.image}
                        alt={item.alt}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                      />
                    </div>
                    <div style={{ padding: '22px', flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                      <h3 style={{ fontSize: '0.98rem', fontWeight: 700, color: '#0f172a', marginBottom: '10px' }}>{item.title}</h3>
                      <p style={{ fontSize: '0.85rem', color: '#64748b', lineHeight: '1.65', marginBottom: '16px', flexGrow: 1 }}>{item.desc}</p>
                      <a href="/dashboard" style={{ fontSize: '0.83rem', fontWeight: 600, color: '#1e88e5', textDecoration: 'none' }}>Explore →</a>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* ── Core Data Collection and Evidence Pathways ───────────────────────── */}
            <section className={styles.section}>
              <span className={styles.eyebrow}>Data Collection</span>
              <h2 className={styles.sectionTitle}>Core Data Collection and Evidence Pathways</h2>
              <p className={styles.sectionSub}>VAX2040 structures country-level intelligence through four key institutional data and evidence pathways.</p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px', marginTop: '32px' }}>
                {[
                  {
                    title: 'Local Pharmaceutical Manufacturer',
                    target: 'Target Respondent: Production Director / Plant Manager',
                    tracks: [
                      'Facility type',
                      'GMP certification status',
                      'installed production capacity',
                      'capacity utilization',
                      'medicines and vaccines produced',
                      'API sourcing within Africa',
                      'packaging sourcing within Africa',
                      'domestic/public/private market reach',
                      'African export reach'
                    ],
                    button: 'Open Manufacturer Form',
                    href: '/donate/data/local-manufacturer',
                    image: '/images/pharma-manufacturing.svg',
                    alt: 'Pharmaceutical manufacturing facility'
                  },
                  {
                    title: 'National Regulatory Authority',
                    target: 'Target Respondent: Regulatory Officer / Data Analyst',
                    tracks: [
                      'WHO GBT maturity level',
                      'AMA ratification status',
                      'marketing authorizations',
                      'domestic vs foreign product approvals',
                      'registration timelines',
                      'fast-track local product pathways',
                      'inspections',
                      'non-compliance notices'
                    ],
                    button: 'Open NRA Form',
                    href: '/donate/data/regulatory-authority',
                    image: '/images/regulatory-review.svg',
                    alt: 'Regulatory document review and inspection'
                  },
                  {
                    title: 'Central Medical Supply',
                    target: 'Target Respondent: Procurement Director / Logistics Manager',
                    tracks: [
                      'annual pharmaceutical procurement budget',
                      'local vs imported procurement split',
                      'essential medicines sourcing',
                      'vaccine sourcing',
                      'maternal and child health sourcing',
                      'local and international lead times',
                      'stockout frequency',
                      'local tender price preferences'
                    ],
                    button: 'Open Medical Supply Form',
                    href: '/donate/data/central-medical-supply',
                    image: '/images/medical-warehouse.svg',
                    alt: 'Medical warehouse logistics'
                  },
                  {
                    title: 'Evidence and Source Validation',
                    target: 'Target Respondent: Researcher, Analyst, or Institutional Partner',
                    tracks: [
                      'Research publications',
                      'Official government reports',
                      'Verified institutional data',
                      'Industry intelligence',
                      'Academic studies',
                      'Third-party assessments',
                      'Media and analyst reports',
                      'Historical trend data'
                    ],
                    button: 'Submit Evidence',
                    href: '/donate/evidence',
                    image: '/images/regulatory-review.svg',
                    alt: 'Research evidence and document review'
                  }
                ].map((card, idx) => (
                  <div key={idx} style={{ background: 'white', border: '1px solid rgba(15,23,42,0.07)', borderRadius: '14px', overflow: 'hidden', boxShadow: '0 4px 16px rgba(15,23,42,0.08)', display: 'flex', flexDirection: 'column', height: '100%' }}>
                    <div style={{ width: '100%', height: '170px', overflow: 'hidden' }}>
                      <img 
                        src={card.image} 
                        alt={card.alt}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                      />
                    </div>
                    <div style={{ padding: '24px', flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                      <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a', marginBottom: '8px' }}>{card.title}</h3>
                      <p style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '16px' }}>{card.target}</p>
                      <div style={{ marginBottom: '20px', flexGrow: 1 }}>
                        <div style={{ fontSize: '0.83rem', fontWeight: 600, color: '#0f172a', marginBottom: '8px' }}>Tracks:</div>
                        <ul style={{ paddingLeft: '18px', margin: 0 }}>
                          {card.tracks.map((t, i) => (
                            <li key={i} style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '4px' }}>{t}</li>
                          ))}
                        </ul>
                      </div>
                      <a href={card.href} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '10px 18px', background: 'linear-gradient(135deg, #1e88e5 0%, #1565c0 100%)', color: 'white', borderRadius: '10px', textDecoration: 'none', fontSize: '0.85rem', fontWeight: 600, width: 'fit-content' }}>
                        {card.button} <IconArrow />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* ── Platform Intelligence Preview ───────────────────────── */}
            <section className={styles.section}>
              <span className={styles.eyebrow}>Platform Overview</span>
              <h2 className={styles.sectionTitle}>Built as a Pharmaceutical Sovereignty Intelligence Platform</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginTop: '24px' }}>
                {[
                  { title: 'Africa Dashboard', desc: 'Continent-wide overview of manufacturing and regulatory progress.' },
                  { title: 'Country Profiles', desc: 'Detailed, structured intelligence per African nation.' },
                  { title: 'Source Library', desc: 'Transparent repository of data sources and verification status.' },
                  { title: 'Reports', desc: 'Research outputs and intelligence briefs.' },
                  { title: 'Methodology', desc: 'How data is collected, reviewed, and published.' },
                  { title: 'Evidence Submissions', desc: 'Portal for partners to submit verified data.' }
                ].map((item, idx) => (
                  <div key={idx} style={{ background: 'white', border: '1px solid rgba(15,23,42,0.07)', borderRadius: '12px', padding: '20px', boxShadow: '0 2px 8px rgba(15,23,42,0.04)' }}>
                    <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0f172a', marginBottom: '6px' }}>{item.title}</h3>
                    <p style={{ fontSize: '0.8rem', color: '#64748b', lineHeight: '1.5' }}>{item.desc}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* ── Methodology and Verification ──────────────────────────────── */}
            <section className={styles.section}>
              <span className={styles.eyebrow}>Data Quality</span>
              <h2 className={styles.sectionTitle}>How the Data Is Reviewed</h2>
              <p className={styles.sectionSub}>Submitted information is reviewed by VAX2040 Data Curators before it is used in public intelligence. Data should be classified by verification status, evidence quality, and confidence level.</p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '12px', marginTop: '24px' }}>
                {[
                  { step: '1', title: 'Data Collection' },
                  { step: '2', title: 'Evidence Submission' },
                  { step: '3', title: 'Curator Review' },
                  { step: '4', title: 'Verification and Classification' },
                  { step: '5', title: 'Public Intelligence Display' }
                ].map((item, idx) => (
                  <div key={idx} style={{ background: 'white', border: '1px solid rgba(15,23,42,0.07)', borderRadius: '10px', padding: '16px', textAlign: 'center', boxShadow: '0 2px 8px rgba(15,23,42,0.04)' }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1e88e5', marginBottom: '4px' }}>{item.step}</div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#0f172a' }}>{item.title}</div>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: '24px', textAlign: 'center' }}>
                <a href="/methodology" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '10px 20px', background: 'linear-gradient(135deg, #1e88e5 0%, #1565c0 100%)', color: 'white', borderRadius: '10px', textDecoration: 'none', fontSize: '0.85rem', fontWeight: 600 }}>
                  Read Methodology <IconArrow />
                </a>
              </div>
            </section>

            {/* ── Who Uses VAX2040 ──────────────────────────────────── */}
            <section className={styles.section}>
              <span className={styles.eyebrow}>Users</span>
              <h2 className={styles.sectionTitle}>Designed for Decision-Makers Across the Pharmaceutical Ecosystem</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px', marginTop: '32px' }}>
                {[
                  { 
                    title: 'Policymakers', 
                    benefit: 'Track national readiness, regulatory bottlenecks, procurement behavior, and manufacturing gaps.',
                    image: '/images/regulatory-review.svg',
                    alt: 'Public health policy planning meeting'
                  },
                  { 
                    title: 'Manufacturers', 
                    benefit: 'Share facility capabilities, certification status, production output, and market reach.',
                    image: '/images/pharma-manufacturing.svg',
                    alt: 'Pharmaceutical manufacturing production line'
                  },
                  { 
                    title: 'Regulators', 
                    benefit: 'Contribute regulatory maturity data, inspection records, and approval timelines.',
                    image: '/images/regulatory-review.svg',
                    alt: 'Regulatory document review and quality assurance'
                  },
                  { 
                    title: 'Central Medical Supply Institutions', 
                    benefit: 'Share procurement patterns, lead times, and stockout data.',
                    image: '/images/medical-warehouse.svg',
                    alt: 'Medical warehouse and inventory'
                  },
                  { 
                    title: 'Researchers', 
                    benefit: 'Use structured country-level evidence for analysis, reports, and policy research.',
                    image: '/images/regulatory-review.svg',
                    alt: 'Research data analysis'
                  },
                  { 
                    title: 'Academic Institutions', 
                    benefit: 'Leverage data for public health and pharmaceutical policy studies.',
                    image: '/images/regulatory-review.svg',
                    alt: 'University research and study'
                  },
                  { 
                    title: 'Development Partners', 
                    benefit: 'Align investments with measurable sovereignty indicators.',
                    image: '/images/pharma-logistics.svg',
                    alt: 'Development partnership meeting'
                  },
                  { 
                    title: 'Donors, Investors, and Media', 
                    benefit: 'Track impact and identify strategic investment opportunities.',
                    image: '/images/regulatory-review.svg',
                    alt: 'Investment and briefing session'
                  }
                ].map((item, idx) => (
                  <div key={idx} style={{ background: 'white', border: '1px solid rgba(15,23,42,0.07)', borderRadius: '14px', overflow: 'hidden', boxShadow: '0 4px 16px rgba(15,23,42,0.08)', display: 'flex', flexDirection: 'column', height: '100%' }}>
                    <div style={{ width: '100%', height: '150px', overflow: 'hidden' }}>
                      <img 
                        src={item.image} 
                        alt={item.alt}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                      />
                    </div>
                    <div style={{ padding: '20px', flexGrow: 1 }}>
                      <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a', marginBottom: '8px' }}>{item.title}</h3>
                      <p style={{ fontSize: '0.83rem', color: '#64748b', lineHeight: '1.6' }}>{item.benefit}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* ── Latest Intelligence and Updates ──────────────────────────────── */}
            <section className={styles.section}>
              <span className={styles.eyebrow}>Updates</span>
              <h2 className={styles.sectionTitle}>Latest Intelligence and Updates</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginTop: '24px' }}>
                {[
                  { title: 'New data pathway launched', date: 'Recent', status: 'Live' },
                  { title: 'Manufacturer data form available', date: 'Recent', status: 'Live' },
                  { title: 'Regulatory authority form available', date: 'Recent', status: 'Live' },
                  { title: 'Central medical supply form available', date: 'Recent', status: 'Live' },
                  { title: 'Methodology framework in progress', date: 'Coming Soon', status: 'In Development' },
                  { title: 'Research reports coming soon', date: 'Coming Soon', status: 'In Development' }
                ].map((item, idx) => (
                  <div key={idx} style={{ background: 'white', border: '1px solid rgba(15,23,42,0.07)', borderRadius: '10px', padding: '16px', boxShadow: '0 2px 8px rgba(15,23,42,0.04)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#1e88e5', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{item.date}</span>
                      <span style={{ fontSize: '0.72rem', fontWeight: 600, color: '#64748b', background: 'rgba(15,23,42,0.04)', padding: '4px 8px', borderRadius: '6px' }}>{item.status}</span>
                    </div>
                    <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#0f172a' }}>{item.title}</div>
                  </div>
                ))}
              </div>
            </section>

            {/* ── Support VAX2040 ──────────────────────────────────── */}
            <section className={styles.section}>
              <span className={styles.eyebrow}>Support</span>
              <h2 className={styles.sectionTitle}>Support the VAX2040 Mission</h2>
              <p className={styles.sectionSub}>Support VAX2040 through evidence submission and institutional partnership.</p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px', marginTop: '32px' }}>
                {[
                  {
                    title: 'Submit Evidence',
                    desc: 'Share research publications, official reports, or verified institutional intelligence.',
                    href: '/donate/evidence',
                    image: '/images/regulatory-review.svg',
                    alt: 'Evidence submission and document review'
                  },
                  {
                    title: 'Strategic Partnership',
                    desc: 'Collaborate as an institutional partner to advance pharmaceutical sovereignty in Africa.',
                    href: '/partner-access',
                    image: '/images/pharma-logistics.svg',
                    alt: 'Institutional strategic partnership'
                  }
                ].map((item, idx) => (
                  <a key={idx} href={item.href} style={{ textDecoration: 'none' }}>
                    <div style={{ background: 'white', border: '1px solid rgba(15,23,42,0.07)', borderRadius: '14px', overflow: 'hidden', boxShadow: '0 4px 16px rgba(15,23,42,0.08)', display: 'flex', flexDirection: 'column', height: '100%', transition: 'transform 0.2s ease, box-shadow 0.2s ease' }} onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(15,23,42,0.12)'; }} onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(15,23,42,0.08)'; }}>
                      <div style={{ width: '100%', height: '160px', overflow: 'hidden' }}>
                        <img src={item.image} alt={item.alt} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                      </div>
                      <div style={{ padding: '24px', flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                        <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a', marginBottom: '10px' }}>{item.title}</h3>
                        <p style={{ fontSize: '0.875rem', color: '#64748b', lineHeight: '1.65', marginBottom: '16px' }}>{item.desc}</p>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', fontWeight: 600, color: '#1e88e5', marginTop: 'auto' }}>
                          Get started <IconArrow />
                        </div>
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </section>

            {/* ── Final CTA ──────────────────────────────────── */}
            <section className={styles.section}>
              <div style={{ background: 'linear-gradient(135deg, #1e88e5 0%, #1565c0 100%)', borderRadius: '20px', padding: '40px', textAlign: 'center' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'white', marginBottom: '12px' }}>Help Build Africa's Pharmaceutical Sovereignty Intelligence</h2>
                <p style={{ fontSize: '0.95rem', color: 'rgba(255,255,255,0.9)', marginBottom: '24px', maxWidth: '700px', marginLeft: 'auto', marginRight: 'auto', lineHeight: '1.6' }}>Explore, submit, verify, and support evidence-backed visibility into Africa's medicine and vaccine manufacturing future.</p>
                <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
                  <a href="/dashboard" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '12px 22px', background: 'white', color: '#1565c0', borderRadius: '10px', textDecoration: 'none', fontSize: '0.88rem', fontWeight: 700 }}>Explore Dashboard <IconArrow /></a>
                  <a href="/countries" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '12px 22px', background: 'rgba(255,255,255,0.12)', color: 'white', border: '1px solid rgba(255,255,255,0.3)', borderRadius: '10px', textDecoration: 'none', fontSize: '0.88rem', fontWeight: 700 }}>View Countries</a>
                  <a href="/contact" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '12px 22px', background: 'rgba(255,255,255,0.12)', color: 'white', border: '1px solid rgba(255,255,255,0.3)', borderRadius: '10px', textDecoration: 'none', fontSize: '0.88rem', fontWeight: 700 }}>Contact Us</a>
                </div>
              </div>
            </section>

          </>
        )}

        {activeTab === 'entry' && (
          <div style={{ maxWidth: 1180, margin: '0 auto', padding: '40px 24px' }}>
            <DataEntryView
              partnerUser={partnerUser}
              manualEntries={manualEntries}
              onAddEntries={handleAddEntries}
              onUpdateEntry={handleUpdateEntry}
              onDeleteEntry={handleDeleteEntry}
              existingCount={manualEntries.length}
            />
          </div>
        )}
      </main>

      {/* ── FOOTER ──────────────────────────────────────── */}
      {activeTab === 'dashboard' ? (
        <footer className={styles.footer}>
          <div className={styles.footerWrap}>
            {/* Quick Links Column */}
            <div className={styles.footerCol}>
              <h4 className={styles.footerTitle}>Quick Links</h4>
              <a href="#" className={styles.footerLink}>About Us</a>
              <a href="#trends" className={styles.footerLink}>Research</a>
              <a href="#" className={styles.footerLink}>Publications</a>
              <a href="#" className={styles.footerLink}>News & Insights</a>
              <a href="#" className={styles.footerLink}>Our Team</a>
              <a href="#" className={styles.footerLink}>Contact</a>
            </div>

            {/* Resources Column */}
            <div className={styles.footerCol}>
              <h4 className={styles.footerTitle}>Resources</h4>
              <a href="#" className={styles.footerLink}>Careers</a>
              <a href="#" className={styles.footerLink}>Partnerships</a>
              <a href="#" className={styles.footerLink}>Events</a>
              <a href="#" className={styles.footerLink}>Privacy Policy</a>
              <a href="#" className={styles.footerLink}>Terms of Use</a>
              <a href="#" className={styles.footerLink}>Disclaimer</a>
            </div>

            {/* Subscribe Column */}
            <div className={styles.footerColSubscribe}>
              <h4 className={styles.footerTitle}>Subscribe</h4>
              <p className={styles.footerDesc}>Stay updated with our latest research and discoveries.</p>
              <form className={styles.subscribeForm} onSubmit={(e) => e.preventDefault()}>
                <input type="email" placeholder="Your email address" className={styles.subscribeInput} required />
                <button type="submit" className={styles.subscribeBtn}>Subscribe</button>
              </form>
            </div>
          </div>

          {/* Footer Bottom Line */}
          <div className={styles.footerBottom}>
            <div className={styles.footerBottomWrap}>
              <div className={styles.footerCopyright}>
                © 2026 Vax 2040 Research Center. All rights reserved.
              </div>
              <div className={styles.footerLegalLinks}>
                <a href="#">Privacy</a>
                <a href="#">Terms</a>
                <a href="#">Disclaimer</a>
              </div>
            </div>
          </div>
        </footer>
      ) : (
        <footer className={styles.footerBottom}>
          <div className={styles.footerBottomWrap}>
            <div className={styles.footerCopyright}>
              © 2026 Vax 2040 Research Center. All rights reserved.
            </div>
          </div>
        </footer>
      )}

      {showLogin && <LoginView onLoginSuccess={handleLoginSuccess} onCancel={() => setShowLogin(false)} />}
    </div>
  );
}
