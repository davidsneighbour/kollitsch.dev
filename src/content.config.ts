import { defineCollection, z } from 'astro:content';
import { file, glob } from 'astro/loaders';

export const blogSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  summary: z.string().optional(),
  date: z.coerce.date().transform((s) => new Date(s)),
  tags: z.array(z.string()).optional(),
  draft: z.boolean().default(false).optional(),
  featured: z.boolean().default(false).optional(),
  cover: z.string().optional(),
  fmContentType: z.string().optional(),
  aliases: z
    .union([z.string(), z.array(z.string())])
    .optional()
    .transform((val) => (typeof val === 'string' ? [val] : val)),
  resources: z
    .array(
      z.object({
        src: z.string().optional(),
        title: z.string().optional(),
        name: z.string().optional(),
      }),
    )
    .optional(),
});

export const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: () => blogSchema,
});

// @todo create a schema for tags
export const tags = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/tags' }),
  schema: () => blogSchema,
});

// @todo create a schema for slash
export const slash = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/slash' }),
  schema: () => blogSchema,
});

export const collections = { blog, tags, slash };

// import { defineCollection, z, type SchemaContext } from "astro:content";

// export const imageSchema = ({ image }: SchemaContext) =>
//     z.object({
//         image: image(),
//         description: z.string().optional(),
//     });

// const blog = defineCollection({
//   loader: /* ... */,
//   schema: ({ image }) => z.object({
//     title: z.string(),
//     permalink: z.string().optional(),
//     image: imageSchema({ image })
//   }),
// });
