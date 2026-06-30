/**
 * schemas/aadhaar.schema.ts — Zod Validation Schemas for Aadhaar Endpoints
 */

import { z } from 'zod';
import { AADHAAR_REGEX, OTP_LENGTH } from '../constants';

// ── Generate OTP ─────────────────────────────────────────────────────────────

export const generateOtpSchema = z.object({
  aadhaarNumber: z
    .string()
    .trim()
    .regex(AADHAAR_REGEX, 'Aadhaar number must be exactly 12 digits'),
  aadhaarName: z
    .string()
    .trim()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must not exceed 100 characters')
    .regex(/^[A-Za-z\s]+$/, 'Name should only contain letters and spaces'),
});

export type GenerateOtpInput = z.infer<typeof generateOtpSchema>;

// ── Verify OTP ───────────────────────────────────────────────────────────────

export const verifyOtpSchema = z.object({
  referenceId: z.string().min(1, 'Reference ID is required'),
  otp: z
    .string()
    .length(OTP_LENGTH, `OTP must be exactly ${OTP_LENGTH} digits`)
    .regex(/^\d+$/, 'OTP must contain only digits'),
});

export type VerifyOtpInput = z.infer<typeof verifyOtpSchema>;
