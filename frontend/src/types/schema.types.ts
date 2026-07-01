/**
 * types/schema.types.ts — Schema-driven Form Field Types
 *
 * These mirror the FormSchema types from the backend and scraper.
 * The frontend uses these to dynamically render form fields.
 */

export interface SelectOption {
  value: string;
  label: string;
}

export interface FieldValidation {
  pattern?: string;
  minLength?: number;
  maxLength?: number;
  min?: string;
  max?: string;
  options?: SelectOption[];
}

export type FieldType =
  | 'text'
  | 'number'
  | 'email'
  | 'tel'
  | 'date'
  | 'select'
  | 'otp'
  | 'password';

export interface FormFieldSchema {
  id: string;
  name: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  required: boolean;
  validation?: FieldValidation;
  step: number;
}

export interface FormStep {
  step: number;
  title: string;
  description: string;
  fields: FormFieldSchema[];
}

export interface FormSchema {
  version: string;
  scrapedAt: string;
  source: string;
  steps: FormStep[];
}
