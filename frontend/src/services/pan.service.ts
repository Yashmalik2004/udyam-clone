/**
 * services/pan.service.ts — Frontend PAN API Calls
 */

import { apiClient } from './api';
import type { ApiResponse, PanValidationData } from '../types';

/**
 * Calls POST /api/pan/validate
 */
export const validatePan = async (payload: {
  panNumber: string;
  panHolderName: string;
  dobOrDoi: string;
  organisationType: string;
  aadhaarToken: string;
}): Promise<PanValidationData> => {
  const res = await apiClient.post<ApiResponse<PanValidationData>>(
    '/pan/validate',
    payload
  );
  if (!res.data.data) throw new Error(res.data.message);
  return res.data.data;
};
