// Constants shared across the admin portal
export const COUNTRIES = [
  { code: 'RWA', name: 'Rwanda', flag: '🇷🇼', primary: true },
  { code: 'KEN', name: 'Kenya', flag: '🇰🇪', primary: false },
  { code: 'ZAF', name: 'South Africa', flag: '🇿🇦', primary: false },
  { code: 'SEN', name: 'Senegal', flag: '🇸🇳', primary: false },
];

export const COUNTRY_COLORS: Record<string, string> = {
  Rwanda: '#D2691E',
  Kenya: '#EF4444',
  'South Africa': '#D97706',
  Senegal: '#3B82F6',
};

export const VAX2040_TARGET = 60; // % local production by 2040
export const VAX2040_YEAR = 2040;

export const API_BASE = process.env.NEXT_PUBLIC_API_URL;

export const TRUST_SCORE_LABELS: Record<number, string> = {
  1: 'Very Low',
  2: 'Low',
  3: 'Moderate',
  4: 'High',
  5: 'Verified',
};

export const TRUST_SCORE_COLORS: Record<number, string> = {
  1: '#ef4444',
  2: '#f97316',
  3: '#d97706',
  4: '#16a34a',
  5: '#00B087',
};

export const ADMIN_KEY = 'vax2040-secret-admin';
