import { defineCollection, z } from "astro:content";

export const blog = defineCollection({
  schema: z
    .object({
      title: z.string(),
      description: z.string().optional(),
      summary: z.string().optional(),
      date: z.string().transform((s) => new Date(s)),
      tags: z.array(z.string()).optional(),
      draft: z.boolean().optional(),
    })
});

export const collections = { blog };
