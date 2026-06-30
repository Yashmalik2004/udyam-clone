/**
 * utils/otp.ts — In-Memory OTP Service
 *
 * Generates, stores, and verifies 6-digit OTPs.
 * OTPs are stored in-memory with expiry times.
 *
 * ⚠️  NOTE: This is a MOCK implementation.
 *     For production, replace with:
 *     - A proper SMS gateway (MSG91, Fast2SMS, etc.)
 *     - Redis for distributed OTP storage
 *     - Proper rate limiting
 */

import { randomInt } from 'crypto';
import { v4 as uuidv4 } from 'uuid';
import { OtpRecord } from '../types';
import { OTP_LENGTH, OTP_MAX_ATTEMPTS, OTP_DEFAULT_EXPIRY_MINUTES } from '../constants';
import { logger } from '../logger/logger';

// ── In-Memory Store ──────────────────────────────────────────────────────────
// Key: referenceId, Value: OtpRecord
const otpStore = new Map<string, OtpRecord>();

// ── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Generates a cryptographically random N-digit OTP string.
 */
const generateOtpCode = (length: number = OTP_LENGTH): string => {
  const min = Math.pow(10, length - 1);
  const max = Math.pow(10, length) - 1;
  return randomInt(min, max + 1).toString();
};

/**
 * Returns the OTP expiry Date based on configured minutes.
 */
const getExpiryDate = (minutes: number = OTP_DEFAULT_EXPIRY_MINUTES): Date => {
  const expiry = new Date();
  expiry.setMinutes(expiry.getMinutes() + minutes);
  return expiry;
};

// ── Public API ───────────────────────────────────────────────────────────────

/**
 * Generates a new OTP for the given Aadhaar number.
 * Returns a referenceId to be used during verification.
 *
 * TODO: Replace in-memory store with Redis for production.
 * TODO: Integrate with real SMS gateway (MSG91, Fast2SMS, etc.).
 */
export const generateOtp = (
  aadhaarNumber: string,
  expiryMinutes: number = OTP_DEFAULT_EXPIRY_MINUTES
): { referenceId: string; otp: string } => {
  const otp = generateOtpCode();
  const referenceId = uuidv4();
  const expiresAt = getExpiryDate(expiryMinutes);

  // Invalidate any existing OTP for this Aadhaar number
  for (const [key, record] of otpStore.entries()) {
    if (record.aadhaarNumber === aadhaarNumber) {
      otpStore.delete(key);
    }
  }

  otpStore.set(referenceId, {
    otp,
    aadhaarNumber,
    expiresAt,
    attempts: 0,
  });

  // 🔥 Log OTP to console (MOCK — do not do this in production)
  logger.info(`[MOCK OTP] Generated for Aadhaar ${aadhaarNumber.slice(-4).padStart(12, 'X')}: ${otp} (expires: ${expiresAt.toISOString()})`);

  return { referenceId, otp };
};

/**
 * Verifies an OTP against the stored record.
 *
 * TODO: Add proper rate-limiting (e.g., 3 attempts max).
 * TODO: Log failed attempts for security audit.
 */
export const verifyOtp = (
  referenceId: string,
  submittedOtp: string
): { success: boolean; reason?: string } => {
  const record = otpStore.get(referenceId);

  if (!record) {
    return { success: false, reason: 'Invalid or expired reference ID' };
  }

  if (new Date() > record.expiresAt) {
    otpStore.delete(referenceId);
    return { success: false, reason: 'OTP has expired. Please generate a new OTP.' };
  }

  if (record.attempts >= OTP_MAX_ATTEMPTS) {
    otpStore.delete(referenceId);
    return { success: false, reason: 'Maximum OTP attempts exceeded. Please generate a new OTP.' };
  }

  // Increment attempts
  record.attempts += 1;
  otpStore.set(referenceId, record);

  if (record.otp !== submittedOtp) {
    const remaining = OTP_MAX_ATTEMPTS - record.attempts;
    return {
      success: false,
      reason: `Incorrect OTP. ${remaining} attempt(s) remaining.`,
    };
  }

  // ✅ Valid — remove from store to prevent replay
  otpStore.delete(referenceId);
  logger.info(`[MOCK OTP] Verified for referenceId: ${referenceId}`);

  return { success: true };
};

/**
 * Retrieves the Aadhaar number associated with a referenceId.
 * Returns null if not found or expired.
 */
export const getAadhaarByReferenceId = (referenceId: string): string | null => {
  return otpStore.get(referenceId)?.aadhaarNumber ?? null;
};

/**
 * Cleans up expired OTP entries. Should be called periodically.
 * TODO: Wire up to a cron job or interval.
 */
export const cleanExpiredOtps = (): number => {
  const now = new Date();
  let removed = 0;
  for (const [key, record] of otpStore.entries()) {
    if (now > record.expiresAt) {
      otpStore.delete(key);
      removed++;
    }
  }
  if (removed > 0) {
    logger.debug(`Cleaned ${removed} expired OTP(s) from store`);
  }
  return removed;
};
