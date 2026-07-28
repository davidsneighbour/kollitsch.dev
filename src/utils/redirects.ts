import path from 'node:path';
import matter from 'gray-matter';

export type RedirectTarget =
  | string
  | {
      destination: string;
      status?: number;
    };

export type RedirectMap = Record<string, RedirectTarget>;

export interface BlogAliasEntry {
  aliases?: unknown;
  filePath: string;
}

const BLOG_ROUTE_PREFIX = '/blog';

function formatRoutePath(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) {
    throw new Error('Alias redirects require non-empty paths.');
  }

  if (
    trimmed.startsWith('//') ||
    /^[a-z][a-z0-9+.-]*:\/\//i.test(trimmed) ||
    /[?#]/.test(trimmed)
  ) {
    throw new Error(
      `Alias redirects only support local pathname aliases: ${trimmed}`,
    );
  }

  const normalized = path.posix.normalize(
    trimmed.startsWith('/') ? trimmed : `/${trimmed}`,
  );
  const rooted =
    normalized === '/' ? normalized : normalized.replace(/\/+$/g, '');

  return rooted === '/' ? rooted : `${rooted}/`;
}

function normalizeAliasList(aliases: unknown, filePath: string): string[] {
  if (aliases == null) return [];

  if (typeof aliases === 'string') return [aliases];

  if (
    Array.isArray(aliases) &&
    aliases.every((alias) => typeof alias === 'string')
  ) {
    return aliases;
  }

  throw new Error(
    `Invalid aliases frontmatter in ${filePath}: expected a string or string array.`,
  );
}

function assertRelativeAlias(alias: string, filePath: string): void {
  const segments = alias.split('/').filter(Boolean);
  if (segments.some((segment) => segment === '.' || segment === '..')) {
    throw new Error(
      `Invalid relative alias in ${filePath}: dot segments are not supported (${alias}).`,
    );
  }
}

export function getBlogRouteFromFilePath(
  filePath: string,
  blogContentRoot: string,
): string {
  const relativePath = path
    .relative(blogContentRoot, filePath)
    .replace(/\\/g, '/')
    .replace(/\.(md|mdx)$/i, '');

  const entryId = relativePath.endsWith('/index')
    ? relativePath.slice(0, -'/index'.length)
    : relativePath;

  return formatRoutePath(`${BLOG_ROUTE_PREFIX}/${entryId}`);
}

export function resolveBlogAliasPath(
  alias: string,
  targetRoute: string,
): string {
  const trimmed = alias.trim();
  if (!trimmed) {
    throw new Error(
      `Invalid alias for ${targetRoute}: aliases must not be empty.`,
    );
  }

  if (trimmed.startsWith('//') || /^[a-z][a-z0-9+.-]*:\/\//i.test(trimmed)) {
    throw new Error(
      `Alias redirects only support local pathname aliases: ${trimmed}`,
    );
  }

  if (trimmed.startsWith('/')) return formatRoutePath(trimmed);

  assertRelativeAlias(trimmed, targetRoute);

  const targetWithoutTrailingSlash = targetRoute.replace(/\/+$/g, '');
  const routeFolder = path.posix.dirname(targetWithoutTrailingSlash);

  return formatRoutePath(path.posix.join(routeFolder, trimmed));
}

export function collectBlogAliasRedirects(
  entries: readonly BlogAliasEntry[],
  blogContentRoot: string,
): RedirectMap {
  const redirects: RedirectMap = {};

  for (const entry of entries) {
    const targetRoute = getBlogRouteFromFilePath(
      entry.filePath,
      blogContentRoot,
    );

    for (const alias of normalizeAliasList(entry.aliases, entry.filePath)) {
      const aliasPath = resolveBlogAliasPath(alias, targetRoute);

      if (aliasPath === targetRoute) {
        throw new Error(
          `Alias redirect in ${entry.filePath} resolves to its canonical route: ${aliasPath}`,
        );
      }

      if (Object.hasOwn(redirects, aliasPath)) {
        throw new Error(`Duplicate generated alias redirect for ${aliasPath}`);
      }

      redirects[aliasPath] = targetRoute;
    }
  }

  return redirects;
}

export function mergeRedirects(
  existingRedirects: RedirectMap,
  generatedRedirects: RedirectMap,
): RedirectMap {
  const merged = { ...existingRedirects };

  for (const [from, to] of Object.entries(generatedRedirects)) {
    if (Object.hasOwn(merged, from)) {
      throw new Error(
        `Generated alias redirect conflicts with existing redirect: ${from}`,
      );
    }

    merged[from] = to;
  }

  return merged;
}

export function collectBlogAliasRedirectsFromFiles(
  filePaths: readonly string[],
  blogContentRoot: string,
): RedirectMap {
  const entries = filePaths.map((filePath) => ({
    aliases: matter.read(filePath).data['aliases'],
    filePath,
  }));

  return collectBlogAliasRedirects(entries, blogContentRoot);
}
