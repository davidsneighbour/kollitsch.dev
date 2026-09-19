/**
 * Pure candidate-path resolution for post cover images, independent of the
 * Astro/Vite runtime.
 *
 * `src/utils/opengraph.ts`'s `resolveImageKey` wraps this with an `exists()`
 * backed by the Vite-only image index (`hasImage()`), for use inside Astro
 * components. `build-og-images.ts` (a plain Node CLI script) calls this
 * directly with an `exists()` backed by `fs.existsSync`, since `hasImage()`
 * depends on `import.meta.glob` and is unavailable outside Vite.
 */

import path from 'node:path';

const toPosix = (p: string) => p.replace(/\\/g, '/');
const isRemoteUrl = (s: string) => /^https?:\/\//i.test(s);
const hasExt = (p: string) => /\.[a-z0-9]+$/i.test(p);

/**
 * Build '/src/content/<collection>/<dir-of-entry>'.
 * - '2025/slug' -> '/src/content/<collection>/2025/slug'
 * - '2025/slug/index' -> '/src/content/<collection>/2025/slug'
 * - '2025/slug.md' -> '/src/content/<collection>/2025'
 */
function contentDirFromId(entryId: string, collection: string): string {
  const base = '/src/content/' + collection;
  const rel = entryId.startsWith('/') ? entryId.slice(1) : entryId;
  const dir =
    hasExt(rel) || rel.endsWith('/index') ? path.posix.dirname(rel) : rel;
  return path.posix.join(base, dir === '.' ? '' : dir);
}

/**
 * Turn '/anything' into '/src/anything' when appropriate.
 * Remote URLs are passed through unchanged.
 */
function normalizeToProjectKey(
  p: string,
  { assumeUnderSrc = true } = {},
): string {
  if (isRemoteUrl(p)) return p;
  if (p.startsWith('/src/')) return toPosix(p);
  if (p.startsWith('/')) {
    return assumeUnderSrc
      ? toPosix(path.posix.join('/src', p.replace(/^\/+/, '')))
      : toPosix(p);
  }
  return toPosix(p);
}

export interface ResolveImageKeyCoreOptions {
  defaultKey?: string; // default from setup.images.opengraph
  assetsDir?: string; // '/src/assets/images'
  contentRoot?: string; // '/src/content'
}

export interface ResolveImageKeyCoreResult {
  /** The resolved key/URL, or '' when there was no imageName and no defaultKey. */
  resolved: string;
  /** Candidate keys tried, in order, before falling back (or matching). */
  tried: readonly string[];
  /** True when none of `tried` matched and `resolved` is the defaultKey fallback. */
  usedFallback: boolean;
}

/**
 * Resolve a post image name to either a local project key or a remote URL.
 * Order:
 * 1) Remote URL -> return
 * 2) '/src/...' -> return if indexed
 * 3) '/...' -> map to '/src/...' and return if indexed
 * 4) Beside entry directory
 * 5) Global assets directory
 * 6) Fallback (defaultKey)
 *
 * Never throws; always returns a result. Does not log — callers decide
 * whether/how to report fallback and dev-mode diagnostics.
 *
 * @param imageName Name from frontmatter (basename or path)
 * @param entryId Content entry id without extension or with (both supported)
 * @param collection Content collection name
 * @param exists Predicate reporting whether a resolved key exists as an image
 */
export function resolveImageKeyCore(
  imageName: string | undefined | null,
  entryId: string,
  collection: string,
  exists: (key: string) => boolean,
  {
    defaultKey = '',
    assetsDir = '/src/assets/images',
    contentRoot = '/src/content',
  }: ResolveImageKeyCoreOptions = {},
): ResolveImageKeyCoreResult {
  let candidate = (imageName ?? '').toString().trim();
  if (!candidate) candidate = defaultKey;
  if (!candidate) {
    return { resolved: '', tried: [], usedFallback: false };
  }

  const clean = candidate.replace(/^[.][/\\]/, ''); // strip leading './'
  const tried: string[] = [];

  if (isRemoteUrl(candidate)) {
    return { resolved: candidate, tried, usedFallback: false };
  }

  if (candidate.startsWith('/src/')) {
    tried.push(candidate);
    if (exists(candidate)) {
      return { resolved: candidate, tried, usedFallback: false };
    }
  }

  if (candidate.startsWith('/') && !candidate.startsWith('/src/')) {
    const mapped = toPosix(
      path.posix.join('/src', candidate.replace(/^\/+/, '')),
    );
    tried.push(mapped);
    if (exists(mapped)) {
      return { resolved: mapped, tried, usedFallback: false };
    }
  }

  const entryBase = contentDirFromId(entryId, collection).replace(
    /^\/src\/content/,
    contentRoot,
  );
  const localKey1 = toPosix(path.posix.join(entryBase, candidate));
  const localKey2 = toPosix(path.posix.join(entryBase, clean));
  tried.push(localKey1);
  if (exists(localKey1)) {
    return { resolved: localKey1, tried, usedFallback: false };
  }
  if (clean !== candidate) {
    tried.push(localKey2);
    if (exists(localKey2)) {
      return { resolved: localKey2, tried, usedFallback: false };
    }
  }

  const globalKey1 = toPosix(path.posix.join(assetsDir, candidate));
  const globalKey2 = toPosix(path.posix.join(assetsDir, clean));
  tried.push(globalKey1);
  if (exists(globalKey1)) {
    return { resolved: globalKey1, tried, usedFallback: false };
  }
  if (clean !== candidate) {
    tried.push(globalKey2);
    if (exists(globalKey2)) {
      return { resolved: globalKey2, tried, usedFallback: false };
    }
  }

  const fallback = normalizeToProjectKey(defaultKey);
  return { resolved: fallback, tried, usedFallback: true };
}
