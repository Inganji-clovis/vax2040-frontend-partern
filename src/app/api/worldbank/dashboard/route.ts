import { NextResponse } from 'next/server';

function createMockIndicator(name: string) {
  return {
    indicatorCode: 'MOCK',
    indicatorName: name,
    unit: 'usd',
    source: 'World Bank',
    sourceUrl: 'https://data.worldbank.org',
    lastUpdated: '2026-01-01',
    trustScore: 5,
    data: [
      { country: 'Rwanda', countryCode: 'RWA', year: '2025', value: 1000000 },
      { country: 'Rwanda', countryCode: 'RWA', year: '2026', value: 1200000 },
      { country: 'Senegal', countryCode: 'SEN', year: '2025', value: 5000000 },
      { country: 'Senegal', countryCode: 'SEN', year: '2026', value: 5200000 },
      { country: 'South Africa', countryCode: 'ZAF', year: '2025', value: 8000000 },
      { country: 'South Africa', countryCode: 'ZAF', year: '2026', value: 9500000 },
    ]
  };
}

export async function GET() {
  return NextResponse.json({
    data: {
      healthExpenditureGDP: createMockIndicator('Health Exp GDP'),
      healthExpenditurePerCapita: createMockIndicator('Health Exp Per Capita'),
      govHealthExpenditureGDP: createMockIndicator('Gov Health Exp GDP'),
      population: createMockIndicator('Population'),
      vaccineImports: createMockIndicator('Vaccine Imports'),
      vaccineLocalProduction: createMockIndicator('Vaccine Local Production'),
      medicineImports: createMockIndicator('Medicine Imports'),
      medicineLocalProduction: createMockIndicator('Medicine Local Production')
    }
  });
}
