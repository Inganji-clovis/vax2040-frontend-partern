interface ConsentBoxProps {
  id: string;
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  error?: string;
}

export default function ConsentBox({ id, label, checked, onChange, error }: ConsentBoxProps) {
  return (
    <div style={{ marginBottom: '24px' }}>
      <label style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', cursor: 'pointer', fontSize: '0.92rem', color: '#374151', fontFamily: 'var(--font-sans)', lineHeight: 1.5 }}>
        <input
          id={id}
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          style={{ width: '20px', height: '20px', cursor: 'pointer', marginTop: '2px', accentColor: '#0A6B6A' }}
        />
        {label}
      </label>
      {error && <p style={{ color: '#EF4444', fontSize: '0.82rem', marginTop: '8px', marginBottom: 0, marginLeft: '32px' }}>{error}</p>}
    </div>
  );
}
