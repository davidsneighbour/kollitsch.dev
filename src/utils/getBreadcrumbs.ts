import { getCollection } from 'astro:content';
import { getHomepageUrl } from '@utils/getHomepageUrl';

export interface BreadcrumbItem {
  label: string;
  href: string;
}

/**
 * Breadcrumb generation based on blog entry filePath.
 *
 * This assumes all breadcrumb paths are inside the `blog` collection.
 * If you later add other content types (e.g. `til`, `projects`),
 * update the `allEntries` collection merge.
 *
 * See full discussion:
 * https://chatgpt.com/share/687f920a-cd4c-8009-a98d-334e90075fc0
 */
export async function getBreadcrumbs(
  filePath: string,
  skipIndex = 0,
): Promise<BreadcrumbItem[]> {
  const homepage = getHomepageUrl().replace(/\/+$/, '');

  // Normalize and strip to relevant path
  const normalizedPath = filePath
    .replace(/\\/g, '/') // Windows compatibility
    .replace(/^.*\/(pages|content)\//, '') // strip up to pages/content
    .replace(/index\.(md|mdx)$/, '') // remove trailing index file
    .replace(/\.(md|mdx)$/, '') // remove .md if not index
    .replace(/\/+/g, '/'); // normalize slashes

  const segments = normalizedPath.split('/').filter(Boolean);

  const breadcrumbs: BreadcrumbItem[] = [
    { href: `${homepage}/`, label: 'Home' },
  ];

  const allEntries = await getCollection('blog');
  let currentPath = '';

  for (let i = skipIndex; i < segments.length; i++) {
    const segment = segments[i];
    currentPath += `/${segment}`;

    // Try to match with an entry title
    const match = allEntries.find((entry) => {
      const entryPath = `/${entry.id}`.replace(/\/+$/, '');
      return entryPath === currentPath;
    });

    const label = match?.data?.title
      ? match.data.title
      : // @ts-expect-error
        segment
          .split('-')
          .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
          .join(' ');

    breadcrumbs.push({
      href: `${homepage}${currentPath}/`,
      label,
    });
  }

  return breadcrumbs;
}

export function toBreadcrumbSchema(breadcrumbs: BreadcrumbItem[]): {
  itemListElement: {
    '@type': 'ListItem';
    position: number;
    name: string;
    item?: string;
  }[];
} {
  return {
    itemListElement: breadcrumbs.map((crumb, index) => {
      const isLast = index === breadcrumbs.length - 1;
      return {
        '@type': 'ListItem',
        name: crumb.label,
        position: index + 1,
        ...(isLast ? {} : { item: crumb.href }),
      };
    }),
  };
}
