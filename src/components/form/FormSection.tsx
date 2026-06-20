import { ReactNode } from 'react';

interface FormSectionProps {
  title: string;
  children: ReactNode;
}

export default function FormSection({ title, children }: FormSectionProps) {
  return (
    <div style={{
      background: '#fff',
      border: '1px solid rgba(15,23,42,0.08)',
      borderRadius: '16px',
      padding: '28px',
      marginBottom: '20px'
    }}>
      <h3 style={{
        fontSize: '1.15rem',
        fontWeight: 700,
        color: '#0F172A',
        marginBottom: '24px',
        fontFamily: 'var(--font-sans)',
        borderBottom: '1px solid rgba(30,136,229,0.1)',
        paddingBottom: '12px'
      }}>
        {title}
      </h3>
      {children}
    </div>
  );
}
