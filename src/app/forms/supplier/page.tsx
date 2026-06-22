'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function SupplierForm() {
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
    totalBudget: '',
    budgetLocal: '',
    budgetImported: '',
    essentialTotal: '',
    essentialLocal: '',
    essentialImported: '',
    vaccinesTotal: '',
    vaccinesLocal: '',
    vaccinesImported: '',
    maternalTotal: '',
    maternalLocal: '',
    maternalImported: '',
    leadTimeLocal: '',
    leadTimeInternational: '',
    stockoutsLocal: '',
    pricePreferenceLocal: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Supplier Form Submitted:', formData);
    alert('Form submitted successfully!');
    router.push('/');
  };

  return (
    <div className="form-wrapper animate-fade-up">
      {/* ── Branded header banner ── */}
      <div style={{
        background: 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)',
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
            Form 03 — Central Medical Supply
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '0.75rem', opacity: 0.75, marginBottom: '4px' }}>Signed in as</div>
          <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>{userName || '—'}</div>
        </div>
      </div>

      <div className="card">
        <h1 className="text-brand font-bold mb-2" style={{ fontSize: '2rem' }}>
          Central Medical Supply Data Collection
        </h1>
        <p className="text-muted mb-6">
          This form is for the person in charge of buying and distributing medicines for your country.
          Please share your budget, where medicines come from, and how reliable your suppliers are.
        </p>

        <form onSubmit={handleSubmit}>
          {/* Section 1: Procurement Portfolio Split */}
          <h2 className="form-section-title">1. Procurement Portfolio Split</h2>
          
          <div className="form-group">
            <label className="form-label" htmlFor="totalBudget">1.1 Total annual pharmaceutical procurement budget (USD)</label>
            <input type="number" id="totalBudget" name="totalBudget" className="form-control" placeholder="e.g., 5000000" min="0" value={formData.totalBudget} onChange={handleChange} required />
          </div>

          <div className="grid-2">
            <div className="form-group">
              <label className="form-label" htmlFor="budgetLocal">1.2 % spent on products manufactured in Africa</label>
              <input type="number" id="budgetLocal" name="budgetLocal" className="form-control" placeholder="0 - 100" min="0" max="100" value={formData.budgetLocal} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="budgetImported">1.3 % spent on products imported from outside Africa</label>
              <input type="number" id="budgetImported" name="budgetImported" className="form-control" placeholder="0 - 100" min="0" max="100" value={formData.budgetImported} onChange={handleChange} />
            </div>
          </div>

          {/* Section 2: Product Category Sourcing Breakdown */}
          <h2 className="form-section-title">2. Product Category Sourcing Breakdown</h2>
          
          <div className="card mb-4" style={{ padding: '16px', background: 'rgba(255,255,255,0.5)', border: '1px solid var(--border)' }}>
            <h3 className="form-label mb-3" style={{ fontSize: '1rem', color: 'var(--text-primary)' }}>2.1 Essential Medicines</h3>
            <div className="form-group mb-3">
              <label className="form-label" htmlFor="essentialTotal">Overall % of total portfolio</label>
              <input type="number" id="essentialTotal" name="essentialTotal" className="form-control" placeholder="0 - 100" min="0" max="100" value={formData.essentialTotal} onChange={handleChange} />
            </div>
            <div className="grid-2">
              <div className="form-group mb-0">
                <label className="form-label" htmlFor="essentialLocal">a) Local %</label>
                <input type="number" id="essentialLocal" name="essentialLocal" className="form-control" placeholder="0 - 100" min="0" max="100" value={formData.essentialLocal} onChange={handleChange} />
              </div>
              <div className="form-group mb-0">
                <label className="form-label" htmlFor="essentialImported">b) Imported %</label>
                <input type="number" id="essentialImported" name="essentialImported" className="form-control" placeholder="0 - 100" min="0" max="100" value={formData.essentialImported} onChange={handleChange} />
              </div>
            </div>
          </div>

          <div className="card mb-4" style={{ padding: '16px', background: 'rgba(255,255,255,0.5)', border: '1px solid var(--border)' }}>
            <h3 className="form-label mb-3" style={{ fontSize: '1rem', color: 'var(--text-primary)' }}>2.2 Vaccines</h3>
            <div className="form-group mb-3">
              <label className="form-label" htmlFor="vaccinesTotal">Overall % of total portfolio</label>
              <input type="number" id="vaccinesTotal" name="vaccinesTotal" className="form-control" placeholder="0 - 100" min="0" max="100" value={formData.vaccinesTotal} onChange={handleChange} />
            </div>
            <div className="grid-2">
              <div className="form-group mb-0">
                <label className="form-label" htmlFor="vaccinesLocal">a) Local %</label>
                <input type="number" id="vaccinesLocal" name="vaccinesLocal" className="form-control" placeholder="0 - 100" min="0" max="100" value={formData.vaccinesLocal} onChange={handleChange} />
              </div>
              <div className="form-group mb-0">
                <label className="form-label" htmlFor="vaccinesImported">b) Imported %</label>
                <input type="number" id="vaccinesImported" name="vaccinesImported" className="form-control" placeholder="0 - 100" min="0" max="100" value={formData.vaccinesImported} onChange={handleChange} />
              </div>
            </div>
          </div>

          <div className="card mb-4" style={{ padding: '16px', background: 'rgba(255,255,255,0.5)', border: '1px solid var(--border)' }}>
            <h3 className="form-label mb-3" style={{ fontSize: '1rem', color: 'var(--text-primary)' }}>2.3 Maternal/Child Health</h3>
            <div className="form-group mb-3">
              <label className="form-label" htmlFor="maternalTotal">Overall % of total portfolio</label>
              <input type="number" id="maternalTotal" name="maternalTotal" className="form-control" placeholder="0 - 100" min="0" max="100" value={formData.maternalTotal} onChange={handleChange} />
            </div>
            <div className="grid-2">
              <div className="form-group mb-0">
                <label className="form-label" htmlFor="maternalLocal">a) Local %</label>
                <input type="number" id="maternalLocal" name="maternalLocal" className="form-control" placeholder="0 - 100" min="0" max="100" value={formData.maternalLocal} onChange={handleChange} />
              </div>
              <div className="form-group mb-0">
                <label className="form-label" htmlFor="maternalImported">b) Imported %</label>
                <input type="number" id="maternalImported" name="maternalImported" className="form-control" placeholder="0 - 100" min="0" max="100" value={formData.maternalImported} onChange={handleChange} />
              </div>
            </div>
          </div>

          {/* Section 3: Supply Chain Reliability & Tenders */}
          <h2 className="form-section-title">3. Supply Chain Reliability & Tenders</h2>

          <div className="grid-2">
            <div className="form-group">
              <label className="form-label" htmlFor="leadTimeLocal">3.1 Average lead time for local manufacturers (days)</label>
              <input type="number" id="leadTimeLocal" name="leadTimeLocal" className="form-control" placeholder="e.g., 30" min="0" value={formData.leadTimeLocal} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="leadTimeInternational">3.2 Average lead time for international (days)</label>
              <input type="number" id="leadTimeInternational" name="leadTimeInternational" className="form-control" placeholder="e.g., 90" min="0" value={formData.leadTimeInternational} onChange={handleChange} />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">3.3 Frequency of stockouts due to local supplier failure</label>
            <div className="grid-3">
              <label className="form-check">
                <input type="radio" name="stockoutsLocal" value="Frequent" className="form-check-input" onChange={handleChange} required />
                <span className="form-check-label">a) Frequent</span>
              </label>
              <label className="form-check">
                <input type="radio" name="stockoutsLocal" value="Occasional" className="form-check-input" onChange={handleChange} />
                <span className="form-check-label">b) Occasional</span>
              </label>
              <label className="form-check">
                <input type="radio" name="stockoutsLocal" value="Never" className="form-check-input" onChange={handleChange} />
                <span className="form-check-label">c) Never</span>
              </label>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">3.4 Do public tenders give price preferences to local manufacturers?</label>
            <div className="grid-2">
              <label className="form-check">
                <input type="radio" name="pricePreferenceLocal" value="Yes" className="form-check-input" onChange={handleChange} required />
                <span className="form-check-label">a) Yes</span>
              </label>
              <label className="form-check">
                <input type="radio" name="pricePreferenceLocal" value="No" className="form-check-input" onChange={handleChange} />
                <span className="form-check-label">b) No</span>
              </label>
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
