/**
 * routes/schema.routes.ts — Form Schema API Routes
 *
 * GET /api/schema
 */

import { Router } from 'express';
import { getSchemaController } from '../controllers/schema.controller';

export const schemaRouter = Router();

schemaRouter.get('/', getSchemaController);
