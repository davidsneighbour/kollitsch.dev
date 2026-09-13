---
title: Frontmatter
tags: []
created: 2026-07-28T00:00:00+07:00
updated: 2026-07-28T00:00:00+07:00
---

This page is the complete frontmatter index for Markdown and MDX content in
this repository. It lists every schema-supported frontmatter property, and also
records legacy keys that still appear in existing content files.

Use `src/content.config.ts` as the implementation source of truth. When a field
has a focused documentation page, this index links there instead of repeating
the full behaviour.

## Collections

| Collection | Source files | Schema status |
| --- | --- | --- |
| `blog` | `src/content/blog/**/*.md`, `src/content/blog/**/*.mdx` | Rich schema in `blogSchema` |
| `tags` | `src/content/tags/**/*.md`, `src/content/tags/**/*.mdx` | Tag metadata schema |
| `pages` | `src/pages/**/*.md`, `src/pages/**/*.mdx` | Requires `layout` only |

`social` is a JSON collection, not frontmatter, and is therefore excluded from
this page.

Documentation files under `documentation/` may carry local documentation
metadata (`title`, `tags`, `created`, `updated`). The lightweight documentation
server strips that frontmatter before rendering and derives sidebar titles from
Markdown headings or filenames.

## Blog Posts

| Property | Required | Type | Use |
| --- | --- | --- | --- |
| `aliases` | no | `string` or `string[]` | Local redirect aliases; see [Alias redirects](alias-redirects.md). |
| `category` | no | `string` | Optional category value kept on `post.data`. |
| `contentFormat` | generated | `md` or `mdx` | Injected by the blog loader from the file extension; do not set by hand. |
| `cover` | no | object | Cover image or video metadata; see [Article images](article-images.md). |
| `cover.alt` | no | `string` | Markdown-capable image alt text; only valid for image covers with `cover.title`. |
| `cover.format` | no | object | Image output settings. |
| `cover.format.contenttype` | no | `jpg`, `png`, `gif`, `svg`, or `webp` | Requested image content type; defaults to `jpg`. |
| `cover.format.quality` | no | `1`-`100` | Requested image quality; defaults to `75`. |
| `cover.src` | for image covers | `string` | Image path or key used by the cover pipeline. |
| `cover.title` | no | `string` | Cover title/caption source. |
| `cover.type` | no | `image` or `video` | Cover type; defaults to `image`. |
| `cover.unsplash` | no | `string` | Unsplash photo id; exactly 11 alphanumeric characters and image-only. |
| `cover.video` | for video covers | object | Video cover metadata. |
| `cover.video.artist` | no | `string` | Optional artist label for video covers. |
| `cover.video.hash` | no | `string` | Vimeo unlisted-video hash; see [Vimeo embeds](../components/content/media/vimeo.md). |
| `cover.video.params` | no | object | YouTube player parameters; see [YouTube embeds](../components/content/media/youtube.md). |
| `cover.video.startAt` | no | `string` | Vimeo start offset; see [Vimeo embeds](../components/content/media/vimeo.md). |
| `cover.video.title` | for video covers | `string` | Video title. |
| `cover.video.vimeo` | for Vimeo video covers | `string` | Numeric Vimeo video id. |
| `cover.video.youtube` | for YouTube video covers | `string` | YouTube video id or URL accepted by the YouTube helpers. |
| `date` | yes | date | Publication date. |
| `description` | yes | `string` | Required non-empty description, trimmed before use. |
| `draft` | no | `boolean` | Draft visibility flag; see [Draft post visibility](draft-status.md). |
| `featured` | no | `boolean` | Marks a post as eligible for featured-post selection. |
| `fmContentType` | yes | `article` or `blog` | Required Front Matter CMS content-type marker for blog posts; existing archive entries still use `blog`. |
| `headers` | no | record of strings | Per-post Netlify response headers; see [Headers](headers.md). |
| `lastModified` | no | date | Explicit last-modified date. |
| `linktitle` | no | `string` | Plain-text shorter link label; must differ from and be shorter than `title`. |
| `options` | no | nested object | Per-post rendering options; known keys are listed below. |
| `options.head.components` | no | `lite-youtube[]`, `date-diff[]` | Extra head components required by a post. |
| `publisher` | no | `rework` or `validate` | Internal publishing workflow state. |
| `resources` | no | object array | External resources with optional `name`, `src`, and `title`. |
| `resources[].name` | no | `string` | Resource name. |
| `resources[].src` | no | `string` | Resource URL or source path. |
| `resources[].title` | no | `string` | Resource title. |
| `sourcecode` | no | record | Source-code links; see [SourceCode](../components/content/sourcecode/source-code.md). |
| `sourcecode.*` | no | `string` or object | Either a direct source string or structured source metadata. |
| `sourcecode.*.class` | no | `string` | Optional presentation class for the source-code link. |
| `sourcecode.*.icon` | no | `string` | Optional icon name for the source-code link. |
| `sourcecode.*.label` | no | `string` | Optional display label for the source-code link. |
| `sourcecode.*.line` | no | `number` or `string` | Optional source line reference. |
| `sourcecode.*.source` | for object entries | `string` | Source URL or repository path. |
| `subtitle` | no | `string` | Optional Markdown-rendered subtitle. |
| `summary` | no | `string` | Optional Markdown-rendered summary; falls back to `description`. |
| `tags` | no | `string[]` | Post tags; see [Tags](tags.md). |
| `title` | yes | `string` | Markdown-rendered post title. |

