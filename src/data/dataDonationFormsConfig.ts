export const countries = [
  'Algeria', 'Angola', 'Benin', 'Botswana', 'Burkina Faso', 'Burundi', 'Cabo Verde',
  'Cameroon', 'Central African Republic', 'Chad', 'Comoros', 'Congo (Brazzaville)',
  'Congo (DRC)', 'Djibouti', 'Egypt', 'Equatorial Guinea', 'Eritrea', 'Eswatini',
  'Ethiopia', 'Gabon', 'Gambia', 'Ghana', 'Guinea', 'Guinea-Bissau', 'Ivory Coast',
  'Kenya', 'Lesotho', 'Liberia', 'Libya', 'Madagascar', 'Malawi', 'Mali', 'Mauritania',
  'Mauritius', 'Morocco', 'Mozambique', 'Namibia', 'Niger', 'Nigeria', 'Rwanda',
  'Sao Tome and Principe', 'Senegal', 'Seychelles', 'Sierra Leone', 'Somalia',
  'South Africa', 'South Sudan', 'Sudan', 'Tanzania', 'Togo', 'Tunisia', 'Uganda',
  'Zambia', 'Zimbabwe'
];

export interface FormField {
  id: string;
  label: string;
  type: 'text' | 'email' | 'number' | 'select' | 'multiselect' | 'textarea' | 'url' | 'checkbox';
  required: boolean;
  options?: string[];
  placeholder?: string;
}

export interface FormSection {
  id: string;
  title: string;
  fields: FormField[];
}

export interface FormConfig {
  id: string;
  title: string;
  targetRespondent: string;
  introText: string;
  sections: FormSection[];
  successMessage: string;
}

export const manufacturerFormConfig: FormConfig = {
  id: 'local-manufacturer',
  title: 'Local Pharmaceutical Manufacturer Data Collection Form',
  targetRespondent: 'Production Director / Plant Manager',
  introText: 'Use this form to submit structured information about manufacturing capacity, licensing, sourcing independence, and market reach. Data will be reviewed by VAX2040 Data Curators before use.',
  successMessage: 'Your data donation has been received. VAX2040 Data Curators will review your submission before it is used in analysis.',
  sections: [
    {
      id: 'facility',
      title: 'Facility & Licensing Profile',
      fields: [
        { id: 'companyName', label: 'Company Name', type: 'text', required: true },
        { id: 'country', label: 'Country of Operation', type: 'select', required: true, options: countries },
        { id: 'contactName', label: 'Contact Person Name', type: 'text', required: true },
        { id: 'contactEmail', label: 'Contact Email', type: 'email', required: true },
        { id: 'position', label: 'Position / Role', type: 'text', required: true },
        { id: 'gmpCertification', label: 'GMP Certification Status', type: 'multiselect', required: true, options: ['WHO GMP', 'National GMP', 'PIC/S', 'None', 'Other'] },
        { id: 'facilityType', label: 'Facility Type', type: 'multiselect', required: true, options: ['Fill & Finish', 'API Manufacturing', 'Formulation (Oral Solid)', 'Biologics / Vaccines', 'Other'] }
      ]
    },
    {
      id: 'capacity',
      title: 'Capacity & Production Output (Annual)',
      fields: [
        { id: 'totalCapacity', label: 'Total Installed Capacity (Units/Year)', type: 'number', required: true },
        { id: 'capacityUtilization', label: 'Current Capacity Utilization Rate (%)', type: 'number', required: true },
        { id: 'medicinesProduced', label: 'Volume of Medicines Produced (Current Year)', type: 'number', required: true },
        { id: 'vaccinesProduced', label: 'Volume of Vaccines Produced (Current Year)', type: 'number', required: false }
      ]
    },
    {
      id: 'sourcing',
      title: 'Sourcing & Supply Chain Independence',
      fields: [
        { id: 'apiLocalPercentage', label: 'Percentage of APIs sourced within Africa (%)', type: 'number', required: true },
        { id: 'packagingLocalPercentage', label: 'Percentage of Packaging Materials sourced within Africa (%)', type: 'number', required: true },
        { id: 'importOriginCountry', label: 'Primary country of origin for imported raw materials', type: 'text', required: true }
      ]
    },
    {
      id: 'market',
      title: 'Market & Export Reach',
      fields: [
        { id: 'domesticPublicPercentage', label: 'Percentage of production sold to domestic public market (%)', type: 'number', required: true },
        { id: 'domesticPrivatePercentage', label: 'Percentage of production sold to domestic private market (%)', type: 'number', required: true },
        { id: 'exportCountriesCount', label: 'Number of African countries exported to', type: 'number', required: true }
      ]
    },
    {
      id: 'evidence',
      title: 'Supporting Evidence',
      fields: [
        { id: 'sourceLink', label: 'Source / document link', type: 'url', required: false },
        { id: 'additionalNotes', label: 'Additional notes', type: 'textarea', required: false },
        { id: 'consent', label: 'I confirm that the submitted information is accurate to the best of my knowledge and may be reviewed by VAX2040 Data Curators.', type: 'checkbox', required: true }
      ]
    }
  ]
};

