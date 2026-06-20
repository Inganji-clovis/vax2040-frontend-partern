'use client';
import { useState, useEffect } from 'react';
import styles from './DataEntryView.module.css';
import { PartnerUser } from './LoginView';
import {
  FileText, CheckCircle2, AlertCircle, Trash2, Edit3, Plus, X, Upload, ArrowLeft, ClipboardList
} from 'lucide-react';

interface Props {
  partnerUser: PartnerUser | null;
  existingCount: number;
}

export interface PartnerSubmission {
  id: string;
  partnerId: string;
  partnerName: string;
  reportingYear: string;
  reportingMonth: string;
  vaccineValue: number;
  medicineValue: number;
  status: 'draft' | 'published' | 'rejected';
  trustScore: number;
  createdAt: string;
  evidenceUrl?: string;
  notes?: string;
}

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const MOCK_SUBMISSIONS: PartnerSubmission[] = [
  {
    id: 'sub_1',
    partnerId: 'reporter@biontech.rw',
    partnerName: 'BioNTech Rwanda',
    reportingYear: '2023',
    reportingMonth: 'November',
    vaccineValue: 12500000,
    medicineValue: 0,
    status: 'published',
    trustScore: 5,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    evidenceUrl: 'biontech_prod_report_2023.pdf',
    notes: 'Ex-factory values audited by Ernst & Young.'
  },
  {
    id: 'sub_2',
    partnerId: 'reporter@biontech.rw',
    partnerName: 'BioNTech Rwanda',
    reportingYear: '2022',
    reportingMonth: 'May',
    vaccineValue: 8800000,
    medicineValue: 0,
    status: 'published',
    trustScore: 5,
    createdAt: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString(),
    evidenceUrl: 'biontech_prod_report_2022.pdf'
  },
  {
    id: 'sub_3',
    partnerId: 'reporter@biontech.rw',
    partnerName: 'BioNTech Rwanda',
    reportingYear: '2024',
    reportingMonth: 'June',
    vaccineValue: 15200000,
    medicineValue: 1200000,
    status: 'draft',
    trustScore: 5,
    createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    notes: 'Initial Q1-Q3 figures entered manually. Auditing document pending.'
  }
];

