'use client';

import { useState } from 'react';
import Link from 'next/link';
import styles from '../../page.module.css';
import { IconArrow, IconArrowDown, IconUser, IconCheck } from '../../../lib/icons';
import FormField from '../../../components/form/FormField';
import SelectField from '../../../components/form/SelectField';
import TextAreaField from '../../../components/form/TextAreaField';
import ConsentBox from '../../../components/form/ConsentBox';
import FormSection from '../../../components/form/FormSection';
import SuccessMessage from '../../../components/form/SuccessMessage';
import { countries } from '../../../data/dataDonationFormsConfig';

export default function DonateEvidencePage() {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [formData, setFormData] = useState<Record<string, any>>({
    fullName: '',
    email: '',
    organization: '',
    country: '',
    evidenceType: '',
    evidenceTitle: '',
    evidenceLink: '',
    description: '',
    consent: false
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (fieldId: string, value: any) => {
    setFormData(prev => ({ ...prev, [fieldId]: value }));
    if (errors[fieldId]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[fieldId];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    let isValid = true;

    const requiredFields = ['fullName', 'email', 'country', 'evidenceType', 'evidenceTitle', 'evidenceLink', 'description', 'consent'];
    requiredFields.forEach(field => {
      if (!formData[field] || (typeof formData[field] === 'string' && formData[field] === '')) {
        newErrors[field] = 'This field is required';
        isValid = false;
      }
    });

    if (formData.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        newErrors.email = 'Please enter a valid email';
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      const mockSubmission = {
        id: Date.now(),
        type: 'evidence',
        data: formData,
        timestamp: new Date().toISOString()
      };
      localStorage.setItem(`vax2040_evidence_${mockSubmission.id}`, JSON.stringify(mockSubmission));
      setIsSubmitted(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleReset = () => {
    setIsSubmitted(false);
    setFormData({
      fullName: '',
      email: '',
      organization: '',
      country: '',
      evidenceType: '',
      evidenceTitle: '',
      evidenceLink: '',
      description: '',
      consent: false
    });
    setErrors({});
  };

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
      <div style={{ maxWidth: '850px', margin: '0 auto', padding: '60px 40px' }}>
        <Link href="/donate" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#1e88e5', textDecoration: 'none', marginBottom: '32px', fontWeight: 600 }}>
          &larr; Back to Support VAX2040
        </Link>

        {isSubmitted ? (
          <SuccessMessage 
            message="Your evidence submission has been received. VAX2040 Data Curators will review the source before it is linked to public analysis." 
            onSubmitAnother={handleReset} 
          />
        ) : (
          <>
            <div style={{ marginBottom: '36px' }}>
              <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', fontWeight: 800, color: '#0F172A', marginBottom: '12px' }}>
                Donate Evidence to VAX2040
              </h1>
              <p style={{ fontSize: '1rem', color: '#64748B', lineHeight: 1.7, maxWidth: '700px' }}>
                Submit reports, policy documents, procurement records, regulatory documents, research papers, or verified public sources for curator review.
              </p>
            </div>

            <form onSubmit={handleSubmit}>
              <FormSection title="Submitter Information">
                <FormField
                  id="fullName" label="Full Name" type="text" required
                  value={formData.fullName} onChange={(v) => handleChange('fullName', v)} error={errors.fullName}
                />
                <FormField
                  id="email" label="Email Address" type="email" required
                  value={formData.email} onChange={(v) => handleChange('email', v)} error={errors.email}
                />
                <FormField
                  id="organization" label="Organization / Affiliation" type="text"
                  value={formData.organization} onChange={(v) => handleChange('organization', v)} error={errors.organization}
                />
                <SelectField
                  id="country" label="Country Related to the Evidence" options={countries} required
                  value={formData.country} onChange={(v) => handleChange('country', v)} error={errors.country}
                />
              </FormSection>

              <FormSection title="Evidence Details">
                <SelectField
                  id="evidenceType" label="Evidence Type" required
                  options={[
                    'Government report', 'Regulatory document', 'Procurement document',
                    'Manufacturer document', 'Research paper', 'Policy document',
                    'News/public source', 'Other'
                  ]}
                  value={formData.evidenceType} onChange={(v) => handleChange('evidenceType', v)} error={errors.evidenceType}
                />
                <FormField
                  id="evidenceTitle" label="Evidence Title" type="text" required
                  value={formData.evidenceTitle} onChange={(v) => handleChange('evidenceTitle', v)} error={errors.evidenceTitle}
                />
                <FormField
                  id="evidenceLink" label="Evidence Link" type="url" required
                  value={formData.evidenceLink} onChange={(v) => handleChange('evidenceLink', v)} error={errors.evidenceLink}
                />
                <TextAreaField
                  id="description" label="Short Description" rows={5} required
                  value={formData.description} onChange={(v) => handleChange('description', v)} error={errors.description}
                />
              </FormSection>

              <FormSection title="Consent">
                <ConsentBox
                  id="consent"
                  label="I confirm that the submitted information is accurate to the best of my knowledge and may be reviewed by VAX2040 Data Curators."
                  checked={formData.consent} onChange={(v) => handleChange('consent', v)} error={errors.consent}
                />
              </FormSection>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '32px', flexWrap: 'wrap', gap: '16px' }}>
                <Link href="/donate" style={{
                  display: 'inline-flex', alignItems: 'center', gap: '8px',
                  padding: '12px 24px', background: 'transparent', color: '#64748B', border: '1.5px solid rgba(100,116,139,0.2)', borderRadius: '10px',
                  fontSize: '0.95rem', fontWeight: 700, textDecoration: 'none', transition: 'all 0.2s ease', cursor: 'pointer'
                }}>
                  Back to Donate
                </Link>
                <button type="submit" style={{
                  display: 'inline-flex', alignItems: 'center', gap: '8px',
                  padding: '14px 32px', background: '#1e88e5', color: '#fff', border: 'none', borderRadius: '10px',
                  fontSize: '1rem', fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s ease', boxShadow: '0 4px 16px rgba(30,136,229,0.25)'
                }} onMouseEnter={(e) => { e.currentTarget.style.background = '#1565c0'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                   onMouseLeave={(e) => { e.currentTarget.style.background = '#1e88e5'; e.currentTarget.style.transform = 'translateY(0)'; }}>
                  Submit Evidence <IconArrow />
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