## Tag Metadata

Tag metadata files describe canonical tags used by posts and the tag overview.
See [Tags](tags.md) for the full tag model, badge presentation metadata,
`hideInTagCloud`, featured tag cards, and overview search.

| Property | Required | Type | Use |
| --- | --- | --- | --- |
| `aliases` | no | `string[]` | Alternative lowercase ids that resolve to the canonical tag. |
| `badge` | no | object | Badge presentation metadata for tag links; see [Tags](tags.md). |
| `badge.class` | no | `string` or `string[]` | Extra Tailwind classes appended after the selected badge variant. |
| `badge.icon` | no | `string` or object | Icon rendered inside the badge. |
| `badge.icon.color` | no | `string` | Optional inline icon colour value. |
| `badge.icon.name` | for object icons | `string` | Icon name for `astro-icon/components`. |
| `badge.icon.position` | no | `inline-start` or `inline-end` | Icon position; defaults to `inline-start`. |
| `badge.variant` | no | `default`, `secondary`, `destructive`, `outline`, `ghost`, `link`, `green`, `gray`, or `red` | Shared badge variant; defaults to `default`. |
| `class` | no | `string` | Legacy top-level presentation class; do not use for new tag metadata. |
| `cover` | no | object | Same cover object used by blog posts. |
| `description` | no | `string` | Markdown-capable tag description. |
| `featured` | no | `boolean` | Makes the tag eligible for featured tag cards. |
| `hideInTagCloud` | no | `boolean` | Hides the tag from the default weighted cloud only; see [Tags](tags.md). |
| `icon` | no | `string` or object | Legacy top-level icon metadata; do not use for new tag metadata. |
| `icon.color` | no | `string` | Optional inline icon colour value for the legacy top-level icon. |
| `icon.name` | for object icons | `string` | Icon name for the legacy top-level icon. |
| `icon.position` | no | `inline-start` or `inline-end` | Icon position for the legacy top-level icon. |
| `id` | yes | `string` | Canonical lowercase kebab-case id matching `^[a-z0-9]+(?:-[a-z0-9]+)*$`. |
| `linktitle` | no | `string` | Plain-text tag link label; falls back to `title`. |
| `title` | yes | `string` | Full tag title. |
| `weight` | no | `number` | Featured-tag sort weight; defaults to `0`. |

## Markdown Pages

Markdown files under `src/pages/` are included in the `pages` collection. The
schema requires only `layout`; other keys may exist in older page files but are
not part of the current collection contract.

| Property | Required | Type | Use |
| --- | --- | --- | --- |
| `layout` | yes | `string` | Astro layout path for the Markdown page. |

## Legacy Keys Present In Content

The following keys appear in existing Markdown or MDX files but are not
schema-supported frontmatter for their current collection. Treat them as legacy
migration residue unless a future schema change explicitly adopts them.

| Collection | Keys |
| --- | --- |
| `blog` | `categories`, `images`, `lastmod`, `linkTitle`, `links`, `publishdate`, `unsplash` |
| `tags` | `draft` |
| `pages` | `aliases`, `build`, `config`, `cover`, `date`, `description`, `draft`, `lastmod`, `linkTitle`, `linktitle`, `menu`, `options`, `publishDate`, `publisher`, `resources`, `tags`, `theme`, `title`, `type`, `url` |
| `documentation` | `created`, `tags`, `title`, `updated` |

## Maintenance

When adding, removing, or changing a frontmatter field:

1. Update `src/content.config.ts`.
2. Update this page so the all-properties index stays complete.
3. Update the focused documentation page if the field has one.
4. Add or update tests when the field changes rendered behaviour.
