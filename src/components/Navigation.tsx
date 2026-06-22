'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const IconUser = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

export function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="navbar">
      <div className="font-heading font-bold" style={{ fontSize: '1.25rem', color: 'var(--brand)' }}>
        <Link href="/">VAX 2040</Link>
      </div>

      <div className="nav-links">
        {/* Links removed as per user request */}
      </div>

      {/* Sign In button */}
      <Link
        href="/select-role"
        id="nav-signin-btn"
        className="btn btn-primary"
        style={{ padding: '9px 18px', fontSize: '0.875rem', borderRadius: '10px', gap: '7px' }}
      >
        <IconUser />
        Sign In
      </Link>
    </nav>
  );
}

