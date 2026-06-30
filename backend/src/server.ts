/**
 * server.ts — Application Entry Point
 *
 * Bootstraps the Express application and starts the HTTP server.
 * All configuration is loaded from environment variables via config/env.ts.
 */

import 'dotenv/config';
import { createApp } from './app';
import { getEnv } from './config/env';
import { logger } from './logger/logger';

const bootstrap = async (): Promise<void> => {
  const env = getEnv();
  const app = createApp();

  const server = app.listen(env.PORT, () => {
    logger.info(`🚀 Server started`, {
      port: env.PORT,
      environment: env.NODE_ENV,
      url: `http://localhost:${env.PORT}`,
    });
  });

  // ── Graceful Shutdown ────────────────────────────────────────────────────
  const shutdown = (signal: string) => {
    logger.info(`Received ${signal}. Shutting down gracefully...`);
    server.close(() => {
      logger.info('HTTP server closed.');
      process.exit(0);
    });
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));

  process.on('unhandledRejection', (reason: unknown) => {
    logger.error('Unhandled Promise Rejection', { reason });
    process.exit(1);
  });

  process.on('uncaughtException', (error: Error) => {
    logger.error('Uncaught Exception', { error: error.message, stack: error.stack });
    process.exit(1);
  });
};

bootstrap().catch((err: unknown) => {
  console.error('Failed to bootstrap server:', err);
  process.exit(1);
});
