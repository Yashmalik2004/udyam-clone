import React from 'react';
import type { UseFormRegister, FieldErrors } from 'react-hook-form';
import type { FormFieldSchema } from '../../types/schema.types';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';

interface DynamicFieldProps {
  field: FormFieldSchema;
  register: UseFormRegister<any>;
  errors: FieldErrors<any>;
  disabled?: boolean;
}

export const DynamicField: React.FC<DynamicFieldProps> = ({
  field,
  register,
  errors,
  disabled = false,
}) => {
  const errorMsg = errors[field.name]?.message as string | undefined;

  // Build registration options based on field schema
  const registerOptions: any = {};
  
  if (field.required) {
    registerOptions.required = `${field.label} is required`;
  }

  if (field.validation) {
    if (field.validation.minLength) {
      registerOptions.minLength = {
        value: field.validation.minLength,
        message: `${field.label} must be at least ${field.validation.minLength} characters`,
      };
    }
    if (field.validation.maxLength) {
      registerOptions.maxLength = {
        value: field.validation.maxLength,
        message: `${field.label} must not exceed ${field.validation.maxLength} characters`,
      };
    }
    if (field.validation.pattern) {
      registerOptions.pattern = {
        value: new RegExp(field.validation.pattern),
        message: `${field.label} format is invalid`,
      };
    }
  }

  // Determine label and placeholder
  const labelText = field.label;
  const placeholderText = field.placeholder || `Enter ${field.label}`;

  if (field.type === 'select') {
    const options = field.validation?.options || [];
    return (
      <Select
        label={labelText}
        options={options}
        placeholder={placeholderText}
        required={field.required}
        error={errorMsg}
        disabled={disabled}
        {...register(field.name, registerOptions)}
      />
    );
  }

  // Handle default input types (text, number, date, tel, etc.)
  return (
    <Input
      type={field.type}
      label={labelText}
      placeholder={placeholderText}
      required={field.required}
      error={errorMsg}
      disabled={disabled}
      {...register(field.name, registerOptions)}
    />
  );
};
