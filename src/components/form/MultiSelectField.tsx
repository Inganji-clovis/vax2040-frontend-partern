interface MultiSelectFieldProps {
  label: string;
  id: string;
  options: string[];
  value: string[];
  onChange: (value: string[]) => void;
  required?: boolean;
  error?: string;
}

export default function MultiSelectField({ label, id, options, value, onChange, required, error }: MultiSelectFieldProps) {
  const handleOptionToggle = (option: string) => {
    if (value.includes(option)) {
      onChange(value.filter(v => v !== option));
    } else {
      onChange([...value, option]);
    }
  };

  return (
    <div style={{ marginBottom: '20px' }}>
      <label style={{ display: 'block', marginBottom: '10px', fontSize: '0.92rem', fontWeight: 600, color: '#0F172A', fontFamily: 'var(--font-sans)' }}>
        {label} {required && <span style={{ color: '#EF4444' }}>*</span>}
      </label>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {options.map((option) => (
          <label key={option} style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '0.92rem', color: '#374151', fontFamily: 'var(--font-sans)' }}>
            <input
              type="checkbox"
              checked={value.includes(option)}
              onChange={() => handleOptionToggle(option)}
              style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: '#1e88e5' }}
            />
            {option}
          </label>
        ))}
      </div>
      {error && <p style={{ color: '#EF4444', fontSize: '0.82rem', marginTop: '6px', marginBottom: 0 }}>{error}</p>}
    </div>
  );
}
