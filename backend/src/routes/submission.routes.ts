/**
 * routes/submission.routes.ts — Submission API Routes
 *
 * POST /api/submit
 */

import { Router } from 'express';
import { submitController } from '../controllers/submission.controller';
import { validate } from '../validators/validate';
import { submissionSchema } from '../schemas/submission.schema';

export const submissionRouter = Router();

submissionRouter.post('/', validate(submissionSchema), submitController);
