import { type DataEntryMap, getCollection } from 'astro:content';

/**
 * Generate breadcrumb objects from a given URL path.
 *
 * @param path - A full pathname (e.g. "/blog/2024/article/")
 * @returns An array of breadcrumb items with `url` and `title`
 */
export async function getBreadcrumbs(
  path: string,
): Promise<{ url: string; title: string }[]> {
  const breadcrumbs: { url: string; title: string }[] = [];

  const segments = path.replace(/^\/+|\/+$/g, '').split('/');

  breadcrumbs.push({ url: '/', title: 'Home' });

  for (let i = 0; i < segments.length; i++) {
    // weird hack to skip the year segment in blog URLs
    if (i === 1 && segments[i - 1] === 'blog') continue;

    const subSegments = segments.slice(0, i + 1);
    const url = '/' + subSegments.join('/') + '/';

    const title =
      (await resolveTitle(url)) ?? titleCase(subSegments.at(-1) || '');

    breadcrumbs.push({ url, title });
  }

  return breadcrumbs;
}

// --- Internal cache
const titleCache = new Map<string, string>();

/**
 * Try to resolve the page title from discovered Astro collections.
 * Uses in-memory cache to avoid redundant lookups.
 */
async function resolveTitle(url: string): Promise<string | null> {
  if (titleCache.has(url)) return titleCache.get(url)!;

  const collections = await discoverCollections();

  for (const name of collections as (keyof DataEntryMap)[]) {
    const entries = await getCollection(name);
    const entry = entries.find((e) => `/${name}/${e.id}/` === url);
    // Some collections use 'title', others use 'label' as the display name
    let resolvedTitle: string | undefined;
    if (entry?.data && typeof entry.data === 'object') {
      if ('title' in entry.data && typeof entry.data.title === 'string') {
        resolvedTitle = entry.data.title;
      } else if ('label' in entry.data && typeof entry.data.label === 'string') {
        resolvedTitle = entry.data.label;
      }
    }
    if (resolvedTitle) {
      titleCache.set(url, resolvedTitle);
      return resolvedTitle;
    }
  }

  titleCache.set(url, '');
  return '';
}

/**
 * Discovers all content collections by inspecting folder structure under src/content/.
 */
async function discoverCollections(): Promise<string[]> {
  const collectionFiles = import.meta.glob('/src/content/*/config.ts', {
    eager: true,
  });
  return Object.keys(collectionFiles)
    .map((path) => path.match(/\/src\/content\/([^/]+)\//)?.[1])
    .filter(Boolean) as string[];
}

function titleCase(slug: string): string {
  return slug
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());
}
