/**
 * app.ts — Express Application Factory
 *
 * Creates and configures the Express application.
 * Registers all global middleware and route handlers.
 * Kept separate from server.ts to facilitate testing.
 */

import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { getEnv } from './config/env';
import { requestLoggerMiddleware } from './middlewares/requestLogger.middleware';
import { notFoundMiddleware } from './middlewares/notFound.middleware';
import { errorMiddleware } from './middlewares/error.middleware';
import { rootRouter } from './routes';

export const createApp = (): Application => {
  const app = express();
  const env = getEnv();

  // ── Security Middlewares ─────────────────────────────────────────────────
  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: 'cross-origin' },
    })
  );

  app.use(
    cors({
      origin: env.FRONTEND_URL,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
      credentials: true,
    })
  );

  // ── Body Parsers ─────────────────────────────────────────────────────────
  app.use(express.json({ limit: '10kb' }));
  app.use(express.urlencoded({ extended: true, limit: '10kb' }));

  // ── Request Logging ──────────────────────────────────────────────────────
  app.use(requestLoggerMiddleware);

  // ── Health Check ─────────────────────────────────────────────────────────
  app.get('/health', (_req, res) => {
    res.json({
      status: 'ok',
      environment: env.NODE_ENV,
      timestamp: new Date().toISOString(),
    });
  });

  // ── API Routes ───────────────────────────────────────────────────────────
  app.use('/api', rootRouter);

  // ── Error Handling (must be LAST) ────────────────────────────────────────
  app.use(notFoundMiddleware);
  app.use(errorMiddleware);

  return app;
};
