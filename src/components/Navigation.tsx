'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { PartnerUser } from './LoginView';

const IconUser = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const IconLogOut = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);

export function Navigation() {
  const pathname = usePathname();
  const router = useRouter();
  const [partnerUser, setPartnerUser] = useState<PartnerUser | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('vax2040_partner_user');
    if (stored) {
      try {
        setPartnerUser(JSON.parse(stored));
      } catch (e) {
        setPartnerUser(null);
      }
    }
  }, []);

  function handleLogout() {
    localStorage.removeItem('vax2040_partner_user');
    setPartnerUser(null);
    router.push('/');
  }

  return (
    <nav className="navbar">
      <div className="font-heading font-bold" style={{ fontSize: '1.25rem', color: 'var(--brand)', display: 'flex', alignItems: 'center', gap: '20px' }}>
        <Link href="/">VAX 2040</Link>
        {partnerUser && (
          <Link href="/dashboard" style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: 600, textDecoration: 'none', marginLeft: '10px' }}>
            Dashboard
          </Link>
        )}
      </div>

      <div className="nav-links">
        {/* Links removed as per user request */}
      </div>

      {partnerUser ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: 'rgba(10, 107, 106, 0.1)',
              color: '#0A6B6A',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              fontSize: '0.85rem'
            }}>
              {(partnerUser.org || partnerUser.email || 'U')[0].toUpperCase()}
            </div>
            <span style={{ fontSize: '0.85rem', color: '#475569', fontWeight: 600 }}>
              {(partnerUser.org || partnerUser.email || 'User').split('@')[0]}
            </span>
          </div>
          <button 
            onClick={handleLogout} 
            title="Sign out"
            style={{
              background: 'none',
              border: 'none',
              color: '#ef4444',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              padding: '6px',
              borderRadius: '6px',
              transition: 'background 0.2s'
            }}
          >
            <IconLogOut />
          </button>
        </div>
      ) : (
        <Link
          href="/select-role"
          id="nav-signin-btn"
          className="btn btn-primary"
          style={{ padding: '9px 18px', fontSize: '0.875rem', borderRadius: '10px', gap: '7px' }}
        >
          <IconUser />
          Sign In
        </Link>
      )}
    </nav>
  );
}
