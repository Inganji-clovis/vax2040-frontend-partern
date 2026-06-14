'use client';
import { useState, useEffect } from 'react';
import styles from './DataEntryView.module.css';
import { ManualEntry } from '../lib/types';
import { COUNTRIES } from '../lib/constants';
import { PartnerUser } from './LoginView';
import {
  ClipboardEdit, Search, ListFilter, Folder, Hourglass, CheckCircle2,
  XCircle, Edit3, Trash2, Syringe, Pill, FileText
} from 'lucide-react';

interface Props {
  partnerUser: PartnerUser | null;
  manualEntries: ManualEntry[];
  onAddEntries: (entries: Omit<ManualEntry, 'id' | 'timestamp'>[]) => void;
  onUpdateEntry: (entry: ManualEntry) => void;
  onDeleteEntry: (id: string) => void;
  existingCount: number;
}

const INDICATORS = [
  { code: 'VAX.IMPR.VACC.CD', name: 'Vaccine Imports (USD)' },
  { code: 'VAX.PROD.VACC.CD', name: 'Vaccine Local Production (USD)' },
  { code: 'VAX.IMPR.MEDI.CD', name: 'Medicine Imports (USD)' },
  { code: 'VAX.PROD.MEDI.CD', name: 'Medicine Local Production (USD)' },
  { code: 'SH.XPD.CHEX.GD.ZS', name: 'Health Expenditure (% of GDP)' },
  { code: 'SH.XPD.CHEX.PC.CD', name: 'Health Expenditure per Capita (USD)' },
  { code: 'SH.XPD.GHED.GD.ZS', name: 'Gov. Health Expenditure (% of GDP)' },
  { code: 'SP.POP.TOTL', name: 'Population, total' },
];

const CSV_TEMPLATE = `countryCode,year,indicatorCode,value,enteredBy,productType,metricUnit,facility,status
RWA,2022,VAX.PROD.VACC.CD,1105160,Rwanda Ministry of Health,vaccine,usd,BioNTech Kigali Hub,approved
KEN,2022,VAX.IMPR.MEDI.CD,412500000,Kenya Local Partner,medicine,usd,Nairobi Depot,submitted
ZAF,2022,VAX.PROD.VACC.CD,58000000,SA Stats Dept,vaccine,usd,Aspen Gqeberha,approved
SEN,2022,VAX.IMPR.MEDI.CD,182400000,Senegal Health Agency,medicine,usd,Pasteur Dakar B,draft`;

