#!/usr/bin/env node
// Runs a single named Lighthouse profile.
// node src/scripts/linting/lighthouse-audit.ts --config=<name> [--url=...] [--output-dir=...] [--save-html]

import path from 'node:path';
import { mkdir, writeFile } from 'node:fs/promises';
import process from 'node:process';
import { launch } from 'chrome-launcher';
import lighthouse from 'lighthouse';
import { ReportGenerator } from 'lighthouse/report/generator/report-generator.js';
import { configs, buildLhConfig, extractScores } from '../../config/lighthouse/index.ts';

function arg(flag: string): string | undefined {
  const eq = process.argv.find((a) => a.startsWith(`--${flag}=`));
  if (eq) return eq.slice(flag.length + 3);
  const idx = process.argv.indexOf(`--${flag}`);
  return idx !== -1 ? process.argv[idx + 1] : undefined;
}

const configName = arg('config') ?? 'mobile';
const url = arg('url') ?? process.env.LH_URL ?? 'https://kollitsch.dev/';
const outputDir = path.resolve(arg('output-dir') ?? 'reports/lighthouse');

const profile = configs[configName];
if (!profile) {
  console.error(`Unknown config "${configName}". Available: ${Object.keys(configs).join(', ')}`);
  process.exit(1);
}

const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
const baseName = `${timestamp}-${configName}`;

await mkdir(outputDir, { recursive: true });

const chrome = await launch({ chromeFlags: ['--headless', '--no-sandbox', '--disable-dev-shm-usage'] });

let lhr: lighthouse.LH.Result;
try {
  const result = await lighthouse(url, { port: chrome.port, output: 'json' }, buildLhConfig(profile));
  if (!result?.lhr) throw new Error('No Lighthouse result returned.');
  lhr = result.lhr;
} finally {
  await chrome.kill();
}

const jsonPath = path.join(outputDir, `${baseName}.json`);
await writeFile(jsonPath, JSON.stringify(lhr, null, 2));
console.log(`JSON  → ${jsonPath}`);

const htmlPath = path.join(outputDir, `${baseName}.html`);
await writeFile(htmlPath, ReportGenerator.generateReport(lhr, 'html'));
console.log(`HTML  → ${htmlPath}`);

const scores = extractScores(lhr.categories);
console.log('\nScores:');
for (const [cat, score] of Object.entries(scores)) {
  console.log(`  ${cat.padEnd(16)} ${score}`);
}
