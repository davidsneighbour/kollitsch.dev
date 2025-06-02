import { defineCollection, z } from 'astro:content';

export const blog = defineCollection({
  // schema: ({ image }) =>
  schema: () =>
    z.object({
      title: z.string(),
      description: z.string().optional(),
      summary: z.string().optional(),
      date: z.string().transform(s => new Date(s)),
      tags: z.array(z.string()).optional(),
      draft: z.boolean().optional(),
      // cover: image().optional(),
      cover: z.string().optional(),
      fmContentType: z.string().optional(),
      resources: z
        .array(
          z.object({
            // src: image(),
            src: z.string().optional(),
            title: z.string().optional(),
            name: z.string().optional(),
          })
        )
        .optional(),
    }),
});

const thailand = defineCollection({
  loader: async () => {
    const response = await fetch('https://restcountries.com/v3.1/alpha/th');
    const data = await response.json();
    return Array.isArray(data)
      ? // biome-ignore lint/suspicious/noExplicitAny: <explanation>
        data.map((country: any) => ({
          id: country.cca3 || country.ccn3 || country.cioc || 'unknown',
          ...country,
        }))
      : [];
  },
});

export const collections = { blog, thailand };
