import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';

import { file, glob } from 'astro/loaders';
// for github releases loader
// https://github.com/lin-stephanie/astro-loaders/tree/main/packages/astro-loader-github-releases
// import { githubReleasesLoader } from 'astro-loader-github-releases';

import {
  blogSchema,
  cover,
  deriveContentFormat,
  explicitOptionTypes,
  optionsSchema,
  plainTextViolation,
  type OptionsData,
  type PostData,
} from './content/blog-schema.ts';

// Re-exported so existing importers (content.config.test.ts, utils/content.ts,
// utils/cover.ts, scripts/maintenance/export-schema.ts) don't need to change.
// The schema itself lives in `./content/blog-schema.ts` because it must stay
// free of `astro:content`/`astro/loaders` imports - see that file's header
// comment for why.
export { blogSchema, explicitOptionTypes, optionsSchema };
export type { OptionsData, PostData };
export type BlogFrontmatter = PostData;

const blogLoader = glob({ base: './src/content/blog', pattern: '**/*.{md,mdx}' });

export const blog = defineCollection({
  loader: {
    ...blogLoader,
    async load(context) {
      const parseDataWithFormat: typeof context.parseData = async (options) => {
        const contentFormat = deriveContentFormat(options.filePath);
        const dataWithFormat = {
          ...options.data,
          contentFormat,
        };

        return context.parseData({ ...options, data: dataWithFormat });
      };

      return blogLoader.load({ ...context, parseData: parseDataWithFormat });
    },
  },
  schema: () => blogSchema,
});

// MARK: Tags
const idRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const classList = z
  .union([z.string(), z.array(z.string())])
  .optional()
  .transform((value) => {
    if (!value) return undefined;
    const classes = Array.isArray(value) ? value : value.split(/\s+/);
    const normalized = classes
      .map((item) => item.trim())
      .filter((item) => item.length > 0)
      .join(' ');
    return normalized.length > 0 ? normalized : undefined;
  });
const tagIconName = z
  .string()
  .transform((value) => value.trim())
  .refine((value) => value.length > 0, {
    message: '`icon` name MUST NOT be empty.',
  });
const tagIconPosition = z
  .enum(['inline-start', 'inline-end'])
  .default('inline-start');
const tagIcon = z
  .union([
    tagIconName,
    z.object({
      name: tagIconName,
      color: z.string().transform((value) => value.trim()).optional(),
      position: tagIconPosition.optional(),
    }),
  ])
  .optional()
  .transform((value) => {
    if (!value) return undefined;
    if (typeof value === 'string') return { name: value };
    return {
      name: value.name,
      ...(value.color ? { color: value.color } : {}),
      position: value.position ?? 'inline-start',
    };
  });
const tagBadge = z
  .object({
    class: classList,
    icon: tagIcon,
    variant: z
      .enum([
        'default',
        'secondary',
        'destructive',
        'outline',
        'ghost',
        'link',
        'green',
        'gray',
        'red',
      ])
      .default('default')
      .optional(),
  })
  .optional();
export const tags = defineCollection({
  loader: glob({ base: './src/content/tags', pattern: '**/*.{md,mdx}' }),
  schema: z
    .object({
      aliases: z
        .array(z.string().transform((s) => s.toLowerCase().trim()))
        .optional(),
      badge: tagBadge,
      class: z.string().optional(),
      cover: cover,
      description: z
        .string()
        .optional()
        .transform((val) => val?.trim() ?? undefined),
      featured: z.boolean().default(false).optional(),
      hideInTagCloud: z.boolean().default(false).optional(),
      icon: tagIcon,
      id: z
        .string()
        .transform((s) => s.toLowerCase().trim())
        .refine((s) => idRegex.test(s), {
          message: `Tag id must match ${idRegex}`,
        }),
      linktitle: z
        .string()
        .optional()
        .transform((val) => val?.trim())
        .refine((val) => (val ? val.length > 0 : true), {
          message: '`linktitle` MUST NOT be empty if defined.',
        })
        .refine((val) => !val || !plainTextViolation.test(val), {
          message: '`linktitle` MUST be plain text only, no HTML or Markdown syntax.',
        }),
      title: z.string().transform((val) => val.trim()),
      weight: z.number().optional().default(0),
    })
    .transform((data) => {
      const linktitle = data.linktitle && data.linktitle.length > 0
        ? data.linktitle
        : data.title;

      return {
        ...data,
        badge: data.badge,
        cover: data.cover,
        label: linktitle,
        linktitle,
      };
    }),
});

// MARK: GitHub Releases
// const oneYearAgo = new Date();
// oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
// const githubReleases = defineCollection({
//   loader: githubReleasesLoader({
//     mode: 'repoList',
//     repos: [setup.repository.slug],
//     sinceDate: oneYearAgo.toISOString().split('T')[0],
//   }),
// });

// MARK: Social Media Links
export const social = defineCollection({
  loader: file('./src/content/social.json', {
    parser: (text) => JSON.parse(text),
  }),
  schema: z.object({
    fill: z.string().optional(),
    icon: z.string(),
    id: z.string(),
    label: z.string(),
    share: z.string().optional(),
    url: z.string().optional(),
  }),
});


// MARK: Markdown Pages
export const pages = defineCollection({
  loader: glob({ base: './src/pages', pattern: '**/*.{md,mdx}' }),
  schema: z
    .object({
      layout: z
        .string()
        .transform((value) => value.trim())
        .refine((value) => value.length > 0, {
          message: '`layout` frontmatter is required for Markdown pages under `src/pages`.',
        }),
    }),
});

// MARK: Export Collections
export const collections = {
  blog,
  tags,
  // githubReleases,
  social,
  pages,
};
