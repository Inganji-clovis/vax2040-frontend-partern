interface TextAreaFieldProps {
  label: string;
  id: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  placeholder?: string;
  rows?: number;
  error?: string;
}

export default function TextAreaField({ label, id, value, onChange, required, placeholder, rows = 4, error }: TextAreaFieldProps) {
  return (
    <div style={{ marginBottom: '20px' }}>
      <label htmlFor={id} style={{ display: 'block', marginBottom: '8px', fontSize: '0.92rem', fontWeight: 600, color: '#0F172A', fontFamily: 'var(--font-sans)' }}>
        {label} {required && <span style={{ color: '#EF4444' }}>*</span>}
      </label>
      <textarea
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        style={{
          width: '100%',
          padding: '12px 16px',
          border: `1.5px solid ${error ? '#EF4444' : 'rgba(15,23,42,0.12)'}`,
          borderRadius: '10px',
          fontSize: '0.95rem',
          fontFamily: 'var(--font-sans)',
          background: '#fff',
          transition: 'all 0.2s ease',
          outline: 'none',
          resize: 'vertical'
        }}
      />
      {error && <p style={{ color: '#EF4444', fontSize: '0.82rem', marginTop: '6px', marginBottom: 0 }}>{error}</p>}
    </div>
  );
}
