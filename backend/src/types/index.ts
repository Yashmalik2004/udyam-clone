/**
 * types/index.ts — Shared TypeScript Types & Interfaces
 *
 * Central location for all shared domain types used across
 * controllers, services, and middlewares.
 */

import { Request } from 'express';

// ── API Response Envelope ────────────────────────────────────────────────────

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  errors?: ValidationError[];
  timestamp: string;
}

export interface ValidationError {
  field: string;
  message: string;
}

// ── Pagination ───────────────────────────────────────────────────────────────

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  meta: PaginationMeta;
}

// ── OTP ─────────────────────────────────────────────────────────────────────

export interface OtpRecord {
  otp: string;
  aadhaarNumber: string;
  expiresAt: Date;
  attempts: number;
}

export interface GenerateOtpResult {
  referenceId: string;
  maskedMobile: string;
  expiresInMinutes: number;
}

export interface VerifyOtpResult {
  verified: boolean;
  aadhaarName: string;
  token: string;
}

// ── PAN ─────────────────────────────────────────────────────────────────────

export interface PanValidationResult {
  valid: boolean;
  panHolderName: string;
  panType: string;
}

// ── Submission ───────────────────────────────────────────────────────────────

export interface SubmissionResult {
  id: string;
  udyamReferenceNumber: string;
  createdAt: string;
}

// ── Schema (Scraper Output) ──────────────────────────────────────────────────

export interface FormFieldSchema {
  id: string;
  name: string;
  label: string;
  type: 'text' | 'number' | 'email' | 'tel' | 'date' | 'select' | 'otp' | 'password';
  placeholder?: string;
  required: boolean;
  validation?: {
    pattern?: string;
    minLength?: number;
    maxLength?: number;
    min?: string;
    max?: string;
    options?: SelectOption[];
  };
  step: number;
}

export interface SelectOption {
  value: string;
  label: string;
}

export interface FormSchema {
  version: string;
  scrapedAt: string;
  source: string;
  steps: FormStep[];
}

export interface FormStep {
  step: number;
  title: string;
  description: string;
  fields: FormFieldSchema[];
}

// ── Express Request Extensions ───────────────────────────────────────────────

export interface AuthenticatedRequest extends Request {
  aadhaarSession?: {
    aadhaarNumber: string;
    aadhaarName: string;
    verified: boolean;
  };
}

// ── AppError ─────────────────────────────────────────────────────────────────

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(message: string, statusCode: number = 500, isOperational: boolean = true) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    Error.captureStackTrace(this, this.constructor);
  }
}
