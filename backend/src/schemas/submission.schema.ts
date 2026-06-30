/**
 * schemas/submission.schema.ts — Zod Validation Schema for Final Submission
 */

import { z } from 'zod';
import { AADHAAR_REGEX, PAN_REGEX } from '../constants';

export const submissionSchema = z.object({
  aadhaarNumber: z
    .string()
    .trim()
    .regex(AADHAAR_REGEX, 'Invalid Aadhaar number'),
  aadhaarName: z
    .string()
    .trim()
    .min(2)
    .max(100),
  otpVerified: z
    .boolean()
    .refine((val) => val === true, 'OTP must be verified before submission'),
  aadhaarToken: z
    .string()
    .min(1, 'Aadhaar verification token is required'),
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
  panNumber: z
    .string()
    .trim()
    .toUpperCase()
    .regex(PAN_REGEX, 'Invalid PAN number'),
  panHolderName: z
    .string()
    .trim()
    .min(2)
    .max(100),
  dobOrDoi: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
});

export type SubmissionInput = z.infer<typeof submissionSchema>;
