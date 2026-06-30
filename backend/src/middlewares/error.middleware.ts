/**
 * middlewares/error.middleware.ts — Global Error Handler
 *
 * Catches all errors passed to next(err) throughout the application.
 * Returns a structured JSON error response.
 *
 * MUST be the LAST middleware registered in app.ts.
 */

import { Request, Response, NextFunction, ErrorRequestHandler } from 'express';
import { AppError } from '../types';
import { logger } from '../logger/logger';
import { HTTP_STATUS } from '../constants';

export const errorMiddleware: ErrorRequestHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  // Determine if this is a known operational error or an unexpected one
  const isOperational = err instanceof AppError && err.isOperational;
  const statusCode =
    err instanceof AppError ? err.statusCode : HTTP_STATUS.INTERNAL_SERVER_ERROR;

  // Log error with appropriate severity
  if (isOperational) {
    logger.warn('Operational error', {
      message: err.message,
      statusCode,
      path: req.path,
      method: req.method,
    });
  } else {
    logger.error('Unexpected error', {
      message: err.message,
      stack: err.stack,
      path: req.path,
      method: req.method,
    });
  }

  const message =
    isOperational
      ? err.message
      : process.env['NODE_ENV'] === 'production'
      ? 'An unexpected error occurred. Please try again later.'
      : err.message;

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env['NODE_ENV'] !== 'production' && { stack: err.stack }),
    timestamp: new Date().toISOString(),
  });
};
