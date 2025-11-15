import { defineCollection, z } from 'astro:content';
// for youtube playlist loader
import { youTubeLoader } from '@ascorbic/youtube-loader';
import setup from '@data/setup.json' with { type: 'json' };
import { buildOptionsSchema } from '@utils/schema.ts';
import { youtubePlayerParamsSchema } from '@utils/youtube.ts';

import { file, glob } from 'astro/loaders';
// for github releases loader
import { githubReleasesLoader } from 'astro-loader-github-releases';
import MarkdownIt from 'markdown-it';

// This could be used to infer the type of post.data in merged collections
export type PostData = z.infer<typeof blogSchema>;

/**
 * Explicitly typed paths: override default (string) with custom type.
 */
export const explicitOptionTypes = {
  'head.components': z.array(
    z.enum(['lite-youtube', 'color-grid', 'date-diff']),
  ),
} as const;

export const optionsSchema = buildOptionsSchema(explicitOptionTypes);
export type OptionsData = z.infer<typeof optionsSchema>;

const md = new MarkdownIt();

const cover = z
  .object({
    format: z
      .object({
        contenttype: z
          .enum(['jpg', 'png', 'gif', 'svg', 'webp'])
          .optional()
          .default('jpg'),
        quality: z.number().min(1).max(100).optional().default(75),
      })
      .optional(),
    src: z.string().optional(),
    title: z.string().optional(),
    type: z.enum(['image', 'video']).optional().default('image'),
    unsplash: z
      .string()
      .regex(/^[A-Za-z0-9]{11}$/, {
        message:
          'cover.unsplash must be exactly 11 characters: letters (a-z, A-Z) or digits (0-9) only.',
      })
      .optional(),
    // Optional alt (Markdown allowed). Validation below enforces:
    // - only with type === "image"
    // - only if title is set
    // - must differ from title
    alt: z.string().optional(),
    video: z
      .object({
        artist: z.string().optional(),
        title: z.string(),
        youtube: z.string(),
        params: youtubePlayerParamsSchema.optional(),
      })
      .optional(),
  })
  // Require src when type is image
  .refine((c) => (c.type === 'image' ? c.src != null && c.src.trim().length > 0 : true), {
    message: 'cover.src is required when cover.type is "image"',
    path: ['src'],
  })
  // Require video metadata when type is video
  .refine((c) => (c.type === 'video' ? c.video != null : true), {
    message: 'video metadata must be provided when cover.type is "video"',
    path: ['video'],
  })
  // Unsplash only for images
  .refine((c) => (c.type === 'image' ? true : c.unsplash == null), {
    message: 'cover.unsplash is only allowed when cover.type is "image".',
    path: ['unsplash'],
  })
  // Alt/title/type relationship:
  // - alt only for images
  // - alt only allowed if title exists
  // - alt must differ from title
  .superRefine((c, ctx) => {
    const isImage = c.type !== 'video';
    const hasAlt = typeof c.alt === 'string' && c.alt.trim().length > 0;
    const hasTitle = typeof c.title === 'string' && c.title.trim().length > 0;

    if (!isImage && hasAlt) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'cover.alt is only allowed when cover.type is "image".',
        path: ['alt'],
      });
    }

    if (hasAlt && !hasTitle) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message:
          'cover.alt is only allowed when cover.title is set. Define a title or remove alt.',
        path: ['alt'],
      });
    }

    if (hasAlt && hasTitle) {
      const t = c.title!.trim();
      const a = c.alt!.trim();
      if (a === t) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'cover.alt must differ from cover.title.',
          path: ['alt'],
        });
      }
    }
  })
  .optional();

// MARK: Blog Posts
export const blogSchema = z
  .object({
    aliases: z
      .union([z.string(), z.array(z.string())])
      .optional()
      .transform((val) => (typeof val === 'string' ? [val] : val)),
    category: z.string().optional(),
    cover: cover,
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
    linktitle: z
      .string()
      .optional()
      .refine((val) => val?.trim() !== '', {
        message: '`linktitle` MUST NOT be empty if defined.',
      }),
    options: optionsSchema.optional(),
    publisher: z.enum(['rework', 'validate']).optional(),
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
              'Tags MUST only contain lowercase letters, numbers, dashes (-), or underscores (_).',
          }),
      )
      .optional(),
    title: z.string(),
  })
  .refine(
    (entry) => {
      if (!entry.linktitle) return true;
      return entry.linktitle !== entry.title;
    },
    {
      message: '`linktitle` MUST not be identical to `title`.',
      path: ['linktitle'],
    },
  )
  .refine(
    (entry) => {
      if (!entry.linktitle) return true;
      return entry.linktitle.length < entry.title.length;
    },
    {
      message: '`linktitle` MUST be shorter than `title`.',
      path: ['linktitle'],
    },
  )
  .transform((entry) => {
    const summaryRaw =
      entry.summary && entry.summary.trim() !== ''
        ? entry.summary
        : entry.description;

    // compute articleimage:
    const coverIsImage =
      entry.cover?.type !== 'video' && typeof entry.cover?.src === 'string';
    const articleimage: string | null =
      (coverIsImage ? (entry.cover?.src ?? null) : null) ??
      setup?.images?.default ??
      null;

    // render markdown for alt text if exists and valid for images
    const coverAlt =
      entry.cover?.alt && entry.cover?.type !== 'video'
        ? md.renderInline(entry.cover.alt)
        : undefined;

    return {
      ...entry,
      cover: entry.cover
        ? {
          ...entry.cover,
          alt: coverAlt ?? entry.cover.alt,
        }
        : entry.cover,
      articleimage,
      summary: md.renderInline(summaryRaw),
      title: md.renderInline(entry.title),
    };
  });
export type BlogFrontmatter = z.infer<typeof blogSchema>;

export const blog = defineCollection({
  loader: glob({ base: './src/content/blog', pattern: '**/*.{md,mdx}' }),
  schema: () => blogSchema,
});

// MARK: Tags
const idRegex = /^[a-z0-9_-]+$/;
export const tags = defineCollection({
  loader: glob({ base: './src/content/tags', pattern: '**/*.{md,mdx}' }),
  schema: z
    .object({
      aliases: z
        .array(z.string().transform((s) => s.toLowerCase().trim()))
        .optional(),
      class: z.string().optional(),
      cover: cover,
      description: z
        .string()
        .optional()
        .transform((val) => val?.trim() ?? undefined),
      featured: z.boolean().default(false).optional(),
      icon: z.string().optional(),
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
        cover: data.cover,
        label: linktitle,
        linktitle,
      };
    }),
});

// MARK: YouTube Playlists
const youtubeApiKey = import.meta.env.YOUTUBE_API_KEY;
const hasYoutubeApiKey =
  typeof youtubeApiKey === 'string' && youtubeApiKey.trim().length > 0;

const playlistCollections = hasYoutubeApiKey
  ? Object.fromEntries(
    Object.entries(setup.playlists).map(([name, playlistId]) => [
      name,
      defineCollection({
        loader: youTubeLoader({
          apiKey: youtubeApiKey,
          fetchFullDetails: true,
          maxResults: 50,
          playlistId,
          type: 'playlist',
        }),
      }),
    ]),
  )
  : {};

// MARK: GitHub Releases
const oneYearAgo = new Date();
oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
const githubReleases = defineCollection({
  loader: githubReleasesLoader({
    mode: 'repoList',
    repos: [setup.repository.slug],
    sinceDate: oneYearAgo.toISOString().split('T')[0],
  }),
});

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

// MARK: Export Collections
export const collections = {
  blog,
  tags,
  ...playlistCollections,
  githubReleases,
  social,
};
