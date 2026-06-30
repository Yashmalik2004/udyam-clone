/**
 * schemas/pan.schema.ts — Zod Validation Schemas for PAN Endpoints
 */

import { z } from 'zod';
import { PAN_REGEX } from '../constants';

// ── PAN Validate ─────────────────────────────────────────────────────────────

export const panValidateSchema = z.object({
  panNumber: z
    .string()
    .trim()
    .toUpperCase()
    .regex(PAN_REGEX, 'Invalid PAN format. Expected: AAAAA0000A (5 letters, 4 digits, 1 letter)'),
  panHolderName: z
    .string()
    .trim()
    .min(2, 'PAN holder name must be at least 2 characters')
    .max(100, 'PAN holder name must not exceed 100 characters'),
  dobOrDoi: z
    .string()
    .regex(
      /^\d{4}-\d{2}-\d{2}$/,
      'Date must be in YYYY-MM-DD format'
    )
    .refine((val) => {
      const date = new Date(val);
      return date instanceof Date && !isNaN(date.getTime());
    }, 'Invalid date value'),
  organisationType: z.enum([
    'PROPRIETORSHIP',
    'PARTNERSHIP',
    'HUF',
    'PRIVATE_LIMITED',
    'PUBLIC_LIMITED',
    'LLP',
    'CO_OPERATIVE',
    'SELF_HELP_GROUP',
    'OTHER',
  ]),
  // Token from Aadhaar OTP verification step
  aadhaarToken: z.string().min(1, 'Aadhaar verification token is required'),
});

export type PanValidateInput = z.infer<typeof panValidateSchema>;
