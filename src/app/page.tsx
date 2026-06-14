'use client';
import { useState, useEffect } from 'react';
import styles from './page.module.css';
import LoginView, { PartnerUser } from '../components/LoginView';
import DataEntryView from '../components/DataEntryView';
import TrendChart from '../components/TrendChart';
import { getWorldBankData, getWHOData, getOverrides, createOverride, updateOverride, deleteOverride } from '../lib/api';
import { DashboardPayload, WHOIndicatorPayload, ManualEntry } from '../lib/types';
import { COUNTRIES } from '../lib/constants';

function fmtVal(val: number | null) {
  if (val === null || val === 0) return 'N/A';
  if (val >= 1_000_000_000) return `$${(val / 1_000_000_000).toFixed(1)}B`;
  if (val >= 1_000_000) return `$${(val / 1_000_000).toFixed(1)}M`;
  return `$${val.toLocaleString()}`;
}

const IconArrow = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
);
const IconLogIn = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>
);
const IconUpload = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/></svg>
);
const IconShield = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
);
const IconChart = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
);
const IconCheck = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
);
const IconLogOut = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
);

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
            <img src="/logoA.png" alt="VAX2040" className={styles.navLogo} />
          </div>

          <div className={styles.navCenter}>
            <button className={`${styles.navItem} ${activeTab === 'dashboard' ? styles.navItemActive : ''}`} onClick={() => setActiveTab('dashboard')}>
              <IconChart /> Live Data
            </button>
            <a href="#trends" className={styles.navItem}>Reports</a>
            <a href="#about" className={styles.navItem}>About</a>
            {partnerUser && (
              <button className={`${styles.navItem} ${activeTab === 'entry' ? styles.navItemActive : ''}`} onClick={() => setActiveTab('entry')}>
                <IconUpload /> Submit Data
              </button>
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
              <>
                <button className={styles.navSignIn} onClick={() => setShowLogin(true)}>
                  <IconLogIn /> Sign In
                </button>
                <button className={styles.navCTA} onClick={() => setShowLogin(true)}>
                  Partner Access <IconArrow />
                </button>
              </>
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
                  Independent Data-Driven Research Mechanism
                </div>

                <h1 className={styles.heroH1}>
                  Pharmaceutical and<br />
                  <span className={styles.heroAccent}>Vaccine Research</span><br />Center
                </h1>

                <p className={styles.heroP}>
                  Vax 2040 is a philanthropic research and development entity dedicated to deepen career into the pharmaceutical manufacturing of vaccines and other health commodities in the Eastern, central regions of Africa and beyond where the manufacturing of vaccines and pharmaceutics express a great need.
                </p>

                <div className={styles.heroActions}>
                  {!partnerUser && (
                    <button className={styles.heroBtnSecondary} onClick={() => setShowLogin(true)}>
                      Partner Portal
                    </button>
                  )}
                </div>

                {/* Trust signals (Infinite Marquee) */}
                <div className={styles.heroTrust}>
                  <div className={styles.heroTrustTrack}>
                    <div className={styles.heroTrustItem}><IconShield /> <span>WHO Verified</span></div>
                    <div className={styles.heroTrustItem}><IconCheck /> <span>World Bank Data</span></div>
                    <div className={styles.heroTrustItem}><IconCheck /> <span>UN Comtrade</span></div>
                    {/* Duplicated for seamless loop */}
                    <div className={styles.heroTrustItem}><IconShield /> <span>WHO Verified</span></div>
                    <div className={styles.heroTrustItem}><IconCheck /> <span>World Bank Data</span></div>
                    <div className={styles.heroTrustItem}><IconCheck /> <span>UN Comtrade</span></div>
                  </div>
                </div>
              </div>

              {/* Right: Image */}
              <div className={styles.heroImagePanel}>
                <img src="/hero-bg.png" alt="Vax 2040 Research" className={styles.heroImage} />
                <div className={styles.heroImageOverlay} />
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
                      <circle cx="50" cy="50" r="40" strokeWidth="7" fill="transparent" stroke="rgba(210,105,30,0.15)" />
                      <circle
                        cx="50" cy="50" r="40" strokeWidth="8" fill="transparent"
                        stroke="#D2691E"
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
