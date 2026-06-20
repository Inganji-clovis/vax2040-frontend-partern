'use client';

import { useState } from 'react';
import Link from 'next/link';
import styles from '../../page.module.css';
import { IconArrow, IconArrowDown, IconUser, IconFactory, IconShield, IconTruck } from '../../../lib/icons';

export default function DonateDataPage() {
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
              {activeDropdown === 'platform' && (
                <div className={styles.navDropdownMenu}>
                  <Link href="/platform" className={styles.navDropdownItem} style={{ textDecoration: 'none' }}>Overview</Link>
                  <Link href="/platform/how-it-works" className={styles.navDropdownItem} style={{ textDecoration: 'none' }}>How VAX2040 Works</Link>
                  <Link href="/methodology" className={styles.navDropdownItem} style={{ textDecoration: 'none' }}>Methodology</Link>
                  <Link href="/platform/data-confidence" className={styles.navDropdownItem} style={{ textDecoration: 'none' }}>Data Confidence</Link>
                  <Link href="/platform/verification-process" className={styles.navDropdownItem} style={{ textDecoration: 'none' }}>Verification Process</Link>
                </div>
              )}
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

      {/* Page content */}
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '60px 40px' }}>
        <Link href="/donate" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#1e88e5', textDecoration: 'none', marginBottom: '32px', fontWeight: 600 }}>
          &larr; Back to Support VAX2040
        </Link>

        <div style={{ marginBottom: '48px' }}>
          <h1 style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '2.5rem',
            fontWeight: 800,
            color: '#0F172A',
            marginBottom: '16px'
          }}>
            Donate Data to VAX2040
          </h1>
          <p style={{ fontSize: '1.05rem', color: '#64748B', lineHeight: 1.7, maxWidth: '700px' }}>
            Select the institution type that best matches your role and submit structured data for VAX2040 review.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', marginBottom: '40px' }}>
          {/* Local Manufacturer Card */}
          <div style={{
            background: '#fff',
            border: '1px solid rgba(15,23,42,0.08)',
            borderRadius: '16px',
            padding: '32px',
            transition: 'all 0.25s ease',
            cursor: 'pointer'
          }} onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-4px)';
            e.currentTarget.style.boxShadow = '0 16px 40px rgba(30,136,229,0.15)';
          }} onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
          }}>
            <div style={{
              background: 'rgba(30,136,229,0.1)',
              width: '56px', height: '56px',
              borderRadius: '12px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#1e88e5',
              marginBottom: '20px'
            }}>
              <IconFactory />
            </div>
            <h3 style={{
              fontSize: '1.15rem', fontWeight: 700, color: '#0F172A', marginBottom: '8px', fontFamily: 'var(--font-sans)'
            }}>
              Local Pharmaceutical Manufacturer
            </h3>
            <p style={{ fontSize: '0.85rem', fontWeight: 600, color: '#1565c0', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.03em' }}>
              Target Respondent: Production Director / Plant Manager
            </p>
            <p style={{ fontSize: '0.92rem', color: '#64748B', lineHeight: 1.6, marginBottom: '24px' }}>
              Submit facility, licensing, production capacity, sourcing, and market/export data.
            </p>
            <Link href="/donate/data/local-manufacturer" style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              padding: '10px 18px', background: '#1e88e5', color: '#fff', borderRadius: '10px',
              fontSize: '0.9rem', fontWeight: 700, textDecoration: 'none', transition: 'all 0.2s ease'
            }} onMouseEnter={(e) => e.currentTarget.style.background = '#1565c0'}
               onMouseLeave={(e) => e.currentTarget.style.background = '#1e88e5'}>
              Open Manufacturer Form <IconArrow />
            </Link>
          </div>

          {/* Regulatory Authority Card */}
          <div style={{
            background: '#fff',
            border: '1px solid rgba(15,23,42,0.08)',
            borderRadius: '16px',
            padding: '32px',
            transition: 'all 0.25s ease',
            cursor: 'pointer'
          }} onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-4px)';
            e.currentTarget.style.boxShadow = '0 16px 40px rgba(30,136,229,0.15)';
          }} onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
          }}>
            <div style={{
              background: 'rgba(30,136,229,0.1)',
              width: '56px', height: '56px',
              borderRadius: '12px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#1e88e5',
              marginBottom: '20px'
            }}>
              <IconShield />
            </div>
            <h3 style={{
              fontSize: '1.15rem', fontWeight: 700, color: '#0F172A', marginBottom: '8px', fontFamily: 'var(--font-sans)'
            }}>
              National Regulatory Authority
            </h3>
            <p style={{ fontSize: '0.85rem', fontWeight: 600, color: '#1565c0', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.03em' }}>
              Target Respondent: Regulatory Officer / Data Analyst
            </p>
            <p style={{ fontSize: '0.92rem', color: '#64748B', lineHeight: 1.6, marginBottom: '24px' }}>
              Submit regulatory maturity, marketing authorizations, local manufacturing incentives, inspection, and oversight data.
            </p>
            <Link href="/donate/data/regulatory-authority" style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              padding: '10px 18px', background: '#1e88e5', color: '#fff', borderRadius: '10px',
              fontSize: '0.9rem', fontWeight: 700, textDecoration: 'none', transition: 'all 0.2s ease'
            }} onMouseEnter={(e) => e.currentTarget.style.background = '#1565c0'}
               onMouseLeave={(e) => e.currentTarget.style.background = '#1e88e5'}>
              Open Regulatory Authority Form <IconArrow />
            </Link>
          </div>

          {/* Central Medical Supply Card */}
          <div style={{
            background: '#fff',
            border: '1px solid rgba(15,23,42,0.08)',
            borderRadius: '16px',
            padding: '32px',
            transition: 'all 0.25s ease',
            cursor: 'pointer'
          }} onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-4px)';
            e.currentTarget.style.boxShadow = '0 16px 40px rgba(30,136,229,0.15)';
          }} onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
          }}>
            <div style={{
              background: 'rgba(30,136,229,0.1)',
              width: '56px', height: '56px',
              borderRadius: '12px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#1e88e5',
              marginBottom: '20px'
            }}>
              <IconTruck />
            </div>
            <h3 style={{
              fontSize: '1.15rem', fontWeight: 700, color: '#0F172A', marginBottom: '8px', fontFamily: 'var(--font-sans)'
            }}>
              Central Medical Supply
            </h3>
            <p style={{ fontSize: '0.85rem', fontWeight: 600, color: '#1565c0', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.03em' }}>
              Target Respondent: Procurement Director / Logistics Manager
            </p>
            <p style={{ fontSize: '0.92rem', color: '#64748B', lineHeight: 1.6, marginBottom: '24px' }}>
              Submit procurement portfolio, sourcing split, product category breakdown, tender, and supply chain reliability data.
            </p>
            <Link href="/donate/data/central-medical-supply" style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              padding: '10px 18px', background: '#1e88e5', color: '#fff', borderRadius: '10px',
              fontSize: '0.9rem', fontWeight: 700, textDecoration: 'none', transition: 'all 0.2s ease'
            }} onMouseEnter={(e) => e.currentTarget.style.background = '#1565c0'}
               onMouseLeave={(e) => e.currentTarget.style.background = '#1e88e5'}>
              Open Medical Supply Form <IconArrow />
            </Link>
          </div>
        </div>

        {/* Note */}
        <div style={{
          background: 'rgba(30,136,229,0.05)',
          border: '1px solid rgba(30,136,229,0.15)',
          borderRadius: '12px',
          padding: '18px 24px'
        }}>
          <p style={{ fontSize: '0.95rem', color: '#374151', margin: 0, display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{
              background: '#1e88e5',
              color: '#fff',
              width: '24px', height: '24px',
              borderRadius: '50%',
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '0.85rem', fontWeight: 700
            }}>i</span>
            All submissions are reviewed by VAX2040 Data Curators before being used in public analysis.
          </p>
        </div>
      </div>
    </div>
  );
}
