import { z } from 'zod';

export const blogSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  summary: z.string().optional(),
  date: z.coerce.date().transform((s) => new Date(s)),
  tags: z.array(z.string()).optional(),
  draft: z.boolean().optional(),
  cover: z.string().optional(),
  fmContentType: z.string().optional(),
  aliases: z.array(z.string()).optional(),
  resources: z
    .array(
      z.object({
        src: z.string().optional(),
        title: z.string().optional(),
        name: z.string().optional(),
      })
    )
    .optional(),
});
