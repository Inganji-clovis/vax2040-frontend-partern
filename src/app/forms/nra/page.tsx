'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DataEntryView from '../../../components/DataEntryView';
import { PartnerUser } from '../../../components/LoginView';

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export default function NRAForm() {
  const router = useRouter();

  // ── Auth guard & tab settings ──────────────────────────────
  const [userName, setUserName] = useState('');
  const [partnerUser, setPartnerUser] = useState<PartnerUser | null>(null);
  const [activeTab, setActiveTab] = useState<'form' | 'history'>('form');
  const [reportingYear, setReportingYear] = useState('2024');
  const [reportingMonth, setReportingMonth] = useState('January');
  const [editingSub, setEditingSub] = useState<any>(null);

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

  const [formData, setFormData] = useState({
    gbtMaturityLevel: 'ML3',
    amaRatification: 'Ratified',
    totalAuthorizations: '',
    domesticAuthorizations: '',
    foreignAuthorizations: '',
    averageTimelineDays: '',
    fastTrackPathway: 'Yes',
    localFacilitiesInspected: '',
    localFacilitiesNonCompliance: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleEditClick = (sub: any) => {
    setEditingSub(sub);
    setReportingYear(sub.reportingYear || '2024');
    setReportingMonth(sub.reportingMonth || 'January');
    
    setFormData({
      gbtMaturityLevel: sub.gbtLevel || 'ML3',
      amaRatification: sub.amaRatified === 'Yes' ? 'Ratified' : 'No action',
      totalAuthorizations: String(sub.totalMAs || ''),
      domesticAuthorizations: String(sub.localMAs || ''),
      foreignAuthorizations: String((sub.totalMAs || 0) - (sub.localMAs || 0) || ''),
      averageTimelineDays: String(sub.medianApprovalTime ? sub.medianApprovalTime * 30 : ''),
      fastTrackPathway: sub.acceleratedPathway || 'Yes',
      localFacilitiesInspected: String(sub.gmpInspections || ''),
      localFacilitiesNonCompliance: String(sub.nonCompliantFacilities || '')
    });

    setActiveTab('form');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const submissionData = {
      reportingYear: reportingYear,
      reportingMonth: reportingMonth,
      gbtLevel: formData.gbtMaturityLevel || 'ML3',
      amaRatified: formData.amaRatification === 'Ratified' ? 'Yes' : 'No',
      gmpInspections: Number(formData.localFacilitiesInspected) || 0,
      nonCompliantFacilities: Number(formData.localFacilitiesNonCompliance) || 0,
      totalMAs: Number(formData.totalAuthorizations) || 0,
      localMAs: Number(formData.domesticAuthorizations) || 0,
      medianApprovalTime: Number(formData.averageTimelineDays) ? Math.round(Number(formData.averageTimelineDays) / 30) : 6,
      acceleratedPathway: formData.fastTrackPathway,
      notes: `Fast track registration pathways: ${formData.fastTrackPathway}. GBT Maturity: ${formData.gbtMaturityLevel}`
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
        partnerId: partnerUser?.email || userName || 'analyst@fda.gov.rw',
        partnerName: partnerUser?.org || 'Regulator (NRA)',
        status: 'submitted',
        trustScore: 5,
        createdAt: new Date().toISOString(),
        formType: 'Regulator (NRA)',
        nraName: partnerUser?.org || 'Rwanda Food and Drugs Authority',
        regionalHarmonisation: 'Yes',
        regionalScheme: 'EAC MRH',
        installedCapacity: 50000000,
        capacityUtilisation: 45,
        productionLines: 4,
        techPlatforms: ['mRNA', 'solid dose (tablets/capsules)'],
        batchCertificates: 85,
        apiAfricaPct: 5,
        packagingAfricaPct: 20,
        techTransfer: 'Yes',
        techTransferPartner: 'BioNTech SE',
        newLocalMAs: 15,
        ...submissionData
      };
      updated = [newSub, ...currentList];
      alert('Form submitted successfully!');
    }

    localStorage.setItem('vax2040_partner_submissions', JSON.stringify(updated));

    // Reset form fields
    setFormData({
      gbtMaturityLevel: 'ML3',
      amaRatification: 'Ratified',
      totalAuthorizations: '',
      domesticAuthorizations: '',
      foreignAuthorizations: '',
      averageTimelineDays: '',
      fastTrackPathway: 'Yes',
      localFacilitiesInspected: '',
      localFacilitiesNonCompliance: ''
    });

    setActiveTab('history');
  };

  return (
    <div className="form-wrapper animate-fade-up">
      {/* ── Branded header banner ── */}
      <div style={{
        background: 'linear-gradient(135deg, #0A6B6A 0%, #085453 100%)',
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
            VAX PHARMA 2040 · Kigali, Rwanda
          </div>
          <div style={{ fontSize: '1.2rem', fontWeight: 800 }}>Africa Pharmaceutical Sovereignty</div>
          <div style={{ fontSize: '0.88rem', opacity: 0.85, marginTop: '4px' }}>
            Form 02 — National Regulatory Authority
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
            National Regulatory Authority (NRA) Data Collection
          </h1>
          <p className="text-muted mb-6">
            This form is for government officials who approve medicines and oversee health regulations.
            Please share how your authority rates, registers products, and supports local manufacturers.
          </p>

          <form onSubmit={handleSubmit}>
            {/* Reporting Period Selectors */}
            <h2 className="form-section-title">0. Reporting Period</h2>
            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Reporting Year *</label>
                <select 
                  className="form-control" 
                  value={reportingYear} 
                  onChange={(e) => setReportingYear(e.target.value)}
                >
                  {Array.from({ length: 15 }, (_, i) => String(2016 + i)).map(y => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Reporting Month *</label>
                <select 
                  className="form-control" 
                  value={reportingMonth} 
                  onChange={(e) => setReportingMonth(e.target.value)}
                >
                  {MONTHS.map(m => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Section 1: Institutional Maturity Rating */}
            <h2 className="form-section-title">1. Institutional Maturity Rating</h2>
            
            <div className="form-group">
              <label className="form-label">1.1 WHO Global Benchmarking Tool (GBT) Maturity Level</label>
              <div className="grid-4">
                <label className="form-check">
                  <input type="radio" name="gbtMaturityLevel" value="ML1" className="form-check-input" checked={formData.gbtMaturityLevel === 'ML1'} onChange={handleChange} required />
                  <span className="form-check-label">ML1</span>
                </label>
                <label className="form-check">
                  <input type="radio" name="gbtMaturityLevel" value="ML2" className="form-check-input" checked={formData.gbtMaturityLevel === 'ML2'} onChange={handleChange} />
                  <span className="form-check-label">ML2</span>
                </label>
                <label className="form-check">
                  <input type="radio" name="gbtMaturityLevel" value="ML3" className="form-check-input" checked={formData.gbtMaturityLevel === 'ML3'} onChange={handleChange} />
                  <span className="form-check-label">ML3</span>
                </label>
                <label className="form-check">
                  <input type="radio" name="gbtMaturityLevel" value="ML4" className="form-check-input" checked={formData.gbtMaturityLevel === 'ML4'} onChange={handleChange} />
                  <span className="form-check-label">ML4</span>
                </label>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">1.2 AMA (African Medicines Agency) Ratification Status</label>
              <div className="grid-3">
                <label className="form-check">
                  <input type="radio" name="amaRatification" value="Ratified" className="form-check-input" checked={formData.amaRatification === 'Ratified'} onChange={handleChange} required />
                  <span className="form-check-label">Ratified</span>
                </label>
                <label className="form-check">
                  <input type="radio" name="amaRatification" value="Signed only" className="form-check-input" checked={formData.amaRatification === 'Signed only'} onChange={handleChange} />
                  <span className="form-check-label">Signed only</span>
                </label>
                <label className="form-check">
                  <input type="radio" name="amaRatification" value="No action" className="form-check-input" checked={formData.amaRatification === 'No action'} onChange={handleChange} />
                  <span className="form-check-label">No action</span>
                </label>
              </div>
            </div>

            {/* Section 2: Registration & Marketing Authorization */}
            <h2 className="form-section-title">2. Registration & Marketing Authorization (Current Year)</h2>
            
            <div className="grid-2">
              <div className="form-group">
                <label className="form-label" htmlFor="totalAuthorizations">2.1 Total marketing authorizations granted</label>
                <input type="number" id="totalAuthorizations" name="totalAuthorizations" className="form-control" placeholder="e.g., 150" min="0" value={formData.totalAuthorizations} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="domesticAuthorizations">2.2 Number of authorizations (domestic)</label>
                <input type="number" id="domesticAuthorizations" name="domesticAuthorizations" className="form-control" placeholder="e.g., 50" min="0" value={formData.domesticAuthorizations} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="foreignAuthorizations">2.3 Number of authorizations (foreign)</label>
                <input type="number" id="foreignAuthorizations" name="foreignAuthorizations" className="form-control" placeholder="e.g., 100" min="0" value={formData.foreignAuthorizations} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="averageTimelineDays">2.4 Average timeline for domestic (days)</label>
                <input type="number" id="averageTimelineDays" name="averageTimelineDays" className="form-control" placeholder="e.g., 90" min="0" value={formData.averageTimelineDays} onChange={handleChange} />
              </div>
            </div>

            {/* Section 3: Local Manufacturing Incentives & Oversight */}
            <h2 className="form-section-title">3. Local Manufacturing Incentives & Oversight</h2>

            <div className="form-group">
              <label className="form-label">3.1 Are there fast-track registration pathways for local products?</label>
              <div className="grid-2">
                <label className="form-check">
                  <input type="radio" name="fastTrackPathway" value="Yes" className="form-check-input" checked={formData.fastTrackPathway === 'Yes'} onChange={handleChange} required />
                  <span className="form-check-label">a) Yes</span>
                </label>
                <label className="form-check">
                  <input type="radio" name="fastTrackPathway" value="No" className="form-check-input" checked={formData.fastTrackPathway === 'No'} onChange={handleChange} />
                  <span className="form-check-label">b) No</span>
                </label>
              </div>
            </div>

            <div className="grid-2">
              <div className="form-group">
                <label className="form-label" htmlFor="localFacilitiesInspected">3.2 Number of local facilities inspected this year</label>
                <input type="number" id="localFacilitiesInspected" name="localFacilitiesInspected" className="form-control" placeholder="e.g., 12" min="0" value={formData.localFacilitiesInspected} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="localFacilitiesNonCompliance">3.3 Number of local facilities issued non-compliance notices</label>
                <input type="number" id="localFacilitiesNonCompliance" name="localFacilitiesNonCompliance" className="form-control" placeholder="e.g., 2" min="0" value={formData.localFacilitiesNonCompliance} onChange={handleChange} />
              </div>
            </div>

            <div className="divider"></div>
            
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '16px' }}>
              <button type="button" className="btn btn-outline" onClick={() => window.history.back()}>Cancel</button>
              <button type="submit" className="btn btn-primary">Submit Form</button>
            </div>
          </form>
        </div>
      ) : (
        <DataEntryView partnerUser={partnerUser} historyOnly={true} onEdit={handleEditClick} />
      )}
    </div>
  );
}
