import { defineCollection, z } from 'astro:content';

// const debugPassthrough = process.env.DEBUG_FRONTMATTER === 'true';
const debugPassthrough = true;

const blog = defineCollection({
  type: 'content',
  schema: (ctx) =>
    z
      .object({
        title: z.string(),
        description: z.string().optional(),
        date: z
          .string()
          .or(z.date())
          .transform((value) => new Date(value)),
        tags: z.array(z.string()).optional(),
        draft: z.boolean().optional().default(false),
      })
      .passthrough()
      .superRefine((data) => {
        if (!debugPassthrough) return;

        console.log(ctx);

        const knownKeys = ['title', 'description', 'date', 'tags', 'draft'];
        const unknown = Object.keys(data).filter((key) => !knownKeys.includes(key));

        if (unknown.length > 0) {
          // filePath is not available, so we just log 'unknown file'
          console.log(
            `[frontmatter] "${data.title}" has unknown keys: ${unknown.join(', ')}`
          );
        }
      }),
});

export const collections = { blog };
