/**
 * scraper/src/parser.ts — Page-to-Schema Parser
 *
 * Takes a Puppeteer Page and extracts all form fields into
 * a structured FormStep object.
 */

import { Page } from 'puppeteer';
import { extractFields } from './extractors/fields.extractor';
import { extractLabels } from './extractors/labels.extractor';
import { FormStep, FormFieldSchema, RawExtractedField } from './types';

// ── Step Metadata Map ─────────────────────────────────────────────────────────

const STEP_META: Record<number, { title: string; description: string }> = {
  1: {
    title: 'Aadhaar Verification',
    description: 'Enter your Aadhaar number and name to verify your identity via OTP',
  },
  2: {
    title: 'PAN Verification',
    description: 'Enter your PAN details and organisation information',
  },
};

// ── Parser ────────────────────────────────────────────────────────────────────

/**
 * Parses the current page state and returns a FormStep for the given step number.
 *
 * TODO: Implement dynamic page navigation to reach each step before extraction.
 * TODO: Handle multi-page forms with JavaScript-driven state changes.
 *
 * @param page  - Active Puppeteer page
 * @param step  - Step number (1 or 2)
 */
export const parsePageToSchema = async (
  page: Page,
  step: number
): Promise<FormStep> => {
  const rawFields: RawExtractedField[] = await extractFields(page);
  const labelMap: Record<string, string> = await extractLabels(page);

  const fields: FormFieldSchema[] = rawFields
    .filter(isRelevantField)
    .map((raw) => mapRawFieldToSchema(raw, labelMap, step));

  const meta = STEP_META[step] ?? { title: `Step ${step}`, description: '' };

  return {
    step,
    title: meta.title,
    description: meta.description,
    fields,
  };
};

// ── Helpers ───────────────────────────────────────────────────────────────────

/**
 * Filters out hidden, submit, button, and irrelevant fields.
 */
const isRelevantField = (field: RawExtractedField): boolean => {
  const excluded = ['hidden', 'submit', 'button', 'reset', 'image', 'checkbox', 'radio'];
  return !excluded.includes(field.type.toLowerCase());
};

/**
 * Maps a raw extracted field to the standardized FormFieldSchema format.
 */
const mapRawFieldToSchema = (
  raw: RawExtractedField,
  labelMap: Record<string, string>,
  step: number
): FormFieldSchema => {
  // Try to find label from labelMap, fallback to extracted labelText or field name
  const label = labelMap[raw.id] ?? raw.labelText ?? raw.name ?? raw.id;

  const field: FormFieldSchema = {
    id: raw.id || raw.name,
    name: raw.name || raw.id,
    label: cleanLabel(label),
    type: normalizeType(raw.type, raw.tagName),
    placeholder: raw.placeholder || undefined,
    required: raw.required,
    step,
  };

  // Add validation only if attributes exist
  const hasValidation =
    raw.pattern || raw.minLength || raw.maxLength || raw.options?.length > 0;

  if (hasValidation) {
    field.validation = {
      ...(raw.pattern ? { pattern: raw.pattern } : {}),
      ...(raw.minLength ? { minLength: raw.minLength } : {}),
      ...(raw.maxLength ? { maxLength: raw.maxLength } : {}),
      ...(raw.min ? { min: raw.min } : {}),
      ...(raw.max ? { max: raw.max } : {}),
      ...(raw.options?.length > 0
        ? {
            options: raw.options.map((o) => ({
              value: o.value,
              label: o.text,
            })),
          }
        : {}),
    };
  }

  return field;
};

/**
 * Normalizes HTML input type to our schema type.
 */
const normalizeType = (
  inputType: string,
  tagName: string
): FormFieldSchema['type'] => {
  if (tagName.toLowerCase() === 'select') return 'select';
  const typeMap: Record<string, FormFieldSchema['type']> = {
    text: 'text',
    number: 'number',
    email: 'email',
    tel: 'tel',
    date: 'date',
    password: 'password',
  };
  return typeMap[inputType.toLowerCase()] ?? 'text';
};

/**
 * Cleans up label text by removing extra whitespace and asterisks.
 */
const cleanLabel = (label: string): string =>
  label.replace(/\*/g, '').replace(/\s+/g, ' ').trim();
