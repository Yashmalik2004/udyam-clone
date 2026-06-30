/**
 * controllers/submission.controller.ts — Final Submission HTTP Handler
 */

import { Request, Response, NextFunction } from 'express';
import { createSubmission } from '../services/submission.service';
import { sendCreated } from '../utils/response';
import { SubmissionInput } from '../schemas/submission.schema';
import { logger } from '../logger/logger';

// ── POST /api/submit ─────────────────────────────────────────────────────────

export const submitController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const input = req.body as SubmissionInput;

    logger.info('Received final submission request', {
      aadhaarSuffix: input.aadhaarNumber.slice(-4),
      panPrefix: input.panNumber.slice(0, 3),
    });

    const result = await createSubmission(input);

    sendCreated(
      res,
      'Registration submitted successfully. Your Udyam Reference Number has been generated.',
      result
    );
  } catch (error) {
    next(error);
  }
};
