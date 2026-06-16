#!/usr/bin/env node
// Interactive Lighthouse runner — shows available profiles, runs selected one with HTML output.
// node src/scripts/linting/lighthouse-run.ts [--config=<name>] [--url=...]

import path from 'node:path';
import { mkdir, writeFile } from 'node:fs/promises';
import { createInterface } from 'node:readline';
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

const url = arg('url') ?? process.env.LH_URL ?? 'https://kollitsch.dev/';
const outputDir = path.resolve('reports/lighthouse');

const profileList = Object.values(configs);

let configName = arg('config');

if (!configName) {
  console.log('\nAvailable Lighthouse profiles:\n');
  profileList.forEach((p, i) => {
    console.log(`  ${String(i + 1).padStart(2)}. ${p.name.padEnd(20)} ${p.description}`);
  });
  console.log();

  const rl = createInterface({ input: process.stdin, output: process.stdout });
  configName = await new Promise<string>((resolve) => {
    rl.question('Select profile (number or name): ', (answer) => {
      rl.close();
      resolve(answer.trim());
    });
  });

  const byIndex = Number(configName);
  if (!Number.isNaN(byIndex) && byIndex >= 1 && byIndex <= profileList.length) {
    configName = profileList[byIndex - 1].name;
  }
}

const profile = configs[configName];
if (!profile) {
  console.error(`Unknown config "${configName}". Available: ${Object.keys(configs).join(', ')}`);
  process.exit(1);
}

console.log(`\nRunning: ${profile.name} — ${profile.description}`);
console.log(`URL: ${url}\n`);

const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
const baseName = `${timestamp}-${profile.name}`;

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