export const regulatoryFormConfig: FormConfig = {
  id: 'regulatory-authority',
  title: 'National Regulatory Authority Data Collection Form',
  targetRespondent: 'Regulatory Officer / Data Analyst',
  introText: 'Use this form to submit information about regulatory maturity, marketing authorizations, local manufacturing incentives, inspections, and oversight.',
  successMessage: 'Your data donation has been received. VAX2040 Data Curators will review your submission before it is used in analysis.',
  sections: [
    {
      id: 'profile',
      title: 'Institution Profile',
      fields: [
        { id: 'authorityName', label: 'National Regulatory Authority Name', type: 'text', required: true },
        { id: 'country', label: 'Country', type: 'select', required: true, options: countries },
        { id: 'contactName', label: 'Contact Person Name', type: 'text', required: true },
        { id: 'officialEmail', label: 'Official Email', type: 'email', required: true },
        { id: 'position', label: 'Position / Role', type: 'text', required: true }
      ]
    },
    {
      id: 'maturity',
      title: 'Institutional Maturity Rating',
      fields: [
        { id: 'gbtMaturity', label: 'WHO Global Benchmarking Tool (GBT) Maturity Level', type: 'select', required: true, options: ['ML1', 'ML2', 'ML3', 'ML4', 'Unknown / Not Available'] },
        { id: 'amaRatification', label: 'AMA Ratification Status', type: 'select', required: true, options: ['Ratified', 'Signed Only', 'No Action', 'Unknown / Not Available'] }
      ]
    },
    {
      id: 'registration',
      title: 'Registration & Marketing Authorization (Current Year)',
      fields: [
        { id: 'totalAuthorizations', label: 'Total marketing authorizations granted', type: 'number', required: true },
        { id: 'domesticAuthorizations', label: 'Number of authorizations granted to domestic manufacturers', type: 'number', required: true },
        { id: 'foreignAuthorizations', label: 'Number of authorizations granted to foreign manufacturers', type: 'number', required: true },
        { id: 'averageDomesticTimeline', label: 'Average timeline for domestic product registration (in days)', type: 'number', required: true }
      ]
    },
    {
      id: 'incentives',
      title: 'Local Manufacturing Incentives & Oversight',
      fields: [
        { id: 'fastTrackPathways', label: 'Are there fast-track registration pathways for local products?', type: 'select', required: true, options: ['Yes', 'No', 'Unknown'] },
        { id: 'localFacilitiesInspected', label: 'Number of local manufacturing facilities inspected this year', type: 'number', required: true },
        { id: 'nonComplianceNotices', label: 'Number of local facilities issued non-compliance notices', type: 'number', required: true }
      ]
    },
    {
      id: 'evidence',
      title: 'Supporting Evidence',
      fields: [
        { id: 'sourceLink', label: 'Source / document link', type: 'url', required: false },
        { id: 'additionalNotes', label: 'Additional notes', type: 'textarea', required: false },
        { id: 'consent', label: 'I confirm that the submitted information is accurate to the best of my knowledge and may be reviewed by VAX2040 Data Curators.', type: 'checkbox', required: true }
      ]
    }
  ]
};

