/**
 * scraper/src/extractors/labels.extractor.ts — Label-to-Field ID Mapper
 *
 * Builds a map of { fieldId → labelText } by querying all <label> elements
 * with a `for` attribute and matching them to their target input IDs.
 */

import { Page } from 'puppeteer';

/**
 * Extracts all <label for="..."> associations on the page.
 *
 * @param page - Active Puppeteer page
 * @returns A map of { inputId → labelText }
 */
export const extractLabels = async (
  page: Page
): Promise<Record<string, string>> => {
  return await page.evaluate((): Record<string, string> => {
    const labelMap: Record<string, string> = {};

    const labels = document.querySelectorAll<HTMLLabelElement>('label[for]');
    labels.forEach((label) => {
      const forAttr = label.getAttribute('for');
      if (forAttr) {
        // Clean up the text: remove asterisks, trim whitespace
        const text = (label.textContent ?? '')
          .replace(/\*/g, '')
          .replace(/\s+/g, ' ')
          .trim();
        if (text) {
          labelMap[forAttr] = text;
        }
      }
    });

    return labelMap;
  });
};
