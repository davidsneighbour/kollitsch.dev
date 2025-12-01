import path from 'node:path';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import process from 'node:process';
import chromeLauncher from 'chrome-launcher';
import lighthouse from 'lighthouse';
import { ReportGenerator } from 'lighthouse/report/generator/report-generator.js';
import { defaultLighthouseRunnerConfig } from '../config/lighthouse.config.js';

type FormFactor = 'mobile' | 'desktop';

interface ParsedConfig {
  url: string;
  outputDir: string;
  saveHtmlReports: boolean;
  chromeFlags: string[];
}

const profiles: FormFactor[] = ['mobile', 'desktop'];

function parseFlagValue(flag: string): string | undefined {
  const argWithEquals = process.argv.find((argument) => argument.startsWith(`--${flag}=`));
  if (argWithEquals) {
    return argWithEquals.split('=')[1];
  }

  const index = process.argv.indexOf(`--${flag}`);
  if (index !== -1) {
    return process.argv[index + 1];
  }

  return undefined;
}

function parseBooleanFlag(flag: string): boolean | undefined {
  if (process.argv.includes(`--${flag}`)) {
    return true;
  }

  const value = parseFlagValue(flag);
  if (value === undefined) {
    return undefined;
  }

  return value === 'true' || value === '1';
}

function loadConfig(): ParsedConfig {
  const url = parseFlagValue('url') ?? process.env.LH_URL ?? defaultLighthouseRunnerConfig.url;
  const outputDir = parseFlagValue('output-dir') ?? defaultLighthouseRunnerConfig.outputDir;
  const saveHtmlReports =
    parseBooleanFlag('save-html') ?? defaultLighthouseRunnerConfig.saveHtmlReports;
  const chromeFlags = (parseFlagValue('chrome-flags') ?? '')
    .split(',')
    .filter(Boolean)
    .concat(defaultLighthouseRunnerConfig.chromeFlags);

  return { url, outputDir, saveHtmlReports, chromeFlags };
}

function timestampLabel(): string {
  return new Date().toISOString().replace(/[:.]/g, '-');
}

async function ensureOutputDir(directory: string): Promise<void> {
  await mkdir(directory, { recursive: true });
}

async function saveJsonReport(
  outputDir: string,
  baseName: string,
  lhr: lighthouse.LH.Result,
): Promise<string> {
  const jsonPath = path.join(outputDir, `${baseName}.json`);
  await writeFile(jsonPath, JSON.stringify(lhr, undefined, 2), 'utf8');
  return jsonPath;
}

async function saveHtmlReport(
  outputDir: string,
  baseName: string,
  lhr: lighthouse.LH.Result,
): Promise<string> {
  const htmlPath = path.join(outputDir, `${baseName}.html`);
  const html = ReportGenerator.generateReport(lhr, 'html');
  await writeFile(htmlPath, html, 'utf8');
  return htmlPath;
}

async function regenerateHtmlFromExistingJson(jsonPath: string): Promise<string> {
  const json = await readFile(jsonPath, 'utf8');
  const lhr = JSON.parse(json) as lighthouse.LH.Result;
  const htmlPath = jsonPath.replace(/\.json$/u, '.html');
  const html = ReportGenerator.generateReport(lhr, 'html');
  await writeFile(htmlPath, html, 'utf8');
  return htmlPath;
}

async function runAuditForProfile(
  profile: FormFactor,
  config: ParsedConfig,
  baseLabel: string,
): Promise<{ json: string; html?: string }>
{
  const chrome = await chromeLauncher.launch({ chromeFlags: config.chromeFlags });
  try {
    const runnerResult = await lighthouse(config.url, {
      logLevel: 'verbose',
      output: 'json',
      port: chrome.port,
      preset: profile === 'desktop' ? 'desktop' : undefined,
      emulatedFormFactor: profile,
    });

    if (!runnerResult?.lhr) {
      throw new Error(`No Lighthouse result returned for ${profile} profile.`);
    }

    const baseName = `${baseLabel}-${profile}`;
    const jsonPath = await saveJsonReport(config.outputDir, baseName, runnerResult.lhr);

    let htmlPath: string | undefined;
    if (config.saveHtmlReports) {
      htmlPath = await saveHtmlReport(config.outputDir, baseName, runnerResult.lhr);
    }

    return { json: jsonPath, html: htmlPath };
  } finally {
    await chrome.kill();
  }
}

async function main(): Promise<void> {
  const config = loadConfig();
  const baseLabel = timestampLabel();
  await ensureOutputDir(config.outputDir);

  const existingJsonToRender = parseFlagValue('render-html-from-json');
  if (existingJsonToRender) {
    const renderedPath = await regenerateHtmlFromExistingJson(existingJsonToRender);
    console.info(`Rendered HTML report from ${existingJsonToRender} -> ${renderedPath}`);
    return;
  }

  for (const profile of profiles) {
    // eslint-disable-next-line no-await-in-loop
    const result = await runAuditForProfile(profile, config, baseLabel);
    console.info(`Saved ${profile} JSON report to ${result.json}`);
    if (result.html) {
      console.info(`Saved ${profile} HTML report to ${result.html}`);
    }
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