export const medicalSupplyFormConfig: FormConfig = {
  id: 'central-medical-supply',
  title: 'Central Medical Supplier Data Collection Form',
  targetRespondent: 'Procurement Director / Logistics Manager',
  introText: 'Use this form to submit procurement, sourcing, tender, and supply chain reliability data for VAX2040 review.',
  successMessage: 'Your data donation has been received. VAX2040 Data Curators will review your submission before it is used in analysis.',
  sections: [
    {
      id: 'profile',
      title: 'Institution Profile',
      fields: [
        { id: 'agencyName', label: 'Central Medical Supplier / Procurement Agency Name', type: 'text', required: true },
        { id: 'country', label: 'Country', type: 'select', required: true, options: countries },
        { id: 'contactName', label: 'Contact Person Name', type: 'text', required: true },
        { id: 'officialEmail', label: 'Official Email', type: 'email', required: true },
        { id: 'position', label: 'Position / Role', type: 'text', required: true }
      ]
    },
    {
      id: 'portfolio',
      title: 'Procurement Portfolio Split',
      fields: [
        { id: 'totalBudget', label: 'Total annual pharmaceutical procurement budget (USD)', type: 'number', required: true },
        { id: 'localBudgetPercentage', label: 'Percentage of budget spent on products manufactured within Africa (%)', type: 'number', required: true },
        { id: 'importBudgetPercentage', label: 'Percentage of budget spent on products imported from outside Africa (%)', type: 'number', required: true }
      ]
    },
    {
      id: 'categories',
      title: 'Product Category Sourcing Breakdown',
      fields: [
        { id: 'essentialMedicinesLocal', label: 'Essential Medicines - Local (%)', type: 'number', required: true },
        { id: 'essentialMedicinesImported', label: 'Essential Medicines - Imported (%)', type: 'number', required: true },
        { id: 'vaccinesLocal', label: 'Vaccines - Local (%)', type: 'number', required: true },
        { id: 'vaccinesImported', label: 'Vaccines - Imported (%)', type: 'number', required: true },
        { id: 'maternalChildLocal', label: 'Maternal / Child Health - Local (%)', type: 'number', required: true },
        { id: 'maternalChildImported', label: 'Maternal / Child Health - Imported (%)', type: 'number', required: true }
      ]
    },
    {
      id: 'supplyChain',
      title: 'Supply Chain Reliability & Tenders',
      fields: [
        { id: 'localLeadTime', label: 'Average lead time for local manufacturers (days)', type: 'number', required: true },
        { id: 'internationalLeadTime', label: 'Average lead time for international manufacturers (days)', type: 'number', required: true },
        { id: 'stockoutFrequency', label: 'Frequency of stockouts due to local supplier failure', type: 'select', required: true, options: ['Frequent', 'Occasional', 'Never', 'Unknown'] },
        { id: 'localPricePreference', label: 'Do public tenders give price preferences to local manufacturers?', type: 'select', required: true, options: ['Yes', 'No', 'Unknown'] }
      ]
    },
    {
      id: 'evidence',
      title: 'Supporting Evidence',
      fields: [
        { id: 'sourceLink', label: 'Source / document link', type: 'url', required: false },
        { id: 'additionalNotes', label: 'Additional notes', type: 'textarea', required: false },
        { id: 'consent', label: 'I confirm that the submitted information is accurate to the best of my knowledge and may be reviewed by VAX2040 Data Curators.', type: 'checkbox', required: true }
      ]
    }
  ]
};

