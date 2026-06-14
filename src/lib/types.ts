// Shared TypeScript types — mirrors the backend schema exactly
export interface NormalisedDataPoint {
  country: string;
  countryCode: string;
  year: string;
  value: number | null;
  sourceType?: 'api' | 'manual'; // Identified origin of the data point
}

export interface IndicatorPayload {
  indicatorCode: string;
  indicatorName: string;
  unit: string;
  source: string;
  sourceUrl: string;
  lastUpdated: string;
  trustScore: number;
  data: NormalisedDataPoint[];
}

export interface DashboardPayload {
  healthExpenditureGDP: IndicatorPayload;
  healthExpenditurePerCapita: IndicatorPayload;
  govHealthExpenditureGDP: IndicatorPayload;
  population: IndicatorPayload;
  vaccineImports: IndicatorPayload;
  vaccineLocalProduction: IndicatorPayload;
  medicineImports: IndicatorPayload;
  medicineLocalProduction: IndicatorPayload;
}

export interface WHOIndicatorPayload {
  pharmaPersonnel: IndicatorPayload;
}

export interface FullDashboardData {
  worldbank: DashboardPayload;
  who: WHOIndicatorPayload;
}

export type CountryCode = 'RWA' | 'KEN' | 'ZAF' | 'SEN';

export interface ManualEntry {
  id: string;
  countryCode: string;
  year: string;
  indicatorCode: string;
  value: number;
  enteredBy: string;
  timestamp: string;
  productType: 'vaccine' | 'medicine';
  metricUnit: 'percent' | 'usd' | 'doses';
  facility?: string;
  supportiveDocument?: string;
  status: 'draft' | 'submitted' | 'approved' | 'rejected';
  rejectionComment?: string;
}

export interface AuditLog {
  timestamp: string;
  action: string;
  user: string;
}
