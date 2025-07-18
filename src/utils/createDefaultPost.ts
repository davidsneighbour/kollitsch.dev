import type { z } from 'astro:content';
import { blogSchema } from '../content.config.js';

type BlogPost = z.infer<typeof blogSchema>;

/**
 * Create a fully valid BlogPost object with defaults,
 * even if the input is missing or malformed.
 *
 * @param input - Partial or unknown input to normalize
 * @returns Valid BlogPost object based on schema
 */
export function createDefaultPost(input: unknown = {}): BlogPost {
  const fallback: Partial<z.input<typeof blogSchema>> = {
    aliases: [],
    cover: undefined,
    date: new Date(),
    description: 'No description available.',
    draft: false,
    featured: false,
    fmContentType: undefined,
    options: {
      head: {
        components: [],
      },
    },
    resources: [],
    summary: '',
    tags: [],
    title: 'Untitled Post',
  };

  const safeInput =
    input && typeof input === 'object' && !Array.isArray(input)
      ? { ...fallback, ...input }
      : fallback;

  const parsed = blogSchema.safeParse(safeInput);
  if (parsed.success) {
    return parsed.data;
  }

  console.warn(
    '✖ Blog post input invalid. Using fallback defaults.',
    parsed.error.format(),
  );
  return blogSchema.parse(fallback);
}
