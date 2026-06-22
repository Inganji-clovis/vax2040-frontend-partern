'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function NRAForm() {
  const router = useRouter();

  // ── Auth guard ────────────────────────────────────────────
  const [userName, setUserName] = useState('');
  useEffect(() => {
    const stored = localStorage.getItem('vax2040_partner_user');
    if (!stored) {
      router.replace('/select-role');
      return;
    }
    try {
      const user = JSON.parse(stored);
      setUserName(user.email || '');
    } catch {
      router.replace('/select-role');
    }
  }, [router]);

  const [formData, setFormData] = useState({
    gbtMaturityLevel: '',
    amaRatification: '',
    totalAuthorizations: '',
    domesticAuthorizations: '',
    foreignAuthorizations: '',
    averageTimelineDays: '',
    fastTrackPathway: '',
    localFacilitiesInspected: '',
    localFacilitiesNonCompliance: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('NRA Form Submitted:', formData);
    alert('Form submitted successfully!');
    router.push('/');
  };

  return (
    <div className="form-wrapper animate-fade-up">
      {/* ── Branded header banner ── */}
      <div style={{
        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
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

      <div className="card">
        <h1 className="text-brand font-bold mb-2" style={{ fontSize: '2rem' }}>
          National Regulatory Authority (NRA) Data Collection
        </h1>
        <p className="text-muted mb-6">
          This form is for government officials who approve medicines and oversee health regulations.
          Please share how your authority rates, registers products, and supports local manufacturers.
        </p>

        <form onSubmit={handleSubmit}>
          {/* Section 1: Institutional Maturity Rating */}
          <h2 className="form-section-title">1. Institutional Maturity Rating</h2>
          
          <div className="form-group">
            <label className="form-label">1.1 WHO Global Benchmarking Tool (GBT) Maturity Level</label>
            <div className="grid-4">
              <label className="form-check">
                <input type="radio" name="gbtMaturityLevel" value="ML1" className="form-check-input" onChange={handleChange} required />
                <span className="form-check-label">ML1</span>
              </label>
              <label className="form-check">
                <input type="radio" name="gbtMaturityLevel" value="ML2" className="form-check-input" onChange={handleChange} />
                <span className="form-check-label">ML2</span>
              </label>
              <label className="form-check">
                <input type="radio" name="gbtMaturityLevel" value="ML3" className="form-check-input" onChange={handleChange} />
                <span className="form-check-label">ML3</span>
              </label>
              <label className="form-check">
                <input type="radio" name="gbtMaturityLevel" value="ML4" className="form-check-input" onChange={handleChange} />
                <span className="form-check-label">ML4</span>
              </label>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">1.2 AMA (African Medicines Agency) Ratification Status</label>
            <div className="grid-3">
              <label className="form-check">
                <input type="radio" name="amaRatification" value="Ratified" className="form-check-input" onChange={handleChange} required />
                <span className="form-check-label">Ratified</span>
              </label>
              <label className="form-check">
                <input type="radio" name="amaRatification" value="Signed only" className="form-check-input" onChange={handleChange} />
                <span className="form-check-label">Signed only</span>
              </label>
              <label className="form-check">
                <input type="radio" name="amaRatification" value="No action" className="form-check-input" onChange={handleChange} />
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
                <input type="radio" name="fastTrackPathway" value="Yes" className="form-check-input" onChange={handleChange} required />
                <span className="form-check-label">a) Yes</span>
              </label>
              <label className="form-check">
                <input type="radio" name="fastTrackPathway" value="No" className="form-check-input" onChange={handleChange} />
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
    </div>
  );
}
