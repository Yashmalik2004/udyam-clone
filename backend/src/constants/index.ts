/**
 * constants/index.ts — Application-wide Constants
 *
 * Single source of truth for magic numbers, string literals, and
 * configuration values that are not environment-dependent.
 */

// ── OTP ─────────────────────────────────────────────────────────────────────

export const OTP_LENGTH = 6;
export const OTP_MAX_ATTEMPTS = 3;
export const OTP_DEFAULT_EXPIRY_MINUTES = 5;

// ── Aadhaar ──────────────────────────────────────────────────────────────────

export const AADHAAR_LENGTH = 12;
export const AADHAAR_REGEX = /^\d{12}$/;

// ── PAN ──────────────────────────────────────────────────────────────────────

export const PAN_REGEX = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
export const PAN_LENGTH = 10;

// ── HTTP Status Codes ────────────────────────────────────────────────────────

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
} as const;

// ── Organisation Types ───────────────────────────────────────────────────────

export const ORGANISATION_TYPES = [
  { value: 'PROPRIETORSHIP', label: 'Proprietorship' },
  { value: 'PARTNERSHIP', label: 'Partnership Firm' },
  { value: 'HUF', label: 'Hindu Undivided Family (HUF)' },
  { value: 'PRIVATE_LIMITED', label: 'Private Limited Company' },
  { value: 'PUBLIC_LIMITED', label: 'Public Limited Company' },
  { value: 'LLP', label: 'Limited Liability Partnership' },
  { value: 'CO_OPERATIVE', label: 'Co-operative Societies' },
  { value: 'SELF_HELP_GROUP', label: 'Self Help Group' },
  { value: 'OTHER', label: 'Others' },
] as const;

// ── API Paths ─────────────────────────────────────────────────────────────────

export const API_PATHS = {
  SCHEMA: '/schema',
  AADHAAR_GENERATE_OTP: '/aadhaar/generate-otp',
  AADHAAR_VERIFY_OTP: '/aadhaar/verify-otp',
  PAN_VALIDATE: '/pan/validate',
  SUBMIT: '/submit',
} as const;

// ── Mock Data (for simulated responses) ─────────────────────────────────────

export const MOCK_AADHAAR_NAME = 'RAJESH KUMAR';
export const MOCK_PAN_HOLDER_NAME = 'RAJESH KUMAR';
export const MOCK_MASKED_MOBILE = 'XXXXXXXX89';
