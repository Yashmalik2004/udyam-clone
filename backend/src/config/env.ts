/**
 * config/env.ts — Environment Variable Configuration
 *
 * Validates and exports all required environment variables using Zod.
 * Fails fast at startup if any required variable is missing or invalid.
 */

import { z } from 'zod';

const envSchema = z.object({
  PORT: z
    .string()
    .default('5000')
    .transform((v) => parseInt(v, 10)),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),
  DIRECT_URL: z.string().optional(),
  JWT_SECRET: z.string().min(16, 'JWT_SECRET must be at least 16 characters').default('dev_secret_change_in_production'),
  OTP_EXPIRY_MINUTES: z
    .string()
    .default('5')
    .transform((v) => parseInt(v, 10)),
  LOG_LEVEL: z.enum(['error', 'warn', 'info', 'http', 'debug']).default('info'),
  FRONTEND_URL: z.string().url().default('http://localhost:5173'),
});

type Env = z.infer<typeof envSchema>;

let _env: Env | null = null;

export const getEnv = (): Env => {
  if (_env) return _env;

  const result = envSchema.safeParse(process.env);

  if (!result.success) {
    console.error('❌ Invalid environment variables:');
    result.error.issues.forEach((issue) => {
      console.error(`  ${issue.path.join('.')}: ${issue.message}`);
    });
    process.exit(1);
  }

  _env = result.data;
  return _env;
};
