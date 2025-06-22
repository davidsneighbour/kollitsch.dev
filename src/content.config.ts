import { defineCollection, z } from 'astro:content';
import { file, glob } from 'astro/loaders';

// Reusable options schema
export const allowedComponents = [
  'lite-youtube',
  'color-grid',
  'date-diff',
] as const;
const optionsSchema = z.object({
  head: z.object({
    components: z.array(z.enum(allowedComponents)),
  }),
});

export const blogSchema = z
  .object({
    aliases: z
      .union([z.string(), z.array(z.string())])
      .optional()
      .transform((val) => (typeof val === 'string' ? [val] : val)),
    cover: z
      .union([
        z.string(),
        z.object({
          src: z.string(),
          title: z.string().optional(),
        }),
      ])
      .optional(),
    date: z.coerce.date().transform((s) => new Date(s)),
    description: z
      .string()
      .transform((str) => str.trim())
      .refine((str) => str.length > 0, {
        message: 'The `description` frontmatter MUST NOT be empty.',
      }),
    draft: z.boolean().default(false).optional(),
    featured: z.boolean().default(false).optional(),
    fmContentType: z.string().optional(),
    lastModified: z.coerce
      .date()
      .transform((s) => new Date(s))
      .optional(),
    options: optionsSchema.optional(),
    resources: z
      .array(
        z.object({
          name: z.string().optional(),
          src: z.string().optional(),
          title: z.string().optional(),
        }),
      )
      .optional(),
    summary: z.string().optional(),
    tags: z
      .array(
        z
          .string()
          .transform((tag) =>
            tag
              .trim()
              .replace(/^['"]+|['"]+$/g, '')
              .toLowerCase(),
          )
          .refine((tag) => /^[a-z0-9_-]+$/.test(tag), {
            message:
              'Tags must only contain lowercase letters, numbers, dashes (-), or underscores (_).',
          }),
      )
      .optional(),
    title: z.string(),
  })
  .transform((entry) => ({
    ...entry,
    cover:
      typeof entry.cover === 'string'
        ? { src: entry.cover, title: entry.title }
        : entry.cover,
    summary:
      entry.summary && entry.summary.trim() !== ''
        ? entry.summary
        : entry.description,
  }));

// @todo blog post schema validation
export const blog = defineCollection({
  loader: glob({ base: './src/content/blog', pattern: '**/*.md' }),
  schema: () => blogSchema,
});

// content for tags
// @todo clean up and add proper schema validation
export const tags = defineCollection({
  loader: file('./src/content/tags.json', {
    parser: (text) => JSON.parse(text),
  }),
  schema: z.object({
    class: z.string(),
    description: z.string(),
    icon: z.string(),
    id: z.string(),
    image: z.string(),
    label: z.string(),
  }),
});

// @todo create a schema for slash
export const slash = defineCollection({
  loader: glob({ base: './src/content/slash', pattern: '**/*.md' }),
  schema: () => blogSchema,
});

export const collections = { blog, slash, tags };
