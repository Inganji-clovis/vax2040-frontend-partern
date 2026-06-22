'use client';

import { useState } from 'react';
import Link from 'next/link';
import styles from '../../page.module.css';
import { IconArrow, IconArrowDown, IconUser, IconFinance } from '../../../lib/icons';

export default function FinancialSupportPage() {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  return (
    <div className={styles.root}>
      {/* Navbar */}
      <nav className={styles.nav}>
        <div className={styles.navWrap}>
          <div className={styles.navBrand}>
            <img src="/logoA.png" alt="VAX2040 Logo" className={styles.navLogo} />
          </div>
          <div className={styles.navCenter}>
            <Link href="/" className={styles.navItem} style={{ textDecoration: 'none' }}>Home</Link>
            <div className={styles.navDropdown} onMouseEnter={() => setActiveDropdown('platform')} onMouseLeave={() => setActiveDropdown(null)}>
              <Link href="/platform" className={styles.navItem} style={{ textDecoration: 'none' }}>Platform <IconArrowDown /></Link>
            </div>
            <div className={styles.navDropdown} onMouseEnter={() => setActiveDropdown('intelligence')} onMouseLeave={() => setActiveDropdown(null)}>
              <Link href="/dashboard" className={styles.navItem} style={{ textDecoration: 'none' }}>Intelligence <IconArrowDown /></Link>
            </div>
            <div className={styles.navDropdown} onMouseEnter={() => setActiveDropdown('countries')} onMouseLeave={() => setActiveDropdown(null)}>
              <Link href="/countries" className={styles.navItem} style={{ textDecoration: 'none' }}>Countries <IconArrowDown /></Link>
            </div>
            <div className={styles.navDropdown} onMouseEnter={() => setActiveDropdown('research')} onMouseLeave={() => setActiveDropdown(null)}>
              <Link href="/research" className={styles.navItem} style={{ textDecoration: 'none' }}>Research <IconArrowDown /></Link>
            </div>
            <div className={styles.navDropdown} onMouseEnter={() => setActiveDropdown('resources')} onMouseLeave={() => setActiveDropdown(null)}>
              <Link href="/about" className={styles.navItem} style={{ textDecoration: 'none' }}>Resources <IconArrowDown /></Link>
            </div>
          </div>
          <div className={styles.navActions}>
            <Link href="/donate" className={styles.navCTA} style={{ padding: '12px 20px', textDecoration: 'none' }}>Donate</Link>
            <button className={styles.navSignIn} title="Sign In" aria-label="Sign In"><IconUser /></button>
          </div>
        </div>
      </nav>

      {/* Page Content */}
      <div style={{ maxWidth: '700px', margin: '0 auto', padding: '80px 40px', textAlign: 'center' }}>
        <Link href="/donate" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#0A6B6A', textDecoration: 'none', marginBottom: '40px', fontWeight: 600 }}>
          &larr; Back to Support VAX2040
        </Link>

        <div style={{
          background: '#fff',
          border: '1px solid rgba(15,23,42,0.08)',
          borderRadius: '24px',
          padding: '60px 48px',
          boxShadow: '0 20px 60px rgba(10, 107, 106,0.12)'
        }}>
          <div style={{
            background: 'rgba(10, 107, 106,0.1)',
            color: '#0A6B6A',
            width: '96px', height: '96px',
            borderRadius: '50%',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            marginBottom: '28px'
          }}>
            <IconFinance />
          </div>
          <h1 style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '2.25rem',
            fontWeight: 800,
            color: '#0F172A',
            marginBottom: '16px'
          }}>
            Financial Support
          </h1>
          <p style={{
            fontSize: '1rem',
            color: '#64748B',
            lineHeight: 1.7,
            marginBottom: '36px'
          }}>
            Financial support features are being prepared to support VAX2040 research operations, data validation, country coverage, reporting tools, and platform development.
          </p>
          <p style={{
            fontSize: '0.95rem',
            color: '#374151',
            lineHeight: 1.6,
            marginBottom: '40px'
          }}>
            For now, organizations interested in supporting VAX2040 can request partner access or contact the VAX2040 team.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
            <Link href="/partner-access" style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              padding: '13px 28px', background: '#0A6B6A', color: '#fff', border: 'none', borderRadius: '12px',
              fontSize: '0.98rem', fontWeight: 700, textDecoration: 'none', transition: 'all 0.2s ease', cursor: 'pointer'
            }} onMouseEnter={(e) => e.currentTarget.style.background = '#085453'}
               onMouseLeave={(e) => e.currentTarget.style.background = '#0A6B6A'}>
              Request Partner Access <IconArrow />
            </Link>

            <Link href="/contact" style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              padding: '13px 28px', background: 'transparent', color: '#0A6B6A', border: '1.5px solid rgba(10, 107, 106,0.3)', borderRadius: '12px',
              fontSize: '0.98rem', fontWeight: 700, textDecoration: 'none', transition: 'all 0.2s ease', cursor: 'pointer'
            }} onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(10, 107, 106,0.08)';
              e.currentTarget.style.borderColor = '#0A6B6A';
            }} onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.borderColor = 'rgba(10, 107, 106,0.3)';
            }}>
              Contact VAX2040 <IconArrow />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
