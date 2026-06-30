/**
 * services/pan.service.ts — PAN Validation Business Logic
 *
 * Contains all business logic for PAN card validation.
 * Currently uses a MOCK implementation. Replace with real Income Tax API later.
 *
 * Extensibility: Implement the same function signatures with real API calls
 * and swap this module without changing any controller code.
 */

import { PanValidationResult, AppError } from '../types';
import { MOCK_PAN_HOLDER_NAME, HTTP_STATUS } from '../constants';
import { logger } from '../logger/logger';

// ── PAN Type Map ─────────────────────────────────────────────────────────────
// The 4th character of a PAN indicates the entity type.
const PAN_TYPE_MAP: Record<string, string> = {
  P: 'Individual',
  C: 'Company',
  H: 'Hindu Undivided Family',
  F: 'Firm',
  A: 'Association of Persons',
  T: 'Trust',
  B: 'Body of Individuals',
  L: 'Local Authority',
  J: 'Artificial Juridical Person',
  G: 'Government',
};

// ── Validate PAN ─────────────────────────────────────────────────────────────

/**
 * Validates a PAN number and returns holder details.
 *
 * TODO: Replace with real Income Tax Department API:
 *   https://developer.incometaxindia.gov.in/
 *   Requires registration on the IT developer portal.
 *
 * TODO: Cross-reference panHolderName with the name returned by the API.
 * TODO: Validate dobOrDoi against PAN records.
 *
 * @param panNumber     - 10-character PAN (e.g., ABCDE1234F)
 * @param panHolderName - Name of the PAN holder as provided by user
 * @param dobOrDoi      - Date of Birth or Date of Incorporation (YYYY-MM-DD)
 */
export const validatePan = async (
  panNumber: string,
  panHolderName: string,
  dobOrDoi: string
): Promise<PanValidationResult> => {
  logger.info(`[MOCK] Validating PAN: ${panNumber.slice(0, 3)}*******`);

  // TODO: Call real IT Department / NSDL PAN verification API
  // const itResponse = await itClient.verifyPan({ panNumber, name: panHolderName, dob: dobOrDoi });

  // MOCK: Simulate async API delay
  await simulateDelay(400);

  // Derive PAN type from the 4th character
  const typeChar = panNumber.charAt(3).toUpperCase();
  const panType = PAN_TYPE_MAP[typeChar] ?? 'Unknown';

  // MOCK: Simulate a specific "invalid" PAN for testing error flows
  if (panNumber === 'AAAAA0000A') {
    throw new AppError('PAN not found in records. Please check the PAN number.', HTTP_STATUS.BAD_REQUEST);
  }

  // MOCK: Return simulated successful response
  return {
    valid: true,
    panHolderName: MOCK_PAN_HOLDER_NAME, // TODO: Return real name from IT API
    panType,
  };
};

// ── Helpers ──────────────────────────────────────────────────────────────────

const simulateDelay = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));
