// Server-only index of local images and optional generated metadata.
// Do not import from browser code or hydrated islands.

import type { ImageMetadata } from 'astro';

if (!import.meta.env.SSR) {
  throw new Error('image-index.ts must not run in the browser bundle.');
}

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

function loadLocalImages(): Map<string, IndexedImage> {
  const generatedByPath = loadGeneratedIndex();

  const modules = {
    ...import.meta.glob<{ default: ImageMetadata }>(
      '/src/content/**/*.{png,jpg,jpeg,webp,avif,gif}',
      {
        eager: true,
      },
    ),
    ...import.meta.glob<{ default: ImageMetadata }>(
      '/src/assets/images/**/*.{png,jpg,jpeg,webp,avif,gif}',
      {
        eager: true,
      },
    ),
  } as Record<string, { default: ImageMetadata }>;

  const images = new Map<string, IndexedImage>();
  for (const [key, mod] of Object.entries(modules)) {
    const filename = key.split('/').pop() ?? key;
    const record = generatedByPath.get(key);
    images.set(
      key,
      Object.freeze({
        filename,
        key,
        meta: mod.default,
        ...(record ? { record } : {}),
      } satisfies IndexedImage),
    );
  }

  if (import.meta.env.DEV) {
    console.debug(`[image-index] Indexed ${images.size} images.`);
  }

  return images;
}

const imagesByKey = loadLocalImages();
let sortedImagesCache: readonly IndexedImage[] | null = null;

export function getIndexedImage(key: string): IndexedImage | undefined {
  return imagesByKey.get(key);
}

export function hasImage(key: string): boolean {
  return imagesByKey.has(key);
}

export function getImageMeta(key: string): ImageMetadata | undefined {
  return imagesByKey.get(key)?.meta;
}

export function listIndexedImages(): readonly IndexedImage[] {
  if (!sortedImagesCache) {
    sortedImagesCache = Object.freeze(
      Array.from(imagesByKey.values()).sort((a, b) =>
        a.key.localeCompare(b.key),
      ),
    );
  }

  return sortedImagesCache;
}
