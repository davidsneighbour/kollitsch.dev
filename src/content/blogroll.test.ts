// src/content/blogroll.test.ts
import { describe, it, expect } from 'vitest';
import Ajv2020 from 'ajv/dist/2020';
import addFormats from 'ajv-formats';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface Config {
  schemaFile: string;
  dataFile: string;
}
const config: Config = {
  schemaFile: 'blogroll.schema.json',
  dataFile: 'blogroll.json',
};

describe('blogroll.json schema validation', () => {
  it('should match the blogroll.schema.json', () => {
    const ajv = new Ajv2020({ allErrors: true, strict: false });
    addFormats(ajv);

    const schemaPath = path.join(__dirname, config.schemaFile);
    const dataPath = path.join(__dirname, config.dataFile);

    const schema = JSON.parse(fs.readFileSync(schemaPath, 'utf8'));
    const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

    const validate = ajv.compile(schema);
    const valid = validate(data);

    if (!valid && validate.errors) {
      // Detailed error output for quick debugging
      console.error(JSON.stringify(validate.errors, null, 2));
    }

    expect(valid).toBe(true);
  });
});
