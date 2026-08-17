import { type ReactNode } from 'react';

type FieldVariant = 'input' | 'select' | 'textarea';

interface FormFieldProps {
  label: string;
  name: string;
  variant?: FieldVariant;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  options?: string[];
  type?: string;
  icon?: ReactNode;
  required?: boolean;
  hint?: string;
}

export default function FormField({
  label,
  name,
  variant = 'input',
  value,
  onChange,
  placeholder,
  options = [],
  type = 'text',
  icon,
  required,
  hint,
}: FormFieldProps) {
  const baseClass =
    'w-full rounded-xl bg-brand-50 border border-brand-100 px-4 py-3 text-sm text-ink-900 outline-none placeholder:text-ink-800/35 focus:ring-2 focus:ring-brand-400 focus:border-transparent transition';
  const labelClass = 'text-[11px] font-bold uppercase tracking-wider text-ink-800/50 mb-1.5 flex items-center gap-1';

  return (
    <div>
      <label htmlFor={name} className={labelClass}>
        {label} {required && <span className="text-error-500">*</span>}
      </label>
      <div className="relative">
        {icon && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-800/35 flex-shrink-0">{icon}</span>}
        {variant === 'select' ? (
          <select
            id={name}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className={`${baseClass} ${icon ? 'pl-9' : ''} appearance-none cursor-pointer`}
          >
            <option value="" disabled>{placeholder ?? 'Select…'}</option>
            {options.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        ) : variant === 'textarea' ? (
          <textarea
            id={name}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            rows={3}
            className={`${baseClass} ${icon ? 'pl-9' : ''} resize-none`}
          />
        ) : (
          <input
            id={name}
            type={type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className={`${baseClass} ${icon ? 'pl-9' : ''}`}
          />
        )}
      </div>
      {hint && <p className="mt-1 text-[11px] text-ink-800/40">{hint}</p>}
    </div>
  );
}
