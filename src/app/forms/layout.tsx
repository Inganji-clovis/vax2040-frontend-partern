import React from 'react';
import { Navigation } from '@/components/Navigation';

export default function FormsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <Navigation />
      <div style={{ paddingTop: '20px' }}>
        {children}
      </div>
    </div>
  );
}
