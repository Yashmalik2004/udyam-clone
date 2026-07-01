/**
 * services/aadhaar.service.ts — Aadhaar OTP Business Logic
 *
 * Contains all business logic for the Aadhaar OTP flow.
 * Currently uses a MOCK implementation. Replace with real UIDAI API later.
 *
 * Extensibility: Implement the same function signatures with real API calls
 * and swap this module without changing any controller code.
 */

import jwt from 'jsonwebtoken';
import { generateOtp, verifyOtp } from '../utils/otp';
import { GenerateOtpResult, VerifyOtpResult } from '../types';
import { AppError } from '../types';
import { MOCK_AADHAAR_NAME, MOCK_MASKED_MOBILE, HTTP_STATUS } from '../constants';
import { getEnv } from '../config/env';
import { logger } from '../logger/logger';

// ── Generate OTP ─────────────────────────────────────────────────────────────

/**
 * Initiates the Aadhaar OTP verification process.
 *
 * TODO: Replace with real UIDAI API call:
 *   POST https://developer.uidai.gov.in/uidotp/...
 *   Requires UIDAI developer credentials and AUA/ASA setup.
 *
 * @param aadhaarNumber - 12-digit Aadhaar number
 * @param aadhaarName   - Name as per Aadhaar
 */
export const generateAadhaarOtp = async (
  aadhaarNumber: string,
  aadhaarName: string
): Promise<GenerateOtpResult> => {
  logger.info(`[MOCK] Generating OTP for Aadhaar: ...${aadhaarNumber.slice(-4)}`);

  // TODO: Validate Aadhaar against UIDAI before generating OTP
  // const uidaiResponse = await uidaiClient.validateAadhaar(aadhaarNumber);

  // MOCK: Simulate async API delay
  await simulateDelay(300);

  const { referenceId, otp } = generateOtp(
    aadhaarNumber,
    getEnv().OTP_EXPIRY_MINUTES
  );

  return {
    referenceId,
    maskedMobile: MOCK_MASKED_MOBILE,
    expiresInMinutes: getEnv().OTP_EXPIRY_MINUTES,
    otp,
  };
};

// ── Verify OTP ───────────────────────────────────────────────────────────────

/**
 * Verifies the submitted OTP and returns a session token on success.
 *
 * TODO: Replace with real UIDAI OTP verification API.
 * TODO: Store session in Redis instead of JWT for better revocability.
 *
 * @param referenceId   - UUID returned from generateAadhaarOtp
 * @param otp           - 6-digit OTP submitted by user
 * @param aadhaarName   - Name as per Aadhaar (for cross-referencing)
 */
export const verifyAadhaarOtp = async (
  referenceId: string,
  otp: string,
  aadhaarName: string
): Promise<VerifyOtpResult> => {
  logger.info(`[MOCK] Verifying OTP for referenceId: ${referenceId}`);

  // TODO: Replace with real UIDAI verification
  const result = verifyOtp(referenceId, otp);

  if (!result.success) {
    throw new AppError(result.reason ?? 'OTP verification failed', HTTP_STATUS.BAD_REQUEST);
  }

  // Generate a short-lived JWT to carry Aadhaar verification across steps
  const token = jwt.sign(
    { aadhaarName, verified: true },
    getEnv().JWT_SECRET,
    { expiresIn: '30m' }
  );

  return {
    verified: true,
    aadhaarName: MOCK_AADHAAR_NAME, // TODO: Return real name from UIDAI response
    token,
  };
};

// ── Helpers ──────────────────────────────────────────────────────────────────

const simulateDelay = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));
