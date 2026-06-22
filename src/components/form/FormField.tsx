

interface FormFieldProps {
  label: string;
  id: string;
  type: 'text' | 'email' | 'number' | 'url';
  value: string | number;
  onChange: (value: string | number) => void;
  required?: boolean;
  placeholder?: string;
  error?: string;
}

export default function FormField({ label, id, type, value, onChange, required, placeholder, error }: FormFieldProps) {
  return (
    <div style={{ marginBottom: '20px' }}>
      <label htmlFor={id} style={{ display: 'block', marginBottom: '8px', fontSize: '0.92rem', fontWeight: 600, color: '#0F172A', fontFamily: 'var(--font-sans)' }}>
        {label} {required && <span style={{ color: '#EF4444' }}>*</span>}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(type === 'number' ? Number(e.target.value) || 0 : e.target.value)}
        placeholder={placeholder}
        style={{
          width: '100%',
          padding: '12px 16px',
          border: `1.5px solid ${error ? '#EF4444' : 'rgba(15,23,42,0.12)'}`,
          borderRadius: '10px',
          fontSize: '0.95rem',
          fontFamily: 'var(--font-sans)',
          background: '#fff',
          transition: 'all 0.2s ease',
          outline: 'none'
        }}
        onFocus={(e) => e.target.style.borderColor = '#0A6B6A'}
        onBlur={(e) => e.target.style.borderColor = error ? '#EF4444' : 'rgba(15,23,42,0.12)'}
      />
      {error && <p style={{ color: '#EF4444', fontSize: '0.82rem', marginTop: '6px', marginBottom: 0 }}>{error}</p>}
    </div>
  );
}
