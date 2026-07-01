'use client';
import { useState, useEffect } from 'react';
import styles from './DataEntryView.module.css';
import { PartnerUser } from './LoginView';
import {
  FileText, CheckCircle2, AlertCircle, Trash2, Edit3, Plus, X, Upload, ArrowLeft, ClipboardList
} from 'lucide-react';

interface Props {
  partnerUser: PartnerUser | null;
  historyOnly?: boolean;
}

export interface ExtractedDataPoint {
  indicator: string;
  value: string;
  unit: string;
  period: string;
  pageRef: string;
}

export interface PartnerSubmission {
  id: string;
  partnerId: string;
  partnerName: string; // The role chosen: "Manufacturer", "Regulator (NRA)", etc.
  reportingYear: string;
  reportingMonth: string;
  status: 'draft' | 'published' | 'rejected' | 'submitted' | 'pending' | 'requires update';
  trustScore: number;
  createdAt: string;
  notes?: string;
  
  // Specific Form Type:
  formType: 'Manufacturer' | 'Regulator (NRA)' | 'Central Medical Supply' | 'Evidence Submission (Research/Analyst)';

  // Manufacturer specifics:
  manufacturerName?: string;
  facilityName?: string;
  facilityAddress?: string;
  facilityType?: string;
  gmpStatus?: string;
  vaccineValue?: number;
  medicineValue?: number;
  evidenceUrl?: string;

  // Regulator (NRA) specifics:
  nraName?: string;
  gbtLevel?: string;
  amaRatified?: string;
  regionalHarmonisation?: string;
  regionalScheme?: string;
  installedCapacity?: number;
  capacityUtilisation?: number;
  productionLines?: number;
  techPlatforms?: string[];
  gmpInspections?: number;
  nonCompliantFacilities?: number;
  batchCertificates?: number;
  apiAfricaPct?: number;
  packagingAfricaPct?: number;
  techTransfer?: string;
  techTransferPartner?: string;
  totalMAs?: number;
  localMAs?: number;
  newLocalMAs?: number;
  medianApprovalTime?: number;
  acceleratedPathway?: string;

  // Central Medical Supply specifics:
  cmsName?: string;
  cmsType?: string;
  procurementBudget?: number;
  procurementCurrency?: string;
  localProcurementPct?: number;
  localPreference?: string;
  localPreferencePremium?: number;
  topTherapeuticCategories?: string[];
  reservedForLocal?: string;
  reservedProducts?: string;
  leadTimeLocal?: number;
  leadTimeImported?: number;
  stockoutDaysLocal?: number;
  stockoutDaysImported?: number;

  // Evidence Submission specifics:
  evidenceType?: string;
  sourceTitle?: string;
  sourceAuthor?: string;
  sourceDate?: string;
  sourceUrl?: string;
  findingsExcerpt?: string;
  extractedPoints?: ExtractedDataPoint[];
  creditContributor?: string;
  contributorName?: string;
  contributorAffiliation?: string;
}

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const MOCK_SUBMISSIONS: PartnerSubmission[] = [
  // ── Manufacturer ──────────────────────────────────────────
  {
    id: 'sub_m1',
    partnerId: 'reporter@biontech.rw',
    partnerName: 'Manufacturer',
    reportingYear: '2023',
    reportingMonth: 'November',
    status: 'published',
    trustScore: 5,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    formType: 'Manufacturer',
    manufacturerName: 'BioNTech Rwanda',
    facilityName: 'Kigali Modular mRNA Plant',
    facilityAddress: 'Kigali Special Economic Zone, Rwanda',
    facilityType: 'Formulation & fill-finish',
    gmpStatus: 'WHO prequalified',
    vaccineValue: 12500000,
    medicineValue: 0,
    evidenceUrl: 'biontech_prod_report_2023.pdf',
    notes: 'Ex-factory values audited by Ernst & Young.'
  },
  {
    id: 'sub_m2',
    partnerId: 'reporter@biontech.rw',
    partnerName: 'Manufacturer',
    reportingYear: '2024',
    reportingMonth: 'June',
    status: 'draft',
    trustScore: 5,
    createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    formType: 'Manufacturer',
    manufacturerName: 'BioNTech Rwanda',
    facilityName: 'Kigali Modular mRNA Plant',
    facilityAddress: 'Kigali Special Economic Zone, Rwanda',
    facilityType: 'Formulation & fill-finish',
    gmpStatus: 'WHO prequalified',
    vaccineValue: 15200000,
    medicineValue: 1200000,
    notes: 'Initial Q1-Q3 figures entered manually. Auditing document pending.'
  },
  
  // ── Regulator (NRA) ─────────────────────────────────────────
  {
    id: 'sub_r1',
    partnerId: 'analyst@fda.gov.rw',
    partnerName: 'Regulator (NRA)',
    reportingYear: '2023',
    reportingMonth: 'November',
    status: 'published',
    trustScore: 5,
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    formType: 'Regulator (NRA)',
    nraName: 'Rwanda Food and Drugs Authority',
    gbtLevel: 'ML3',
    amaRatified: 'Yes',
    regionalHarmonisation: 'Yes',
    regionalScheme: 'EAC MRH',
    installedCapacity: 50000000,
    capacityUtilisation: 45,
    productionLines: 4,
    techPlatforms: ['mRNA', 'solid dose (tablets/capsules)', 'sterile injectables'],
    gmpInspections: 12,
    nonCompliantFacilities: 1,
    batchCertificates: 85,
    apiAfricaPct: 5,
    packagingAfricaPct: 20,
    techTransfer: 'Yes',
    techTransferPartner: 'BioNTech SE',
    totalMAs: 1450,
    localMAs: 120,
    newLocalMAs: 15,
    medianApprovalTime: 6,
    acceleratedPathway: 'Yes',
    notes: 'WHO Global Benchmarking audit completed in late 2023.'
  },
  {
    id: 'sub_r2',
    partnerId: 'analyst@fda.gov.rw',
    partnerName: 'Regulator (NRA)',
    reportingYear: '2024',
    reportingMonth: 'June',
    status: 'draft',
    trustScore: 5,
    createdAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    formType: 'Regulator (NRA)',
    nraName: 'Rwanda Food and Drugs Authority',
    gbtLevel: 'ML3',
    amaRatified: 'Yes',
    regionalHarmonisation: 'Yes',
    regionalScheme: 'EAC MRH',
    installedCapacity: 60000000,
    capacityUtilisation: 48,
    productionLines: 5,
    techPlatforms: ['mRNA', 'solid dose (tablets/capsules)'],
    gmpInspections: 4,
    nonCompliantFacilities: 0,
    batchCertificates: 22,
    apiAfricaPct: 8,
    packagingAfricaPct: 22,
    techTransfer: 'Yes',
    techTransferPartner: 'BioNTech SE',
    totalMAs: 1510,
    localMAs: 135,
    newLocalMAs: 8,
    medianApprovalTime: 5.5,
    acceleratedPathway: 'Yes'
  },

  // ── Central Medical Supply ──────────────────────────────────
  {
    id: 'sub_c1',
    partnerId: 'procurement@rbc.gov.rw',
    partnerName: 'Central Medical Supply',
    reportingYear: '2023',
    reportingMonth: 'October',
    status: 'published',
    trustScore: 5,
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    formType: 'Central Medical Supply',
    cmsName: 'Rwanda Biomedical Centre',
    cmsType: 'Central government procurement',
    procurementBudget: 42000000,
    procurementCurrency: 'USD',
    localProcurementPct: 15,
    localPreference: 'Yes',
    localPreferencePremium: 10,
    topTherapeuticCategories: ['Essential medicines', 'Vaccines', 'Anti-infectives'],
    reservedForLocal: 'Yes',
    reservedProducts: 'Paracetamol, Amoxicillin Syrups, Sterile Water',
    leadTimeLocal: 14,
    leadTimeImported: 90,
    stockoutDaysLocal: 5,
    stockoutDaysImported: 24,
    notes: 'Procurement cycle aligned with national financial year budgets.'
  },
  {
    id: 'sub_c2',
    partnerId: 'procurement@rbc.gov.rw',
    partnerName: 'Central Medical Supply',
    reportingYear: '2024',
    reportingMonth: 'June',
    status: 'draft',
    trustScore: 5,
    createdAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    formType: 'Central Medical Supply',
    cmsName: 'Rwanda Biomedical Centre',
    cmsType: 'Central government procurement',
    procurementBudget: 45000000,
    procurementCurrency: 'USD',
    localProcurementPct: 18,
    localPreference: 'Yes',
    localPreferencePremium: 10,
    topTherapeuticCategories: ['Essential medicines', 'Vaccines'],
    reservedForLocal: 'Yes',
    reservedProducts: 'Paracetamol, Amoxicillin Syrups',
    leadTimeLocal: 12,
    leadTimeImported: 85,
    stockoutDaysLocal: 3,
    stockoutDaysImported: 18
  },

  // ── Evidence Submission ─────────────────────────────────────
  {
    id: 'sub_e1',
    partnerId: 'researcher@chai.org',
    partnerName: 'Evidence Submission (Research/Analyst)',
    reportingYear: '2023',
    reportingMonth: 'December',
    status: 'published',
    trustScore: 5,
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    formType: 'Evidence Submission (Research/Analyst)',
    evidenceType: 'Institutional verified data (WHO, AU, etc.)',
    sourceTitle: 'Africa CDC Vaccine Manufacturing Review 2023',
    sourceAuthor: 'Africa CDC & PAVM Secretariat',
    sourceDate: '2023-10-15',
    sourceUrl: 'https://africacdc.org/resources/vaccine-manufacturing-2023',
    findingsExcerpt: 'East African regional capacity increased by 15% due to new tech-transfer agreements in Rwanda and Kenya.',
    extractedPoints: [
      { indicator: 'Regional Vaccine Local Share', value: '4.5', unit: '%', period: '2023', pageRef: 'Page 18' },
      { indicator: 'Active Production Facilities', value: '8', unit: 'Facilities', period: '2023', pageRef: 'Page 22' }
    ],
    creditContributor: 'Yes',
    contributorName: 'Dr. Jean Kaseya',
    contributorAffiliation: 'Africa CDC'
  },
  {
    id: 'sub_e2',
    partnerId: 'researcher@chai.org',
    partnerName: 'Evidence Submission (Research/Analyst)',
    reportingYear: '2024',
    reportingMonth: 'June',
    status: 'draft',
    trustScore: 5,
    createdAt: new Date(Date.now() - 50 * 60 * 1000).toISOString(),
    formType: 'Evidence Submission (Research/Analyst)',
    evidenceType: 'Research publication',
    sourceTitle: 'Pharmaceutical Sovereign Ratios in sub-Saharan Africa',
    sourceAuthor: 'Lancet Global Health',
    sourceDate: '2024-04-01',
    sourceUrl: 'https://thelancet.com/journals/langlo/article/PIIS2214-109X',
    findingsExcerpt: 'Analysis of ex-factory outputs from 12 regional plants demonstrates a severe bottleneck in local API procurement.',
    extractedPoints: [
      { indicator: 'API African Sourcing Rate', value: '3.2', unit: '%', period: '2024', pageRef: 'Page 5' }
    ],
    creditContributor: 'No'
  }
];