export default function DataEntryView({
  partnerUser,
  manualEntries,
  onAddEntries,
  onUpdateEntry,
  onDeleteEntry,
  existingCount,
}: Props) {
  // Form states
  const [countryCode, setCountryCode] = useState('RWA');
  const [indicatorCode, setIndicatorCode] = useState('VAX.PROD.VACC.CD');
  const [year, setYear] = useState('2022');
  const [value, setValue] = useState('');
  const [enteredBy, setEnteredBy] = useState('');
  
  // Pharma specific states
  const [productType, setProductType] = useState<'vaccine' | 'medicine'>('vaccine');
  const [metricUnit, setMetricUnit] = useState<'percent' | 'usd' | 'doses'>('usd');
  const [facility, setFacility] = useState('');
  const [supportiveDocument, setSupportiveDocument] = useState('');
  const [status, setStatus] = useState<'draft' | 'submitted' | 'approved' | 'rejected'>('draft');

  // Edit/Update mode state
  const [editingId, setEditingId] = useState<string | null>(null);

  // Search & Filters states
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCountry, setFilterCountry] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  const [submissionMode, setSubmissionMode] = useState<'single' | 'bulk'>('single');

  // CSV Import State
  const [csvText, setCsvText] = useState('');
  const [csvFileName, setCsvFileName] = useState('');
  const [bulkDocument, setBulkDocument] = useState('');
  const [importLog, setImportLog] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [previewEntries, setPreviewEntries] = useState<Omit<ManualEntry, 'id' | 'timestamp'>[]>([]);

  // Sync state if partnerUser is logged in
  useEffect(() => {
    if (partnerUser) {
      setEnteredBy(partnerUser.org);
      setStatus('submitted');
    }
  }, [partnerUser]);

  // Populate form for editing
  function handleEditClick(entry: ManualEntry) {
    setEditingId(entry.id);
    setCountryCode(entry.countryCode);
    setIndicatorCode(entry.indicatorCode);
    setYear(entry.year);
    setValue(String(entry.value));
    setEnteredBy(entry.enteredBy);
    setProductType(entry.productType);
    setMetricUnit(entry.metricUnit);
    setFacility(entry.facility || '');
    setSupportiveDocument(entry.supportiveDocument || '');
    setStatus(entry.status);

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Cancel edit mode
  function handleCancelEdit() {
    setEditingId(null);
    setValue('');
    setEnteredBy(partnerUser ? partnerUser.org : '');
    setFacility('');
    setSupportiveDocument('');
    setProductType('vaccine');
    setMetricUnit('usd');
    setStatus(partnerUser ? 'submitted' : 'draft');
  }

  // Form submission (Add or Update)
  function handleFormSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!value || isNaN(Number(value))) {
      alert('Please enter a valid numeric value.');
      return;
    }
    const finalEnteredBy = partnerUser ? partnerUser.org : enteredBy.trim();
    if (!finalEnteredBy) {
      alert('Please enter the organization/source name.');
      return;
    }
    if (!supportiveDocument) {
      alert('Please upload a supportive document for verification.');
      return;
    }

    if (editingId) {
      const original = manualEntries.find((m) => m.id === editingId);
      if (original) {
        onUpdateEntry({
          id: editingId,
          countryCode,
          year,
          indicatorCode,
          value: Number(value),
          enteredBy: finalEnteredBy,
          productType,
          metricUnit,
          facility: facility.trim() || undefined,
          supportiveDocument: supportiveDocument.trim() || undefined,
          status: partnerUser ? 'submitted' : status,
          timestamp: original.timestamp,
        });
        setImportLog({ type: 'success', message: 'Override updated successfully!' });
      }
      setEditingId(null);
    } else {
      onAddEntries([
        {
          countryCode,
          year,
          indicatorCode,
          value: Number(value),
          enteredBy: finalEnteredBy,
          productType,
          metricUnit,
          facility: facility.trim() || undefined,
          supportiveDocument: supportiveDocument.trim() || undefined,
          status: partnerUser ? 'submitted' : status,
        },
      ]);
      setImportLog({ type: 'success', message: 'Manual override registered successfully!' });
    }

    setValue('');
    setEnteredBy(partnerUser ? partnerUser.org : '');
    setFacility('');
    setSupportiveDocument('');
    setProductType('vaccine');
    setMetricUnit('usd');
    setStatus(partnerUser ? 'submitted' : 'draft');
  }

  // Bulk CSV loader
  function handleLoadTemplate() {
    setCsvText(CSV_TEMPLATE);
    setCsvFileName('vax2040_template.csv');
    setBulkDocument('sample_evidence.pdf');
    setImportLog({ type: 'success', message: 'Sample CSV template and mock document loaded! Click "Preview Extracted Data" to view.' });
  }

  function handleCsvFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setImportLog({ type: 'error', message: 'File is too large. Max size is 5MB.' });
        return;
      }
      setCsvFileName(file.name);
      const reader = new FileReader();
      reader.onload = (evt) => {
        setCsvText(evt.target?.result as string);
        setImportLog({ type: 'success', message: `Parsed ${file.name} successfully.` });
      };
      reader.readAsText(file);
    }
  }

  // Bulk CSV Processor to generate preview
  function handlePreviewCsv() {
    if (!bulkDocument) {
      setImportLog({ type: 'error', message: 'Supportive document is required for bulk imports.' });
      return;
    }
    if (!csvText.trim()) {
      setImportLog({ type: 'error', message: 'CSV text area is empty or file not loaded.' });
      return;
    }

    const lines = csvText.split('\n').map((l) => l.trim()).filter(Boolean);
    if (lines.length < 2) {
      setImportLog({ type: 'error', message: 'CSV requires a header row and at least one data row.' });
      return;
    }

    const header = lines[0].toLowerCase();
    const expectedHeaders = ['countrycode', 'year', 'indicatorcode', 'value', 'enteredby'];
    const headersMatch = expectedHeaders.every((h) => header.includes(h));

    if (!headersMatch) {
      setImportLog({
        type: 'error',
        message: 'Invalid headers. Expected: countryCode, year, indicatorCode, value, enteredBy',
      });
      return;
    }

    const newEntries: Omit<ManualEntry, 'id' | 'timestamp'>[] = [];
    let lineErrors = 0;

    for (let i = 1; i < lines.length; i++) {
      const parts = lines[i].split(',').map((p) => p.trim());
      if (parts.length < 5) {
        lineErrors++;
        continue;
      }

      const [cCode, yr, indCode, valStr, source, prodType, unitType, plant, stat] = parts;
      
      const validCountry = COUNTRIES.some((c) => c.code === cCode.toUpperCase());
      const validInd = INDICATORS.some((ind) => ind.code === indCode);
      const validYear = !isNaN(Number(yr)) && Number(yr) >= 2010 && Number(yr) <= 2060;
      const validVal = !isNaN(Number(valStr));

      if (validCountry && validInd && validYear && validVal && (partnerUser || source)) {
        const safeProductType = (prodType === 'vaccine' || prodType === 'medicine') ? prodType : 'vaccine';
        const safeUnit = (unitType === 'percent' || unitType === 'usd' || unitType === 'doses') ? unitType : 'percent';
        const safeStatus = (stat === 'draft' || stat === 'submitted' || stat === 'approved' || stat === 'rejected') ? stat : 'draft';

        newEntries.push({
          countryCode: cCode.toUpperCase(),
          year: yr,
          indicatorCode: indCode,
          value: Number(valStr),
          enteredBy: partnerUser ? partnerUser.org : source,
          productType: safeProductType,
          metricUnit: safeUnit,
          facility: plant || undefined,
          supportiveDocument: bulkDocument,
          status: partnerUser ? 'submitted' : safeStatus,
        });
      } else {
        lineErrors++;
      }
    }

    if (newEntries.length > 0) {
      setPreviewEntries(newEntries);
      setImportLog({
        type: 'success',
        message: `Successfully parsed ${newEntries.length} bulk records. Please review and edit below.${
          lineErrors > 0 ? ` Skipped ${lineErrors} lines due to syntax errors.` : ''
        }`,
      });
    } else {
      setImportLog({
        type: 'error',
        message: 'Failed to import. Ensure format matches the template exactly.',
      });
    }
  }

  function handlePreviewEdit(index: number, field: keyof Omit<ManualEntry, 'id' | 'timestamp'>, value: any) {
    const updated = [...previewEntries];
    updated[index] = { ...updated[index], [field]: value };
    setPreviewEntries(updated);
  }

  function handlePreviewRemove(index: number) {
    setPreviewEntries(previewEntries.filter((_, i) => i !== index));
    if (previewEntries.length === 1) {
      setImportLog(null); // Cleared last one
    }
  }

  function handleSubmitPreview() {
    onAddEntries(previewEntries);
    setImportLog({ type: 'success', message: `Successfully registered ${previewEntries.length} bulk records.` });
    setPreviewEntries([]);
    setCsvText('');
    setCsvFileName('');
    setBulkDocument('');
  }

  // Filtering entries for the CRUD list
  const filteredEntries = manualEntries.filter((entry) => {
    if (partnerUser && entry.enteredBy.toLowerCase() !== partnerUser.org.toLowerCase()) {
      return false;
    }
    const matchesSearch =
      entry.enteredBy.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (entry.facility || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCountry = filterCountry === 'all' || entry.countryCode === filterCountry;
    const matchesStatus = filterStatus === 'all' || entry.status === filterStatus;
    return matchesSearch && matchesCountry && matchesStatus;
  });

  function getFlag(code: string) {
    return COUNTRIES.find((c) => c.code === code)?.flag || '';
  }

  function getIndicatorLabel(code: string) {
    return INDICATORS.find((i) => i.code === code)?.name || code;
  }

  function fmtTableVal(val: number, unit: string) {
    if (unit === 'usd') {
      return val >= 1_000_000 ? `$${(val / 1_000_000).toFixed(1)}M` : `$${val.toLocaleString()}`;
    }
    if (unit === 'percent') {
      return `${val.toFixed(1)}%`;
    }
    return `${val.toLocaleString()} Doses`;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.titleArea}>
          <span className="badge badge-warn" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <ClipboardEdit size={16} /> Manual Submissions
          </span>
          <h1 className={styles.title}>Partner Feeds Registry</h1>
          <p className={styles.sub}>
            Upload spreadsheets or submit factory production data directly. All records require curator audit logs verification.
          </p>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>Active Overrides</span>
          <span className={styles.statValue}>{existingCount} Records</span>
        </div>
      </div>

      {importLog && (
        <div className={`${styles.alert} ${importLog.type === 'success' ? styles.alertSuccess : styles.alertError}`}>
          {importLog.type === 'success' ? '✓' : '⚠️'} {importLog.message}
        </div>
      )}

      {/* Tabs to Switch Modes */}
      <div className={styles.tabs}>
        <button
          className={`${styles.tabBtn} ${submissionMode === 'single' ? styles.tabBtnActive : ''}`}
          onClick={() => setSubmissionMode('single')}
        >
          Single Entry Form
        </button>
        <button
          className={`${styles.tabBtn} ${submissionMode === 'bulk' ? styles.tabBtnActive : ''}`}
          onClick={() => setSubmissionMode('bulk')}
        >
          Bulk Import
        </button>
      </div>

      <div className={styles.grid} style={{ gridTemplateColumns: '1fr', maxWidth: '800px', margin: '0 auto 40px 0' }}>
        
        {submissionMode === 'single' ? (
        <div className={`card ${styles.card}`}>
          <div className={styles.formHeader}>
            <h2 className={styles.cardTitle}>{editingId ? 'Edit Data Override' : 'Single Entry Form'}</h2>
            {editingId && (
              <button className={styles.cancelEditBtn} onClick={handleCancelEdit}>
                Cancel Edit Mode
              </button>
            )}
          </div>

          <form onSubmit={handleFormSubmit} className={styles.form}>
            
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Focus Country</label>
                <select
                  className={styles.select}
                  value={countryCode}
                  onChange={(e) => setCountryCode(e.target.value)}
                >
                  {COUNTRIES.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.flag} {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Target Year</label>
                <select
                  className={styles.select}
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                >
                  {Array.from({ length: 15 }, (_, i) => String(2014 + i)).map((y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Target Indicator</label>
              <select
                className={styles.select}
                value={indicatorCode}
                onChange={(e) => setIndicatorCode(e.target.value)}
              >
                {INDICATORS.map((ind) => (
                  <option key={ind.code} value={ind.code}>
                    {ind.name}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Product Type</label>
                <select
                  className={styles.select}
                  value={productType}
                  onChange={(e) => setProductType(e.target.value as any)}
                >
                  <option value="vaccine">💉 Vaccine</option>
                  <option value="medicine">💊 Medicine</option>
                </select>
              </div>

              {!partnerUser && (
                <div className={styles.formGroup}>
                  <label className={styles.label}>Verification Status</label>
                  <select
                    className={styles.select}
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                  >
                    <option value="draft">📁 Draft (Internal)</option>
                    <option value="submitted">⏳ Submitted (Partner)</option>
                    <option value="approved">✅ Approved (VAX2040)</option>
                  </select>
                </div>
              )}
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Measurement Unit</label>
              <div className={styles.radioGroup}>
                <label className={styles.radioLabel}>
                  <input
                    type="radio"
                    name="unit"
                    value="percent"
                    checked={metricUnit === 'percent'}
                    onChange={() => setMetricUnit('percent')}
                  />
                  <span>Percentage (%)</span>
                </label>
                <label className={styles.radioLabel}>
                  <input
                    type="radio"
                    name="unit"
                    value="usd"
                    checked={metricUnit === 'usd'}
                    onChange={() => setMetricUnit('usd')}
                  />
                  <span>Value (USD)</span>
                </label>
                <label className={styles.radioLabel}>
                  <input
                    type="radio"
                    name="unit"
                    value="doses"
                    checked={metricUnit === 'doses'}
                    onChange={() => setMetricUnit('doses')}
                  />
                  <span>Doses (Units)</span>
                </label>
              </div>
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Value</label>
                <input
                  type="text"
                  placeholder="e.g. 15.5 or 55000000"
                  className={styles.input}
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Facility / Plant (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. BioNTech Kigali"
                  className={styles.input}
                  value={facility}
                  onChange={(e) => setFacility(e.target.value)}
                />
              </div>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Supportive Document (Required)</label>
              <label className={styles.uploadZone}>
                <input
                  type="file"
                  className={styles.uploadInput}
                  onChange={(e) => setSupportiveDocument(e.target.files?.[0]?.name || '')}
                />
                <span className={styles.uploadIcon}><FileText size={32} strokeWidth={1.5} /></span>
                <span className={styles.uploadText}>
                  Click or drag file to upload PDF / Excel (Max 5MB)
                </span>
                {supportiveDocument && (
                  <span className={styles.uploadSelected} style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}><CheckCircle2 size={14} /> {supportiveDocument}</span>
                )}
              </label>
            </div>

            {!partnerUser && (
              <div className={styles.formGroup}>
                <label className={styles.label}>Source / Entered By</label>
                <input
                  type="text"
                  placeholder="e.g. VAX2040 Partner Team"
                  className={styles.input}
                  value={enteredBy}
                  onChange={(e) => setEnteredBy(e.target.value)}
                  required
                />
              </div>
            )}

            <button type="submit" className={styles.submitBtn}>
              {editingId ? 'Update Data Point' : 'Register Override'}
            </button>
          </form>
        </div>
        ) : (
        <div className={`card ${styles.card}`}>
          <div className={styles.cardHeader}>
            <div>
              <h2 className={styles.cardTitle}>Excel / CSV Import Simulator</h2>
              <p className={styles.cardDesc}>Upload bulk records matching VAX2040 schema.</p>
            </div>
            <button className={styles.templateBtn} onClick={handleLoadTemplate}>
              Load Template
            </button>
          </div>

          <div className={styles.formGroup} style={{ marginBottom: '20px' }}>
            <label className={styles.label}>CSV / Excel Data File</label>
            <label className={styles.uploadZone}>
              <input
                type="file"
                accept=".csv, .xlsx, .xls"
                className={styles.uploadInput}
                onChange={handleCsvFileSelect}
              />
              <span className={styles.uploadIcon}><FileText size={32} strokeWidth={1.5} /></span>
              <span className={styles.uploadText}>
                Click to attach CSV or Excel Data (Max 5MB)
              </span>
              {csvFileName && (
                <span className={styles.uploadSelected} style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}><CheckCircle2 size={14} /> {csvFileName}</span>
              )}
            </label>
          </div>

          <div className={styles.formGroup} style={{ marginBottom: '20px' }}>
            <label className={styles.label}>Supportive Document for Bulk Data (Required)</label>
            <label className={styles.uploadZone}>
              <input
                type="file"
                className={styles.uploadInput}
                onChange={(e) => setBulkDocument(e.target.files?.[0]?.name || '')}
              />
                <span className={styles.uploadIcon}><FileText size={32} strokeWidth={1.5} /></span>
                <span className={styles.uploadText}>
                  Click to attach master evidence document (PDF/Word, Max 10MB)
                </span>
              {bulkDocument && (
                <span className={styles.uploadSelected}><CheckCircle2 size={14} /> {bulkDocument}</span>
              )}
            </label>
          </div>

          <div className={styles.actionRow}>
            <button className={styles.importBtn} onClick={handlePreviewCsv}>
              Preview Extracted Data
            </button>
          </div>

          <div className={styles.infoBox}>
            <span className={styles.infoTitle}>Validation Rules:</span>
            <ul className={styles.infoList}>
              <li>Country: RWA, KEN, ZAF, SEN</li>
              <li>Year: 2014 to 2060</li>
              <li>Product: vaccine, medicine</li>
              <li>Unit: percent, usd, doses</li>
            </ul>
          </div>

          {previewEntries.length > 0 && (
            <div style={{ marginTop: '32px', borderTop: '1px solid var(--border)', paddingTop: '24px' }}>
              <h3 className={styles.sectionTitle} style={{ fontSize: '1.1rem', marginBottom: '16px' }}>
                Preview & Edit Records ({previewEntries.length})
              </h3>
              <div className={styles.tableWrapper} style={{ marginBottom: '24px' }}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Country</th>
                      <th>Year</th>
                      <th>Value</th>
                      <th>Facility</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {previewEntries.map((entry, idx) => (
                      <tr key={idx}>
                        <td>
                          <select
                            className={styles.select}
                            style={{ padding: '6px' }}
                            value={entry.countryCode}
                            onChange={(e) => handlePreviewEdit(idx, 'countryCode', e.target.value)}
                          >
                            {COUNTRIES.map(c => <option key={c.code} value={c.code}>{c.code}</option>)}
                          </select>
                        </td>
                        <td>
                          <input
                            type="text"
                            className={styles.input}
                            style={{ padding: '6px', width: '80px' }}
                            value={entry.year}
                            onChange={(e) => handlePreviewEdit(idx, 'year', e.target.value)}
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            className={styles.input}
                            style={{ padding: '6px', width: '120px' }}
                            value={entry.value}
                            onChange={(e) => handlePreviewEdit(idx, 'value', Number(e.target.value))}
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            className={styles.input}
                            style={{ padding: '6px' }}
                            value={entry.facility || ''}
                            onChange={(e) => handlePreviewEdit(idx, 'facility', e.target.value)}
                          />
                        </td>
                        <td>
                          <button
                            className={styles.actionBtnDelete}
                            onClick={() => handlePreviewRemove(idx)}
                            title="Remove from batch"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className={styles.actionRow} style={{ justifyContent: 'center' }}>
                <button
                  className={styles.submitBtn}
                  style={{ width: '100%', maxWidth: '300px' }}
                  onClick={handleSubmitPreview}
                >
                  Confirm and Submit Records
                </button>
              </div>
            </div>
          )}
        </div>
        )}
      </div>

      <section className={styles.managerSection}>
        <div className={styles.managerHeader}>
          <h2 className={styles.sectionTitle}>My Submissions Log</h2>
          <p className={styles.sectionDesc}>Search, edit, and check status of entries submitted under your organization.</p>
        </div>

        {/* Filters */}
        <div className={styles.filterBar}>
          <div className={styles.searchWrapper}>
            <span className={styles.searchIcon}><Search size={16} /></span>
            <input
              type="text"
              placeholder="Search by facility or keyword..."
              className={styles.searchInput}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className={styles.filtersGroup}>
            <select
              className={styles.filterSelect}
              value={filterCountry}
              onChange={(e) => setFilterCountry(e.target.value)}
            >
              <option value="all">🌍 All Countries</option>
              {COUNTRIES.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.flag} {c.name}
                </option>
              ))}
            </select>

            <select
              className={styles.filterSelect}
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">All Statuses</option>
              <option value="draft">Draft</option>
              <option value="submitted">Submitted</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>

        {filteredEntries.length === 0 ? (
          <div className={`card ${styles.emptyState}`}>
            <span className={styles.emptyIcon}><Search size={48} strokeWidth={1.5} color="var(--text-muted)" /></span>
            <p className={styles.emptyText}>No manual submissions found matching filters.</p>
          </div>
        ) : (
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Country</th>
                  <th>Year</th>
                  <th>Indicator</th>
                  <th>Category</th>
                  <th>Value</th>
                  <th>Facility / Plant</th>
                  <th>Documents</th>
                  <th>Source Org</th>
                  <th>Verification</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredEntries.map((entry) => (
                  <tr key={entry.id} className={editingId === entry.id ? styles.editingRow : ''}>
                    <td className={styles.tdCountry}>{getFlag(entry.countryCode)} {entry.countryCode}</td>
                    <td className={styles.tdYear}>{entry.year}</td>
                    <td className={styles.tdIndicator} title={entry.indicatorCode}>
                      {getIndicatorLabel(entry.indicatorCode)}
                    </td>
                    <td className={styles.tdType}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        {entry.productType === 'vaccine' ? <Syringe size={14} /> : <Pill size={14} />}
                        {entry.productType === 'vaccine' ? 'Vaccine' : 'Medicine'}
                      </div>
                    </td>
                    <td className={styles.tdVal}>{fmtTableVal(entry.value, entry.metricUnit)}</td>
                    <td className={styles.tdFacility}>{entry.facility || <span className={styles.mutedText}>—</span>}</td>
                    <td>
                      {entry.supportiveDocument ? (
                        <span style={{ fontSize: '0.8rem', color: '#3B82F6', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px' }} title={entry.supportiveDocument}>
                          <FileText size={14} /> Attached
                        </span>
                      ) : (
                        <span className={styles.mutedText}>—</span>
                      )}
                    </td>
                    <td className={styles.tdSource}>{entry.enteredBy}</td>
                    <td>
                      <span className={`${styles.statusBadge} ${
                        entry.status === 'approved' ? styles.statusApproved : 
                        entry.status === 'submitted' ? styles.statusSubmitted : 
                        entry.status === 'rejected' ? styles.statusRejected : styles.statusDraft
                      }`} title={entry.rejectionComment} style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        {entry.status === 'approved' && <CheckCircle2 size={12} />}
                        {entry.status === 'submitted' && <Hourglass size={12} />}
                        {entry.status === 'rejected' && <XCircle size={12} />}
                        {entry.status === 'draft' && <Folder size={12} />}
                        {entry.status}
                      </span>
                    </td>
                    <td>
                      <div className={styles.actionsCell}>
                        <button
                          className={styles.actionBtnEdit}
                          onClick={() => handleEditClick(entry)}
                          disabled={entry.status === 'approved'}
                          title="Edit submission"
                        >
                          <Edit3 size={16} />
                        </button>
                        <button
                          className={styles.actionBtnDelete}
                          onClick={() => onDeleteEntry(entry.id)}
                          title="Delete submission"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
