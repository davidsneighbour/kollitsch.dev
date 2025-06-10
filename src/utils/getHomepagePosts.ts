import { getCollection } from 'astro:content';
import type { CollectionEntry } from 'astro:content';
import siteinfo from '@data/site.json';

const POST_LIMIT = siteinfo.homepage?.recent_posts ?? 6;

/**
 * Load and return the featured post and recent posts for homepage display.
 */
export async function getHomepagePosts() {
  const allPosts = await getCollection('blog', ({ data }) => !data.draft);
  const sorted = allPosts.sort(
    (a, b) => new Date(b.data.date).getTime() - new Date(a.data.date).getTime(),
  );

  // 1. Try to find the featured post
  let featured: CollectionEntry<'blog'> | undefined = sorted.find(
    (post) => post.data.featured === true,
  );

  // 2. Fallback to latest post
  if (!featured) {
    featured = sorted[0];
  }

  // 3. Remove the featured post from recent list
  const recentPosts = sorted
    .filter((post) => post.id !== featured?.id)
    .slice(0, POST_LIMIT);

  return {
    featuredPost: featured,
    recentPosts,
  };
}
