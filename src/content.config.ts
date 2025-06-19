import { defineCollection, z } from 'astro:content';
import { file, glob } from 'astro/loaders';

// Reusable options schema
export const allowedComponents = ['lite-youtube'] as const;
const optionsSchema = z.object({
  head: z.object({
    components: z.array(z.enum(allowedComponents)),
  }),
});

export const blogSchema = z
  .object({
    title: z.string(),
    description: z
      .string()
      .transform(str => str.trim())
      .refine(str => str.length > 0, {
        message: 'The `description` frontmatter MUST NOT be empty.',
      }),
    summary: z.string().optional(),
    date: z.coerce.date().transform(s => new Date(s)),
    tags: z.array(z.string()).optional(),
    draft: z.boolean().default(false).optional(),
    featured: z.boolean().default(false).optional(),
    cover: z
      .union([
        z.string(),
        z.object({
          src: z.string(),
          title: z.string().optional(),
        }),
      ])
      .optional(),
    fmContentType: z.string().optional(),
    aliases: z
      .union([z.string(), z.array(z.string())])
      .optional()
      .transform(val => (typeof val === 'string' ? [val] : val)),
    resources: z
      .array(
        z.object({
          src: z.string().optional(),
          title: z.string().optional(),
          name: z.string().optional(),
        }),
      )
      .optional(),
    options: optionsSchema.optional(),
  })
  .transform(entry => ({
    ...entry,
    summary:
      entry.summary && entry.summary.trim() !== ''
        ? entry.summary
        : entry.description,
    cover:
      typeof entry.cover === 'string'
        ? { src: entry.cover, title: entry.title }
        : entry.cover,
  }));

// @todo blog post schema validation
export const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: () => blogSchema,
});

// content for tags
// @todo clean up and add proper schema validation
export const tags = defineCollection({
  loader: file('./src/content/tags.json', {
    parser: (text) => JSON.parse(text),
  }),
  schema: z.object({
    id: z.string(),
    label: z.string(),
    description: z.string(),
    image: z.string(),
    icon: z.string(),
    class: z.string(),
  }),
});

// @todo create a schema for slash
export const slash = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/slash' }),
  schema: () => blogSchema,
});

export const collections = { blog, tags, slash };
