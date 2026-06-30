/**
 * validators/validate.ts — Reusable Zod Validation Middleware Factory
 *
 * Creates Express middleware that validates request body/query/params
 * against a Zod schema. Returns 422 with structured errors on failure.
 */

import { Request, Response, NextFunction, RequestHandler } from 'express';
import { ZodSchema, ZodError } from 'zod';
import { sendError } from '../utils/response';
import { HTTP_STATUS } from '../constants';
import { ValidationError } from '../types';

type RequestPart = 'body' | 'query' | 'params';

/**
 * Creates an Express middleware that validates a specific part of the request
 * against the provided Zod schema.
 *
 * @param schema - Zod schema to validate against
 * @param part   - Which part of the request to validate (default: 'body')
 */
export const validate = <T>(
  schema: ZodSchema<T>,
  part: RequestPart = 'body'
): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req[part]);

    if (!result.success) {
      const errors = formatZodErrors(result.error);
      sendError(res, 'Validation failed', HTTP_STATUS.UNPROCESSABLE_ENTITY, errors);
      return;
    }

    // Replace the original data with the parsed (and potentially coerced) data
    req[part] = result.data as typeof req[typeof part];
    next();
  };
};

/**
 * Formats Zod validation errors into a consistent API error structure.
 */
const formatZodErrors = (error: ZodError): ValidationError[] => {
  return error.issues.map((issue) => ({
    field: issue.path.join('.') || 'unknown',
    message: issue.message,
  }));
};
