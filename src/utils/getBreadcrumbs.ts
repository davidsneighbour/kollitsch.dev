import { getCollection, type CollectionEntry } from 'astro:content';

/**
 * Represents a single breadcrumb item
 */
export interface BreadcrumbItem {
  label: string;
  href: string;
}

/**
 * Creates a breadcrumb trail based on a given URL path using Astro content collections.
 *
 * @param pathname - The current path (e.g., `/blog/posts/my-article`)
 * @returns Array of breadcrumb items
 *
 * @example
 * const breadcrumbs = await getBreadcrumbs('/blog/posts/my-article');
 * // [
 * //   { label: 'Blog', href: '/blog/' },
 * //   { label: 'Posts', href: '/blog/posts/' },
 * //   { label: 'My Article', href: '/blog/posts/my-article/' }
 * // ]
 */
export async function getBreadcrumbs(
  pathname: string,
): Promise<BreadcrumbItem[]> {
  const segments = pathname
    .replace(/\/+$/, '') // Remove trailing slashes
    .split('/')
    .filter(Boolean); // Remove empty segments

  const breadcrumbs: BreadcrumbItem[] = [];
  let currentPath = '';

  // Preload all entries once
  const allCollections = await getAllCollectionEntries();

  for (const segment of segments) {
    currentPath += `/${segment}`;
    const href = `${currentPath}/`;

    // Default label fallback
    let label = segment.toUpperCase();

    // Match against all known slugs
    const match = allCollections.find(entry => {
      // @ts-ignore
      const entryPath = `/${entry.slug}`.replace(/\/+$/, '');
      return entryPath === currentPath;
    });

    // @ts-ignore
    if (match?.data?.title) {
      // @ts-ignore
      label = match.data.title;
    } else {
      label = segment
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    }

    breadcrumbs.push({ label, href });
  }

  return breadcrumbs;
}

/**
 * Loads all content entries from all known collections.
 * Extend this list manually if you add more collections.
 *
 * @todo find out how we type our content collections without re-iterating
 */
// @ts-expect-error
async function getAllCollectionEntries(): Promise<CollectionEntry<string>[]> {
  const collections = ['blog', 'pages'];
  const allEntries = await Promise.all(
    // @ts-expect-error
    collections.map(name => getCollection(name)),
  );
  // @ts-expect-error
  return allEntries.flat();
}
