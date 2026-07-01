/**
 * scraper/src/types.ts — Shared Types for Scraper Module
 */

export interface FormFieldSchema {
  id: string;
  name: string;
  label: string;
  type: 'text' | 'number' | 'email' | 'tel' | 'date' | 'select' | 'otp' | 'password';
  placeholder?: string;
  required: boolean;
  validation?: {
    pattern?: string;
    minLength?: number;
    maxLength?: number;
    min?: string;
    max?: string;
    options?: SelectOption[];
  };
  step: number;
}

export interface SelectOption {
  value: string;
  label: string;
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

export interface RawExtractedField {
  tagName: string;
  id: string;
  name: string;
  type: string;
  placeholder: string;
  required: boolean;
  pattern: string;
  minLength: number;
  maxLength: number;
  min: string;
  max: string;
  labelText: string;
  options: { value: string; text: string }[];
}
