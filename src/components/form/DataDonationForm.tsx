'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FormConfig, FormField as FormFieldType } from '../../data/dataDonationFormsConfig';
import FormField from './FormField';
import SelectField from './SelectField';
import TextAreaField from './TextAreaField';
import MultiSelectField from './MultiSelectField';
import ConsentBox from './ConsentBox';
import FormSection from './FormSection';
import SuccessMessage from './SuccessMessage';
import { IconArrow } from '../../lib/icons';

interface DataDonationFormProps {
  config: FormConfig;
}

export default function DataDonationForm({ config }: DataDonationFormProps) {
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Initialize form data with empty values
  useEffect(() => {
    const initialData: Record<string, any> = {};
    config.sections.forEach(section => {
      section.fields.forEach(field => {
        if (field.type === 'multiselect') {
          initialData[field.id] = [];
        } else if (field.type === 'checkbox') {
          initialData[field.id] = false;
        } else if (field.type === 'number') {
          initialData[field.id] = '';
        } else {
          initialData[field.id] = '';
        }
      });
    });
    setFormData(initialData);
  }, [config]);

  const handleChange = (fieldId: string, value: any) => {
    setFormData(prev => ({ ...prev, [fieldId]: value }));
    if (errors[fieldId]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[fieldId];
        return newErrors;
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    let isValid = true;

    config.sections.forEach(section => {
      section.fields.forEach((field: FormFieldType) => {
        if (field.required) {
          if (field.type === 'multiselect' && formData[field.id]?.length === 0) {
            newErrors[field.id] = 'Please select at least one option';
            isValid = false;
          } else if (field.type === 'checkbox' && !formData[field.id]) {
            newErrors[field.id] = 'Please confirm consent';
            isValid = false;
          } else if (field.type === 'email') {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(formData[field.id])) {
              newErrors[field.id] = 'Please enter a valid email';
              isValid = false;
            }
          } else if (['text', 'select', 'number', 'url'].includes(field.type)) {
            if (formData[field.id] === '' || formData[field.id] === null || formData[field.id] === undefined) {
              newErrors[field.id] = 'This field is required';
              isValid = false;
            }
          }
        }
      });
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      // Mock submission - store in localStorage
      const mockSubmission = {
        id: Date.now(),
        formId: config.id,
        data: formData,
        timestamp: new Date().toISOString()
      };
      localStorage.setItem(`vax2040_submission_${mockSubmission.id}`, JSON.stringify(mockSubmission));
      
      // Show success
      setIsSubmitted(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleReset = () => {
    setIsSubmitted(false);
    const initialData: Record<string, any> = {};
    config.sections.forEach(section => {
      section.fields.forEach(field => {
        if (field.type === 'multiselect') {
          initialData[field.id] = [];
        } else if (field.type === 'checkbox') {
          initialData[field.id] = false;
        } else if (field.type === 'number') {
          initialData[field.id] = '';
        } else {
          initialData[field.id] = '';
        }
      });
    });
    setFormData(initialData);
    setErrors({});
  };

  if (isSubmitted) {
    return (
      <SuccessMessage message={config.successMessage} onSubmitAnother={handleReset} />
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      {config.sections.map(section => (
        <FormSection key={section.id} title={section.title}>
          {section.fields.map(field => {
            switch (field.type) {
              case 'text':
              case 'email':
              case 'number':
              case 'url':
                return (
                  <FormField
                    key={field.id}
                    id={field.id}
                    label={field.label}
                    type={field.type}
                    required={field.required}
                    value={formData[field.id] || ''}
                    onChange={(value) => handleChange(field.id, value)}
                    error={errors[field.id]}
                  />
                );
              case 'select':
                return (
                  <SelectField
                    key={field.id}
                    id={field.id}
                    label={field.label}
                    required={field.required}
                    options={field.options || []}
                    value={formData[field.id] || ''}
                    onChange={(value) => handleChange(field.id, value)}
                    error={errors[field.id]}
                  />
                );
              case 'textarea':
                return (
                  <TextAreaField
                    key={field.id}
                    id={field.id}
                    label={field.label}
                    required={field.required}
                    value={formData[field.id] || ''}
                    onChange={(value) => handleChange(field.id, value)}
                    error={errors[field.id]}
                  />
                );
              case 'multiselect':
                return (
                  <MultiSelectField
                    key={field.id}
                    id={field.id}
                    label={field.label}
                    required={field.required}
                    options={field.options || []}
                    value={formData[field.id] || []}
                    onChange={(value) => handleChange(field.id, value)}
                    error={errors[field.id]}
                  />
                );
              case 'checkbox':
                return (
                  <ConsentBox
                    key={field.id}
                    id={field.id}
                    label={field.label}
                    checked={formData[field.id] || false}
                    onChange={(checked) => handleChange(field.id, checked)}
                    error={errors[field.id]}
                  />
                );
              default:
                return null;
            }
          })}
        </FormSection>
      ))}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '32px', flexWrap: 'wrap', gap: '16px' }}>
        <Link href="/donate/data" style={{
          display: 'inline-flex', alignItems: 'center', gap: '8px',
          padding: '12px 24px', background: 'transparent', color: '#64748B', border: '1.5px solid rgba(100,116,139,0.2)', borderRadius: '10px',
          fontSize: '0.95rem', fontWeight: 700, textDecoration: 'none', transition: 'all 0.2s ease', cursor: 'pointer'
        }}>
          Back to Data Donation
        </Link>
        <button type="submit" style={{
          display: 'inline-flex', alignItems: 'center', gap: '8px',
          padding: '14px 32px', background: '#0A6B6A', color: '#fff', border: 'none', borderRadius: '10px',
          fontSize: '1rem', fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s ease', boxShadow: '0 4px 16px rgba(10, 107, 106,0.25)'
        }} onMouseEnter={(e) => { e.currentTarget.style.background = '#085453'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
           onMouseLeave={(e) => { e.currentTarget.style.background = '#0A6B6A'; e.currentTarget.style.transform = 'translateY(0)'; }}>
          Submit Data <IconArrow />
        </button>
      </div>
    </form>
  );
}
