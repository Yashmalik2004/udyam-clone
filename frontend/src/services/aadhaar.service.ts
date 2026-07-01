/**
 * services/aadhaar.service.ts — Frontend Aadhaar API Calls
 */

import { apiClient } from './api';
import type { ApiResponse, GenerateOtpData, VerifyOtpData } from '../types';

/**
 * Calls POST /api/aadhaar/generate-otp
 */
export const generateOtp = async (
  aadhaarNumber: string,
  aadhaarName: string
): Promise<GenerateOtpData> => {
  const res = await apiClient.post<ApiResponse<GenerateOtpData>>(
    '/aadhaar/generate-otp',
    { aadhaarNumber, aadhaarName }
  );
  if (!res.data.data) throw new Error(res.data.message);
  return res.data.data;
};

/**
 * Calls POST /api/aadhaar/verify-otp
 */
export const verifyOtp = async (
  referenceId: string,
  otp: string,
  aadhaarName: string
): Promise<VerifyOtpData> => {
  const res = await apiClient.post<ApiResponse<VerifyOtpData>>(
    '/aadhaar/verify-otp',
    { referenceId, otp, aadhaarName }
  );
  if (!res.data.data) throw new Error(res.data.message);
  return res.data.data;
};
