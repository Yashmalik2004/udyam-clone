/**
 * routes/pan.routes.ts — PAN API Routes
 *
 * POST /api/pan/validate
 */

import { Router } from 'express';
import { validatePanController } from '../controllers/pan.controller';
import { validate } from '../validators/validate';
import { panValidateSchema } from '../schemas/pan.schema';

export const panRouter = Router();

panRouter.post('/validate', validate(panValidateSchema), validatePanController);
