/**
 * utils/response.ts — Standardized API Response Helpers
 *
 * All API responses follow a consistent envelope format:
 * { success, message, data?, errors?, timestamp }
 */

import { Response } from 'express';
import { ApiResponse, ValidationError } from '../types';

/**
 * Sends a successful JSON response.
 */
export const sendSuccess = <T>(
  res: Response,
  message: string,
  data?: T,
  statusCode: number = 200
): Response => {
  const response: ApiResponse<T> = {
    success: true,
    message,
    data,
    timestamp: new Date().toISOString(),
  };
  return res.status(statusCode).json(response);
};

/**
 * Sends an error JSON response.
 */
export const sendError = (
  res: Response,
  message: string,
  statusCode: number = 500,
  errors?: ValidationError[]
): Response => {
  const response: ApiResponse<never> = {
    success: false,
    message,
    errors,
    timestamp: new Date().toISOString(),
  };
  return res.status(statusCode).json(response);
};

/**
 * Sends a 201 Created response.
 */
export const sendCreated = <T>(
  res: Response,
  message: string,
  data?: T
): Response => sendSuccess(res, message, data, 201);
