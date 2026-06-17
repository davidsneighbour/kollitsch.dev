/**
 * Netlify `_headers` file generator.
 *
 * Renders `PathRule[]` data from `src/data/headers.ts` into the plain-text
 * `_headers` format that Netlify reads from the deploy root.
 *
 * Called by the `generateHeadersIntegration` Astro hook in `build-hooks.ts`
 * during `astro:build:done` — the generated file is written directly to the
 * Astro output directory (`dist/_headers`) so it is included in every deploy.
 *
 * Do not edit `dist/_headers` directly; edit `src/data/headers.ts` instead.
 */

import { writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { headerRules, moduleHeaderRules, type PathRule } from '../../data/headers.ts';

/** Returns an RFC 1123 date string for build time + 1 year. */
function expiresOneYearFromNow(): string {
  const d = new Date();
  d.setFullYear(d.getFullYear() + 1);
  return d.toUTCString();
}

function renderRule(rule: PathRule, expiresValue: string): string {
  const lines: string[] = [];

  if (rule.comment) {
    for (const line of rule.comment.split('\n')) {
      lines.push(`# ${line}`);
    }
  }

  lines.push(rule.path);

  for (const header of rule.headers) {
    lines.push(
      header.disabled
        ? `  # ${header.name}: ${header.value}`
        : `  ${header.name}: ${header.value}`,
    );
  }

  if (rule.addExpires) {
    lines.push(`  Expires: ${expiresValue}`);
  }

  return lines.join('\n');
}

/**
 * Renders all rules into a `_headers` file string.
 *
 * @param extraRules - Additional path rules appended after the module rules,
 *   e.g. rules collected from page frontmatter at build time.
 */
export function renderHeaders(extraRules: PathRule[] = []): string {
  const expiresValue = expiresOneYearFromNow();
  const buildDate = new Date().toISOString();

  const baseSection = headerRules
    .map((rule) => renderRule(rule, expiresValue))
    .join('\n\n');

  const moduleSection = [
    '# headers created via data configuration from other modules',
    ...moduleHeaderRules.map((rule) => renderRule(rule, expiresValue)),
  ].join('\n');

  const extraSection =
    extraRules.length > 0
      ? '\n# headers from page frontmatter\n' +
        extraRules.map((rule) => renderRule(rule, expiresValue)).join('\n\n')
      : '';

  return [
    '# header configuration for kollitsch.dev on Netlify',
    `# generated at build time (${buildDate}) — edit src/data/headers.ts, not this file`,
    '',
    baseSection,
    '',
    moduleSection,
    extraSection,
  ].join('\n');
}

/**
 * Generates `_headers` and writes it to `outDir`.
 *
 * @param outDir  - Absolute path to the Astro build output directory.
 * @param extraRules - Per-page rules collected from frontmatter (empty for now).
 */
export function generateHeaders(outDir: string, extraRules: PathRule[] = []): void {
  const content = renderHeaders(extraRules);
  writeFileSync(join(outDir, '_headers'), content, 'utf8');
}
