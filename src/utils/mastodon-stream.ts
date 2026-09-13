import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

import { z } from 'astro/zod';
import sanitizeHtml from 'sanitize-html';
import TurndownService from 'turndown';

import {
  groupSelfReplyThreads,
  type StreamMedia,
  type StreamStatus,
  type StreamThread,
} from './stream-shared.ts';

export {
  groupSelfReplyThreads,
  type StreamMedia,
  type StreamStatus,
  type StreamThread,
};

/**
 * Shared helpers for the `/stream/` Mastodon integration. Reused by the
 * Netlify Function that serves the stream, the `promote:stream` CLI, and
 * their tests, so eligibility/normalisation rules only live in one place.
 */

// MARK: Mastodon API shapes

export const mastodonMediaAttachmentSchema = z.object({
  blurhash: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
  id: z.string(),
  preview_url: z.string().nullable().optional(),
  type: z.enum(['image', 'video', 'gifv', 'audio', 'unknown']),
  url: z.string().nullable().optional(),
});

export const mastodonAccountSchema = z.object({
  acct: z.string(),
  id: z.string(),
  url: z.string(),
  username: z.string(),
});

export const mastodonStatusSchema = z.object({
  account: mastodonAccountSchema.optional(),
  content: z.string(),
  created_at: z.string(),
  favourites_count: z.number().default(0),
  id: z.string(),
  in_reply_to_account_id: z.string().nullable().optional(),
  in_reply_to_id: z.string().nullable().optional(),
  media_attachments: z.array(mastodonMediaAttachmentSchema).default([]),
  reblog: z.object({ id: z.string() }).nullable().optional(),
  reblogs_count: z.number().default(0),
  replies_count: z.number().default(0),
  sensitive: z.boolean().default(false),
  spoiler_text: z.string().default(''),
  tags: z.array(z.object({ name: z.string(), url: z.string() })).default([]),
  uri: z.string(),
  url: z.string().nullable().optional(),
  visibility: z.enum(['public', 'unlisted', 'private', 'direct']),
});
export type MastodonStatus = z.infer<typeof mastodonStatusSchema>;
export type MastodonAccount = z.infer<typeof mastodonAccountSchema>;

// MARK: Environment / config

export interface StreamConfig {
  instanceUrl: string;
  accountId?: string;
  accountHandle?: string;
  accessToken?: string;
}

const DEFAULT_INSTANCE_URL = 'https://mas.to';

/**
 * Parses a `KEY=VALUE` `.env` file. Missing files return an empty object;
 * comments and blank lines are skipped, and surrounding quotes are stripped.
 */
async function parseEnvFile(filePath: string): Promise<Record<string, string>> {
  let raw: string;
  try {
    raw = await readFile(filePath, 'utf8');
  } catch {
    return {};
  }

  const result: Record<string, string> = {};
  for (const line of raw.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    result[key] = value;
  }
  return result;
}

/**
 * Loads `${HOME}/.env` first, then a local `.env`, with the local file
 * overriding home values. Real `process.env` values (already set by the
 * shell/CI) always win over both files. Returns the merged map and, unless
 * `apply: false`, assigns any keys not already present in `process.env`.
 */
export async function loadMergedEnv(
  options: { cwd?: string; home?: string; apply?: boolean } = {},
): Promise<Record<string, string>> {
  const cwd = options.cwd ?? process.cwd();
  const home = options.home ?? process.env['HOME'] ?? '';
  const apply = options.apply ?? true;

  const homeEnv = home ? await parseEnvFile(path.join(home, '.env')) : {};
  const localEnv = await parseEnvFile(path.join(cwd, '.env'));
  const merged = { ...homeEnv, ...localEnv };

  if (apply) {
    for (const [key, value] of Object.entries(merged)) {
      if (process.env[key] === undefined) {
        process.env[key] = value;
      }
    }
  }

  return merged;
}

/**
 * Builds a {@link StreamConfig} from an environment map (defaults to
 * `process.env`). Does not validate that an account id/handle is present -
 * callers should call {@link resolveMastodonAccount} to resolve one.
 */
export function resolveStreamConfigFromEnv(
  env: Record<string, string | undefined> = process.env,
): StreamConfig {
  const config: StreamConfig = {
    instanceUrl: env['MASTODON_INSTANCE_URL'] || DEFAULT_INSTANCE_URL,
  };
  const accountId = env['MASTODON_ACCOUNT_ID'];
  const accountHandle = env['MASTODON_ACCOUNT_HANDLE'];
  const accessToken = env['MASTODON_ACCESS_TOKEN'];
  if (accountId) config.accountId = accountId;
  if (accountHandle) config.accountHandle = accountHandle;
  if (accessToken) config.accessToken = accessToken;
  return config;
}

