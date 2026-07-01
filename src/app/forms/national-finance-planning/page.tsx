'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DataDonationForm from '../../../components/form/DataDonationForm';
import { financePlanningFormConfig } from '../../../data/dataDonationFormsConfig';
import DataEntryView from '../../../components/DataEntryView';
import { PartnerUser } from '../../../components/LoginView';

export default function NationalFinancePlanningForm() {
  const router = useRouter();

  // ── Auth guard & tab settings ──────────────────────────────
  const [userName, setUserName] = useState('');
  const [partnerUser, setPartnerUser] = useState<PartnerUser | null>(null);
  const [activeTab, setActiveTab] = useState<'form' | 'history'>('form');
  const [editingSub, setEditingSub] = useState<any>(null);
  const [initialFormData, setInitialFormData] = useState<Record<string, any>>({});

  useEffect(() => {
    const stored = localStorage.getItem('vax2040_partner_user');
    if (!stored) {
      router.replace('/select-role');
      return;
    }
    try {
      const user = JSON.parse(stored);
      setUserName(user.email || '');
      setPartnerUser(user);
    } catch {
      router.replace('/select-role');
    }
  }, [router]);

  const handleEditClick = (sub: any) => {
    setEditingSub(sub);
    
    let rawData = {};
    if (sub.notes) {
      try {
        rawData = JSON.parse(sub.notes);
      } catch (err) {
        rawData = {};
      }
    }
    
    setInitialFormData(rawData);
    setActiveTab('form');
  };

  const handleFormSubmit = (submittedData: Record<string, any>) => {
    // Map the JSON form data to the PartnerSubmission format
    const submissionData = {
      reportingYear: String(submittedData.reportingPeriod || '2024'),
      reportingMonth: 'January', // default month since annual form
      status: 'submitted',
      formType: 'Evidence Submission (Research/Analyst)' as any,
      evidenceType: 'Research publication',
      sourceTitle: `National Budget Report - ${submittedData.ministryDepartment || 'Ministry of Finance'}`,
      sourceAuthor: submittedData.focalPointNameTitle || 'National Curator',
      sourceDate: new Date().toISOString().split('T')[0],
      findingsExcerpt: `Total Budget: $${Number(submittedData.totalNationalBudget).toLocaleString()}. Health Allocation: $${Number(submittedData.healthSectorAllocation).toLocaleString()}. Corporate Tax: ${submittedData.standardCorporateTaxRate}%.`,
      extractedPoints: [
        { indicator: 'Total National Budget', value: String(submittedData.totalNationalBudget), unit: 'USD', period: String(submittedData.reportingPeriod || '2024'), pageRef: 'Section 1' },
        { indicator: 'Health Sector Allocation', value: String(submittedData.healthSectorAllocation), unit: 'USD', period: String(submittedData.reportingPeriod || '2024'), pageRef: 'Section 1' }
      ],
      creditContributor: 'Yes',
      notes: JSON.stringify(submittedData)
    };

    const stored = localStorage.getItem('vax2040_partner_submissions');
    let currentList = [];
    if (stored) {
      try {
        currentList = JSON.parse(stored);
      } catch (err) {
        currentList = [];
      }
    }

    let updated = [];
    if (editingSub) {
      updated = currentList.map((sub: any) => {
        if (sub.id === editingSub.id) {
          return {
            ...sub,
            ...submissionData,
            createdAt: new Date().toISOString()
          };
        }
        return sub;
      });
      alert('Form updated successfully!');
      setEditingSub(null);
    } else {
      const newSub = {
        id: 'sub_' + Math.random().toString(36).substr(2, 9),
        partnerId: partnerUser?.email || userName || 'academic@kurasini.org',
        partnerName: partnerUser?.org || 'Evidence Submission (Research/Analyst)',
        trustScore: 5,
        createdAt: new Date().toISOString(),
        ...submissionData
      };
      updated = [newSub, ...currentList];
      alert('Form submitted successfully!');
    }

    localStorage.setItem('vax2040_partner_submissions', JSON.stringify(updated));
    setInitialFormData({});
    setActiveTab('history');
  };

  return (
    <div className="form-wrapper animate-fade-up">
      {/* ── Branded header banner ── */}
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
            Form 04 - Evidence Submission (Research/Analyst)
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '0.75rem', opacity: 0.75, marginBottom: '4px' }}>Signed in as</div>
          <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>{userName || '—'}</div>
        </div>
      </div>

      {/* Tab Switcher */}
      <div style={{
        display: 'flex',
        gap: '12px',
        borderBottom: '2px solid rgba(15, 23, 42, 0.06)',
        marginBottom: '24px',
        paddingBottom: '2px'
      }}>
        <button
          onClick={() => setActiveTab('form')}
          style={{
            background: 'none',
            border: 'none',
            borderBottom: activeTab === 'form' ? '3px solid #0A6B6A' : '3px solid transparent',
            color: activeTab === 'form' ? '#0A6B6A' : '#64748b',
            padding: '12px 20px',
            fontSize: '0.95rem',
            fontWeight: 700,
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            marginBottom: '-2px'
          }}
        >
          Data Entry Form
        </button>
        <button
          onClick={() => setActiveTab('history')}
          style={{
            background: 'none',
            border: 'none',
            borderBottom: activeTab === 'history' ? '3px solid #0A6B6A' : '3px solid transparent',
            color: activeTab === 'history' ? '#0A6B6A' : '#64748b',
            padding: '12px 20px',
            fontSize: '0.95rem',
            fontWeight: 700,
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            marginBottom: '-2px'
          }}
        >
          Submission History
        </button>
      </div>

      {activeTab === 'form' ? (
        <div className="card">
          <h1 className="text-brand font-bold mb-2" style={{ fontSize: '2rem' }}>
            {financePlanningFormConfig.title}
          </h1>
          <p className="text-muted mb-6">
            {financePlanningFormConfig.introText}
          </p>
          <DataDonationForm 
            config={financePlanningFormConfig} 
            initialData={initialFormData} 
            onSubmit={handleFormSubmit} 
          />
        </div>
      ) : (
        <DataEntryView 
          partnerUser={partnerUser} 
          historyOnly={true} 
          onEdit={handleEditClick} 
        />
      )}
    </div>
  );
}
