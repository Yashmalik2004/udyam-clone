/**
 * middlewares/requestLogger.middleware.ts — HTTP Request Logger
 *
 * Uses Morgan to log all incoming HTTP requests, piped through Winston.
 */

import morgan, { StreamOptions } from 'morgan';
import { RequestHandler } from 'express';
import { logger } from '../logger/logger';

// ── Morgan → Winston Stream ──────────────────────────────────────────────────

const stream: StreamOptions = {
  write: (message: string) => {
    logger.http(message.trim());
  },
};

// Skip logging in test environment
const skip = (): boolean => {
  return process.env['NODE_ENV'] === 'test';
};

const morganFormat =
  process.env['NODE_ENV'] === 'production'
    ? 'combined'
    : ':method :url :status :res[content-length] - :response-time ms';

export const requestLoggerMiddleware: RequestHandler = morgan(morganFormat, {
  stream,
  skip,
});