export const financePlanningFormConfig: FormConfig = {
  id: 'national-finance-planning',
  title: 'National Finance and Planning Authority Data Collection Form',
  targetRespondent: 'Ministry of Planning / Ministry of Finance (Director of Macro-Economic Policy or Development Finance)',
  introText: 'Use this form to submit macro-budgetary, development finance, fiscal incentive, tax policy, public procurement, and market guarantee data for VAX2040 review.',
  successMessage: 'Your data donation has been received. VAX2040 Data Curators will review your submission before it is used in analysis.',
  sections: [
    {
      id: 'profile',
      title: 'Respondent Profile',
      fields: [
        { id: 'country', label: 'Country', type: 'select', required: true, options: countries },
        { id: 'ministryDepartment', label: 'Ministry / Department', type: 'text', required: true },
        { id: 'focalPointNameTitle', label: 'Focal Point Name & Title', type: 'text', required: true },
        { id: 'emailAddress', label: 'Email Address', type: 'email', required: true },
        { id: 'reportingPeriod', label: 'Reporting Period (Calendar Year)', type: 'number', required: true }
      ]
    },
    {
      id: 'macroBudgetaryAllocations',
      title: 'Macro-Budgetary Allocations',
      fields: [
        { id: 'totalNationalBudget', label: 'Total National Budget approved for the current fiscal year (USD)', type: 'number', required: true },
        { id: 'healthSectorAllocation', label: 'Health Sector Allocation to the Ministry of Health (USD)', type: 'number', required: true },
        { id: 'pharmaceuticalIndustrialAllocation', label: 'Pharmaceutical Industrial Allocation for manufacturing infrastructure, R&D, or industrial parks, excluding direct medicine procurement (USD)', type: 'number', required: true }
      ]
    },
    {
      id: 'developmentFinance',
      title: 'Development Finance & Sovereign Resource Mobilization',
      fields: [
        { id: 'dedicatedFunds', label: 'Does the country possess a sovereign wealth fund, national development bank, or public strategic fund with an explicit mandate to invest in domestic pharmaceutical manufacturing?', type: 'select', required: true, options: ['Yes', 'No', 'Unknown'] },
        { id: 'publicCapitalDisbursed', label: 'Public capital disbursed by state-owned development banks to local pharmaceutical companies in the last 12 months (USD)', type: 'number', required: true },
        { id: 'externalDevelopmentFinance', label: 'External concessional loans, grants, or bilateral financial packages earmarked for local vaccine or medicine production lines (USD)', type: 'number', required: true }
      ]
    },
    {
      id: 'fiscalIncentives',
      title: 'Fiscal Incentives & Tax Policy',
      fields: [
        { id: 'standardCorporateTaxRate', label: 'Standard corporate tax rate (%)', type: 'number', required: true },
        { id: 'pharmaManufacturerTaxRate', label: 'Corporate tax rate applied to certified domestic pharmaceutical manufacturers (%)', type: 'number', required: true },
        { id: 'apiImportTariff', label: 'Import tariff applied to APIs and raw chemical materials used in local manufacturing (%)', type: 'number', required: true },
        { id: 'finishedProductImportTariff', label: 'Import tariff applied to finished medicines that compete with local production (%)', type: 'number', required: true },
        { id: 'equipmentVatExemption', label: 'VAT exemption on imported manufacturing machinery and lab equipment', type: 'select', required: true, options: ['Full Exemption', 'Partial Exemption', 'No Exemption'] },
        { id: 'equipmentVatPartialExemptionRate', label: 'Partial VAT exemption rate, if applicable (%)', type: 'number', required: false }
      ]
    },
    {
      id: 'publicProcurement',
      title: 'Public Procurement & Market Guarantees',
      fields: [
        { id: 'offtakeAgreements', label: 'Does the Ministry of Finance underwrite or guarantee long-term public offtake agreements of at least 5 years for locally manufactured vaccines and essential medicines?', type: 'select', required: true, options: ['Yes, actively implemented', 'Policy exists but not implemented', 'No policy exists', 'Unknown'] },
        { id: 'pricePreferenceMargin', label: 'Price preference margin legally granted to local manufacturers over foreign bidders in public health tenders (%)', type: 'number', required: true },
        { id: 'afcftaAlignment', label: 'Has the ministry allocated resources to integrate public procurement systems with regional African pharmaceutical pools or AfCFTA frameworks?', type: 'select', required: true, options: ['Yes', 'No', 'Unknown'] }
      ]
    },
    {
      id: 'evidence',
      title: 'Supporting Evidence',
      fields: [
        { id: 'sourceLink', label: 'Source / document link', type: 'url', required: false },
        { id: 'additionalNotes', label: 'Additional notes', type: 'textarea', required: false },
        { id: 'consent', label: 'I confirm that the submitted information is accurate to the best of my knowledge and may be reviewed by VAX2040 Data Curators.', type: 'checkbox', required: true }
      ]
    }
  ]
};
