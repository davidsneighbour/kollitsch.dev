import { blogSchema } from 'src/content.config.js';
import type { z } from 'astro:content';

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
    title: 'Untitled Post',
    description: 'No description available.',
    date: new Date(),
    tags: [],
    draft: false,
    featured: false,
    cover: undefined,
    fmContentType: undefined,
    aliases: [],
    resources: [],
    summary: '',
    options: {
      head: {
        components: [],
      },
    },
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
