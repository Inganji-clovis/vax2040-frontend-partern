'use client';
import { useState, useEffect, useRef } from 'react';
import styles from './page.module.css';
import { PartnerUser } from '../components/LoginView';
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
  IconUpload,
  IconSyringe,
  IconPackage,
  IconPill,
  IconGlobe
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
  const [isMounted, setIsMounted] = useState(false);
  const [worldbankData, setWorldbankData] = useState<DashboardPayload | null>(null);
  const [manualEntries, setManualEntries] = useState<ManualEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<string>('');
  const scrollRef = useRef<HTMLDivElement>(null);
  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 300;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

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

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['the-problem', 'the-data', 'our-approach', 'get-involved'];
      let currentSection = '';
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 200 && rect.bottom >= 200) {
            currentSection = section;
          }
        }
      }
      setActiveSection(currentSection);
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      // Update active section immediately
      setActiveSection(id);
    }
  };

  function handleLoginSuccess(user: PartnerUser) {
    setPartnerUser(user);
    localStorage.setItem('vax2040_partner_user', JSON.stringify(user));
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
            <a href="#the-problem" onClick={(e) => scrollToSection(e, 'the-problem')} className={`${styles.navItem} ${activeSection === 'the-problem' ? styles.navItemActive : ''}`}>
              The Problem
            </a>
            <a href="#the-data" onClick={(e) => scrollToSection(e, 'the-data')} className={`${styles.navItem} ${activeSection === 'the-data' ? styles.navItemActive : ''}`}>
              The Data
            </a>
            <a href="#our-approach" onClick={(e) => scrollToSection(e, 'our-approach')} className={`${styles.navItem} ${activeSection === 'our-approach' ? styles.navItemActive : ''}`}>
              Our Approach
            </a>
            <a href="#get-involved" onClick={(e) => scrollToSection(e, 'get-involved')} className={`${styles.navItem} ${activeSection === 'get-involved' ? styles.navItemActive : ''}`}>
              Get Involved
            </a>
          </div>

          <div className={styles.navActions}>
            {partnerUser && (
              <div className={styles.partnerTabs}>
                <button 
                  className={`${styles.partnerTabBtn} ${activeTab === 'dashboard' ? styles.partnerTabBtnActive : ''}`}
                  onClick={() => setActiveTab('dashboard')}
                >
                  Portal View
                </button>
                <button 
                  className={`${styles.partnerTabBtn} ${activeTab === 'entry' ? styles.partnerTabBtnActive : ''}`}
                  onClick={() => setActiveTab('entry')}
                >
                  Workspace
                </button>
              </div>
            )}

            {partnerUser ? (
              <div className={styles.navUser}>
                <div className={styles.navUserAvatar}>{partnerUser.org[0]}</div>
                <span className={styles.navUserName}>{partnerUser.org.split(' ')[0]}</span>
                <button className={styles.navSignOut} onClick={handleLogout} title="Sign out"><IconLogOut /></button>
              </div>
            ) : (
              <a href="/auth" className={styles.navSignIn} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
                Login <IconUser />
              </a>
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
                  <a href="#the-data" className={styles.heroBtnPrimary} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                    View Countries <IconArrow />
                  </a>
                </div>
              </div>

              {/* Right: Animated Africa Map */}
              <div className={styles.heroImagePanel}>
                <AnimatedAfricaMap />
              </div>
            </section>

            {/* ── SECTION 1: THE PROBLEM ────────────────────── */}
            <section id="the-problem" className={`${styles.splitSectionRow} ${styles.splitBgLight}`}>
              <div className={styles.splitTextSide}>
                <span className={styles.splitEyebrow}>Why This Matters</span>
                <h2 className={styles.splitH2}>23% of the global disease burden. A fraction of the production.</h2>
                <p className={styles.splitBody}>
                  The COVID-19 pandemic exposed the critical vulnerability of relying heavily on imported medicines and vaccines. While Africa accounts for nearly a quarter of the global disease burden, it remains dependent on external sources for life-saving therapeutics, severely impacting cost and access for health systems across the continent.
                </p>
                <div style={{ display: 'flex', gap: '24px', marginTop: '16px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontSize: '1.75rem', fontWeight: 800, color: '#1e88e5' }}>99%</span>
                    <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Imported Vaccines</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontSize: '1.75rem', fontWeight: 800, color: '#1e88e5' }}>8 of 55</span>
                    <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Producing Countries</span>
                  </div>
                </div>
              </div>
              <div className={styles.splitMediaSide}>
                <img src="/images/medical-materials.png" alt="Medical testing and production materials" className={styles.splitImg} />
              </div>
            </section>

            {/* ── SECTION 2: COUNTRY INTELLIGENCE ──────────────── */}
            <section id="the-data" className={styles.countryIntelSection}>
              <div className={styles.countryIntelInner}>

                {/* Header row */}
                <div className={styles.countryIntelHeader}>
                  <span className={styles.splitEyebrow}>Live Country Intelligence</span>
                  <h2 className={styles.countryIntelTitle}>Where Africa Stands Today</h2>
                  <p className={styles.countryIntelSub}>
                    Select any country to see real-time pharmaceutical manufacturing and import intelligence.
                  </p>
                </div>

                {/* Country selector tabs container */}
                <div className={styles.countryTabsContainer}>
                  <button className={styles.scrollBtn} onClick={() => scroll('left')} aria-label="Scroll left">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
                  </button>
                  
                  <div ref={scrollRef} className={styles.countryTabsRow}>
                    {COUNTRIES.map(c => {
                      const m = getMetrics(c.code);
                      const isActive = focusCountry === c.code;
                      const isFeatured = c.active;
                      return (
                        <button
                          key={c.code}
                          className={`${styles.countryTab} ${isActive ? styles.countryTabActive : ''} ${!isFeatured ? styles.countryTabInactive : ''}`}
                          onClick={() => setFocusCountry(c.code)}
                        >
                          <span className={styles.countryTabFlag}>{c.flag}</span>
                          <span className={styles.countryTabName}>{c.name}</span>
                          {isFeatured ? (
                            <span className={styles.countryTabPct}>{m.vLocalPct.toFixed(0)}% local</span>
                          ) : (
                            <span className={styles.countryTabPctOffline}>Pipeline</span>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  <button className={styles.scrollBtn} onClick={() => scroll('right')} aria-label="Scroll right">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                  </button>
                </div>

                {/* Main data card */}
                <div className={styles.countryDataCard}>

                  {/* Left: Progress ring + identity */}
                  <div className={styles.countryDataLeft}>
                    <div className={styles.countryRingWrap}>
                      <svg width="140" height="140" viewBox="0 0 140 140">
                        {/* Background track */}
                        <circle cx="70" cy="70" r="58" strokeWidth="9" fill="transparent" stroke="rgba(30,136,229,0.1)" />
                        {/* Target ring (ghost at 60%) */}
                        <circle cx="70" cy="70" r="58" strokeWidth="4" fill="transparent" stroke="rgba(30,136,229,0.2)" strokeDasharray={`${2 * Math.PI * 58 * 0.6} ${2 * Math.PI * 58 * 0.4}`} strokeDashoffset={`${2 * Math.PI * 58 * 0.25}`} />
                        {/* Progress arc */}
                        <circle
                          cx="70" cy="70" r="58"
                          strokeWidth="9"
                          fill="transparent"
                          stroke="#1e88e5"
                          strokeLinecap="round"
                          strokeDasharray={`${2 * Math.PI * 58}`}
                          strokeDashoffset={`${2 * Math.PI * 58 * (1 - Math.min(100, focusMetrics.vLocalPct) / 100)}`}
                          style={{ transition: 'stroke-dashoffset 0.7s cubic-bezier(0.4,0,0.2,1)', transform: 'rotate(-90deg)', transformOrigin: 'center' }}
                        />
                        {/* Center text */}
                        <text x="70" y="64" textAnchor="middle" fontSize="22" fontWeight="800" fill="#0F172A" fontFamily="var(--font-sans)" style={{ fontVariantNumeric: 'tabular-nums' }}>
                          {focusMetrics.vLocalPct.toFixed(1)}%
                        </text>
                        <text x="70" y="82" textAnchor="middle" fontSize="10" fontWeight="600" fill="#64748B" fontFamily="var(--font-sans)" letterSpacing="0.04em">
                          LOCAL SHARE
                        </text>
                      </svg>
                      <div className={styles.countryRingTarget}>
                        <span>Target</span>
                        <strong>60%</strong>
                        <span>by 2040</span>
                      </div>
                    </div>
                    <div className={styles.countryIdentity}>
                      <span className={styles.countryIdentityFlag}>{focusCountryObj.flag}</span>
                      <div>
                        <div className={styles.countryIdentityName}>{focusCountryObj.name}</div>
                        <div className={styles.countryIdentityCode}>{focusCountryObj.code} · Latest Available Year</div>
                      </div>
                    </div>
                  </div>

                  {/* Divider */}
                  <div className={styles.countryDataDivider} />

                  {/* Right: 4-stat grid */}
                  <div className={styles.countryStatsGrid} style={{ position: 'relative' }}>
                    <div className={`${styles.countryStat} ${styles.countryStatBlue}`}>
                      <div className={styles.countryStatIcon}><IconSyringe /></div>
                      <div className={styles.countryStatVal}>{fmtVal(focusMetrics.vLocal)}</div>
                      <div className={styles.countryStatLabel}>Vaccine Local Production</div>
                    </div>
                    <div className={`${styles.countryStat} ${styles.countryStatOrange}`}>
                      <div className={styles.countryStatIcon}><IconPackage /></div>
                      <div className={styles.countryStatVal}>{fmtVal(focusMetrics.vImport)}</div>
                      <div className={styles.countryStatLabel}>Vaccine Imports</div>
                    </div>
                    <div className={`${styles.countryStat} ${styles.countryStatGreen}`}>
                      <div className={styles.countryStatIcon}><IconPill /></div>
                      <div className={styles.countryStatVal}>{fmtVal(focusMetrics.mLocal)}</div>
                      <div className={styles.countryStatLabel}>Medicine Local Production</div>
                    </div>
                    <div className={`${styles.countryStat} ${styles.countryStatPurple}`}>
                      <div className={styles.countryStatIcon}><IconGlobe /></div>
                      <div className={styles.countryStatVal}>{fmtVal(focusMetrics.mImport)}</div>
                      <div className={styles.countryStatLabel}>Medicine Imports</div>
                    </div>

                    {!focusCountryObj.active && (
                      <div className={styles.offlineOverlay}>
                        <div className={styles.offlineGlow} />
                        <span className={styles.offlineLock}>🔒</span>
                        <h4 className={styles.offlineTitle}>Data In Pipeline</h4>
                        <p className={styles.offlineText}>
                          Audit overrides for {focusCountryObj.name} are currently pending review. Baseline estimates are offline.
                        </p>
                        <button className={styles.offlineBtn} onClick={() => alert("Activation priority request submitted for " + focusCountryObj.name)}>
                          Request Priority Activation
                        </button>
                      </div>
                    )}
                  </div>
                </div>

              </div>
            </section>


            {/* ── SECTION 2.5: TRENDS CHARTS ───────────────── */}
            {worldbankData && (
              <section id="trends" className={styles.trendsSection}>
                <div className={styles.trendsContainer}>
                  <div className={styles.trendsHeader}>
                    <div>
                      <h2 className={styles.trendsTitle}>Pharmaceutical Trade Trends</h2>
                      <p className={styles.trendsSub}>
                        Comparing local manufacturing capacity against import dependency across all tracked nations. Click a country pill above to highlight its trend line.
                      </p>
                    </div>
                    <div className={styles.trendsTabs}>
                      <button
                        className={`${styles.trendsTab} ${trendsTab === 'imports' ? styles.trendsTabActive : ''}`}
                        onClick={() => setTrendsTab('imports')}
                      >
                        Imports
                      </button>
                      <button
                        className={`${styles.trendsTab} ${trendsTab === 'production' ? styles.trendsTabActive : ''}`}
                        onClick={() => setTrendsTab('production')}
                      >
                        Local Production
                      </button>
                    </div>
                  </div>

                  <div className={styles.chartsGrid}>
                    <TrendChart
                      payload={trendsTab === 'imports' ? worldbankData.vaccineImports : worldbankData.vaccineLocalProduction}
                      title={trendsTab === 'imports' ? "Vaccine Imports (USD)" : "Vaccine Local Production (USD)"}
                      focusCountry={focusCountry}
                    />
                    <TrendChart
                      payload={trendsTab === 'imports' ? worldbankData.medicineImports : worldbankData.medicineLocalProduction}
                      title={trendsTab === 'imports' ? "Medicine Imports (USD)" : "Medicine Local Production (USD)"}
                      focusCountry={focusCountry}
                    />
                  </div>
                </div>
              </section>
            )}

            {/* ── SECTION 3: THE PATH FORWARD ───────────────── */}
            <section id="our-approach" className={`${styles.splitSectionRow} ${styles.splitBgLight}`}>
              <div className={styles.splitTextSide}>
                <span className={styles.splitEyebrow}>Building Sovereignty by 2040</span>
                <h2 className={styles.splitH2}>The momentum is real — and measurable</h2>
                <p className={styles.splitBody}>
                  Backed by the Partnerships for African Vaccine Manufacturing (PAVM) framework and the $1.2B African Vaccine Manufacturing Accelerator, substantial progress is underway. Pioneer facilities like the BioVac Institute, Institut Pasteur de Dakar, and new mRNA hubs in South Africa and Rwanda are laying the groundwork for a robust 2025–2030 WHO prequalification pipeline.
                </p>
                <div className={styles.splitActions}>
                  <a href="/research" className={styles.heroBtnSecondary}>Read the landscape report</a>
                </div>
              </div>
              <div className={styles.splitMediaSide}>
                <img src="/images/pharma-lab.png" alt="Pharmaceutical manufacturing facility" className={styles.splitImg} />
              </div>
            </section>

            {/* ── SECTION 4: CALL TO ACTION ─────────────────── */}
            <section id="get-involved" className={`${styles.splitSectionRowReverse} ${styles.splitBgDark}`}>
              <div className={styles.splitTextSide}>
                <span className={styles.splitEyebrow}>Get Involved</span>
                <h2 className={styles.splitH2}>Join the coalition for African vaccine sovereignty</h2>
                <p className={styles.splitBody}>
                  We invite researchers, policymakers, and NGOs to co-sign the framework and help shape the future of African health security. Access our full dataset, collaborate on policy briefs, and subscribe to vital updates.
                </p>
                <div className={styles.splitActions}>
                  <a href="/partner-access" className={styles.heroBtnPrimary}>Partner with us</a>
                </div>
              </div>
              <div className={styles.splitMediaSide}>
                <img src="/images/coalition.png" alt="Coalition and collaboration" className={styles.splitImg} />
              </div>
            </section>

          </>
        )}

        {activeTab === 'entry' && (
          <div style={{ maxWidth: 1180, margin: '0 auto', padding: '40px 24px' }}>
            <DataEntryView
              partnerUser={partnerUser}
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
    </div>
  );
}