export default function DataEntryView({ partnerUser, historyOnly }: Props) {
  const [submissions, setSubmissions] = useState<PartnerSubmission[]>([]);
  const [viewMode, setViewMode] = useState<'list' | 'form'>('list');

  useEffect(() => {
    if (historyOnly) {
      setViewMode('list');
    }
  }, [historyOnly]);

  const [editingSub, setEditingSub] = useState<PartnerSubmission | null>(null);

  // Common Form inputs
  const [reportingYear, setReportingYear] = useState('2024');
  const [reportingMonth, setReportingMonth] = useState('January');
  const [notes, setNotes] = useState('');
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // 1. Manufacturer Form Inputs
  const [manufacturerName, setManufacturerName] = useState('');
  const [facilityName, setFacilityName] = useState('');
  const [facilityAddress, setFacilityAddress] = useState('');
  const [facilityType, setFacilityType] = useState('Formulation & fill‑finish');
  const [gmpStatus, setGmpStatus] = useState('WHO prequalified');
  const [vaccineValue, setVaccineValue] = useState('');
  const [medicineValue, setMedicineValue] = useState('');
  const [evidenceFile, setEvidenceFile] = useState<string>('');

  // 2. Regulator (NRA) Form Inputs
  const [nraName, setNraName] = useState('');
  const [gbtLevel, setGbtLevel] = useState('ML3');
  const [amaRatified, setAmaRatified] = useState('Yes');
  const [regionalHarmonisation, setRegionalHarmonisation] = useState('Yes');
  const [regionalScheme, setRegionalScheme] = useState('');
  const [installedCapacity, setInstalledCapacity] = useState('');
  const [capacityUtilisation, setCapacityUtilisation] = useState('');
  const [productionLines, setProductionLines] = useState('');
  const [techPlatforms, setTechPlatforms] = useState<string[]>([]);
  const [gmpInspections, setGmpInspections] = useState('');
  const [nonCompliantFacilities, setNonCompliantFacilities] = useState('');
  const [batchCertificates, setBatchCertificates] = useState('');
  const [apiAfricaPct, setApiAfricaPct] = useState('');
  const [packagingAfricaPct, setPackagingAfricaPct] = useState('');
  const [techTransfer, setTechTransfer] = useState('No');
  const [techTransferPartner, setTechTransferPartner] = useState('');
  const [totalMAs, setTotalMAs] = useState('');
  const [localMAs, setLocalMAs] = useState('');
  const [newLocalMAs, setNewLocalMAs] = useState('');
  const [medianApprovalTime, setMedianApprovalTime] = useState('');
  const [acceleratedPathway, setAcceleratedPathway] = useState('No');

  // 3. Central Medical Supply Form Inputs
  const [cmsName, setCmsName] = useState('');
  const [cmsType, setCmsType] = useState('Central government procurement');
  const [procurementBudget, setProcurementBudget] = useState('');
  const [procurementCurrency, setProcurementCurrency] = useState('USD');
  const [localProcurementPct, setLocalProcurementPct] = useState('');
  const [localPreference, setLocalPreference] = useState('No');
  const [localPreferencePremium, setLocalPreferencePremium] = useState('');
  const [topTherapeuticCategories, setTopTherapeuticCategories] = useState<string[]>([]);
  const [reservedForLocal, setReservedForLocal] = useState('No');
  const [reservedProducts, setReservedProducts] = useState('');
  const [leadTimeLocal, setLeadTimeLocal] = useState('');
  const [leadTimeImported, setLeadTimeImported] = useState('');
  const [stockoutDaysLocal, setStockoutDaysLocal] = useState('');
  const [stockoutDaysImported, setStockoutDaysImported] = useState('');

  // 4. Evidence & Source Validation Form Inputs
  const [evidenceType, setEvidenceType] = useState('Research publication');
  const [sourceTitle, setSourceTitle] = useState('');
  const [sourceAuthor, setSourceAuthor] = useState('');
  const [sourceDate, setSourceDate] = useState('');
  const [sourceUrl, setSourceUrl] = useState('');
  const [findingsExcerpt, setFindingsExcerpt] = useState('');
  const [extractedPoints, setExtractedPoints] = useState<ExtractedDataPoint[]>([
    { indicator: '', value: '', unit: '', period: '', pageRef: '' }
  ]);
  const [creditContributor, setCreditContributor] = useState('No');
  const [contributorName, setContributorName] = useState('');
  const [contributorAffiliation, setContributorAffiliation] = useState('');

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

  let role = partnerUser.org as PartnerSubmission['formType'];
  if (role) {
    const rLower = role.toLowerCase();
    if (rLower === 'manufacturer') {
      role = 'Manufacturer';
    } else if (rLower === 'nra' || rLower === 'regulator (nra)' || rLower.includes('regulator')) {
      role = 'Regulator (NRA)';
    } else if (rLower === 'supplier' || rLower === 'central medical supply' || rLower.includes('supply') || rLower.includes('supplier')) {
      role = 'Central Medical Supply';
    } else if (rLower === 'finance' || rLower === 'evidence' || rLower.includes('evidence') || rLower.includes('analyst') || rLower.includes('research')) {
      role = 'Evidence Submission (Research/Analyst)';
    }
  }

  // Handle Dynamic Extracted Points (Evidence Form)
  const addDataPointRow = () => {
    setExtractedPoints([
      ...extractedPoints,
      { indicator: '', value: '', unit: '', period: '', pageRef: '' }
    ]);
  };

  const removeDataPointRow = (idx: number) => {
    if (extractedPoints.length <= 1) return;
    setExtractedPoints(extractedPoints.filter((_, i) => i !== idx));
  };

  const updateDataPointField = (idx: number, field: keyof ExtractedDataPoint, val: string) => {
    const updated = extractedPoints.map((pt, i) => {
      if (i === idx) {
        return { ...pt, [field]: val };
      }
      return pt;
    });
    setExtractedPoints(updated);
  };

  const handleSaveSubmission = (e: React.FormEvent, asDraft: boolean) => {
    e.preventDefault();

    // Verification and validation based on Form Roles
    if (role === 'Manufacturer') {
      if (!manufacturerName.trim()) {
        setNotification({ type: 'error', message: 'Please enter a Manufacturer Name.' });
        return;
      }
      if (!facilityAddress.trim()) {
        setNotification({ type: 'error', message: 'Please enter a Facility Address.' });
        return;
      }
      if (isNaN(Number(vaccineValue)) || Number(vaccineValue) < 0 || !vaccineValue) {
        setNotification({ type: 'error', message: 'Please enter a valid Vaccine Production Value.' });
        return;
      }
      if (isNaN(Number(medicineValue)) || Number(medicineValue) < 0 || !medicineValue) {
        setNotification({ type: 'error', message: 'Please enter a valid Medicine Production Value.' });
        return;
      }
    } else if (role === 'Regulator (NRA)') {
      if (!nraName.trim()) {
        setNotification({ type: 'error', message: 'Please enter NRA Name.' });
        return;
      }
      if (!installedCapacity || isNaN(Number(installedCapacity)) || Number(installedCapacity) < 0) {
        setNotification({ type: 'error', message: 'Please enter a valid Installed Capacity.' });
        return;
      }
      if (!capacityUtilisation || isNaN(Number(capacityUtilisation)) || Number(capacityUtilisation) < 0 || Number(capacityUtilisation) > 100) {
        setNotification({ type: 'error', message: 'Please enter a Capacity Utilisation Rate (0-100%).' });
        return;
      }
      if (!productionLines || isNaN(Number(productionLines)) || Number(productionLines) < 0) {
        setNotification({ type: 'error', message: 'Please enter a valid number of Production Lines.' });
        return;
      }
      if (techPlatforms.length === 0) {
        setNotification({ type: 'error', message: 'Please select at least one Technology Platform.' });
        return;
      }
      if (!gmpInspections || isNaN(Number(gmpInspections)) || Number(gmpInspections) < 0) {
        setNotification({ type: 'error', message: 'Please enter GMP Inspections conducted.' });
        return;
      }
      if (!batchCertificates || isNaN(Number(batchCertificates)) || Number(batchCertificates) < 0) {
        setNotification({ type: 'error', message: 'Please enter total Batch Release Certificates issued.' });
        return;
      }
      if (!apiAfricaPct || isNaN(Number(apiAfricaPct)) || Number(apiAfricaPct) < 0 || Number(apiAfricaPct) > 100) {
        setNotification({ type: 'error', message: 'Please enter % of APIs sourced from Africa.' });
        return;
      }
      if (!packagingAfricaPct || isNaN(Number(packagingAfricaPct)) || Number(packagingAfricaPct) < 0 || Number(packagingAfricaPct) > 100) {
        setNotification({ type: 'error', message: 'Please enter % of packaging materials sourced from Africa.' });
        return;
      }
      if (!totalMAs || isNaN(Number(totalMAs)) || Number(totalMAs) < 0) {
        setNotification({ type: 'error', message: 'Please enter active Marketing Authorisations.' });
        return;
      }
      if (!localMAs || isNaN(Number(localMAs)) || Number(localMAs) < 0) {
        setNotification({ type: 'error', message: 'Please enter active Local Marketing Authorisations.' });
        return;
      }
    } else if (role === 'Central Medical Supply') {
      if (!cmsName.trim()) {
        setNotification({ type: 'error', message: 'Please enter CMS Name.' });
        return;
      }
      if (!procurementBudget || isNaN(Number(procurementBudget)) || Number(procurementBudget) < 0) {
        setNotification({ type: 'error', message: 'Please enter a valid Procurement Budget.' });
        return;
      }
      if (!localProcurementPct || isNaN(Number(localProcurementPct)) || Number(localProcurementPct) < 0 || Number(localProcurementPct) > 100) {
        setNotification({ type: 'error', message: 'Please enter a valid Local Procurement %.' });
        return;
      }
      if (!leadTimeLocal || isNaN(Number(leadTimeLocal)) || Number(leadTimeLocal) < 0) {
        setNotification({ type: 'error', message: 'Please enter local lead times in days.' });
        return;
      }
      if (!leadTimeImported || isNaN(Number(leadTimeImported)) || Number(leadTimeImported) < 0) {
        setNotification({ type: 'error', message: 'Please enter imported lead times in days.' });
        return;
      }
    } else if (role === 'Evidence Submission (Research/Analyst)') {
      if (!sourceTitle.trim()) {
        setNotification({ type: 'error', message: 'Please enter Title of Source.' });
        return;
      }
      if (!sourceAuthor.trim()) {
        setNotification({ type: 'error', message: 'Please enter Author / Publishing Organisation.' });
        return;
      }
      if (!sourceDate) {
        setNotification({ type: 'error', message: 'Please enter Publication Date.' });
        return;
      }
      if (!findingsExcerpt.trim()) {
        setNotification({ type: 'error', message: 'Please paste Key Findings / Excerpts.' });
        return;
      }
      const incompletePt = extractedPoints.some(pt => !pt.indicator.trim() || !pt.value.trim() || !pt.unit.trim());
      if (incompletePt) {
        setNotification({ type: 'error', message: 'Please fill in all details for extracted data points.' });
        return;
      }
    }

    const currentYear = role === 'Evidence Submission (Research/Analyst)' ? sourceDate.substring(0, 4) : reportingYear;
    const currentMonth = role === 'Evidence Submission (Research/Analyst)' ? 'Annual' : reportingMonth;

    // Period constraint check: except for Evidence Submissions which are report-based, others prevent duplicate Year+Month
    if (role !== 'Evidence Submission (Research/Analyst)') {
      const isDuplicate = submissions.some(
        s => s.reportingYear === currentYear &&
        s.reportingMonth === currentMonth &&
        s.formType === role &&
        (!editingSub || s.id !== editingSub.id)
      );

      if (isDuplicate) {
        setNotification({ type: 'error', message: `A submission for the period ${currentMonth} ${currentYear} already exists.` });
        return;
      }
    }

    let updatedList: PartnerSubmission[] = [];
    
    // Assemble the submission specific payload
    const submissionData: Partial<PartnerSubmission> = {
      reportingYear: currentYear,
      reportingMonth: currentMonth,
      notes: notes || undefined,
      formType: role,
      status: asDraft ? 'draft' : 'submitted',
    };

    if (role === 'Manufacturer') {
      submissionData.manufacturerName = manufacturerName;
      submissionData.facilityName = facilityName || undefined;
      submissionData.facilityAddress = facilityAddress;
      submissionData.facilityType = facilityType;
      submissionData.gmpStatus = gmpStatus;
      submissionData.vaccineValue = Number(vaccineValue);
      submissionData.medicineValue = Number(medicineValue);
      submissionData.evidenceUrl = evidenceFile || undefined;
    } else if (role === 'Regulator (NRA)') {
      submissionData.nraName = nraName;
      submissionData.gbtLevel = gbtLevel;
      submissionData.amaRatified = amaRatified;
      submissionData.regionalHarmonisation = regionalHarmonisation;
      submissionData.regionalScheme = regionalHarmonisation === 'Yes' ? regionalScheme : undefined;
      submissionData.installedCapacity = Number(installedCapacity);
      submissionData.capacityUtilisation = Number(capacityUtilisation);
      submissionData.productionLines = Number(productionLines);
      submissionData.techPlatforms = techPlatforms;
      submissionData.gmpInspections = Number(gmpInspections);
      submissionData.nonCompliantFacilities = nonCompliantFacilities ? Number(nonCompliantFacilities) : undefined;
      submissionData.batchCertificates = Number(batchCertificates);
      submissionData.apiAfricaPct = Number(apiAfricaPct);
      submissionData.packagingAfricaPct = Number(packagingAfricaPct);
      submissionData.techTransfer = techTransfer;
      submissionData.techTransferPartner = techTransfer === 'Yes' ? techTransferPartner : undefined;
      submissionData.totalMAs = Number(totalMAs);
      submissionData.localMAs = Number(localMAs);
      submissionData.newLocalMAs = newLocalMAs ? Number(newLocalMAs) : undefined;
      submissionData.medianApprovalTime = medianApprovalTime ? Number(medianApprovalTime) : undefined;
      submissionData.acceleratedPathway = acceleratedPathway;
    } else if (role === 'Central Medical Supply') {
      submissionData.cmsName = cmsName;
      submissionData.cmsType = cmsType;
      submissionData.procurementBudget = Number(procurementBudget);
      submissionData.procurementCurrency = procurementCurrency;
      submissionData.localProcurementPct = Number(localProcurementPct);
      submissionData.localPreference = localPreference;
      submissionData.localPreferencePremium = localPreference === 'Yes' ? Number(localPreferencePremium) : undefined;
      submissionData.topTherapeuticCategories = topTherapeuticCategories;
      submissionData.reservedForLocal = reservedForLocal;
      submissionData.reservedProducts = reservedForLocal === 'Yes' ? reservedProducts : undefined;
      submissionData.leadTimeLocal = Number(leadTimeLocal);
      submissionData.leadTimeImported = Number(leadTimeImported);
      submissionData.stockoutDaysLocal = stockoutDaysLocal ? Number(stockoutDaysLocal) : undefined;
      submissionData.stockoutDaysImported = stockoutDaysImported ? Number(stockoutDaysImported) : undefined;
    } else if (role === 'Evidence Submission (Research/Analyst)') {
      submissionData.evidenceType = evidenceType;
      submissionData.sourceTitle = sourceTitle;
      submissionData.sourceAuthor = sourceAuthor;
      submissionData.sourceDate = sourceDate;
      submissionData.sourceUrl = sourceUrl || undefined;
      submissionData.findingsExcerpt = findingsExcerpt;
      submissionData.extractedPoints = extractedPoints;
      submissionData.creditContributor = creditContributor;
      submissionData.contributorName = creditContributor === 'Yes' ? contributorName : undefined;
      submissionData.contributorAffiliation = creditContributor === 'Yes' ? contributorAffiliation : undefined;
    }

    if (editingSub) {
      updatedList = submissions.map(s => {
        if (s.id === editingSub.id) {
          return {
            ...s,
            ...submissionData,
            createdAt: new Date().toISOString()
          };
        }
        return s;
      });
      setNotification({ type: 'success', message: 'Report updated successfully.' });
    } else {
      const newSub: PartnerSubmission = {
        id: 'sub_' + Math.random().toString(36).substr(2, 9),
        partnerId: partnerUser.email,
        partnerName: partnerUser.org,
        trustScore: 5,
        createdAt: new Date().toISOString(),
        ...submissionData
      } as PartnerSubmission;
      updatedList = [newSub, ...submissions];
      setNotification({ type: 'success', message: 'New data report submitted successfully.' });
    }

    setSubmissions(updatedList);
    localStorage.setItem('vax2040_partner_submissions', JSON.stringify(updatedList));
    handleCancelForm();
  };

  const handleEditClick = (sub: PartnerSubmission) => {
    if (sub.status !== 'draft' && sub.status !== 'requires update') {
      alert("Only drafts or records requiring updates can be edited.");
      return;
    }
    setEditingSub(sub);
    setReportingYear(sub.reportingYear);
    setReportingMonth(sub.reportingMonth);
    setNotes(sub.notes || '');

    // Load form specifics
    if (sub.formType === 'Manufacturer') {
      setManufacturerName(sub.manufacturerName || '');
      setFacilityName(sub.facilityName || '');
      setFacilityAddress(sub.facilityAddress || '');
      setFacilityType(sub.facilityType || 'Formulation & fill‑finish');
      setGmpStatus(sub.gmpStatus || 'WHO prequalified');
      setVaccineValue(String(sub.vaccineValue || ''));
      setMedicineValue(String(sub.medicineValue || ''));
      setEvidenceFile(sub.evidenceUrl || '');
    } else if (sub.formType === 'Regulator (NRA)') {
      setNraName(sub.nraName || '');
      setGbtLevel(sub.gbtLevel || 'ML3');
      setAmaRatified(sub.amaRatified || 'Yes');
      setRegionalHarmonisation(sub.regionalHarmonisation || 'Yes');
      setRegionalScheme(sub.regionalScheme || '');
      setInstalledCapacity(String(sub.installedCapacity || ''));
      setCapacityUtilisation(String(sub.capacityUtilisation || ''));
      setProductionLines(String(sub.productionLines || ''));
      setTechPlatforms(sub.techPlatforms || []);
      setGmpInspections(String(sub.gmpInspections || ''));
      setNonCompliantFacilities(String(sub.nonCompliantFacilities || ''));
      setBatchCertificates(String(sub.batchCertificates || ''));
      setApiAfricaPct(String(sub.apiAfricaPct || ''));
      setPackagingAfricaPct(String(sub.packagingAfricaPct || ''));
      setTechTransfer(sub.techTransfer || 'No');
      setTechTransferPartner(sub.techTransferPartner || '');
      setTotalMAs(String(sub.totalMAs || ''));
      setLocalMAs(String(sub.localMAs || ''));
      setNewLocalMAs(String(sub.newLocalMAs || ''));
      setMedianApprovalTime(String(sub.medianApprovalTime || ''));
      setAcceleratedPathway(sub.acceleratedPathway || 'No');
    } else if (sub.formType === 'Central Medical Supply') {
      setCmsName(sub.cmsName || '');
      setCmsType(sub.cmsType || 'Central government procurement');
      setProcurementBudget(String(sub.procurementBudget || ''));
      setProcurementCurrency(sub.procurementCurrency || 'USD');
      setLocalProcurementPct(String(sub.localProcurementPct || ''));
      setLocalPreference(sub.localPreference || 'No');
      setLocalPreferencePremium(String(sub.localPreferencePremium || ''));
      setTopTherapeuticCategories(sub.topTherapeuticCategories || []);
      setReservedForLocal(sub.reservedForLocal || 'No');
      setReservedProducts(sub.reservedProducts || '');
      setLeadTimeLocal(String(sub.leadTimeLocal || ''));
      setLeadTimeImported(String(sub.leadTimeImported || ''));
      setStockoutDaysLocal(String(sub.stockoutDaysLocal || ''));
      setStockoutDaysImported(String(sub.stockoutDaysImported || ''));
    } else if (sub.formType === 'Evidence Submission (Research/Analyst)') {
      setEvidenceType(sub.evidenceType || 'Research publication');
      setSourceTitle(sub.sourceTitle || '');
      setSourceAuthor(sub.sourceAuthor || '');
      setSourceDate(sub.sourceDate || '');
      setSourceUrl(sub.sourceUrl || '');
      setFindingsExcerpt(sub.findingsExcerpt || '');
      setExtractedPoints(sub.extractedPoints || [{ indicator: '', value: '', unit: '', period: '', pageRef: '' }]);
      setCreditContributor(sub.creditContributor || 'No');
      setContributorName(sub.contributorName || '');
      setContributorAffiliation(sub.contributorAffiliation || '');
    }

    setViewMode('form');
  };

  const handleDeleteClick = (sub: PartnerSubmission) => {
    if (sub.status !== 'draft' && sub.status !== 'requires update') {
      alert("Only draft submissions or records requiring updates can be deleted.");
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
    setNotes('');

    // Reset Manufacturer
    setManufacturerName('');
    setFacilityName('');
    setFacilityAddress('');
    setFacilityType('Formulation & fill‑finish');
    setGmpStatus('WHO prequalified');
    setVaccineValue('');
    setMedicineValue('');
    setEvidenceFile('');

    // Reset Regulator
    setNraName('');
    setGbtLevel('ML3');
    setAmaRatified('Yes');
    setRegionalHarmonisation('Yes');
    setRegionalScheme('');
    setInstalledCapacity('');
    setCapacityUtilisation('');
    setProductionLines('');
    setTechPlatforms([]);
    setGmpInspections('');
    setNonCompliantFacilities('');
    setBatchCertificates('');
    setApiAfricaPct('');
    setPackagingAfricaPct('');
    setTechTransfer('No');
    setTechTransferPartner('');
    setTotalMAs('');
    setLocalMAs('');
    setNewLocalMAs('');
    setMedianApprovalTime('');
    setAcceleratedPathway('No');

    // Reset Central Medical Supply
    setCmsName('');
    setCmsType('Central government procurement');
    setProcurementBudget('');
    setProcurementCurrency('USD');
    setLocalProcurementPct('');
    setLocalPreference('No');
    setLocalPreferencePremium('');
    setTopTherapeuticCategories([]);
    setReservedForLocal('No');
    setReservedProducts('');
    setLeadTimeLocal('');
    setLeadTimeImported('');
    setStockoutDaysLocal('');
    setStockoutDaysImported('');

    // Reset Evidence
    setEvidenceType('Research publication');
    setSourceTitle('');
    setSourceAuthor('');
    setSourceDate('');
    setSourceUrl('');
    setFindingsExcerpt('');
    setExtractedPoints([{ indicator: '', value: '', unit: '', period: '', pageRef: '' }]);
    setCreditContributor('No');
    setContributorName('');
    setContributorAffiliation('');

    setViewMode('list');
  };

  const isDeleteExpired = (createdAt: string) => {
    const elapsedMs = new Date().getTime() - new Date(createdAt).getTime();
    const twoHoursMs = 2 * 60 * 60 * 1000;
    return elapsedMs >= twoHoursMs;
  };

  const getDeleteTooltip = (sub: PartnerSubmission) => {
    if (sub.status !== 'draft' && sub.status !== 'requires update') return "Only draft submissions can be deleted";
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

  // Filter list and aggregate stats based on Role
  const mySubmissions = submissions.filter(s => s.formType === role);

  return (
    <div className={styles.container}>
      {/* HEADER SECTION */}
      <div className={styles.header}>
        <div className={styles.titleArea}>
          <div className={styles.partnerNameLabel}>Access Level: <strong>{role}</strong></div>
          <h1 className={styles.title}>Production Feed Workspace</h1>
          <p className={styles.sub}>
            {role === 'Manufacturer' && 'Submit ex-factory values and facility identity logs for your domestic operations.'}
            {role === 'Regulator (NRA)' && 'Log official regulatory benchmarks, inspections, and marketing authorisations (MAs).'}
            {role === 'Central Medical Supply' && 'Log logistics mix, tender procurement preferences, lead times, and stockouts.'}
            {role === 'Evidence Submission (Research/Analyst)' && 'Submit academic papers, third-party reports, and verify external indicators.'}
          </p>
        </div>

        {!historyOnly && viewMode === 'list' && (
          <button className={styles.submitNewBtn} onClick={() => setViewMode('form')}>
            <Plus size={16} /> Submit New Data
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

      {/* TAB NAVIGATION ROW */}
      {!historyOnly && (
        <div className={styles.tabContainer}>
          <button 
            className={`${styles.tabButton} ${viewMode === 'list' ? styles.tabActive : ''}`}
            onClick={() => setViewMode('list')}
          >
            <ClipboardList size={16} /> Dashboard / History
          </button>
          <button 
            className={`${styles.tabButton} ${viewMode === 'form' ? styles.tabActive : ''}`}
            onClick={() => setViewMode('form')}
          >
            <FileText size={16} /> Data Entry Form
          </button>
        </div>
      )}

      {viewMode === 'list' ? (
        <>
          {/* STATS OVERVIEW CARDS (Per-Role customized stats) */}
          <div className={styles.statsRow}>
            <div className={styles.statCard}>
              <span className={styles.statLabel}>Submissions logged</span>
              <span className={styles.statValue}>{mySubmissions.length} Reports</span>
            </div>

            {role === 'Manufacturer' && (
              <>
                <div className={styles.statCard}>
                  <span className={styles.statLabel}>Total Vaccines Logged</span>
                  <span className={styles.statValue}>{fmtVal(mySubmissions.reduce((sum, s) => sum + (s.vaccineValue || 0), 0))}</span>
                </div>
                <div className={styles.statCard}>
                  <span className={styles.statLabel}>Total Medicines Logged</span>
                  <span className={styles.statValue}>{fmtVal(mySubmissions.reduce((sum, s) => sum + (s.medicineValue || 0), 0))}</span>
                </div>
              </>
            )}

            {role === 'Regulator (NRA)' && (
              <>
                <div className={styles.statCard}>
                  <span className={styles.statLabel}>Inspections Monitored</span>
                  <span className={styles.statValue}>{mySubmissions.reduce((sum, s) => sum + (s.gmpInspections || 0), 0)} GMP audits</span>
                </div>
                <div className={styles.statCard}>
                  <span className={styles.statLabel}>MAs Tracked</span>
                  <span className={styles.statValue}>{mySubmissions.reduce((sum, s) => sum + (s.totalMAs || 0), 0)} Approvals</span>
                </div>
              </>
            )}

            {role === 'Central Medical Supply' && (
              <>
                <div className={styles.statCard}>
                  <span className={styles.statLabel}>Total Budget Logged</span>
                  <span className={styles.statValue}>{fmtVal(mySubmissions.reduce((sum, s) => sum + (s.procurementBudget || 0), 0))}</span>
                </div>
                <div className={styles.statCard}>
                  <span className={styles.statLabel}>Avg Local Procure Rate</span>
                  <span className={styles.statValue}>
                    {mySubmissions.length > 0
                      ? (mySubmissions.reduce((sum, s) => sum + (s.localProcurementPct || 0), 0) / mySubmissions.length).toFixed(1)
                      : '0.0'}%
                  </span>
                </div>
              </>
            )}

            {role === 'Evidence Submission (Research/Analyst)' && (
              <>
                <div className={styles.statCard}>
                  <span className={styles.statLabel}>Evidence Sources</span>
                  <span className={styles.statValue}>{mySubmissions.length} Documents</span>
                </div>
                <div className={styles.statCard}>
                  <span className={styles.statLabel}>Extracted Metrics</span>
                  <span className={styles.statValue}>{mySubmissions.reduce((sum, s) => sum + (s.extractedPoints?.length || 0), 0)} Items</span>
                </div>
              </>
            )}

            <div className={styles.statCard}>
              <span className={styles.statLabel}>Trust Score</span>
              <span className={styles.statValue} style={{ color: '#00B087', display: 'flex', alignItems: 'center', gap: '6px', justifyContent: 'flex-end' }}>
                5 / 5 <CheckCircle2 size={18} />
              </span>
            </div>
          </div>

          {/* TABLE LOG LIST (Per-Role customized headers) */}
          <div className={styles.managerSection}>
            <div className={styles.managerHeader}>
              <h2 className={styles.sectionTitle}>Historical Submissions Feed</h2>
              <p className={styles.sectionDesc}>List of logs submitted by your organization role level.</p>
            </div>

            {mySubmissions.length === 0 ? (
              <div className={styles.emptyState}>
                <ClipboardList size={40} className={styles.emptyIcon} />
                <p className={styles.emptyText}>No historical records found</p>
                <p className={styles.emptySub}>Click the "Submit New Data" button above to log your first output metrics.</p>
              </div>
            ) : (
              <div className={styles.tableWrapper}>
                <table className={styles.table}>
                  <thead>
                    {role === 'Manufacturer' && (
                      <tr>
                        <th>Reporting Period</th>
                        <th>Vaccine Value (USD)</th>
                        <th>Medicine Value (USD)</th>
                        <th>Verification Status</th>
                        <th>Trust Rating</th>
                        <th>Date Logged</th>
                        <th>Actions</th>
                      </tr>
                    )}
                    {role === 'Regulator (NRA)' && (
                      <tr>
                        <th>Reporting Period</th>
                        <th>NRA Name</th>
                        <th>Installed Capacity</th>
                        <th>MAs Registered</th>
                        <th>AMA Ratified</th>
                        <th>Status</th>
                        <th>Date Logged</th>
                        <th>Actions</th>
                      </tr>
                    )}
                    {role === 'Central Medical Supply' && (
                      <tr>
                        <th>Reporting Period</th>
                        <th>CMS Name</th>
                        <th>Budget (USD)</th>
                        <th>Local Procure %</th>
                        <th>Lead Times (Loc/Imp)</th>
                        <th>Status</th>
                        <th>Date Logged</th>
                        <th>Actions</th>
                      </tr>
                    )}
                    {role === 'Evidence Submission (Research/Analyst)' && (
                      <tr>
                        <th>Source Title</th>
                        <th>Author / Org</th>
                        <th>Evidence Type</th>
                        <th>Pub Date</th>
                        <th>Extracted Pts</th>
                        <th>Status</th>
                        <th>Date Logged</th>
                        <th>Actions</th>
                      </tr>
                    )}
                  </thead>
                  <tbody>
                    {mySubmissions.map(sub => {
                      const isEditable = sub.status === 'draft';
                      const canDelete = sub.status === 'draft' && !isDeleteExpired(sub.createdAt);
                      
                      return (
                        <tr key={sub.id}>
                          {/* Manufacturer columns */}
                          {role === 'Manufacturer' && (
                            <>
                              <td className={styles.tdYear}>{sub.reportingMonth} {sub.reportingYear}</td>
                              <td className={styles.tdVal}>{fmtVal(sub.vaccineValue || 0)}</td>
                              <td className={styles.tdVal}>{fmtVal(sub.medicineValue || 0)}</td>
                            </>
                          )}

                          {/* NRA columns */}
                          {role === 'Regulator (NRA)' && (
                            <>
                              <td className={styles.tdYear}>{sub.reportingMonth} {sub.reportingYear}</td>
                              <td>{sub.nraName}</td>
                              <td className={styles.tdVal}>{(sub.installedCapacity || 0).toLocaleString()} doses</td>
                              <td>{sub.totalMAs} (Local: {sub.localMAs})</td>
                              <td>{sub.amaRatified}</td>
                            </>
                          )}

                          {/* CMS columns */}
                          {role === 'Central Medical Supply' && (
                            <>
                              <td className={styles.tdYear}>{sub.reportingMonth} {sub.reportingYear}</td>
                              <td>{sub.cmsName}</td>
                              <td className={styles.tdVal}>{fmtVal(sub.procurementBudget || 0)}</td>
                              <td className={styles.tdVal}>{sub.localProcurementPct}%</td>
                              <td>{sub.leadTimeLocal}d / {sub.leadTimeImported}d</td>
                            </>
                          )}

                          {/* Evidence columns */}
                          {role === 'Evidence Submission (Research/Analyst)' && (
                            <>
                              <td className={styles.tdYear} style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{sub.sourceTitle}</td>
                              <td>{sub.sourceAuthor}</td>
                              <td>{sub.evidenceType}</td>
                              <td>{sub.sourceDate}</td>
                              <td>{sub.extractedPoints?.length || 0} points</td>
                            </>
                          )}

                          {/* Common columns */}
                          <td>
                            {(() => {
                              let statusText = 'Pending';
                              let statusClass = styles.statusPending;
                              
                              const stat = sub.status?.toLowerCase();
                              if (stat === 'published' || stat === 'approved' || stat === 'accepted') {
                                statusText = 'Accepted';
                                statusClass = styles.statusApproved;
                              } else if (stat === 'rejected' || stat === 'denied') {
                                statusText = 'Denied';
                                statusClass = styles.statusRejected;
                              } else if (stat === 'draft' || stat === 'requires update') {
                                statusText = 'Requires Update';
                                statusClass = styles.statusDraft;
                              } else if (stat === 'submitted' || stat === 'pending') {
                                statusText = 'Pending';
                                statusClass = styles.statusPending;
                              }
                              
                              return (
                                <span className={`${styles.statusBadge} ${statusClass}`}>
                                  {statusText}
                                </span>
                              );
                            })()}
                          </td>
                          {role === 'Manufacturer' && (
                            <td>
                              <span className={styles.trustBadge}>
                                <CheckCircle2 size={10} /> 5/5 Rating
                              </span>
                            </td>
                          )}
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
              <h2 className={styles.formCardTitle}>{editingSub ? 'Edit Production Report' : 'Submit Production Metrics'}</h2>
              <p className={styles.formCardDesc}>Input verification values relevant to the {role} access level.</p>
            </div>
            <button className={styles.backBtn} onClick={handleCancelForm}>
              <ArrowLeft size={14} /> Back to History
            </button>
          </div>

          <form className={styles.formBody}>
            {/* YEAR & MONTH PERIOD (Rendered for all except Evidence Submission) */}
            {role !== 'Evidence Submission (Research/Analyst)' && (
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
            )}

            {/* 1. RENDER LOCAL PHARMACEUTICAL MANUFACTURER FORM */}
            {role === 'Manufacturer' && (
              <>
                <div className={styles.formSubtitle}>A. Facility Identity</div>
                
                <div className={styles.formGroup}>
                  <label className={styles.label}>Manufacturer Name <span className={styles.reqAsterisk}>*</span></label>
                  <input
                    type="text"
                    placeholder="e.g. BioNTech Rwanda"
                    className={styles.input}
                    value={manufacturerName}
                    onChange={(e) => setManufacturerName(e.target.value)}
                    required
                  />
                </div>

                <div className={styles.formGrid}>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Plant / Facility Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Kigali mRNA Facility"
                      className={styles.input}
                      value={facilityName}
                      onChange={(e) => setFacilityName(e.target.value)}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.label}>Facility Type <span className={styles.reqAsterisk}>*</span></label>
                    <select className={styles.select} value={facilityType} onChange={(e) => setFacilityType(e.target.value)}>
                      <option value="Formulation & fill‑finish">Formulation & fill‑finish</option>
                      <option value="Active Pharmaceutical Ingredient (API) production">Active Pharmaceutical Ingredient (API) production</option>
                      <option value="Packaging only">Packaging only</option>
                      <option value="R&D centre">R&D centre</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <div className={styles.formGrid}>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>GMP Certification Status <span className={styles.reqAsterisk}>*</span></label>
                    <select className={styles.select} value={gmpStatus} onChange={(e) => setGmpStatus(e.target.value)}>
                      <option value="WHO prequalified">WHO prequalified</option>
                      <option value="PIC/S">PIC/S</option>
                      <option value="ISO 13485">ISO 13485</option>
                      <option value="National GMP only">National GMP only</option>
                      <option value="Pending">Pending</option>
                      <option value="None">None</option>
                    </select>
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.label}>Facility Address <span className={styles.reqAsterisk}>*</span></label>
                    <input
                      type="text"
                      placeholder="City, Province, GPS (optional)"
                      className={styles.input}
                      value={facilityAddress}
                      onChange={(e) => setFacilityAddress(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className={styles.formSubtitle}>B. Production Outputs</div>
                
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
              </>
            )}

            {/* 2. RENDER REGULATOR (NRA) FORM */}
            {role === 'Regulator (NRA)' && (
              <>
                <div className={styles.formSubtitle}>A. NRA Context</div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>NRA Name <span className={styles.reqAsterisk}>*</span></label>
                  <input
                    type="text"
                    placeholder="e.g. Rwanda Food and Drugs Authority"
                    className={styles.input}
                    value={nraName}
                    onChange={(e) => setNraName(e.target.value)}
                    required
                  />
                </div>

                <div className={styles.formGrid}>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>WHO GBT Maturity Level <span className={styles.reqAsterisk}>*</span></label>
                    <select className={styles.select} value={gbtLevel} onChange={(e) => setGbtLevel(e.target.value)}>
                      <option value="ML1">ML1 (Maturity Level 1)</option>
                      <option value="ML2">ML2 (Maturity Level 2)</option>
                      <option value="ML3">ML3 (Maturity Level 3)</option>
                      <option value="ML4">ML4 (Maturity Level 4)</option>
                      <option value="Not assessed">Not assessed</option>
                    </select>
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.label}>Ratified African Medicines Agency (AMA) Treaty? <span className={styles.reqAsterisk}>*</span></label>
                    <div className={styles.radioGroup}>
                      <label className={styles.radioItem}>
                        <input type="radio" name="ama" value="Yes" checked={amaRatified === 'Yes'} onChange={() => setAmaRatified('Yes')} /> Yes
                      </label>
                      <label className={styles.radioItem}>
                        <input type="radio" name="ama" value="No" checked={amaRatified === 'No'} onChange={() => setAmaRatified('No')} /> No
                      </label>
                    </div>
                  </div>
                </div>

                <div className={styles.formGrid}>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Part of Regional Regulatory Scheme? <span className={styles.reqAsterisk}>*</span></label>
                    <div className={styles.radioGroup}>
                      <label className={styles.radioItem}>
                        <input type="radio" name="regional" value="Yes" checked={regionalHarmonisation === 'Yes'} onChange={() => setRegionalHarmonisation('Yes')} /> Yes
                      </label>
                      <label className={styles.radioItem}>
                        <input type="radio" name="regional" value="No" checked={regionalHarmonisation === 'No'} onChange={() => setRegionalHarmonisation('No')} /> No
                      </label>
                    </div>
                  </div>

                  {regionalHarmonisation === 'Yes' && (
                    <div className={styles.formGroup}>
                      <label className={styles.label}>Specify Scheme <span className={styles.reqAsterisk}>*</span></label>
                      <input
                        type="text"
                        placeholder="e.g. EAC MRH, Zazibona"
                        className={styles.input}
                        value={regionalScheme}
                        onChange={(e) => setRegionalScheme(e.target.value)}
                        required
                      />
                    </div>
                  )}
                </div>

                <div className={styles.formSubtitle}>B. Marketing Authorisations (MAs)</div>

                <div className={styles.formGrid}>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Total Active MAs (Human Medicines) <span className={styles.reqAsterisk}>*</span></label>
                    <input
                      type="number"
                      placeholder="e.g. 1450"
                      className={styles.input}
                      value={totalMAs}
                      onChange={(e) => setTotalMAs(e.target.value)}
                      required
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.label}>Active MAs for Locally Manufactured Products <span className={styles.reqAsterisk}>*</span></label>
                    <input
                      type="number"
                      placeholder="e.g. 120"
                      className={styles.input}
                      value={localMAs}
                      onChange={(e) => setLocalMAs(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className={styles.formGrid}>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>New MAs Granted this Period (Local Products)</label>
                    <input
                      type="number"
                      placeholder="e.g. 15"
                      className={styles.input}
                      value={newLocalMAs}
                      onChange={(e) => setNewLocalMAs(e.target.value)}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.label}>Median Time to Approve Local Product (months)</label>
                    <input
                      type="number"
                      placeholder="e.g. 6"
                      className={styles.input}
                      value={medianApprovalTime}
                      onChange={(e) => setMedianApprovalTime(e.target.value)}
                    />
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>Accelerated Pathway for Local Essential Products? <span className={styles.reqAsterisk}>*</span></label>
                  <div className={styles.radioGroup}>
                    <label className={styles.radioItem}>
                      <input type="radio" name="accel" value="Yes" checked={acceleratedPathway === 'Yes'} onChange={() => setAcceleratedPathway('Yes')} /> Yes
                    </label>
                    <label className={styles.radioItem}>
                      <input type="radio" name="accel" value="No" checked={acceleratedPathway === 'No'} onChange={() => setAcceleratedPathway('No')} /> No
                    </label>
                  </div>
                </div>

                <div className={styles.formSubtitle}>C. Installed Capacity & Utilisation</div>

                <div className={styles.formGrid}>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Installed Annual Capacity (doses/units) <span className={styles.reqAsterisk}>*</span></label>
                    <input
                      type="number"
                      placeholder="e.g. 50000000"
                      className={styles.input}
                      value={installedCapacity}
                      onChange={(e) => setInstalledCapacity(e.target.value)}
                      required
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.label}>Capacity Utilisation Rate (%) <span className={styles.reqAsterisk}>*</span></label>
                    <input
                      type="number"
                      placeholder="e.g. 45"
                      className={styles.input}
                      value={capacityUtilisation}
                      onChange={(e) => setCapacityUtilisation(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>Active dedicated Production Lines <span className={styles.reqAsterisk}>*</span></label>
                  <input
                    type="number"
                    placeholder="e.g. 4"
                    className={styles.input}
                    value={productionLines}
                    onChange={(e) => setProductionLines(e.target.value)}
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>Technology Platform(s) <span className={styles.reqAsterisk}>*</span></label>
                  <div className={styles.checkboxGroup}>
                    {['mRNA', 'viral vector', 'recombinant protein', 'sterile injectables', 'solid dose (tablets/capsules)', 'liquid/syrup'].map(p => (
                      <label key={p} className={styles.checkboxItem}>
                        <input
                          type="checkbox"
                          checked={techPlatforms.includes(p)}
                          onChange={(e) => {
                            if (e.target.checked) setTechPlatforms([...techPlatforms, p]);
                            else setTechPlatforms(techPlatforms.filter(item => item !== p));
                          }}
                        /> {p}
                      </label>
                    ))}
                  </div>
                </div>

                <div className={styles.formSubtitle}>D. Inspections & Compliance</div>

                <div className={styles.formGrid}>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>GMP Inspections Conducted this Period <span className={styles.reqAsterisk}>*</span></label>
                    <input
                      type="number"
                      placeholder="e.g. 12"
                      className={styles.input}
                      value={gmpInspections}
                      onChange={(e) => setGmpInspections(e.target.value)}
                      required
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.label}>Local facilities found Non-Compliant</label>
                    <input
                      type="number"
                      placeholder="e.g. 1"
                      className={styles.input}
                      value={nonCompliantFacilities}
                      onChange={(e) => setNonCompliantFacilities(e.target.value)}
                    />
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>Total Batch Release Certificates Issued <span className={styles.reqAsterisk}>*</span></label>
                  <input
                    type="number"
                    placeholder="e.g. 85"
                    className={styles.input}
                    value={batchCertificates}
                    onChange={(e) => setBatchCertificates(e.target.value)}
                    required
                  />
                </div>

                <div className={styles.formSubtitle}>E. Supply Chain Localisation</div>

                <div className={styles.formGrid}>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>% APIs Sourced from Africa (%) <span className={styles.reqAsterisk}>*</span></label>
                    <input
                      type="number"
                      placeholder="e.g. 5"
                      className={styles.input}
                      value={apiAfricaPct}
                      onChange={(e) => setApiAfricaPct(e.target.value)}
                      required
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.label}>% Packaging Sourced from Africa (%) <span className={styles.reqAsterisk}>*</span></label>
                    <input
                      type="number"
                      placeholder="e.g. 20"
                      className={styles.input}
                      value={packagingAfricaPct}
                      onChange={(e) => setPackagingAfricaPct(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className={styles.formGrid}>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Has formal Tech-Transfer Agreement? <span className={styles.reqAsterisk}>*</span></label>
                    <div className={styles.radioGroup}>
                      <label className={styles.radioItem}>
                        <input type="radio" name="techTrsf" value="Yes" checked={techTransfer === 'Yes'} onChange={() => setTechTransfer('Yes')} /> Yes
                      </label>
                      <label className={styles.radioItem}>
                        <input type="radio" name="techTrsf" value="No" checked={techTransfer === 'No'} onChange={() => setTechTransfer('No')} /> No
                      </label>
                    </div>
                  </div>

                  {techTransfer === 'Yes' && (
                    <div className={styles.formGroup}>
                      <label className={styles.label}>Specify Partner Name(s) <span className={styles.reqAsterisk}>*</span></label>
                      <input
                        type="text"
                        placeholder="e.g. BioNTech SE, Moderna"
                        className={styles.input}
                        value={techTransferPartner}
                        onChange={(e) => setTechTransferPartner(e.target.value)}
                        required
                      />
                    </div>
                  )}
                </div>
              </>
            )}

            {/* 3. RENDER CENTRAL MEDICAL SUPPLY FORM */}
            {role === 'Central Medical Supply' && (
              <>
                <div className={styles.formSubtitle}>A. Organisation & Budget</div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>Organisation Name <span className={styles.reqAsterisk}>*</span></label>
                  <input
                    type="text"
                    placeholder="e.g. Rwanda Biomedical Centre"
                    className={styles.input}
                    value={cmsName}
                    onChange={(e) => setCmsName(e.target.value)}
                    required
                  />
                </div>

                <div className={styles.formGrid}>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Organisation Type <span className={styles.reqAsterisk}>*</span></label>
                    <select className={styles.select} value={cmsType} onChange={(e) => setCmsType(e.target.value)}>
                      <option value="Central government procurement">Central government procurement</option>
                      <option value="Regional health authority">Regional health authority</option>
                      <option value="Major public hospital network">Major public hospital network</option>
                      <option value="Large private distributor">Large private distributor</option>
                      <option value="Faith‑based network">Faith‑based network</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.label}>Currency <span className={styles.reqAsterisk}>*</span></label>
                    <select className={styles.select} value={procurementCurrency} onChange={(e) => setProcurementCurrency(e.target.value)}>
                      <option value="USD">USD (United States Dollar)</option>
                      <option value="EUR">EUR (Euro)</option>
                      <option value="Local">Local Currency</option>
                    </select>
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>Annual Pharmaceutical Procurement Budget <span className={styles.reqAsterisk}>*</span></label>
                  <input
                    type="number"
                    placeholder="e.g. 42000000"
                    className={styles.input}
                    value={procurementBudget}
                    onChange={(e) => setProcurementBudget(e.target.value)}
                    required
                  />
                </div>

                <div className={styles.formSubtitle}>B. Sourcing Mix & Policy</div>

                <div className={styles.formGrid}>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>% Spent on Locally Manufactured Products (%) <span className={styles.reqAsterisk}>*</span></label>
                    <input
                      type="number"
                      placeholder="e.g. 15"
                      className={styles.input}
                      value={localProcurementPct}
                      onChange={(e) => setLocalProcurementPct(e.target.value)}
                      required
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.label}>Policy Includes Local Preference Margin? <span className={styles.reqAsterisk}>*</span></label>
                    <div className={styles.radioGroup}>
                      <label className={styles.radioItem}>
                        <input type="radio" name="preference" value="Yes" checked={localPreference === 'Yes'} onChange={() => setLocalPreference('Yes')} /> Yes
                      </label>
                      <label className={styles.radioItem}>
                        <input type="radio" name="preference" value="No" checked={localPreference === 'No'} onChange={() => setLocalPreference('No')} /> No
                      </label>
                    </div>
                  </div>
                </div>

                {localPreference === 'Yes' && (
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Allowed Premium Premium Allowed (%) <span className={styles.reqAsterisk}>*</span></label>
                    <input
                      type="number"
                      placeholder="e.g. 10"
                      className={styles.input}
                      value={localPreferencePremium}
                      onChange={(e) => setLocalPreferencePremium(e.target.value)}
                      required
                    />
                  </div>
                )}

                <div className={styles.formGroup}>
                  <label className={styles.label}>Top 3 Therapeutic Categories by Spend</label>
                  <div className={styles.checkboxGroup}>
                    {['Essential medicines', 'Vaccines', 'Maternal & child health', 'Anti‑infectives', 'NCDs', 'Other'].map(t => (
                      <label key={t} className={styles.checkboxItem}>
                        <input
                          type="checkbox"
                          checked={topTherapeuticCategories.includes(t)}
                          onChange={(e) => {
                            if (e.target.checked) setTopTherapeuticCategories([...topTherapeuticCategories, t]);
                            else setTopTherapeuticCategories(topTherapeuticCategories.filter(item => item !== t));
                          }}
                        /> {t}
                      </label>
                    ))}
                  </div>
                </div>

                <div className={styles.formGrid}>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Specific Products Reserved Exclusively for Local Purchase? <span className={styles.reqAsterisk}>*</span></label>
                    <div className={styles.radioGroup}>
                      <label className={styles.radioItem}>
                        <input type="radio" name="reserved" value="Yes" checked={reservedForLocal === 'Yes'} onChange={() => setReservedForLocal('Yes')} /> Yes
                      </label>
                      <label className={styles.radioItem}>
                        <input type="radio" name="reserved" value="No" checked={reservedForLocal === 'No'} onChange={() => setReservedForLocal('No')} /> No
                      </label>
                    </div>
                  </div>

                  {reservedForLocal === 'Yes' && (
                    <div className={styles.formGroup}>
                      <label className={styles.label}>Specify Reserved Products <span className={styles.reqAsterisk}>*</span></label>
                      <input
                        type="text"
                        placeholder="e.g. Paracetamol, Amoxicillin Syrups"
                        className={styles.input}
                        value={reservedProducts}
                        onChange={(e) => setReservedProducts(e.target.value)}
                        required
                      />
                    </div>
                  )}
                </div>

                <div className={styles.formSubtitle}>C. Lead Times & Stockouts</div>

                <div className={styles.formGrid}>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Average Lead Time - Local Products (days) <span className={styles.reqAsterisk}>*</span></label>
                    <input
                      type="number"
                      placeholder="e.g. 14"
                      className={styles.input}
                      value={leadTimeLocal}
                      onChange={(e) => setLeadTimeLocal(e.target.value)}
                      required
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.label}>Average Lead Time - Imported Products (days) <span className={styles.reqAsterisk}>*</span></label>
                    <input
                      type="number"
                      placeholder="e.g. 90"
                      className={styles.input}
                      value={leadTimeImported}
                      onChange={(e) => setLeadTimeImported(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className={styles.formGrid}>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Stockout Frequency - Local Products (days/year)</label>
                    <input
                      type="number"
                      placeholder="e.g. 5"
                      className={styles.input}
                      value={stockoutDaysLocal}
                      onChange={(e) => setStockoutDaysLocal(e.target.value)}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.label}>Stockout Frequency - Imported Products (days/year)</label>
                    <input
                      type="number"
                      placeholder="e.g. 24"
                      className={styles.input}
                      value={stockoutDaysImported}
                      onChange={(e) => setStockoutDaysImported(e.target.value)}
                    />
                  </div>
                </div>
              </>
            )}

            {/* 4. RENDER EVIDENCE & SOURCE VALIDATION FORM */}
            {role === 'Evidence Submission (Research/Analyst)' && (
              <>
                <div className={styles.formSubtitle}>A. Evidence Context</div>

                <div className={styles.formGrid}>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Evidence Type <span className={styles.reqAsterisk}>*</span></label>
                    <select className={styles.select} value={evidenceType} onChange={(e) => setEvidenceType(e.target.value)}>
                      <option value="Research publication">Research publication</option>
                      <option value="Official government report">Official government report</option>
                      <option value="Institutional verified data (WHO, AU, etc.)">Institutional verified data (WHO, AU, etc.)</option>
                      <option value="Industry intelligence">Industry intelligence</option>
                      <option value="Academic study">Academic study</option>
                      <option value="Third‑party assessment (e.g., CHAI, PATH)">Third‑party assessment (e.g., CHAI, PATH)</option>
                      <option value="Media/analyst report">Media/analyst report</option>
                      <option value="Historical trend data">Historical trend data</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.label}>Publication Date <span className={styles.reqAsterisk}>*</span></label>
                    <input
                      type="date"
                      className={styles.input}
                      value={sourceDate}
                      onChange={(e) => setSourceDate(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>Title of Source <span className={styles.reqAsterisk}>*</span></label>
                  <input
                    type="text"
                    placeholder="e.g. Africa CDC Vaccine Manufacturing Review 2023"
                    className={styles.input}
                    value={sourceTitle}
                    onChange={(e) => setSourceTitle(e.target.value)}
                    required
                  />
                </div>

                <div className={styles.formGrid}>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Author / Publishing Organisation <span className={styles.reqAsterisk}>*</span></label>
                    <input
                      type="text"
                      placeholder="e.g. PAVM Secretariat"
                      className={styles.input}
                      value={sourceAuthor}
                      onChange={(e) => setSourceAuthor(e.target.value)}
                      required
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.label}>URL / DOI</label>
                    <input
                      type="url"
                      placeholder="e.g. https://doi.org/10.1016/..."
                      className={styles.input}
                      value={sourceUrl}
                      onChange={(e) => setSourceUrl(e.target.value)}
                    />
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>Key Findings / Excerpt <span className={styles.reqAsterisk}>*</span></label>
                  <textarea
                    placeholder="Copy-paste the specific verbatim excerpt from the source text supporting the pharmaceutical sovereignty ratio."
                    className={styles.textarea}
                    value={findingsExcerpt}
                    onChange={(e) => setFindingsExcerpt(e.target.value)}
                    rows={4}
                    required
                  />
                </div>

                <div className={styles.formSubtitle}>B. Data Points Extracted</div>
                
                <table className={styles.dataPointsTable}>
                  <thead>
                    <tr>
                      <th>Indicator Name</th>
                      <th>Value</th>
                      <th>Unit</th>
                      <th>Period</th>
                      <th>Page / Section</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {extractedPoints.map((pt, idx) => (
                      <tr key={idx}>
                        <td>
                          <input
                            type="text"
                            placeholder="e.g. Vaccine Local Share"
                            className={styles.dataPointInput}
                            value={pt.indicator}
                            onChange={(e) => updateDataPointField(idx, 'indicator', e.target.value)}
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            placeholder="e.g. 4.5"
                            className={styles.dataPointInput}
                            value={pt.value}
                            onChange={(e) => updateDataPointField(idx, 'value', e.target.value)}
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            placeholder="e.g. %"
                            className={styles.dataPointInput}
                            value={pt.unit}
                            onChange={(e) => updateDataPointField(idx, 'unit', e.target.value)}
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            placeholder="e.g. 2023"
                            className={styles.dataPointInput}
                            value={pt.period}
                            onChange={(e) => updateDataPointField(idx, 'period', e.target.value)}
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            placeholder="e.g. Page 18"
                            className={styles.dataPointInput}
                            value={pt.pageRef}
                            onChange={(e) => updateDataPointField(idx, 'pageRef', e.target.value)}
                          />
                        </td>
                        <td>
                          <button
                            type="button"
                            className={styles.removeRowBtn}
                            onClick={() => removeDataPointRow(idx)}
                            disabled={extractedPoints.length <= 1}
                            style={{ opacity: extractedPoints.length <= 1 ? 0.3 : 1 }}
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <button type="button" className={styles.addDataPointBtn} onClick={addDataPointRow}>
                  <Plus size={14} /> Add Data Point Row
                </button>

                <div className={styles.formSubtitle}>C. Attribution</div>

                <div className={styles.formGrid}>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Credit Contributor on Public Dashboard? <span className={styles.reqAsterisk}>*</span></label>
                    <div className={styles.radioGroup}>
                      <label className={styles.radioItem}>
                        <input type="radio" name="credit" value="Yes" checked={creditContributor === 'Yes'} onChange={() => setCreditContributor('Yes')} /> Yes
                      </label>
                      <label className={styles.radioItem}>
                        <input type="radio" name="credit" value="No" checked={creditContributor === 'No'} onChange={() => setCreditContributor('No')} /> No
                      </label>
                    </div>
                  </div>

                  {creditContributor === 'Yes' && (
                    <>
                      <div className={styles.formGroup}>
                        <label className={styles.label}>Contributor Name</label>
                        <input
                          type="text"
                          placeholder="e.g. Dr. Jean Kaseya"
                          className={styles.input}
                          value={contributorName}
                          onChange={(e) => setContributorName(e.target.value)}
                        />
                      </div>
                      <div className={styles.formGroup}>
                        <label className={styles.label}>Affiliation / Institution</label>
                        <input
                          type="text"
                          placeholder="e.g. Africa CDC"
                          className={styles.input}
                          value={contributorAffiliation}
                          onChange={(e) => setContributorAffiliation(e.target.value)}
                        />
                      </div>
                    </>
                  )}
                </div>
              </>
            )}

            {/* GENERAL NOTES / COMMENTS */}
            <div className={styles.formSubtitle}>Additional Context</div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Optional Notes / Comments</label>
              <textarea
                placeholder="Include details regarding audit standards, specific product profiles, or exchange rate baselines used..."
                className={styles.textarea}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={4}
              />
            </div>

            {/* FORM ACTIONS */}
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
                {editingSub ? 'Update & Publish' : 'Submit Data Report'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
