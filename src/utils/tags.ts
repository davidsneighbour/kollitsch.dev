// src/utils/tags.ts
import { getCollection } from 'astro:content';

export interface TagInfo {
  count: number;
  posts: Awaited<ReturnType<typeof getCollection>>; // filtered posts
}

export async function getValidTags(): Promise<Map<string, TagInfo>> {
  const blogPosts = await getCollection('blog');
  const tagMap = new Map<string, TagInfo>();

  for (const post of blogPosts) {
    const tags = post.data.tags || [];
    for (const tag of tags) {
      const entry = tagMap.get(tag) || { count: 0, posts: [] };
      entry.count += 1;
      entry.posts.push(post);
      tagMap.set(tag, entry);
    }
  }

  // Remove tags with < 2 posts
  for (const [tag, info] of tagMap.entries()) {
    if (info.count < 2) {
      tagMap.delete(tag);
    }
  }

  return tagMap;
}
