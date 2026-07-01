/**
 * services/schema.service.ts — Frontend Schema API Calls
 */

import { apiClient } from './api';
import type { ApiResponse } from '../types';
import type { FormSchema } from '../types/schema.types';

/**
 * Fetches the dynamic form schema from GET /api/schema
 */
export const fetchFormSchema = async (): Promise<FormSchema> => {
  const res = await apiClient.get<ApiResponse<FormSchema>>('/schema');
  if (!res.data.data) throw new Error('Failed to load form schema');
  return res.data.data;
};

/**
 * Calls POST /api/submit with complete registration data
 */
export const submitRegistration = async (payload: {
  aadhaarNumber: string;
  aadhaarName: string;
  otpVerified: boolean;
  aadhaarToken: string;
  organisationType: string;
  panNumber: string;
  panHolderName: string;
  dobOrDoi: string;
}) => {
  const res = await apiClient.post('/submit', payload);
  return res.data;
};
