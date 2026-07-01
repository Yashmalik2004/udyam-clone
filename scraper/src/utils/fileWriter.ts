/**
 * scraper/src/utils/fileWriter.ts — Schema JSON File Writer
 *
 * Writes the extracted schema to a JSON file in the output/ directory.
 * Creates the output directory if it does not exist.
 */

import fs from 'fs';
import path from 'path';
import { FormSchema } from '../types';

/**
 * Writes a FormSchema object to the specified file path as pretty-printed JSON.
 *
 * @param schema     - The FormSchema object to write
 * @param outputPath - Absolute path to the output file
 */
export const writeSchemaToFile = async (
  schema: FormSchema,
  outputPath: string
): Promise<void> => {
  const dir = path.dirname(outputPath);

  // Create output directory if it doesn't exist
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`📁 Created output directory: ${dir}`);
  }

  const json = JSON.stringify(schema, null, 2);
  fs.writeFileSync(outputPath, json, 'utf-8');

  console.log(`💾 Schema saved: ${outputPath} (${json.length} bytes)`);
};
