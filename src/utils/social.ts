// Usage:
//   import { mergeSocial } from '@utils/mergeSocial';
//   const merged = await mergeSocial();
//   // or with options:
//   const merged = await mergeSocial({ dataPath: 'src/data/social.json', contentPath: 'src/content/social.json', strict: false });

/**

import { mergeSocial } from '@utils/mergeSocial';

async function main(): Promise<void> {
  try {
    const social = await mergeSocial({
      // optional:
      // dataPath: 'src/data/social.json',
      // contentPath: 'src/content/social.json',
      strict: false,
    });

    // social['mastodon'], social['github'], ...
    console.log(Object.keys(social));
  } catch (e) {
    console.error(e);
    process.exitCode = 1;
  }
}

main().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});


 */

import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { createLogger } from './logger.ts';

const log = createLogger({ slug: 'social' });

type JsonObject = Record<string, unknown>;

/** Base item coming from data/social.json */
export interface DataSocialItem {
  id: string;
  icon: string;
  label: string;
  share?: string;
  [key: string]: unknown;
}

/** Content item coming from content/social.json (may add/override fields) */
export interface ContentSocialItem {
  id: string;
  icon?: string;
  label?: string;
  share?: string;
  [key: string]: unknown;
}

/** Result item: data item with content overrides applied */
export type MergedSocialItem = DataSocialItem & ContentSocialItem;

/** Final return shape keyed by ID. */
export type SocialMap = Record<string, MergedSocialItem>;

export interface MergeSocialOptions {
  /** Path to data/social.json (base). Default: "src/data/social.json" */
  dataPath?: string;
  /** Path to content/social.json (overrides). Default: "src/content/social.json" */
  contentPath?: string;
  /**
   * If true, throw when content contains an ID not present in data.
   * If false (default), include such content-only items as-is and log a warning via console.warn.
   */
  strict?: boolean;
  /** Optional custom loader to inject arrays directly (bypasses filesystem). For testing or custom pipelines. */
  loaders?: {
    loadData?: () => Promise<readonly DataSocialItem[]>;
    loadContent?: () => Promise<readonly ContentSocialItem[]>;
  };
}

/**
 * Read and parse JSON file safely.
 * Runtime validation happens elsewhere; this is a typed loader.
 * @template T
 * @param {string} filePath Absolute or relative path.
 * @returns {Promise<T>}
 * @throws Error when file read or JSON parsing fails.
 */
async function readJsonFile<T>(filePath: string): Promise<T> {
  const abs = resolve(filePath);
  let raw: string;
  try {
    raw = await readFile(abs, 'utf8');
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    throw new Error(`Failed to read JSON file at ${abs}: ${msg}`);
  }

  try {
    const parsed = JSON.parse(raw) as unknown as T;
    return parsed;
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    throw new Error(`Invalid JSON in ${abs}: ${msg}`);
  }
}

/**
 * Minimal runtime validation for arrays and required fields.
 * Throws with a useful message if invalid.
 * @param {unknown} items
 * @param {string} hint
 * @throws Error when validation fails
 */
function validateDataItems(
  items: unknown,
  hint: string,
): asserts items is readonly DataSocialItem[] {
  if (!Array.isArray(items)) {
    throw new Error(`${hint} must be an array`);
  }
  for (const it of items) {
    if (typeof it !== 'object' || it === null)
      throw new Error(`${hint} contains a non-object item`);
    const id = (it as JsonObject).id;
    if (typeof id !== 'string' || id.trim() === '')
      throw new Error(`${hint} item has invalid 'id'`);
    const icon = (it as JsonObject).icon;
    if (typeof icon !== 'string' || icon.trim() === '')
      throw new Error(`${hint} item '${id}' has invalid 'icon'`);
    const label = (it as JsonObject).label;
    if (typeof label !== 'string' || label.trim() === '')
      throw new Error(`${hint} item '${id}' has invalid 'label'`);
  }
}

/**
 * Minimal runtime validation for content items.
 * @param {unknown} items
 * @param {string} hint
 * @throws Error when validation fails
 */
function validateContentItems(
  items: unknown,
  hint: string,
): asserts items is readonly ContentSocialItem[] {
  if (!Array.isArray(items)) {
    throw new Error(`${hint} must be an array`);
  }
  for (const it of items) {
    if (typeof it !== 'object' || it === null)
      throw new Error(`${hint} contains a non-object item`);
    const id = (it as JsonObject).id;
    if (typeof id !== 'string' || id.trim() === '')
      throw new Error(`${hint} item has invalid 'id'`);
  }
}

/**
 * Merge social definitions:
 * - Start with IDs from content/social.json (these define the whitelist).
 * - For each content ID, if a matching base item exists in data/social.json, shallow-merge { ...base, ...content }.
 * - If no base exists:
 *   - strict=true  -> throw error
 *   - strict=false -> include content as-is and console.warn once per missing ID.
 *
 * @returns {Promise<SocialMap>} Record keyed by ID, values are merged items.
 */
export async function mergeSocial(
  options: MergeSocialOptions = {},
): Promise<SocialMap> {
  const {
    dataPath = 'src/data/social.json',
    contentPath = 'src/content/social.json',
    strict = false,
    loaders,
  } = options;

  let dataItems: readonly DataSocialItem[];
  let contentItems: readonly ContentSocialItem[];

  try {
    if (loaders?.loadData) {
      dataItems = await loaders.loadData();
    } else {
      dataItems = await readJsonFile<readonly DataSocialItem[]>(dataPath);
    }
    validateDataItems(dataItems, 'data/social.json');
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    throw new Error(`Failed loading base data: ${msg}`);
  }

  try {
    if (loaders?.loadContent) {
      contentItems = await loaders.loadContent();
    } else {
      contentItems =
        await readJsonFile<readonly ContentSocialItem[]>(contentPath);
    }
    validateContentItems(contentItems, 'content/social.json');
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    throw new Error(`Failed loading content data: ${msg}`);
  }

  // Map base by id for quick lookup
  const baseById = new Map<string, DataSocialItem>();
  for (const b of dataItems) baseById.set(b.id, b);

  const out: SocialMap = {};
  for (const content of contentItems) {
    const base = baseById.get(content.id);
    if (!base) {
      if (strict) {
        throw new Error(
          `content/social.json references unknown id '${content.id}' not present in data/social.json`,
        );
      } else {
        log.warn(
          `[mergeSocial] content-only id '${content.id}' not found in data/social.json; including content as-is.`,
        );
        out[content.id] = { ...(content as MergedSocialItem) };
        continue;
      }
    }
    // Shallow merge: content overrides base
    out[content.id] = { ...base, ...content };
  }

  return out;
}

/**
 * Convert a SocialMap to an array of merged items.
 * @param {SocialMap} map
 * @returns {MergedSocialItem[]}
 */
export function toArray(map: SocialMap): MergedSocialItem[] {
  return Object.values(map);
}
