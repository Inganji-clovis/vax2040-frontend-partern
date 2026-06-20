interface SelectFieldProps {
  label: string;
  id: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  error?: string;
}

export default function SelectField({ label, id, options, value, onChange, required, error }: SelectFieldProps) {
  return (
    <div style={{ marginBottom: '20px' }}>
      <label htmlFor={id} style={{ display: 'block', marginBottom: '8px', fontSize: '0.92rem', fontWeight: 600, color: '#0F172A', fontFamily: 'var(--font-sans)' }}>
        {label} {required && <span style={{ color: '#EF4444' }}>*</span>}
      </label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
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
          cursor: 'pointer'
        }}
      >
        <option value="">Select...</option>
        {options.map((option) => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>
      {error && <p style={{ color: '#EF4444', fontSize: '0.82rem', marginTop: '6px', marginBottom: 0 }}>{error}</p>}
    </div>
  );
}
