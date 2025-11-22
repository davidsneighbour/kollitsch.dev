// @vitest-environment node
import fs from 'fs';
import path from 'path';
import { describe, expect, it } from 'vitest';

const filePath = path.resolve(
  process.cwd(),
  'src/components/content/typography/Komut.astro',
);
const content = fs.readFileSync(filePath, 'utf8');

describe('Komut.astro (static assertions)', () => {
  it('exports a Props interface', () => {
    expect(content).toMatch(/export\s+interface\s+Props/);
  });

  it('defines defaultClasses as "is--komut"', () => {
    expect(content).toMatch(/const\s+defaultClasses\s*=\s*["']is--komut["']/);
  });

  it('applies select-none conditionally when visual is true', () => {
    expect(content).toMatch(/visual\s*\?\s*["']select-none["']/);
  });

  it('includes both Khmer and Thai komut symbols', () => {
    expect(content).toContain('៚'); // Khmer komut (default)
    expect(content).toContain('๛'); // Thai komut (thai variant)
  });

  it('normalizes the container tag to "div" or "span"', () => {
    expect(content).toMatch(/as:\s*Tag/); // as prop type present
    expect(content).toMatch(/asTag\s*===\s*["']div["']|asTag\s*===\s*'div'/); // tag normalization exists
  });

  it('uses aria-hidden bound to the visual prop', () => {
    expect(content).toMatch(/aria-hidden\s*=\s*{visual}/);
  });
});
