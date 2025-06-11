import { defineCollection, z } from 'astro:content';

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
  schema: () => blogSchema,
});

// @todo create a schema for tags
export const tags = defineCollection({
  schema: () => blogSchema,
});

// @todo create a schema for slash
export const slash = defineCollection({
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