// MARK: Cache files

export const DEFAULT_CACHE_DIR = '.cache/mastodon-stream';

async function readJsonCache<T>(filePath: string): Promise<T | null> {
  try {
    const raw = await readFile(filePath, 'utf8');
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

async function writeJsonCache(filePath: string, data: unknown): Promise<void> {
  try {
    await mkdir(path.dirname(filePath), { recursive: true });
    await writeFile(filePath, JSON.stringify(data, null, 2), 'utf8');
  } catch {
    // Deployed functions may not have writable disk - cache writes are
    // best-effort and must never fail the request.
  }
}

export function cachePaths(cacheDir: string = DEFAULT_CACHE_DIR) {
  return {
    account: path.join(cacheDir, 'account.json'),
    statuses: path.join(cacheDir, 'statuses.json'),
    statusesFull: path.join(cacheDir, 'statuses-full.json'),
  };
}

// MARK: Account resolution

/**
 * Resolves a Mastodon account id, preferring a configured id, then looking
 * up a configured handle, then falling back to a cached lookup from a
 * previous run.
 */
export async function resolveMastodonAccount(
  config: StreamConfig,
  options: { cacheDir?: string; fetchImpl?: typeof fetch } = {},
): Promise<MastodonAccount> {
  const doFetch = options.fetchImpl ?? fetch;
  const paths = cachePaths(options.cacheDir);

  if (config.accountId) {
    try {
      const response = await doFetch(
        `${config.instanceUrl}/api/v1/accounts/${config.accountId}`,
      );
      if (response.ok) {
        const account = mastodonAccountSchema.parse(await response.json());
        await writeJsonCache(paths.account, account);
        return account;
      }
    } catch {
      // fall through to handle lookup / cache below
    }
  }

  if (config.accountHandle) {
    try {
      const handle = config.accountHandle.replace(/^@/, '').split('@')[0] ?? '';
      const response = await doFetch(
        `${config.instanceUrl}/api/v1/accounts/lookup?acct=${encodeURIComponent(handle)}`,
      );
      if (response.ok) {
        const account = mastodonAccountSchema.parse(await response.json());
        await writeJsonCache(paths.account, account);
        return account;
      }
    } catch {
      // fall through to cache below
    }
  }

  const cached = await readJsonCache<MastodonAccount>(paths.account);
  if (cached) return mastodonAccountSchema.parse(cached);

  throw new Error(
    'Unable to resolve a Mastodon account id: no MASTODON_ACCOUNT_ID/MASTODON_ACCOUNT_HANDLE, no reachable instance, and no cached account.',
  );
}

// MARK: Fetching statuses

/**
 * Fetches an account's statuses, without `exclude_replies` (too coarse -
 * self-replies must stay visible; see {@link isEligibleStreamStatus}).
 * Falls back to cached statuses on any fetch/parse failure.
 */
export async function fetchMastodonStatuses(
  config: StreamConfig,
  account: MastodonAccount,
  options: { limit?: number; cacheDir?: string; fetchImpl?: typeof fetch } = {},
): Promise<MastodonStatus[]> {
  const doFetch = options.fetchImpl ?? fetch;
  const paths = cachePaths(options.cacheDir);
  const limit = options.limit ?? 40;

  const url = new URL(
    `${config.instanceUrl}/api/v1/accounts/${account.id}/statuses`,
  );
  url.searchParams.set('exclude_reblogs', 'true');
  url.searchParams.set('limit', String(limit));

  const headers: Record<string, string> = {};
  if (config.accessToken)
    headers['Authorization'] = `Bearer ${config.accessToken}`;

  try {
    const response = await doFetch(url.toString(), { headers });
    if (!response.ok)
      throw new Error(`Mastodon API returned ${response.status}`);
    const rawStatuses = await response.json();
    const statuses = z.array(mastodonStatusSchema).parse(rawStatuses);
    await writeJsonCache(paths.statusesFull, statuses);
    return statuses;
  } catch (error) {
    const cached = await readJsonCache<MastodonStatus[]>(paths.statusesFull);
    if (cached) return z.array(mastodonStatusSchema).parse(cached);
    throw error;
  }
}

/**
 * Fetches a single status by id, falling back to a previously cached
 * statuses list (full, then normalised) when the network is unavailable.
 */
export async function fetchStatusById(
  config: StreamConfig,
  id: string,
  options: { cacheDir?: string; fetchImpl?: typeof fetch } = {},
): Promise<MastodonStatus> {
  const doFetch = options.fetchImpl ?? fetch;
  const paths = cachePaths(options.cacheDir);

  try {
    const response = await doFetch(
      `${config.instanceUrl}/api/v1/statuses/${id}`,
    );
    if (!response.ok)
      throw new Error(`Mastodon API returned ${response.status}`);
    return mastodonStatusSchema.parse(await response.json());
  } catch (error) {
    const cached = await readJsonCache<MastodonStatus[]>(paths.statusesFull);
    const match = cached?.find((status) => status.id === id);
    if (match) return mastodonStatusSchema.parse(match);
    throw error;
  }
}

/**
 * Fetches an account's statuses and applies {@link isEligibleStreamStatus},
 * returning only the statuses eligible for the stream.
 */
export async function listEligibleStatuses(
  config: StreamConfig,
  account: MastodonAccount,
  options: { limit?: number; cacheDir?: string; fetchImpl?: typeof fetch } = {},
): Promise<MastodonStatus[]> {
  const statuses = await fetchMastodonStatuses(config, account, options);
  return statuses.filter((status) =>
    isEligibleStreamStatus(status, account.id),
  );
}

// MARK: Eligibility and normalisation

/**
 * Applies the stream's inclusion rules: original posts only (no boosts),
 * public/unlisted visibility, and either a top-level post or a reply to the
 * same account (a self-reply).
 */
export function isEligibleStreamStatus(
  status: MastodonStatus,
  accountId: string,
): boolean {
  if (status.reblog != null) return false;
  if (status.visibility !== 'public' && status.visibility !== 'unlisted')
    return false;
  if (status.in_reply_to_id == null) return true;
  return status.in_reply_to_account_id === accountId;
}

const SANITIZE_OPTIONS: sanitizeHtml.IOptions = {
  allowedAttributes: {
    a: ['href', 'rel', 'translate', 'class'],
    span: ['class'],
  },
  allowedSchemes: ['https', 'http', 'mailto'],
  allowedTags: [
    'p',
    'br',
    'a',
    'span',
    'strong',
    'em',
    'code',
    'pre',
    'ul',
    'ol',
    'li',
  ],
};

/** Sanitises a Mastodon status's HTML `content` for safe rendering. */
export function sanitizeStatusHtml(html: string): string {
  return sanitizeHtml(html, SANITIZE_OPTIONS);
}

/** Normalises a raw Mastodon status into the site-owned {@link StreamStatus} shape. */
export function normaliseStreamStatus(status: MastodonStatus): StreamStatus {
  return {
    contentHtml: sanitizeStatusHtml(status.content),
    counts: {
      boosts: status.reblogs_count,
      favourites: status.favourites_count,
      replies: status.replies_count,
    },
    createdAt: status.created_at,
    id: status.id,
    inReplyToId: status.in_reply_to_id ?? null,
    media: status.media_attachments.map((attachment) => ({
      description: attachment.description ?? null,
      previewUrl: attachment.preview_url ?? null,
      type: attachment.type,
      url: attachment.url ?? null,
    })),
    sensitive: status.sensitive,
    spoilerText: status.spoiler_text,
    uri: status.uri,
    url: status.url ?? null,
  };
}

// MARK: HTML -> Markdown / promotion

const turndownService = new TurndownService({ headingStyle: 'atx' });

/** Converts sanitised status HTML into Markdown for a promoted blog post. */
export function statusHtmlToMarkdown(html: string): string {
  return turndownService.turndown(sanitizeStatusHtml(html)).trim();
}

export interface SuggestedPost {
  bodyMarkdown: string;
  origin: {
    type: 'mastodon';
    id: string;
    uri: string;
    url: string;
    account: string;
    published: string;
    imported: string;
  };
  media: StreamMedia[];
}

/** Converts a raw Mastodon status into the shape needed to draft a blog post. */
export function statusToSuggestedPost(
  status: MastodonStatus,
  accountHandle: string,
  now: Date = new Date(),
): SuggestedPost {
  return {
    bodyMarkdown: statusHtmlToMarkdown(status.content),
    media: status.media_attachments.map((attachment) => ({
      description: attachment.description ?? null,
      previewUrl: attachment.preview_url ?? null,
      type: attachment.type,
      url: attachment.url ?? null,
    })),
    origin: {
      account: accountHandle,
      id: status.id,
      imported: now.toISOString(),
      published: status.created_at,
      type: 'mastodon',
      uri: status.uri,
      url: status.url ?? status.uri,
    },
  };
}
