/**
 * routes/index.ts — Root API Router
 *
 * Combines all sub-routers under the /api prefix.
 * This is the single router mounted in app.ts.
 */

import { Router } from 'express';
import { aadhaarRouter } from './aadhaar.routes';
import { panRouter } from './pan.routes';
import { schemaRouter } from './schema.routes';
import { submissionRouter } from './submission.routes';

export const rootRouter = Router();

// ── Mount Sub-Routers ────────────────────────────────────────────────────────
rootRouter.use('/schema', schemaRouter);
rootRouter.use('/aadhaar', aadhaarRouter);
rootRouter.use('/pan', panRouter);
rootRouter.use('/submit', submissionRouter);

// ── API Info ──────────────────────────────────────────────────────────────────
rootRouter.get('/', (_req, res) => {
  res.json({
    name: 'Udyam Registration API',
    version: '1.0.0',
    endpoints: [
      'GET  /api/schema',
      'POST /api/aadhaar/generate-otp',
      'POST /api/aadhaar/verify-otp',
      'POST /api/pan/validate',
      'POST /api/submit',
    ],
  });
});
