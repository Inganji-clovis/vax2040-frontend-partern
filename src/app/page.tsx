'use client';
import { useState, useEffect } from 'react';
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
  const [isMounted, setIsMounted] = useState(false);
  const [worldbankData, setWorldbankData] = useState<DashboardPayload | null>(null);
  const [manualEntries, setManualEntries] = useState<ManualEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<string>('');

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

            {/* ── SECTION 2: THE DATA ───────────────────────── */}
            <section id="the-data" className={`${styles.splitSectionRowReverse} ${styles.splitBgWhite}`}>
              <div className={styles.splitTextSide}>
                <span className={styles.splitEyebrow}>Where Africa Stands Today</span>
                <h2 className={styles.splitH2}>55 countries, five tiers of production capacity</h2>
                <p className={styles.splitBody}>
                  We track and classify manufacturing readiness across five distinct tiers—from countries with no current capacity to those capable of full end-to-end drug substance production. Explore the interactive dashboard to see how individual nations are progressing toward their sovereignty targets.
                </p>
                <div className={styles.splitActions}>
                  <a href="/dashboard" className={styles.heroBtnPrimary}>View full country breakdown</a>
                  <a href="/download-dataset" className={styles.heroBtnSecondary}>Download dataset</a>
                </div>
              </div>
              <div className={styles.splitMediaSide}>
                <div className={styles.splitMediaData}>
                  <div style={{ width: '100%', maxWidth: '500px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    <div className={styles.metricsCountries}>
                      <span className={styles.metricsCountriesLabel}>Select country</span>
                      <div className={styles.pillsRowDark}>
                        {COUNTRIES.slice(0, 6).map(c => {
                          const m = getMetrics(c.code);
                          return (
                            <button key={c.code} className={`${styles.pillDark} ${focusCountry === c.code ? styles.pillDarkActive : ''}`} onClick={() => setFocusCountry(c.code)}>
                              <span>{c.flag}</span><span>{c.code}</span>
                              <span className={styles.pillDarkPct}>{m.vLocalPct.toFixed(0)}%</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                    
                    <div className={styles.metricsRing}>
                      <div className={styles.ringWrap} style={{ width: 100, height: 100 }}>
                        <svg width="100" height="100" viewBox="0 0 100 100" style={{ transform: 'rotate(-90deg)' }}>
                          <circle cx="50" cy="50" r="40" strokeWidth="7" fill="transparent" stroke="rgba(30,136,229,0.15)" />
                          <circle cx="50" cy="50" r="40" strokeWidth="8" fill="transparent" stroke="#1e88e5" strokeLinecap="round" strokeDasharray={`${2 * Math.PI * 40}`} strokeDashoffset={`${2 * Math.PI * 40 * (1 - Math.min(60, focusMetrics.vLocalPct) / 100)}`} style={{ transition: 'stroke-dashoffset 0.8s ease' }} />
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
                    
                    <div className={styles.metricsStats}>
                      <div className={styles.metricsStat} style={{ padding: '0 16px 0 0', alignItems: 'flex-start' }}>
                        <span className={styles.metricsStatVal}>{fmtVal(focusMetrics.vLocal)}</span>
                        <span className={styles.metricsStatLabel}>Vaccine Local</span>
                      </div>
                      <div className={styles.metricsStatDivider} />
                      <div className={styles.metricsStat} style={{ padding: '0 0 0 16px', alignItems: 'flex-start' }}>
                        <span className={styles.metricsStatVal}>{fmtVal(focusMetrics.vImport)}</span>
                        <span className={styles.metricsStatLabel}>Vaccine Imports</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

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
                  <a href="/download-dataset" className={styles.heroBtnPrimary}>Download the dataset</a>
                  <a href="/partner-access" className={styles.heroBtnSecondary} style={{ color: 'white', borderColor: 'rgba(255,255,255,0.3)' }}>Partner with us</a>
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
    </div>
  );
}
