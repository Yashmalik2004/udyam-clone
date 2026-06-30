/**
 * controllers/aadhaar.controller.ts — Aadhaar HTTP Request Handlers
 *
 * Thin controllers: validate input → call service → return response.
 * Business logic lives in services/aadhaar.service.ts.
 */

import { Request, Response, NextFunction } from 'express';
import { generateAadhaarOtp, verifyAadhaarOtp } from '../services/aadhaar.service';
import { sendSuccess } from '../utils/response';
import { logger } from '../logger/logger';

// ── POST /api/aadhaar/generate-otp ──────────────────────────────────────────

export const generateOtpController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { aadhaarNumber, aadhaarName } = req.body as {
      aadhaarNumber: string;
      aadhaarName: string;
    };

    logger.info('Received generate-OTP request', {
      aadhaarSuffix: aadhaarNumber.slice(-4),
    });

    const result = await generateAadhaarOtp(aadhaarNumber, aadhaarName);

    sendSuccess(res, 'OTP sent successfully to registered mobile number', result);
  } catch (error) {
    next(error);
  }
};

// ── POST /api/aadhaar/verify-otp ────────────────────────────────────────────

export const verifyOtpController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { referenceId, otp, aadhaarName } = req.body as {
      referenceId: string;
      otp: string;
      aadhaarName: string;
    };

    logger.info('Received verify-OTP request', { referenceId });

    const result = await verifyAadhaarOtp(referenceId, otp, aadhaarName);

    sendSuccess(res, 'OTP verified successfully', result);
  } catch (error) {
    next(error);
  }
};
