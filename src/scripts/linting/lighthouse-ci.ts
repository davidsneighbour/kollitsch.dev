#!/usr/bin/env node
// CI Lighthouse runner — runs mobile + desktop profiles, saves JSON reports, appends scores to data/lighthouse/history.json.
// node src/scripts/linting/lighthouse-ci.ts [--url=...]

import path from 'node:path';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import process from 'node:process';
import { execSync } from 'node:child_process';
import { launch } from 'chrome-launcher';
import lighthouse from 'lighthouse';
import { configs, buildLhConfig, extractScores } from '../../config/lighthouse/index.ts';

function arg(flag: string): string | undefined {
  const eq = process.argv.find((a) => a.startsWith(`--${flag}=`));
  if (eq) return eq.slice(flag.length + 3);
  const idx = process.argv.indexOf(`--${flag}`);
  return idx !== -1 ? process.argv[idx + 1] : undefined;
}

const url = arg('url') ?? process.env.LH_URL ?? 'https://kollitsch.dev/';
const outputDir = path.resolve('reports/lighthouse');
const historyPath = path.resolve('data/lighthouse/history.json');

const timestamp = new Date().toISOString().replace(/[:.]/g, '-');

async function runProfile(profileName: string): Promise<Record<string, number>> {
  const profile = configs[profileName];
  if (!profile) throw new Error(`Unknown profile: ${profileName}`);

  console.log(`Running ${profile.name} — ${profile.description}`);

  const chrome = await launch({ chromeFlags: ['--headless', '--no-sandbox', '--disable-dev-shm-usage'] });
  let lhr: lighthouse.LH.Result;
  try {
    const result = await lighthouse(url, { port: chrome.port, output: 'json' }, buildLhConfig(profile));
    if (!result?.lhr) throw new Error('No Lighthouse result returned.');
    lhr = result.lhr;
  } finally {
    await chrome.kill();
  }

  const jsonPath = path.join(outputDir, `${timestamp}-${profileName}.json`);
  await writeFile(jsonPath, JSON.stringify(lhr, null, 2));
  console.log(`JSON  → ${jsonPath}`);

  return extractScores(lhr.categories);
}

await mkdir(outputDir, { recursive: true });

const mobileScores = await runProfile('mobile');
console.log('Mobile scores:', mobileScores);

const desktopScores = await runProfile('desktop');
console.log('Desktop scores:', desktopScores);

let sha = 'unknown';
try {
  sha = execSync('git rev-parse --short HEAD', { encoding: 'utf8' }).trim();
} catch {
  // not in git or git unavailable
}

const record = {
  date: new Date().toISOString().slice(0, 10),
  sha,
  url,
  mobile: mobileScores,
  desktop: desktopScores,
};

await mkdir(path.dirname(historyPath), { recursive: true });

let history: unknown[] = [];
if (existsSync(historyPath)) {
  const raw = await readFile(historyPath, 'utf8');
  history = JSON.parse(raw);
}

history.push(record);
await writeFile(historyPath, JSON.stringify(history, null, 2) + '\n');
console.log(`\nAppended to ${historyPath}`);
