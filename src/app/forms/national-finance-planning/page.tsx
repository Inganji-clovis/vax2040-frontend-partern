'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DataDonationForm from '../../../components/form/DataDonationForm';
import { financePlanningFormConfig } from '../../../data/dataDonationFormsConfig';

export default function NationalFinancePlanningForm() {
  const router = useRouter();

  useEffect(() => {
    const stored = localStorage.getItem('vax2040_partner_user');
    if (!stored) {
      router.replace('/select-role');
      return;
    }

    try {
      JSON.parse(stored);
    } catch {
      router.replace('/select-role');
    }
  }, [router]);

  return (
    <div className="form-wrapper animate-fade-up">
      <div style={{
        background: 'linear-gradient(135deg, #d97706 0%, #b45309 100%)',
        borderRadius: '16px',
        padding: '24px 28px',
        marginBottom: '24px',
        color: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px',
      }}>
        <div>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', opacity: 0.8, marginBottom: '6px' }}>
            VAX PHARMA 2040 - Kigali, Rwanda
          </div>
          <div style={{ fontSize: '1.2rem', fontWeight: 800 }}>Africa Pharmaceutical Sovereignty</div>
          <div style={{ fontSize: '0.88rem', opacity: 0.85, marginTop: '4px' }}>
            Form 04 - National Finance and Planning Authority
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '0.75rem', opacity: 0.75, marginBottom: '4px' }}>Signed in as</div>
          <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>Partner account</div>
        </div>
      </div>

      <div className="card">
        <h1 className="text-brand font-bold mb-2" style={{ fontSize: '2rem' }}>
          {financePlanningFormConfig.title}
        </h1>
        <p className="text-muted mb-6">
          {financePlanningFormConfig.introText}
        </p>
        <DataDonationForm config={financePlanningFormConfig} />
      </div>
    </div>
  );
}
