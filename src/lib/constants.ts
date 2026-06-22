// Constants shared across the admin portal
export const COUNTRIES = [
  { code: 'RWA', name: 'Rwanda', flag: '🇷🇼', active: true, primary: true },
  { code: 'KEN', name: 'Kenya', flag: '🇰🇪', active: true, primary: false },
  { code: 'ZAF', name: 'South Africa', flag: '🇿🇦', active: true, primary: false },
  { code: 'SEN', name: 'Senegal', flag: '🇸🇳', active: true, primary: false },
  // North Africa
  { code: 'DZA', name: 'Algeria', flag: '🇩🇿', active: false, primary: false },
  { code: 'EGY', name: 'Egypt', flag: '🇪🇬', active: false, primary: false },
  { code: 'LBY', name: 'Libya', flag: '🇱🇾', active: false, primary: false },
  { code: 'MAR', name: 'Morocco', flag: '🇲🇦', active: false, primary: false },
  { code: 'TUN', name: 'Tunisia', flag: '🇹🇳', active: false, primary: false },
  // East Africa
  { code: 'BDI', name: 'Burundi', flag: '🇧🇮', active: false, primary: false },
  { code: 'COM', name: 'Comoros', flag: '🇰🇲', active: false, primary: false },
  { code: 'DJI', name: 'Djibouti', flag: '🇩🇯', active: false, primary: false },
  { code: 'ERI', name: 'Eritrea', flag: '🇪🇷', active: false, primary: false },
  { code: 'ETH', name: 'Ethiopia', flag: '🇪🇹', active: false, primary: false },
  { code: 'MDG', name: 'Madagascar', flag: '🇲🇬', active: false, primary: false },
  { code: 'MWI', name: 'Malawi', flag: '🇲🇼', active: false, primary: false },
  { code: 'MUS', name: 'Mauritius', flag: '🇲🇺', active: false, primary: false },
  { code: 'SOM', name: 'Somalia', flag: '🇸🇴', active: false, primary: false },
  { code: 'SSD', name: 'South Sudan', flag: '🇸🇸', active: false, primary: false },
  { code: 'SDN', name: 'Sudan', flag: '🇸🇩', active: false, primary: false },
  { code: 'TZA', name: 'Tanzania', flag: '🇹🇿', active: false, primary: false },
  { code: 'UGA', name: 'Uganda', flag: '🇺🇬', active: false, primary: false },
  // West Africa
  { code: 'BEN', name: 'Benin', flag: '🇧🇯', active: false, primary: false },
  { code: 'BFA', name: 'Burkina Faso', flag: '🇧🇫', active: false, primary: false },
  { code: 'CPV', name: 'Cabo Verde', flag: '🇨🇻', active: false, primary: false },
  { code: 'CIV', name: "Cote d'Ivoire", flag: '🇨🇮', active: false, primary: false },
  { code: 'GMB', name: 'Gambia', flag: '🇬🇲', active: false, primary: false },
  { code: 'GHA', name: 'Ghana', flag: '🇬🇭', active: false, primary: false },
  { code: 'GIN', name: 'Guinea', flag: '🇬🇳', active: false, primary: false },
  { code: 'GNB', name: 'Guinea-Bissau', flag: '🇬🇼', active: false, primary: false },
  { code: 'LBR', name: 'Liberia', flag: '🇱🇷', active: false, primary: false },
  { code: 'MLI', name: 'Mali', flag: '🇲🇱', active: false, primary: false },
  { code: 'MRT', name: 'Mauritania', flag: '🇲🇷', active: false, primary: false },
  { code: 'NER', name: 'Niger', flag: '🇳🇪', active: false, primary: false },
  { code: 'NGA', name: 'Nigeria', flag: '🇳🇬', active: false, primary: false },
  { code: 'STP', name: 'Sao Tome & Principe', flag: '🇸🇹', active: false, primary: false },
  { code: 'SLE', name: 'Sierra Leone', flag: '🇸🇱', active: false, primary: false },
  { code: 'TGO', name: 'Togo', flag: '🇹🇬', active: false, primary: false },
  // Central Africa
  { code: 'AGO', name: 'Angola', flag: '🇦🇴', active: false, primary: false },
  { code: 'CMR', name: 'Cameroon', flag: '🇨🇲', active: false, primary: false },
  { code: 'CAF', name: 'Central African Republic', flag: '🇨🇫', active: false, primary: false },
  { code: 'TCD', name: 'Chad', flag: '🇹🇩', active: false, primary: false },
  { code: 'COG', name: 'Congo', flag: '🇨🇬', active: false, primary: false },
  { code: 'COD', name: 'DR Congo', flag: '🇨🇩', active: false, primary: false },
  { code: 'GNQ', name: 'Equatorial Guinea', flag: '🇬🇶', active: false, primary: false },
  { code: 'GAB', name: 'Gabon', flag: '🇬🇦', active: false, primary: false },
  // Southern Africa
  { code: 'BWA', name: 'Botswana', flag: '🇧🇼', active: false, primary: false },
  { code: 'LSO', name: 'Lesotho', flag: '🇱🇸', active: false, primary: false },
  { code: 'MOZ', name: 'Mozambique', flag: '🇲🇿', active: false, primary: false },
  { code: 'NAM', name: 'Namibia', flag: '🇳🇦', active: false, primary: false },
  { code: 'SYC', name: 'Seychelles', flag: '🇸🇨', active: false, primary: false },
  { code: 'SWZ', name: 'Eswatini', flag: '🇸🇿', active: false, primary: false },
  { code: 'ZMB', name: 'Zambia', flag: '🇿🇲', active: false, primary: false },
  { code: 'ZWE', name: 'Zimbabwe', flag: '🇿🇼', active: false, primary: false },
];

export const COUNTRY_COLORS: Record<string, string> = {
  Rwanda: '#0A6B6A',
  Kenya: '#EF4444',
  'South Africa': '#D97706',
  Senegal: '#3B82F6',
};

export const VAX2040_TARGET = 60; // % local production by 2040
export const VAX2040_YEAR = 2040;

export const API_BASE = process.env.NEXT_PUBLIC_API_URL || '';

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
