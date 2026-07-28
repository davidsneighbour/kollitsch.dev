---
title: Head
tags: []
created: 2026-07-27T00:00:00+07:00
updated: 2026-07-28T00:00:00+07:00
---

Assembles the full `<head>` contents for every page: charset, viewport, title,
canonical, feed and Markdown alternate links, robots and theme-colour meta,
Open Graph and Twitter tags, view transitions, favicons, static meta tags,
speculation rules, and the Matomo analytics bootstrap.

## File locations

| Field | Value |
| --- | --- |
| Component | `src/components/layout/head/Head.astro` |
| Data | [`src/data/setup.json`](../../../../src/data/setup.json) (title, description, head defaults, theme colours) |
| Tests | [`src/components/layout/head/Head.test.ts`](../../../../src/components/layout/head/Head.test.ts) |

## Props

<!-- markdownlint-disable MD013 -->

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `post` | `(MarkdownInstance<Record<string, unknown>> \| CollectionEntry<"blog">) & OpenGraphSource` | `undefined` | The current post/content entry, used to resolve title, description, draft status, and Open Graph payload |
| `frontmatter` | `Record<string, unknown>` | `undefined` | Raw page frontmatter, merged into the Open Graph resolution alongside `post` |

<!-- markdownlint-enable MD013 -->

## Usage

```astro
---
import Head from '@components/layout/head/Head.astro';
---

<head>
  <Head />
</head>
```

```astro
---
import Head from '@components/layout/head/Head.astro';

const { post } = Astro.props;
---

<head>
  <Head post={post} />
</head>
```

## Behaviour

- Normalises the incoming `post` prop into a safe object without mutating the
  original, then calls `resolveOpenGraphPayload` from
  [`src/utils/content.ts`](../../../../src/utils/content.ts) to derive the page
  title, description, draft status, and Open Graph payload.
- Builds a trailing-slash-enforced canonical URL from `Astro.url.pathname` and
  `Astro.site`, plus absolute RSS, Atom, and JSON feed URLs.
- Emits a `text/markdown` alternate link for blog posts that have a generated
  `.md` representation.
- Emits `robots` as `noindex, nofollow, noarchive` for draft content and
  `index, follow` otherwise.
- Emits a `<base>` tag only when `BASE_URL` is not `/`, to avoid breaking
  relative paths on the default deployment.
- Reads `themeColorLight` and `themeColorDark` from `setup.head`, falling back
  to `#ffffff` and `#000000`.
- Renders, in order: charset and viewport meta, `<title>`, optional `<base>`,
  canonical and feed `<link>` tags, robots/referrer/description/colour-scheme
  and theme-colour meta, [`FontsPreload`](fonts-preload.md),
  [`OpenGraph`](open-graph.md), Astro's `<ClientRouter />` (view transitions),
  [`Favicon`](favicon.md), [`Meta`](meta.md),
  [`SpeculationRules`](speculation-rules.md), a `generator` meta tag, and an
  inline Matomo analytics bootstrap script.
- The Matomo script defers `trackPageView` until the document is not
  `prerendering` (listening for `prerenderingchange` when it is), so speculative
  Chrome prerenders do not inflate analytics counts, and re-tracks on
  `astro:after-swap` for view-transition navigations.

## Extending

To add a new global `<head>` element, add it directly in `Head.astro` or extract
it into its own component under `src/components/layout/head/` and import it
here, following the pattern of [`FontsPreload`](fonts-preload.md) or
[`SpeculationRules`](speculation-rules.md).
