/**
 * types/index.ts — Shared Frontend TypeScript Types
 */

// ── API Response Envelope ────────────────────────────────────────────────────

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  errors?: { field: string; message: string }[];
  timestamp: string;
}

// ── Aadhaar ───────────────────────────────────────────────────────────────────

export interface GenerateOtpData {
  referenceId: string;
  maskedMobile: string;
  expiresInMinutes: number;
  otp?: string;
}

export interface VerifyOtpData {
  verified: boolean;
  aadhaarName: string;
  token: string;
}

// ── PAN ───────────────────────────────────────────────────────────────────────

export interface PanValidationData {
  valid: boolean;
  panHolderName: string;
  panType: string;
}

// ── Submission ────────────────────────────────────────────────────────────────

export interface SubmissionData {
  id: string;
  udyamReferenceNumber: string;
  createdAt: string;
}

// ── Multi-Step Form State ─────────────────────────────────────────────────────

export interface StepOneFormData {
  aadhaarNumber: string;
  aadhaarName: string;
}

export interface StepTwoFormData {
  organisationType: string;
  panNumber: string;
  panHolderName: string;
  dobOrDoi: string;
}

export interface RegistrationState {
  step: 1 | 2 | 'success';
  stepOne: Partial<StepOneFormData>;
  stepTwo: Partial<StepTwoFormData>;
  aadhaarToken: string | null;
  submissionResult: SubmissionData | null;
}
