'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ManufacturerForm() {
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
    companyName: '',
    country: '',
    gmpStatus: [] as string[],
    facilityType: [] as string[],
    totalCapacity: '',
    capacityUtilization: '',
    volumeMedicines: '',
    volumeVaccines: '',
    apiSourcedAfrica: '',
    packagingSourcedAfrica: '',
    primaryOriginRawMaterials: '',
    percentPublicMarket: '',
    percentPrivateMarket: '',
    countriesExported: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked } = e.target;
    setFormData(prev => {
      const currentList = prev[name as keyof typeof prev] as string[];
      if (checked) {
        return { ...prev, [name]: [...currentList, value] };
      } else {
        return { ...prev, [name]: currentList.filter(item => item !== value) };
      }
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Manufacturer Form Submitted:', formData);
    alert('Form submitted successfully!');
    router.push('/');
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
            Form 01 — Local Pharmaceutical Manufacturer
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '0.75rem', opacity: 0.75, marginBottom: '4px' }}>Signed in as</div>
          <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>{userName || '—'}</div>
        </div>
      </div>

      <div className="card">
        <h1 className="text-brand font-bold mb-2" style={{ fontSize: '2rem' }}>
          Local Manufacturer Data Collection
        </h1>
        <p className="text-muted mb-6">
          This form is for the person in charge of production at your medicine or vaccine factory.
          Please fill in the details about your facility, how much you produce, and where your materials come from.
        </p>

        <form onSubmit={handleSubmit}>
          {/* Section 1: Facility & Licensing Profile */}
          <h2 className="form-section-title">1. Facility & Licensing Profile</h2>
          
          <div className="grid-2">
            <div className="form-group">
              <label className="form-label" htmlFor="companyName">1.1 Company Name</label>
              <input 
                type="text" 
                id="companyName" 
                name="companyName" 
                className="form-control" 
                placeholder="Enter company name"
                value={formData.companyName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="country">1.2 Country of Operation</label>
              <input 
                type="text" 
                id="country" 
                name="country" 
                className="form-control" 
                placeholder="Enter country"
                value={formData.country}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">1.3 GMP Certification Status (Select all that apply)</label>
            <div className="grid-2">
              <label className="form-check">
                <input type="checkbox" name="gmpStatus" value="WHO GMP" className="form-check-input" checked={formData.gmpStatus.includes('WHO GMP')} onChange={handleCheckboxChange} />
                <span className="form-check-label">a) WHO GMP</span>
              </label>
              <label className="form-check">
                <input type="checkbox" name="gmpStatus" value="National GMP" className="form-check-input" checked={formData.gmpStatus.includes('National GMP')} onChange={handleCheckboxChange} />
                <span className="form-check-label">b) National GMP</span>
              </label>
              <label className="form-check">
                <input type="checkbox" name="gmpStatus" value="PIC/S" className="form-check-input" checked={formData.gmpStatus.includes('PIC/S')} onChange={handleCheckboxChange} />
                <span className="form-check-label">c) PIC/S</span>
              </label>
              <label className="form-check">
                <input type="checkbox" name="gmpStatus" value="None" className="form-check-input" checked={formData.gmpStatus.includes('None')} onChange={handleCheckboxChange} />
                <span className="form-check-label">d) None</span>
              </label>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">1.4 Facility Type (Select all that apply)</label>
            <div className="grid-2">
              <label className="form-check">
                <input type="checkbox" name="facilityType" value="Fill & Finish" className="form-check-input" checked={formData.facilityType.includes('Fill & Finish')} onChange={handleCheckboxChange} />
                <span className="form-check-label">a) Fill & Finish</span>
              </label>
              <label className="form-check">
                <input type="checkbox" name="facilityType" value="API Manufacturing" className="form-check-input" checked={formData.facilityType.includes('API Manufacturing')} onChange={handleCheckboxChange} />
                <span className="form-check-label">b) API Manufacturing</span>
              </label>
              <label className="form-check">
                <input type="checkbox" name="facilityType" value="Formulation (Oral Solid)" className="form-check-input" checked={formData.facilityType.includes('Formulation (Oral Solid)')} onChange={handleCheckboxChange} />
                <span className="form-check-label">c) Formulation (Oral Solid)</span>
              </label>
              <label className="form-check">
                <input type="checkbox" name="facilityType" value="Biologics/Vaccines" className="form-check-input" checked={formData.facilityType.includes('Biologics/Vaccines')} onChange={handleCheckboxChange} />
                <span className="form-check-label">d) Biologics/Vaccines</span>
              </label>
            </div>
          </div>

          {/* Section 2: Capacity & Production Output */}
          <h2 className="form-section-title">2. Capacity & Production Output (Annual)</h2>
          
          <div className="grid-2">
            <div className="form-group">
              <label className="form-label" htmlFor="totalCapacity">2.1 Total Installed Capacity (Units/Year)</label>
              <input type="number" id="totalCapacity" name="totalCapacity" className="form-control" placeholder="e.g., 1000000" value={formData.totalCapacity} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="capacityUtilization">2.2 Current Capacity Utilization Rate (%)</label>
              <input type="number" id="capacityUtilization" name="capacityUtilization" className="form-control" placeholder="0 - 100" min="0" max="100" value={formData.capacityUtilization} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="volumeMedicines">2.3 Volume of Medicines Produced (Current Year)</label>
              <input type="number" id="volumeMedicines" name="volumeMedicines" className="form-control" placeholder="Volume in units" value={formData.volumeMedicines} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="volumeVaccines">2.4 Volume of Vaccines Produced (Current Year)</label>
              <input type="number" id="volumeVaccines" name="volumeVaccines" className="form-control" placeholder="Volume in units" value={formData.volumeVaccines} onChange={handleChange} />
            </div>
          </div>

          {/* Section 3: Sourcing & Supply Chain Independence */}
          <h2 className="form-section-title">3. Sourcing & Supply Chain Independence</h2>

          <div className="grid-2">
            <div className="form-group">
              <label className="form-label" htmlFor="apiSourcedAfrica">3.1 % of APIs sourced within Africa</label>
              <input type="number" id="apiSourcedAfrica" name="apiSourcedAfrica" className="form-control" placeholder="0 - 100" min="0" max="100" value={formData.apiSourcedAfrica} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="packagingSourcedAfrica">3.2 % of Packaging materials sourced within Africa</label>
              <input type="number" id="packagingSourcedAfrica" name="packagingSourcedAfrica" className="form-control" placeholder="0 - 100" min="0" max="100" value={formData.packagingSourcedAfrica} onChange={handleChange} />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="primaryOriginRawMaterials">3.3 Primary country of origin for imported raw materials</label>
            <input type="text" id="primaryOriginRawMaterials" name="primaryOriginRawMaterials" className="form-control" placeholder="e.g., India, China" value={formData.primaryOriginRawMaterials} onChange={handleChange} />
          </div>

          {/* Section 4: Market & Export Reach */}
          <h2 className="form-section-title">4. Market & Export Reach</h2>
          
          <div className="grid-3">
            <div className="form-group">
              <label className="form-label" htmlFor="percentPublicMarket">4.1 % to domestic public market</label>
              <input type="number" id="percentPublicMarket" name="percentPublicMarket" className="form-control" placeholder="0 - 100" min="0" max="100" value={formData.percentPublicMarket} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="percentPrivateMarket">4.2 % to domestic private market</label>
              <input type="number" id="percentPrivateMarket" name="percentPrivateMarket" className="form-control" placeholder="0 - 100" min="0" max="100" value={formData.percentPrivateMarket} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="countriesExported">4.3 Number of African countries exported to</label>
              <input type="number" id="countriesExported" name="countriesExported" className="form-control" placeholder="e.g., 5" min="0" value={formData.countriesExported} onChange={handleChange} />
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
