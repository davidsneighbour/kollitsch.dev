import { defineCollection, z } from 'astro:content';
// for youtube playlist loader
import { youTubeLoader } from '@ascorbic/youtube-loader';
import setup from '@data/setup.json' with { type: 'json' };
import { buildOptionsSchema } from '@utils/schema.ts';

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

// MARK: Blog Posts
export const blogSchema = z
  .object({
    aliases: z
      .union([z.string(), z.array(z.string())])
      .optional()
      .transform((val) => (typeof val === 'string' ? [val] : val)),
    category: z.string().optional(),
    cover: z
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
        src: z.string(),
        title: z.string().optional(),
        type: z.enum(['image', 'video']).optional().default('image'),
        video: z
          .object({
            artist: z.string().optional(),
            title: z.string(),
            youtube: z.string(),
          })
          .optional(),
      })
      .refine((c) => (c.type === 'video' ? c.video != null : true), {
        message: 'video metadata must be provided when cover.type is "video"',
        path: ['video'],
      })
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

    return {
      ...entry,
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
  loader: file('./src/content/tags.json', {
    parser: (text) => JSON.parse(text),
  }),
  schema: z.object({
    // aliases map to this id — always lowercase
    aliases: z
      .array(z.string().transform((s) => s.toLowerCase().trim()))
      .optional(),
    class: z.string().optional(),
    description: z.string().optional(),
    featured: z.boolean().default(false).optional(),
    icon: z.string().optional(),
    // canonical id used in URLs
    id: z
      .string()
      .transform((s) => s.toLowerCase().trim())
      .refine((s) => idRegex.test(s), {
        message: `Tag id must match ${idRegex}`,
      }),
    image: z.string().optional(),
    // human label shown in UI (may contain symbols and casing)
    label: z.string(),
    weight: z.number().optional().default(0),
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
