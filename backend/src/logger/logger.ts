/**
 * logger/logger.ts — Winston Logger Configuration
 *
 * Creates a configured Winston logger instance with:
 * - Console transport (colorized in development)
 * - Separate file transports for info, warn, and error logs
 * - JSON format for production, pretty-print for development
 */

import { createLogger, format, transports, Logger } from 'winston';
import path from 'path';

const { combine, timestamp, colorize, printf, json, errors } = format;

// ── Log Formats ─────────────────────────────────────────────────────────────

const devFormat = combine(
  colorize({ all: true }),
  timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  errors({ stack: true }),
  printf(({ level, message, timestamp: ts, stack, ...meta }) => {
    const metaStr = Object.keys(meta).length ? `\n  ${JSON.stringify(meta, null, 2)}` : '';
    return `${ts} [${level}]: ${stack ?? message}${metaStr}`;
  })
);

const prodFormat = combine(
  timestamp(),
  errors({ stack: true }),
  json()
);

// ── Logger Instance ──────────────────────────────────────────────────────────

const logLevel = process.env['LOG_LEVEL'] ?? 'info';
const isDev = process.env['NODE_ENV'] !== 'production';

const logsDir = path.join(process.cwd(), 'logs');

export const logger: Logger = createLogger({
  level: logLevel,
  format: isDev ? devFormat : prodFormat,
  transports: [
    // Console transport — always enabled
    new transports.Console(),

    // File transports — info, warn, error
    new transports.File({
      filename: path.join(logsDir, 'error.log'),
      level: 'error',
    }),
    new transports.File({
      filename: path.join(logsDir, 'warn.log'),
      level: 'warn',
    }),
    new transports.File({
      filename: path.join(logsDir, 'combined.log'),
    }),
  ],
  exceptionHandlers: [
    new transports.File({ filename: path.join(logsDir, 'exceptions.log') }),
  ],
  rejectionHandlers: [
    new transports.File({ filename: path.join(logsDir, 'rejections.log') }),
  ],
  exitOnError: false,
});
