import {
  getEntryBySlug,
  getCollection,
  type CollectionEntry,
} from 'astro:content';

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

  for (const segment of segments) {
    currentPath += `/${segment}`;

    const href = `${currentPath}/`; // Always end with a slash
    let label = segment.toUpperCase(); // fallback

    // Try to find a matching entry in any collection
    const allCollections = await getAllCollectionEntries();

    const match = allCollections.find(entry => {
      const entryPath = `/${entry.slug}`.replace(/\/+$/, '');
      return entryPath === currentPath;
    });

    if (match?.data?.title) {
      label = match.data.title;
    } else {
      // Fallback formatting (e.g., "blog-posts" → "Blog Posts")
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
 */
async function getAllCollectionEntries(): Promise<CollectionEntry<string>[]> {
  const collections = ['blog', 'pages', 'docs']; // Add your collections here
  const allEntries = await Promise.all(
    collections.map(name => getCollection(name)),
  );
  return allEntries.flat();
}
