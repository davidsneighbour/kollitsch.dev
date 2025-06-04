import { defineCollection, z } from 'astro:content';
import { blogSchema } from '@schema/blog';

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

// const thailand = defineCollection({
//   loader: async () => {
//     const response = await fetch('https://restcountries.com/v3.1/alpha/th');
//     const data = await response.json();
//     return Array.isArray(data)
//       ? // biome-ignore lint/suspicious/noExplicitAny: <explanation>
//         data.map((country: any) => ({
//           id: country.cca3 || country.ccn3 || country.cioc || 'unknown',
//           ...country,
//         }))
//       : [];
//   },
// });

export const collections = { blog, tags, slash };
