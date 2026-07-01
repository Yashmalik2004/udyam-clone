/**
 * scraper/src/utils/fallbackSchema.ts — Static Fallback Schema
 *
 * Provides a pre-defined schema that mirrors the real Udyam portal fields.
 * Used when the live scraper fails (network issues, portal changes, etc.)
 */

import { FormSchema } from '../types';

export const getFallbackSchema = (): FormSchema => ({
  version: '1.0.0',
  scrapedAt: new Date().toISOString(),
  source: 'fallback-static',
  steps: [
    {
      step: 1,
      title: 'Aadhaar Verification',
      description: 'Enter your Aadhaar details to verify your identity',
      fields: [
        {
          id: 'aadhaarNumber',
          name: 'aadhaarNumber',
          label: 'Aadhaar Number',
          type: 'text',
          placeholder: 'Enter 12-digit Aadhaar Number',
          required: true,
          step: 1,
          validation: {
            pattern: '^\\d{12}$',
            minLength: 12,
            maxLength: 12,
          },
        },
        {
          id: 'aadhaarName',
          name: 'aadhaarName',
          label: 'Name as per Aadhaar',
          type: 'text',
          placeholder: 'Enter name exactly as on Aadhaar card',
          required: true,
          step: 1,
          validation: {
            minLength: 2,
            maxLength: 100,
          },
        },
      ],
    },
    {
      step: 2,
      title: 'PAN & Organisation Details',
      description: 'Enter your PAN details and organisation information',
      fields: [
        {
          id: 'organisationType',
          name: 'organisationType',
          label: 'Type of Organisation',
          type: 'select',
          placeholder: 'Select Organisation Type',
          required: true,
          step: 2,
          validation: {
            options: [
              { value: 'PROPRIETORSHIP', label: 'Proprietorship' },
              { value: 'PARTNERSHIP', label: 'Partnership Firm' },
              { value: 'HUF', label: 'Hindu Undivided Family (HUF)' },
              { value: 'PRIVATE_LIMITED', label: 'Private Limited Company' },
              { value: 'PUBLIC_LIMITED', label: 'Public Limited Company' },
              { value: 'LLP', label: 'Limited Liability Partnership' },
              { value: 'CO_OPERATIVE', label: 'Co-operative Societies' },
              { value: 'SELF_HELP_GROUP', label: 'Self Help Group' },
              { value: 'OTHER', label: 'Others' },
            ],
          },
        },
        {
          id: 'panNumber',
          name: 'panNumber',
          label: 'PAN Number',
          type: 'text',
          placeholder: 'e.g., ABCDE1234F',
          required: true,
          step: 2,
          validation: {
            pattern: '^[A-Z]{5}[0-9]{4}[A-Z]{1}$',
            minLength: 10,
            maxLength: 10,
          },
        },
        {
          id: 'panHolderName',
          name: 'panHolderName',
          label: 'Name of PAN Holder',
          type: 'text',
          placeholder: 'Enter name exactly as on PAN card',
          required: true,
          step: 2,
          validation: { minLength: 2, maxLength: 100 },
        },
        {
          id: 'dobOrDoi',
          name: 'dobOrDoi',
          label: 'Date of Birth / Date of Incorporation as per PAN',
          type: 'date',
          placeholder: '',
          required: true,
          step: 2,
        },
      ],
    },
  ],
});
