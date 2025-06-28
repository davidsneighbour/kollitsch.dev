import { getCollection, type CollectionEntry } from 'astro:content';
import { getHomepageUrl } from '@utils/getHomepageUrl';

type CollectionName = 'blog' | 'pages';
type Entry = CollectionEntry<CollectionName>;

export interface BreadcrumbItem {
  label: string;
  href: string; // absolute URL
}

export async function getBreadcrumbs(
  pathname: string,
  skipIndex?: number,
): Promise<BreadcrumbItem[]> {
  const homepage = getHomepageUrl().replace(/\/+$/, '');
  const segments = pathname.replace(/\/+$/, '').split('/').filter(Boolean);

  const breadcrumbs: BreadcrumbItem[] = [
    {
      label: 'Home',
      href: `${homepage}/`,
    },
  ];

  let currentPath = '';
  const allCollections = await getAllCollectionEntries();

  for (let i = 0; i < segments.length; i++) {
    const segment = segments[i];
    if (!segment) {
      throw new Error(`Unexpected undefined segment at index ${i}`);
    }

    if (i === skipIndex) {
      currentPath += `/${segment}`;
      continue;
    }

    currentPath += `/${segment}`;
    const href = `${homepage}${currentPath}/`;

    let label = segment.toUpperCase();

    const match = allCollections.find(entry => {
      const entryPath = `/${entry.id}`.replace(/\/+$/, '');
      return entryPath === currentPath;
    });

    if (match?.data?.title && typeof match.data.title === 'string') {
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

async function getAllCollectionEntries(): Promise<Entry[]> {
  const collections: CollectionName[] = ['blog', 'pages'];
  const allEntries = await Promise.all(
    collections.map(name => getCollection(name)),
  );
  return allEntries.flat();
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
        position: index + 1,
        name: crumb.label,
        ...(isLast ? {} : { item: crumb.href }),
      };
    }),
  };
}
