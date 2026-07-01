/**
 * utils/validators.ts — Zod Validation Schemas for Frontend Forms
 *
 * Mirrors backend Zod schemas for client-side validation.
 * Keeps validation logic consistent across the stack.
 */

import { z } from 'zod';

// ── Aadhaar ───────────────────────────────────────────────────────────────────

export const aadhaarSchema = z.object({
  aadhaarNumber: z
    .string()
    .trim()
    .regex(/^\d{12}$/, 'Aadhaar number must be exactly 12 digits'),
  aadhaarName: z
    .string()
    .trim()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must not exceed 100 characters')
    .regex(/^[A-Za-z\s]+$/, 'Name should only contain letters and spaces'),
});

export type AadhaarFormValues = z.infer<typeof aadhaarSchema>;

// ── OTP ───────────────────────────────────────────────────────────────────────

export const otpSchema = z.object({
  otp: z
    .string()
    .length(6, 'OTP must be exactly 6 digits')
    .regex(/^\d{6}$/, 'OTP must contain only digits'),
});

export type OtpFormValues = z.infer<typeof otpSchema>;

// ── Step 2 / PAN ─────────────────────────────────────────────────────────────

export const panSchema = z.object({
  organisationType: z
    .string()
    .min(1, 'Please select an organisation type'),
  panNumber: z
    .string()
    .trim()
    .toUpperCase()
    .regex(
      /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,
      'Invalid PAN format. Expected: AAAAA0000A'
    ),
  panHolderName: z
    .string()
    .trim()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must not exceed 100 characters'),
  dobOrDoi: z
    .string()
    .min(1, 'Please enter date of birth or date of incorporation')
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
});

export type PanFormValues = z.infer<typeof panSchema>;

// ── Dynamic Field Validation Builder ─────────────────────────────────────────

/**
 * Builds a Zod string validator from a FormFieldSchema validation config.
 * Used by the DynamicForm component to apply per-field validation from schema.
 *
 * TODO: Extend to handle number/date types with proper Zod coercions.
 */
export const buildFieldValidator = (fieldId: string, validation?: {
  pattern?: string;
  minLength?: number;
  maxLength?: number;
  required?: boolean;
}): z.ZodTypeAny => {
  let validator = z.string();

  if (validation?.minLength) {
    validator = validator.min(validation.minLength, `${fieldId} must be at least ${validation.minLength} characters`);
  }
  if (validation?.maxLength) {
    validator = validator.max(validation.maxLength, `${fieldId} must not exceed ${validation.maxLength} characters`);
  }
  if (validation?.pattern) {
    validator = validator.regex(new RegExp(validation.pattern), `${fieldId} format is invalid`);
  }

  return validator;
};
