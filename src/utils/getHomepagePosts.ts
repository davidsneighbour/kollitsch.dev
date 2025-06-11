import { getCollection } from 'astro:content';
import type { CollectionEntry } from 'astro:content';
import siteinfo from '@data/site.json';

const POST_LIMIT = siteinfo.homepage?.recent_posts ?? 6;

/**
 * Load and return the featured post and recent posts for homepage display.
 *
 * - `featuredPost` is guaranteed to be a single post (never undefined)
 * - `recentPosts` is always an array (can be empty if only one post exists)
 */
export async function getHomepagePosts(): Promise<{
  featuredPost: CollectionEntry<'blog'>;
  recentPosts: CollectionEntry<'blog'>[];
}> {
  const allPosts = await getCollection('blog', ({ data }) => !data.draft);

  if (allPosts.length === 0) {
    throw new Error('[getHomepagePosts] No published blog posts available.');
  }

  const sorted = allPosts.sort(
    (a, b) => new Date(b.data.date).getTime() - new Date(a.data.date).getTime(),
  );

  // Extract featured post first (if any)
  const maybeFeatured = sorted.find((post) => post.data.featured === true);
  const fallback = sorted[0];

  // Guarantee a featuredPost by assigning fallback explicitly
  // @ts-ignore - we KNOW this will result in a single valid post (because the content exists)
  const featuredPost: CollectionEntry<'blog'> = maybeFeatured ?? fallback;

  // Filter out the featured post from recent list
  const recentPosts: CollectionEntry<'blog'>[] = sorted
    .filter((post) => post.id !== featuredPost.id)
    .slice(0, POST_LIMIT);

  return {
    featuredPost,
    recentPosts,
  };
}
