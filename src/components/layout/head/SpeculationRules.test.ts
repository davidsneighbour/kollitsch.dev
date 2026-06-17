// @vitest-environment node

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { describe, expect, it } from 'vitest';

describe('SpeculationRules component', () => {
  let src: string;

  const load = async () => {
    const dir = path.dirname(fileURLToPath(import.meta.url));
    src = await fs.readFile(path.join(dir, 'SpeculationRules.astro'), 'utf8');
  };

  it('exports a Props interface', async () => {
    await load();
    expect(/export\s+(?:interface|type)\s+[A-Za-z0-9_]*Props\b/.test(src)).toBe(
      true,
    );
  });

  it('emits a speculationrules script tag with is:inline', async () => {
    await load();
    expect(src).toContain('type="speculationrules"');
    expect(src).toContain('is:inline');
  });

  it('targets /about/, /blog/, and /tags/ with immediate eagerness', async () => {
    await load();
    expect(src).toContain('"/about/"');
    expect(src).toContain('"/blog/"');
    expect(src).toContain('"/tags/"');
    expect(src).toContain('"eagerness": "immediate"');
  });
});
