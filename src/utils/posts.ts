// src/utils/paginateByYear.ts

import { getCollection } from 'astro:content';
import type { CollectionEntry } from 'astro:content';

export interface PaginatedPosts {
  posts: CollectionEntry<'blog'>[];
  totalPages: number;
}

/**
 * Returns sorted, paginated blog posts for a given year.
 *
 * @param year - The 4-digit year string (e.g. "2025")
 * @param page - Page number, 1-based
 * @param pageSize - Items per page
 */
export async function paginateBlogPostsByYear(
  year: string,
  page: number,
  pageSize: number,
): Promise<PaginatedPosts> {
  const allPosts = await getCollection('blog');

  const postsOfYear = allPosts
    .filter((post) => new Date(post.data.date).getFullYear().toString() === year)
    .sort((a, b) => new Date(b.data.date).getTime() - new Date(a.data.date).getTime());

  const totalPages = Math.ceil(postsOfYear.length / pageSize);
  const start = (page - 1) * pageSize;
  const end = start + pageSize;

  return {
    posts: postsOfYear.slice(start, end),
    totalPages,
  };
}
