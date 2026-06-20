import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ data: [] });
}
export async function POST() {
  return NextResponse.json({ data: [] });
}
export async function PUT() {
  return NextResponse.json({ data: {} });
}
export async function DELETE() {
  return NextResponse.json({ data: null });
}
