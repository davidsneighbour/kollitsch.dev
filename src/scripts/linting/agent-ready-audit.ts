#!/usr/bin/env node
import process from 'node:process';

const AUDIT_ENDPOINT = 'https://isitagentready.com/api/scan';
const DEFAULT_SITE_URL = 'https://kollitsch.dev';
const CONTENT_PROFILE_CHECKS = [
  'robotsTxt',
  'sitemap',
  'linkHeaders',
  'dnsAid',
  'markdownNegotiation',
  'robotsTxtAiRules',
  'contentSignals',
] as const;

type ContentProfileCheck = (typeof CONTENT_PROFILE_CHECKS)[number];

type CheckStatus = 'pass' | 'fail' | 'neutral' | 'unableToCheck';

interface AuditCheck {
  status: CheckStatus;
  message?: string;
}

interface AuditResponse {
  url: string;
  scannedAt: string;
  level?: number;
  levelName?: string;
  checks: {
    discoverability?: Partial<Record<ContentProfileCheck, AuditCheck>>;
    contentAccessibility?: Partial<Record<ContentProfileCheck, AuditCheck>>;
    botAccessControl?: Partial<Record<ContentProfileCheck, AuditCheck>>;
  };
  siteError?: {
    httpStatus?: number;
    statusText?: string;
    bodyPreview?: string;
  };
}

interface Options {
  siteUrl: string;
}

function parseArgs(): Options {
  const args = new Map<string, string>();

  for (let i = 2; i < process.argv.length; i++) {
    const arg = process.argv[i];
    if (!arg.startsWith('--')) continue;

    const [rawKey, rawValue] = arg.slice(2).split('=', 2);
    if (rawValue !== undefined) {
      args.set(rawKey, rawValue);
      continue;
    }

    const next = process.argv[i + 1];
    if (next && !next.startsWith('--')) {
      args.set(rawKey, next);
      i++;
    } else {
      args.set(rawKey, '');
    }
  }

  const siteUrl =
    args.get('url') ?? process.env.AGENT_READY_URL ?? DEFAULT_SITE_URL;

  if (!/^https?:\/\//i.test(siteUrl)) {
    throw new Error(`--url must be an absolute http(s) URL: ${siteUrl}`);
  }

  return { siteUrl };
}

function auditPageUrl(siteUrl: string): string {
  const hostname = new URL(siteUrl).hostname;
  return `https://isitagentready.com/${encodeURIComponent(
    hostname,
  )}?profile=content`;
}

function collectContentChecks(
  response: AuditResponse,
): Record<string, AuditCheck> {
  return {
    ...(response.checks.discoverability ?? {}),
    ...(response.checks.contentAccessibility ?? {}),
    ...(response.checks.botAccessControl ?? {}),
  };
}

async function runAudit(siteUrl: string): Promise<AuditResponse> {
  const response = await fetch(AUDIT_ENDPOINT, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      enabledChecks: CONTENT_PROFILE_CHECKS,
      url: siteUrl,
    }),
  });

  const body = (await response.json()) as unknown;

  if (!response.ok) {
    const message =
      body && typeof body === 'object' && 'error' in body
        ? String(body.error)
        : `HTTP ${response.status}`;
    throw new Error(`isitagentready.com scan failed: ${message}`);
  }

  return body as AuditResponse;
}

const options = parseArgs();
let result: AuditResponse;

try {
  result = await runAudit(options.siteUrl);
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);
  console.error(
    `Agent-readiness audit failed before a result was returned: ${message}`,
  );
  process.exit(1);
}

if (result.siteError) {
  const status = result.siteError.httpStatus
    ? `${result.siteError.httpStatus} ${result.siteError.statusText ?? ''}`.trim()
    : 'network error';
  console.error(`Agent-readiness audit could not scan ${result.url}: ${status}`);
  if (result.siteError.bodyPreview) console.error(result.siteError.bodyPreview);
  process.exit(1);
}

const checks = collectContentChecks(result);
const rows = CONTENT_PROFILE_CHECKS.map((checkName) => {
  const check = checks[checkName];
  return {
    message: check?.message ?? 'Missing audit result',
    name: checkName,
    status: check?.status ?? 'unableToCheck',
  };
});

console.log(`Agent-readiness content-profile audit for ${result.url}`);
console.log(`Audit page: ${auditPageUrl(result.url)}`);
console.log(`Scanned at: ${result.scannedAt}`);
if (result.level !== undefined && result.levelName) {
  console.log(`Level: ${result.level} (${result.levelName})`);
}
console.log('');

for (const row of rows) {
  const marker = row.status === 'pass' ? 'PASS' : row.status.toUpperCase();
  console.log(`${marker.padEnd(14)} ${row.name.padEnd(22)} ${row.message}`);
}

const failures = rows.filter((row) => row.status !== 'pass');

if (failures.length > 0) {
  console.error('');
  console.error(
    `Content-profile audit failed: ${failures.length} check(s) did not pass.`,
  );
  process.exit(1);
}
