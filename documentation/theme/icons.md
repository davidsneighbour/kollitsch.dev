---
title: Icons
tags: []
created: 2026-06-14T00:00:00+07:00
updated: 2026-06-14T00:00:00+07:00
---

All icons are rendered through `astro-icon`, which provides a single `<Icon>` component backed by multiple icon sets. Never write inline SVG; always use the component.

## Icon sets

| Set | Prefix | Use for | Source |
| --- | --- | --- | --- |
| Local Bootstrap Icons | none | Existing nav and UI icons; do not add new files here | `src/icons/` |
| Simple Icons | `simple-icons:` | Brand and logo icons | [simpleicons.org](https://simpleicons.org) |
| Lucide | `lucide:` | General UI icons | [lucide.dev](https://lucide.dev) |
| Font Awesome 7 Brands | `fa7-brands:` | Legacy brand icons; prefer Simple Icons for new work | — |

## Usage

### Standalone icon

```astro
---
import { Icon } from 'astro-icon/components';
---

<Icon name="lucide:rss" class="size-[1em]" aria-hidden="true" />
<Icon name="simple-icons:github" class="size-5" aria-hidden="true" />
```

### Icon inside a link or button

Use `IconLink`. Never compose `<Icon>` + `<a>` by hand:

```astro
---
import IconLink from '@components/shared/links/IconLink.astro';
---

<IconLink icon="lucide:rss" href="/rss.xml">
  RSS feed
</IconLink>

<IconLink icon="simple-icons:github" href="https://github.com/example">
  GitHub
</IconLink>
```

See `src/components/shared/links/IconLink.astro` for the full Props reference.

## Sizing

Always add an explicit size class so the icon scales with the surrounding font size rather than relying on the SVG `width`/`height` presentation attributes:

```astro
<Icon name="lucide:search" class="size-[1em]" />   <!-- matches text size exactly -->
<Icon name="simple-icons:npm" class="size-5" />    <!-- fixed 20 px -->
```

For navigation icons, `size-[1em]` is the standard choice (see `NavItem.astro`).

## Inline SVG replacement

When you encounter an existing inline `<svg>` element, look up the equivalent icon:

1. Identify whether it is a brand/logo or a UI icon.
2. Search [simpleicons.org](https://simpleicons.org) for brands or [lucide.dev](https://lucide.dev) for UI icons.
3. Replace the `<svg>` with `<Icon name="prefix:icon-name" class="size-[1em]" />`.
4. If no equivalent exists in either set, check the local `src/icons/` Bootstrap Icons before adding a new file.

## Choosing the right set

| Scenario | Icon set |
| --- | --- |
| GitHub, npm, X, LinkedIn, YouTube, etc. | `simple-icons:` |
| RSS, search, menu, close, chevron, etc. | `lucide:` |
| Icons already used in existing navigation | local `src/icons/` (Bootstrap Icons) |
| New navigation or UI additions | `lucide:` |
