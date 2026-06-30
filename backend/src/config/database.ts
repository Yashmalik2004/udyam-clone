/**
 * config/database.ts — Prisma Client Singleton
 *
 * Exports a single Prisma Client instance to be shared across the application.
 * Prevents multiple connections from being opened during hot-reload in development.
 */

import { PrismaClient } from '../../generated/prisma';
import { logger } from '../logger/logger';

declare global {
  // eslint-disable-next-line no-var
  var __prisma: PrismaClient | undefined;
}

const createPrismaClient = (): PrismaClient => {
  const client = new PrismaClient({
    log: [
      { emit: 'event', level: 'query' },
      { emit: 'event', level: 'error' },
      { emit: 'event', level: 'warn' },
    ],
  });

  // ── Log DB queries in development ────────────────────────────────────────
  if (process.env['NODE_ENV'] === 'development') {
    client.$on('query', (e) => {
      logger.debug('DB Query', { query: e.query, duration: `${e.duration}ms` });
    });
  }

  client.$on('error', (e) => {
    logger.error('DB Error', { message: e.message });
  });

  return client;
};

// Re-use client across hot-reloads in development
export const prisma: PrismaClient =
  global.__prisma ?? createPrismaClient();

if (process.env['NODE_ENV'] !== 'production') {
  global.__prisma = prisma;
}

export const connectDatabase = async (): Promise<void> => {
  // TODO: Add retry logic for production resilience
  await prisma.$connect();
  logger.info('✅ Database connected');
};

export const disconnectDatabase = async (): Promise<void> => {
  await prisma.$disconnect();
  logger.info('Database disconnected');
};
