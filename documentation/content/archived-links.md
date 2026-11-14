---
title: Archived links
tags: []
created: 2026-11-14T00:00:00+07:00
updated: 2026-11-14T00:00:00+07:00
---

When an external page is gone for reasons outside the site's control, a post can link to an Internet Archive snapshot of that page instead. The site marks these links automatically, so readers know before they click that the link opens an archived copy.

## Authoring

Write a normal Markdown link to the snapshot URL. Do not add attributes, components, or frontmatter options:

```markdown
[It's possible to just replace it](https://web.archive.org/web/20230926190851/https://www.gearrice.com/update/removing-google-assistant-from-the-nest-mini-to-replace-it-with-chatgpt-is-possible/)
```

Use the `https://web.archive.org/web/<timestamp>/<original-url>` form. Pick the snapshot closest to the post's publication date that shows the content the post refers to. The timestamp must contain at least the day (`YYYYMMDD`) for the tooltip to show the capture date.

Use archived links only for pages that are really gone (404, dead domain, origin down, redirect loop). For pages that block only the link checker, follow the checker-blocked workflow in `.agents/skills/kdev-postreview/resources/link-review.md`. For links that should keep their original URL, use the broken-link markers described in `src/components/content/links/README.md`.

## Rendering

`rehypeArchiveLinks` (`src/utils/rehype-archive-links.ts`) runs in the Markdown processor configured in `astro.config.ts`, so it applies to `.md` and `.mdx` content. For every link to a snapshot URL, it:

- adds the Internet Archive icon (`simple-icons:internetarchive`) after the link text, inside the link, so the icon adds no extra focus stop;
- keeps the icon on the same line as the last word of the link text;
- shows a tooltip on hover and keyboard focus, for example "Archived copy from 26 September 2023 via the Internet Archive. The original page is no longer available." With CSS anchor positioning, the tooltip shifts sideways to stay inside the reading column; `ReadingArea.astro` is `relative` so that the column is the tooltip's containing block. Older browsers show the tooltip centred above the icon;
- appends screen-reader text such as "(archived copy from 26 September 2023)" to the link's accessible name;
- sets `data-archive-link`, `data-archive-original`, and `data-archive-date` on the link.

The icon path data is read from the installed `simple-icons-astro` package at build time, so it stays in step with the registered icon.

`cover.title` captions are rendered with `markdown-it` outside the Markdown processor. `resolveCover` in `src/utils/cover.ts` passes them through `decorateArchiveLinksInHtml`, so archive links in captions get the same marker.

URL parsing and the marker markup live in `src/utils/archive-links.pure.ts`, which has no Node or Astro dependencies and is unit-tested in `archive-links.pure.test.ts`.

## Maintenance

When a link review replaces a URL with a snapshot, set `maintenance.brokenLinksReviewed` in the post's frontmatter, as for every other link fix. Lychee checks snapshot URLs like any other external URL.
