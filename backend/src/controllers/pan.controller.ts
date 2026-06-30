/**
 * controllers/pan.controller.ts — PAN HTTP Request Handler
 */

import { Request, Response, NextFunction } from 'express';
import { validatePan } from '../services/pan.service';
import { sendSuccess } from '../utils/response';
import { logger } from '../logger/logger';

// ── POST /api/pan/validate ───────────────────────────────────────────────────

export const validatePanController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { panNumber, panHolderName, dobOrDoi } = req.body as {
      panNumber: string;
      panHolderName: string;
      dobOrDoi: string;
    };

    logger.info('Received PAN validate request', {
      panPrefix: panNumber.slice(0, 3),
    });

    const result = await validatePan(panNumber, panHolderName, dobOrDoi);

    sendSuccess(res, 'PAN validated successfully', result);
  } catch (error) {
    next(error);
  }
};
