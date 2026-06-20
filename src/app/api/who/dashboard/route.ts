import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    data: {
      pharmaPersonnel: {
        indicatorCode: 'WHO_PHARMA',
        indicatorName: 'Pharma Personnel',
        unit: 'count',
        source: 'WHO',
        sourceUrl: '',
        lastUpdated: '2026',
        trustScore: 4,
        data: []
      }
    }
  });
}
