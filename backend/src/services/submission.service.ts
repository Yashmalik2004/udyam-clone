/**
 * services/submission.service.ts — Submission Business Logic
 *
 * Handles the final multi-step form submission.
 * Saves validated data to the database via Prisma.
 *
 * TODO: Add email confirmation after successful submission.
 * TODO: Generate a proper Udyam Reference Number (URN) format.
 */

import { prisma } from '../config/database';
import { SubmissionInput } from '../schemas/submission.schema';
import { SubmissionResult, AppError } from '../types';
import { HTTP_STATUS } from '../constants';
import { logger } from '../logger/logger';
import { OrganisationType } from '../../generated/prisma';

/**
 * Creates a new registration submission in the database.
 *
 * @param input - Validated submission data from Step 1 + Step 2
 */
export const createSubmission = async (
  input: SubmissionInput
): Promise<SubmissionResult> => {
  logger.info('[DB] Creating new submission', {
    aadhaarSuffix: input.aadhaarNumber.slice(-4),
    panNumber: `${input.panNumber.slice(0, 3)}*******`,
  });

  // TODO: Check for duplicate submission (same Aadhaar + PAN combination)
  // const existing = await prisma.submission.findFirst({
  //   where: { panNumber: input.panNumber }
  // });
  // if (existing) throw new AppError('A submission with this PAN already exists.', HTTP_STATUS.CONFLICT);

  let submission;
  try {
    submission = await prisma.submission.create({
      data: {
        aadhaarNumber: input.aadhaarNumber,
        aadhaarName: input.aadhaarName,
        otpVerified: input.otpVerified,
        organisationType: input.organisationType as OrganisationType,
        panNumber: input.panNumber,
        panHolderName: input.panHolderName,
        dobOrDoi: input.dobOrDoi,
      },
    });
  } catch (error) {
    logger.error('[DB] Failed to create submission', { error });
    throw new AppError('Failed to save registration. Please try again.', HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }

  // TODO: Generate real URN format: UDYAM-XX-00-0000000
  const udyamReferenceNumber = `UDYAM-XX-00-${submission.id.slice(-7).toUpperCase()}`;

  logger.info(`[DB] Submission created: ${submission.id}`);

  return {
    id: submission.id,
    udyamReferenceNumber,
    createdAt: submission.createdAt.toISOString(),
  };
};

/**
 * Retrieves a submission by ID.
 *
 * TODO: Add proper authorization check before returning data.
 */
export const getSubmissionById = async (id: string) => {
  const submission = await prisma.submission.findUnique({ where: { id } });

  if (!submission) {
    throw new AppError('Submission not found', HTTP_STATUS.NOT_FOUND);
  }

  return submission;
};
