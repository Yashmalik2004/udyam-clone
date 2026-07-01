import React, { forwardRef } from 'react';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: SelectOption[];
  error?: string;
  hint?: string;
  required?: boolean;
  placeholder?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, options, error, hint, required, className = '', id, placeholder, ...props }, ref) => {
    const selectId = id || props.name || Math.random().toString(36).substr(2, 9);

    return (
      <div className="form-group">
        {label && (
          <label htmlFor={selectId} className="form-label">
            {label}
            {required && <span className="required">*</span>}
          </label>
        )}
        <div className="form-select-wrapper">
          <select
            ref={ref}
            id={selectId}
            className={`form-select ${error ? 'form-select--error' : ''} ${className}`}
            {...props}
          >
            {placeholder && <option value="">{placeholder}</option>}
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
        {error && (
          <span className="form-error" role="alert">
            <svg
              className="w-4 h-4 fill-current mr-1"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            {error}
          </span>
        )}
        {hint && !error && <p className="form-hint">{hint}</p>}
      </div>
    );
  }
);

Select.displayName = 'Select';
