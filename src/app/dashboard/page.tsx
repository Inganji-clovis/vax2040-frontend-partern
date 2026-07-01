'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DataEntryView from '../../components/DataEntryView';
import { Navigation } from '../../components/Navigation';
import { PartnerUser } from '../../components/LoginView';

export default function DashboardPage() {
  const router = useRouter();
  const [partnerUser, setPartnerUser] = useState<PartnerUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('vax2040_partner_user');
    if (!stored) {
      router.replace('/select-role');
      return;
    }
    try {
      const user = JSON.parse(stored);
      if (user && user.email) {
        setPartnerUser(user);
      } else {
        router.replace('/select-role');
      }
    } catch (e) {
      router.replace('/select-role');
    } finally {
      setLoading(false);
    }
  }, [router]);

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#f8fafc',
        fontFamily: 'sans-serif'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '40px',
            height: '40px',
            border: '4px solid rgba(10, 107, 106, 0.1)',
            borderTopColor: '#0A6B6A',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 16px'
          }} />
          <style>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
          <p style={{ color: '#64748b', fontSize: '0.95rem', fontWeight: 500 }}>Loading workspace...</p>
        </div>
      </div>
    );
  }

  if (!partnerUser) return null;

  return (
    <>
      <Navigation />
      <div style={{ background: '#f8fafc', minHeight: 'calc(100vh - 72px)', paddingTop: '20px', paddingBottom: '40px' }}>
        <DataEntryView partnerUser={partnerUser} />
      </div>
    </>
  );
}