export default function DataEntryView({ partnerUser }: Props) {
  const [submissions, setSubmissions] = useState<PartnerSubmission[]>([]);
  const [viewMode, setViewMode] = useState<'list' | 'form'>('list');
  const [editingSub, setEditingSub] = useState<PartnerSubmission | null>(null);

  // Form inputs
  const [reportingYear, setReportingYear] = useState('2024');
  const [reportingMonth, setReportingMonth] = useState('January');
  const [vaccineValue, setVaccineValue] = useState('');
  const [medicineValue, setMedicineValue] = useState('');
  const [evidenceFile, setEvidenceFile] = useState<string>('');
  const [notes, setNotes] = useState('');

  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Load from local storage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('vax2040_partner_submissions');
      if (stored) {
        try {
          setSubmissions(JSON.parse(stored));
        } catch {
          setSubmissions(MOCK_SUBMISSIONS);
        }
      } else {
        setSubmissions(MOCK_SUBMISSIONS);
        localStorage.setItem('vax2040_partner_submissions', JSON.stringify(MOCK_SUBMISSIONS));
      }
    }
  }, []);

  if (!partnerUser) {
    return (
      <div className={styles.unauthorized}>
        <AlertCircle size={48} className={styles.unauthIcon} />
        <h2>Authentication Required</h2>
        <p>You must be signed in as a verified pharmaceutical manufacturer or partner organization to access the workspace feeds.</p>
        <a href="/auth" className={styles.unauthBtn}>Sign In to Account</a>
      </div>
    );
  }

  const handleSaveSubmission = (e: React.FormEvent, asDraft: boolean) => {
    e.preventDefault();
    if (isNaN(Number(vaccineValue)) || Number(vaccineValue) < 0) {
      setNotification({ type: 'error', message: 'Please enter a valid Vaccine Production Value.' });
      return;
    }
    if (isNaN(Number(medicineValue)) || Number(medicineValue) < 0) {
      setNotification({ type: 'error', message: 'Please enter a valid Medicine Production Value.' });
      return;
    }

    const currentYear = reportingYear;
    const currentMonth = reportingMonth;
    const isDuplicate = submissions.some(
      s => s.reportingYear === currentYear && 
      s.reportingMonth === currentMonth &&
      s.partnerId === partnerUser.email && 
      (!editingSub || s.id !== editingSub.id)
    );

    if (isDuplicate) {
      setNotification({ type: 'error', message: `A submission for the period ${currentMonth} ${currentYear} already exists.` });
      return;
    }

    let updatedList: PartnerSubmission[] = [];

    if (editingSub) {
      // Update existing
      updatedList = submissions.map(s => {
        if (s.id === editingSub.id) {
          return {
            ...s,
            reportingYear,
            reportingMonth,
            vaccineValue: Number(vaccineValue),
            medicineValue: Number(medicineValue),
            evidenceUrl: evidenceFile || s.evidenceUrl,
            notes,
            status: asDraft ? 'draft' : 'published',
            createdAt: new Date().toISOString()
          };
        }
        return s;
      });
      setNotification({ type: 'success', message: 'Submission updated successfully.' });
    } else {
      // Add new
      const newSub: PartnerSubmission = {
        id: 'sub_' + Math.random().toString(36).substr(2, 9),
        partnerId: partnerUser.email,
        partnerName: partnerUser.org,
        reportingYear,
        reportingMonth,
        vaccineValue: Number(vaccineValue),
        medicineValue: Number(medicineValue),
        status: asDraft ? 'draft' : 'published',
        trustScore: 5,
        createdAt: new Date().toISOString(),
        evidenceUrl: evidenceFile || undefined,
        notes: notes || undefined
      };
      updatedList = [newSub, ...submissions];
      setNotification({ type: 'success', message: 'Production data submitted successfully.' });
    }

    setSubmissions(updatedList);
    localStorage.setItem('vax2040_partner_submissions', JSON.stringify(updatedList));

    // Clear form and go back to list
    handleCancelForm();
  };

  const handleEditClick = (sub: PartnerSubmission) => {
    if (sub.status !== 'draft') {
      alert("Only draft submissions can be edited. Published or rejected data points require administration overrides.");
      return;
    }
    setEditingSub(sub);
    setReportingYear(sub.reportingYear);
    setReportingMonth(sub.reportingMonth);
    setVaccineValue(String(sub.vaccineValue));
    setMedicineValue(String(sub.medicineValue));
    setEvidenceFile(sub.evidenceUrl || '');
    setNotes(sub.notes || '');
    setViewMode('form');
  };

  const handleDeleteClick = (sub: PartnerSubmission) => {
    if (sub.status !== 'draft') {
      alert("Only draft submissions can be deleted.");
      return;
    }

    const elapsedMs = new Date().getTime() - new Date(sub.createdAt).getTime();
    const twoHoursMs = 2 * 60 * 60 * 1000;
    if (elapsedMs >= twoHoursMs) {
      alert("Deletion window has expired. Submissions can only be deleted within 2 hours of registration.");
      return;
    }

    if (confirm("Are you sure you want to delete this submission draft?")) {
      const updatedList = submissions.filter(s => s.id !== sub.id);
      setSubmissions(updatedList);
      localStorage.setItem('vax2040_partner_submissions', JSON.stringify(updatedList));
      setNotification({ type: 'success', message: 'Draft deleted successfully.' });
    }
  };

  const handleCancelForm = () => {
    setEditingSub(null);
    setReportingYear('2024');
    setReportingMonth('January');
    setVaccineValue('');
    setMedicineValue('');
    setEvidenceFile('');
    setNotes('');
    setViewMode('list');
  };

  const isDeleteExpired = (createdAt: string) => {
    const elapsedMs = new Date().getTime() - new Date(createdAt).getTime();
    const twoHoursMs = 2 * 60 * 60 * 1000;
    return elapsedMs >= twoHoursMs;
  };

  const getDeleteTooltip = (sub: PartnerSubmission) => {
    if (sub.status !== 'draft') return "Only draft submissions can be deleted";
    const elapsedMs = new Date().getTime() - new Date(sub.createdAt).getTime();
    const twoHoursMs = 2 * 60 * 60 * 1000;
    const remainingMs = twoHoursMs - elapsedMs;
    if (remainingMs <= 0) return "Delete disabled (2-hour window expired)";
    const remainingMins = Math.ceil(remainingMs / (1000 * 60));
    if (remainingMins > 60) {
      const hours = Math.floor(remainingMins / 60);
      const mins = remainingMins % 60;
      return `Delete draft (Allowed for another ${hours}h ${mins}m)`;
    }
    return `Delete draft (Allowed for another ${remainingMins}m)`;
  };

  const fmtVal = (val: number) => {
    return `$${val.toLocaleString()}`;
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const mySubmissions = submissions.filter(s => s.partnerId === partnerUser.email);
  const totalVaccines = mySubmissions.reduce((sum, s) => sum + s.vaccineValue, 0);
  const totalMedicines = mySubmissions.reduce((sum, s) => sum + s.medicineValue, 0);

  return (
    <div className={styles.container}>
      {/* HEADER SECTION */}
      <div className={styles.header}>
        <div className={styles.titleArea}>
          <div className={styles.partnerNameLabel}>Logged in as: <strong>{partnerUser.org}</strong></div>
          <h1 className={styles.title}>Production Feed Workspace</h1>
          <p className={styles.sub}>
            Submit your local pharmaceutical production outputs. These values will be verified against UN Comtrade indices to compile national sovereign ratios.
          </p>
        </div>

        {viewMode === 'list' && (
          <button className={styles.submitNewBtn} onClick={() => setViewMode('form')}>
            <Plus size={16} /> Submit New Production Data
          </button>
        )}
      </div>

      {notification && (
        <div className={`${styles.alert} ${notification.type === 'success' ? styles.alertSuccess : styles.alertError}`}>
          <AlertCircle size={16} />
          <span>{notification.message}</span>
          <button className={styles.alertClose} onClick={() => setNotification(null)}><X size={14} /></button>
        </div>
      )}

      {viewMode === 'list' ? (
        <>
          {/* STATS OVERVIEW CARDS */}
          <div className={styles.statsRow}>
            <div className={styles.statCard}>
              <span className={styles.statLabel}>Submissions logged</span>
              <span className={styles.statValue}>{mySubmissions.length} Reports</span>
            </div>
            <div className={styles.statCard}>
              <span className={styles.statLabel}>Total Vaccines Logged</span>
              <span className={styles.statValue}>{fmtVal(totalVaccines)}</span>
            </div>
            <div className={styles.statCard}>
              <span className={styles.statLabel}>Total Medicines Logged</span>
              <span className={styles.statValue}>{fmtVal(totalMedicines)}</span>
            </div>
            <div className={styles.statCard}>
              <span className={styles.statLabel}>Manufacturer Trust Rating</span>
              <span className={styles.statValue} style={{ color: '#00B087', display: 'flex', alignItems: 'center', gap: '6px', justifyContent: 'flex-end' }}>
                5 / 5 <CheckCircle2 size={18} />
              </span>
            </div>
          </div>

          {/* TABLE LOG LIST */}
          <div className={styles.managerSection}>
            <div className={styles.managerHeader}>
              <h2 className={styles.sectionTitle}>Historical Submissions Feed</h2>
              <p className={styles.sectionDesc}>List of ex-factory reports submitted by your manufacturing centers.</p>
            </div>

            {mySubmissions.length === 0 ? (
              <div className={styles.emptyState}>
                <ClipboardList size={40} className={styles.emptyIcon} />
                <p className={styles.emptyText}>No historical records found</p>
                <p className={styles.emptySub}>Click the "Submit New Production Data" button above to log your first output metrics.</p>
              </div>
            ) : (
              <div className={styles.tableWrapper}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Reporting Period</th>
                      <th>Vaccine Production Value (USD)</th>
                      <th>Medicine Production Value (USD)</th>
                      <th>Verification Status</th>
                      <th>Trust Rating</th>
                      <th>Date Logged</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mySubmissions.map(sub => {
                      const isEditable = sub.status === 'draft';
                      const canDelete = sub.status === 'draft' && !isDeleteExpired(sub.createdAt);
                      
                      return (
                        <tr key={sub.id}>
                          <td className={styles.tdYear}>{sub.reportingMonth} {sub.reportingYear}</td>
                          <td className={styles.tdVal}>{fmtVal(sub.vaccineValue)}</td>
                          <td className={styles.tdVal}>{fmtVal(sub.medicineValue)}</td>
                          <td>
                            <span className={`${styles.statusBadge} ${
                              sub.status === 'published' ? styles.statusApproved : 
                              sub.status === 'rejected' ? styles.statusRejected : styles.statusDraft
                            }`}>
                              {sub.status}
                            </span>
                          </td>
                          <td>
                            <span className={styles.trustBadge}>
                              <CheckCircle2 size={10} /> 5/5 Rating
                            </span>
                          </td>
                          <td className={styles.tdDate}>{formatDate(sub.createdAt)}</td>
                          <td>
                            <div className={styles.actionsCell}>
                              <button
                                className={styles.actionBtnEdit}
                                onClick={() => handleEditClick(sub)}
                                disabled={!isEditable}
                                title={isEditable ? "Edit draft" : "Only draft records are editable"}
                              >
                                <Edit3 size={15} />
                              </button>
                              <button
                                className={styles.actionBtnDelete}
                                onClick={() => handleDeleteClick(sub)}
                                disabled={!canDelete}
                                title={getDeleteTooltip(sub)}
                                style={{
                                  opacity: canDelete ? 1 : 0.4,
                                  cursor: canDelete ? 'pointer' : 'not-allowed'
                                }}
                              >
                                <Trash2 size={15} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      ) : (
        /* FORM VIEW */
        <div className={styles.formCard}>
          <div className={styles.formHeader}>
            <div>
              <h2 className={styles.formCardTitle}>{editingSub ? 'Edit Production Override' : 'Submit Production Metrics'}</h2>
              <p className={styles.formCardDesc}>Input the total ex-factory value for products manufactured inside your domestic operations.</p>
            </div>
            <button className={styles.backBtn} onClick={handleCancelForm}>
              <ArrowLeft size={14} /> Back to History
            </button>
          </div>

          <form className={styles.formBody}>
            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Reporting Year <span className={styles.reqAsterisk}>*</span></label>
                <select 
                  className={styles.select} 
                  value={reportingYear} 
                  onChange={(e) => setReportingYear(e.target.value)}
                >
                  {Array.from({ length: 15 }, (_, i) => String(2016 + i)).map(y => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Reporting Month <span className={styles.reqAsterisk}>*</span></label>
                <select 
                  className={styles.select} 
                  value={reportingMonth} 
                  onChange={(e) => setReportingMonth(e.target.value)}
                >
                  {MONTHS.map(m => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Total Value of Locally Produced Human Vaccines (USD) <span className={styles.reqAsterisk}>*</span></label>
                <div className={styles.inputPrefixWrapper}>
                  <span className={styles.inputPrefix}>$</span>
                  <input
                    type="number"
                    min="0"
                    placeholder="e.g. 12500000"
                    className={styles.input}
                    value={vaccineValue}
                    onChange={(e) => setVaccineValue(e.target.value)}
                    required
                  />
                </div>
                <span className={styles.inputTip}>Enter total ex-factory revenue. Can be 0 if no local vaccines are manufactured.</span>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Total Value of Locally Produced Medicaments (USD) <span className={styles.reqAsterisk}>*</span></label>
                <div className={styles.inputPrefixWrapper}>
                  <span className={styles.inputPrefix}>$</span>
                  <input
                    type="number"
                    min="0"
                    placeholder="e.g. 8500000"
                    className={styles.input}
                    value={medicineValue}
                    onChange={(e) => setMedicineValue(e.target.value)}
                    required
                  />
                </div>
                <span className={styles.inputTip}>Enter total ex-factory revenue of medicaments (in USD). Can be 0 if none.</span>
              </div>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Optional Evidence File Upload <span className={styles.optionalLabel}>(Max 10MB)</span></label>
              <label className={styles.dropZone}>
                <input 
                  type="file" 
                  className={styles.fileInput}
                  onChange={(e) => setEvidenceFile(e.target.files?.[0]?.name || '')}
                />
                <Upload size={24} className={styles.uploadIcon} />
                <span className={styles.uploadMainText}>Click to select file (PDF, Excel, image)</span>
                <span className={styles.uploadSubText}>Provide audited reports, invoice registers, or certificates of production.</span>
                {evidenceFile && (
                  <span className={styles.uploadActiveBadge}>✓ Attached: {evidenceFile}</span>
                )}
              </label>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Optional Notes / Comments</label>
              <textarea
                placeholder="Include details regarding audit standards, facility name, specific vaccine profiles, or exchange rate baselines used..."
                className={styles.textarea}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={4}
              />
            </div>

            <div className={styles.formActions}>
              <button 
                type="button" 
                className={styles.saveDraftBtn}
                onClick={(e) => handleSaveSubmission(e, true)}
              >
                Save as Draft
              </button>
              <button 
                type="button" 
                className={styles.submitBtn}
                onClick={(e) => handleSaveSubmission(e, false)}
              >
                {editingSub ? 'Update & Publish' : 'Submit Production Data'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
