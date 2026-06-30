/**
 * routes/aadhaar.routes.ts — Aadhaar API Routes
 *
 * POST /api/aadhaar/generate-otp
 * POST /api/aadhaar/verify-otp
 */

import { Router } from 'express';
import { generateOtpController, verifyOtpController } from '../controllers/aadhaar.controller';
import { validate } from '../validators/validate';
import { generateOtpSchema, verifyOtpSchema } from '../schemas/aadhaar.schema';

export const aadhaarRouter = Router();

aadhaarRouter.post(
  '/generate-otp',
  validate(generateOtpSchema),
  generateOtpController
);

aadhaarRouter.post(
  '/verify-otp',
  validate(verifyOtpSchema),
  verifyOtpController
);
