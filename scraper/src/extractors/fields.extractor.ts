/**
 * scraper/src/extractors/fields.extractor.ts — Form Field Extractor
 *
 * Uses Puppeteer's page.evaluate() to extract all <input>, <select>,
 * and <textarea> elements from the page, including their validation attributes.
 *
 * NOTE: This runs in browser context (no Node.js APIs available inside evaluate()).
 */

import { Page } from 'puppeteer';
import { RawExtractedField } from '../types';

/**
 * Extracts all form field metadata from the current page.
 *
 * TODO: Scope extraction to a specific form element for more precision.
 * TODO: Handle dynamic fields that appear after user interaction.
 *
 * @param page - Active Puppeteer page
 */
export const extractFields = async (page: Page): Promise<RawExtractedField[]> => {
  return await page.evaluate((): RawExtractedField[] => {
    const fields: RawExtractedField[] = [];

    // Query all interactive form elements
    const elements = document.querySelectorAll<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >('input, select, textarea');

    elements.forEach((el) => {
      // Skip hidden and purely decorative elements
      if (
        el.type === 'hidden' ||
        (el as HTMLInputElement).type === 'submit' ||
        (el as HTMLInputElement).type === 'button' ||
        (el as HTMLInputElement).type === 'image'
      ) {
        return;
      }

      // Extract <select> options
      const options: { value: string; text: string }[] = [];
      if (el.tagName.toLowerCase() === 'select') {
        (el as HTMLSelectElement).querySelectorAll('option').forEach((opt) => {
          if (opt.value) {
            options.push({ value: opt.value, text: opt.textContent?.trim() ?? '' });
          }
        });
      }

      // Find associated <label> via for attribute
      let labelText = '';
      if (el.id) {
        const label = document.querySelector<HTMLLabelElement>(`label[for="${el.id}"]`);
        if (label) {
          labelText = label.textContent?.trim() ?? '';
        }
      }

      // Walk up the DOM tree to find a wrapping label
      if (!labelText) {
        let parent = el.parentElement;
        while (parent) {
          if (parent.tagName.toLowerCase() === 'label') {
            labelText = parent.textContent?.trim() ?? '';
            break;
          }
          parent = parent.parentElement;
        }
      }

      const input = el as HTMLInputElement;

      fields.push({
        tagName: el.tagName.toLowerCase(),
        id: el.id ?? '',
        name: el.name ?? '',
        type: input.type ?? 'text',
        placeholder: input.placeholder ?? '',
        required: el.required ?? false,
        pattern: input.pattern ?? '',
        minLength: input.minLength > 0 ? input.minLength : 0,
        maxLength: input.maxLength > 0 && input.maxLength !== 524288 ? input.maxLength : 0,
        min: input.min ?? '',
        max: input.max ?? '',
        labelText,
        options,
      });
    });

    return fields;
  });
};
