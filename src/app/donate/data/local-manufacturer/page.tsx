'use client';

import { useState } from 'react';
import Link from 'next/link';
import styles from '../../../page.module.css';
import { IconArrow, IconArrowDown, IconUser } from '../../../../lib/icons';
import DataDonationForm from '../../../../components/form/DataDonationForm';
import { manufacturerFormConfig } from '../../../../data/dataDonationFormsConfig';

export default function LocalManufacturerFormPage() {
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
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '60px 40px' }}>
        <Link href="/donate/data" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#0A6B6A', textDecoration: 'none', marginBottom: '32px', fontWeight: 600 }}>
          &larr; Back to Data Donation
        </Link>
        <div style={{ marginBottom: '36px' }}>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', fontWeight: 800, color: '#0F172A', marginBottom: '12px' }}>
            {manufacturerFormConfig.title}
          </h1>
          <p style={{ fontSize: '0.92rem', fontWeight: 600, color: '#085453', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.03em' }}>
            {manufacturerFormConfig.targetRespondent}
          </p>
          <p style={{ fontSize: '1rem', color: '#64748B', lineHeight: 1.7 }}>
            {manufacturerFormConfig.introText}
          </p>
        </div>

        <DataDonationForm config={manufacturerFormConfig} />
      </div>
    </div>
  );
}
