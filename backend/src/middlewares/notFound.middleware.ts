/**
 * middlewares/notFound.middleware.ts — 404 Not Found Handler
 *
 * Catches all requests that don't match any registered route.
 * Returns a structured 404 JSON response.
 */

import { Request, Response, NextFunction } from 'express';
import { HTTP_STATUS } from '../constants';

export const notFoundMiddleware = (
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  res.status(HTTP_STATUS.NOT_FOUND).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
    timestamp: new Date().toISOString(),
  });
};
