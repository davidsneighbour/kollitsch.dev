// Server-only index of local images and optional generated metadata.
// Do not import from browser code or hydrated islands.

import type { ImageMetadata } from 'astro';
import { createLogger } from './logger.ts';

if (!import.meta.env.SSR) {
  throw new Error('image-index.ts must not run in the browser bundle.');
}

const log = createLogger({ slug: 'image-index' });

export interface GeneratedImageRecord {
  readonly alt?: string;
  readonly author?: string;
  readonly caption?: string;
  readonly derivedTags: readonly string[];
  readonly dir: string;
  readonly filename: string;
  readonly format: string;
  readonly height: number;
  readonly id: string;
  readonly lqipDataUri: string;
  readonly relPath: string;
  readonly source?: string;
  readonly tags?: readonly string[];
  readonly title?: string;
  readonly width: number;
}

interface GeneratedIndexFile {
  readonly createdAt: string;
  readonly files: Record<string, GeneratedImageRecord>;
  readonly source: {
    readonly frontmatterDbPath: string | null;
    readonly imagesDir: string;
    readonly metaJsonPath: string | null;
  };
}

export interface IndexedImage {
  readonly key: string;
  readonly filename: string;
  readonly meta: ImageMetadata;
  readonly record?: GeneratedImageRecord;
}

type ImageModuleLoader = () => Promise<{ default: ImageMetadata }>;

function ensureLeadingSlash(path: string): string {
  return path.startsWith('/') ? path : `/${path}`;
}

function toUrlPath(path: string): string {
  return ensureLeadingSlash(path.replace(/\\/g, '/'));
}

function normalizeGeneratedKey(
  relPath: string,
  projectRootUrl: string,
  imagesDir: string,
): string {
  const normalized = ensureLeadingSlash(relPath);
  const rootPrefix = projectRootUrl.endsWith('/')
    ? projectRootUrl.slice(0, -1)
    : projectRootUrl;

  if (normalized.startsWith(rootPrefix)) {
    const sliced = normalized.slice(rootPrefix.length);
    return sliced.length ? ensureLeadingSlash(sliced) : '/';
  }

  const imagesDirUrl = ensureLeadingSlash(imagesDir.replace(/\\/g, '/'));
  const index = normalized.lastIndexOf(imagesDirUrl);
  if (index >= 0) {
    const sliced = normalized.slice(index);
    return sliced.length ? ensureLeadingSlash(sliced) : imagesDirUrl;
  }

  return normalized;
}

function loadGeneratedIndex(): Map<string, GeneratedImageRecord> {
  const mods = import.meta.glob('/src/content/_generated/image-index.json', {
    eager: true,
    import: 'default',
  }) as Record<string, GeneratedIndexFile>;

  const record = Object.values(mods)[0];
  if (!record) return new Map();

  const projectRootUrl = toUrlPath(process.cwd());

  const entries = Object.values(record.files).map<
    [string, GeneratedImageRecord]
  >((data) => [
    normalizeGeneratedKey(
      data.relPath,
      projectRootUrl,
      record.source.imagesDir,
    ),
    data,
  ]);
  return new Map(entries);
}

const generatedByPath = loadGeneratedIndex();

function loadImageModules(): Map<string, ImageModuleLoader> {
  const modules = {
    ...import.meta.glob<{ default: ImageMetadata }>(
      '/src/content/**/*.{png,jpg,jpeg,webp,avif,gif}',
    ),
    ...import.meta.glob<{ default: ImageMetadata }>(
      '/src/assets/images/**/*.{png,jpg,jpeg,webp,avif,gif}',
    ),
  } as Record<string, ImageModuleLoader>;

  return new Map(Object.entries(modules));
}

const imageLoadersByKey = loadImageModules();
const loadedImagesByKey = new Map<string, IndexedImage>();

async function loadIndexedImage(
  key: string,
): Promise<IndexedImage | undefined> {
  const cached = loadedImagesByKey.get(key);
  if (cached) return cached;

  const loader = imageLoadersByKey.get(key);
  if (!loader) return undefined;

  const mod = await loader();
  const filename = key.split('/').pop() ?? key;
  const record = generatedByPath.get(key);
  const image = Object.freeze({
    filename,
    key,
    meta: mod.default,
    ...(record ? { record } : {}),
  } satisfies IndexedImage);
  loadedImagesByKey.set(key, image);
  return image;
}

function listImageKeys(): readonly string[] {
  return Array.from(imageLoadersByKey.keys()).sort((a, b) =>
    a.localeCompare(b),
  );
}

async function loadLocalImages(): Promise<Map<string, IndexedImage>> {
  const images = new Map<string, IndexedImage>();
  for (const key of listImageKeys()) {
    const image = await loadIndexedImage(key);
    if (!image) continue;
    const filename = key.split('/').pop() ?? key;
    images.set(
      key,
      Object.freeze({
        filename,
        key,
        meta: image.meta,
        ...(image.record ? { record: image.record } : {}),
      } satisfies IndexedImage),
    );
  }

  if (import.meta.env.DEV) {
    log.debug(`[image-index] Indexed ${images.size} images.`);
  }

  return images;
}

let sortedImagesCache: readonly IndexedImage[] | null = null;

export async function getIndexedImage(
  key: string,
): Promise<IndexedImage | undefined> {
  return loadIndexedImage(key);
}

export function hasImage(key: string): boolean {
  return imageLoadersByKey.has(key);
}

export async function getImageMeta(
  key: string,
): Promise<ImageMetadata | undefined> {
  return (await loadIndexedImage(key))?.meta;
}

export async function listIndexedImages(): Promise<readonly IndexedImage[]> {
  if (!sortedImagesCache) {
    const imagesByKey = await loadLocalImages();
    sortedImagesCache = Object.freeze(
      Array.from(imagesByKey.values()).sort((a, b) =>
        a.key.localeCompare(b.key),
      ),
    );
  }

  return sortedImagesCache;
}
