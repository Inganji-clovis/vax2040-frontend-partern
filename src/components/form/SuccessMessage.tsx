import Link from 'next/link';
import { IconCheck, IconArrow } from '../../lib/icons';

interface SuccessMessageProps {
  message: string;
  onSubmitAnother?: () => void;
}

export default function SuccessMessage({ message, onSubmitAnother }: SuccessMessageProps) {
  return (
    <div style={{
      background: 'rgba(30,136,229,0.06)',
      border: '1px solid rgba(30,136,229,0.2)',
      borderRadius: '16px',
      padding: '40px 32px',
      textAlign: 'center'
    }}>
      <div style={{
        background: '#1e88e5',
        color: '#fff',
        width: '72px', height: '72px',
        borderRadius: '50%',
        display: 'inline-flex',
        alignItems: 'center', justifyContent: 'center',
        marginBottom: '24px'
      }}>
        <IconCheck />
      </div>
      <h3 style={{
        fontSize: '1.5rem', fontWeight: 700, color: '#0F172A', marginBottom: '16px', fontFamily: 'var(--font-sans)'
      }}>
        Thank you!
      </h3>
      <p style={{ fontSize: '1rem', color: '#374151', lineHeight: 1.7, marginBottom: '32px', maxWidth: '600px', marginLeft: 'auto', marginRight: 'auto' }}>
        {message}
      </p>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
        <Link href="/donate" style={{
          display: 'inline-flex', alignItems: 'center', gap: '8px',
          padding: '12px 24px', background: '#1e88e5', color: '#fff', border: 'none', borderRadius: '10px',
          fontSize: '0.95rem', fontWeight: 700, textDecoration: 'none', transition: 'all 0.2s ease', cursor: 'pointer'
        }} onMouseEnter={(e) => e.currentTarget.style.background = '#1565c0'}
           onMouseLeave={(e) => e.currentTarget.style.background = '#1e88e5'}>
          Return to Donate <IconArrow />
        </Link>
        {onSubmitAnother && (
          <button onClick={onSubmitAnother} style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            padding: '12px 24px', background: 'transparent', color: '#1e88e5', border: '1.5px solid rgba(30,136,229,0.3)', borderRadius: '10px',
            fontSize: '0.95rem', fontWeight: 700, textDecoration: 'none', transition: 'all 0.2s ease', cursor: 'pointer'
          }} onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(30,136,229,0.08)'; e.currentTarget.style.borderColor = '#1e88e5'; }}
             onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'rgba(30,136,229,0.3)'; }}>
            Submit Another Form
          </button>
        )}
        <Link href="/" style={{
          display: 'inline-flex', alignItems: 'center', gap: '8px',
          padding: '12px 24px', background: 'transparent', color: '#1e88e5', border: '1.5px solid rgba(30,136,229,0.3)', borderRadius: '10px',
          fontSize: '0.95rem', fontWeight: 700, textDecoration: 'none', transition: 'all 0.2s ease', cursor: 'pointer'
        }} onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(30,136,229,0.08)'; e.currentTarget.style.borderColor = '#1e88e5'; }}
           onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'rgba(30,136,229,0.3)'; }}>
          Go to Dashboard <IconArrow />
        </Link>
      </div>
    </div>
  );
}
