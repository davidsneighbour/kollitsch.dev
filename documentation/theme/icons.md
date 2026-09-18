---
title: Icons
tags: []
created: 2026-06-14T00:00:00+07:00
updated: 2026-09-18T00:00:00+07:00
---

All icons are rendered through `@components/shared/elements/Icon.astro`, backed by a small hand-maintained registry in `src/utils/icon-names.ts`. Never write inline SVG; always use the component.

## Icon sets

| Set | Prefix | Use for | Source |
| --- | --- | --- | --- |
| Lucide | `lucide:` | All UI icons | [lucide.dev](https://lucide.dev), via `@lucide/astro` |
| Simple Icons | `simple-icons:` | Brand and logo icons | [simpleicons.org](https://simpleicons.org), via `simple-icons-astro` |
| Local | `local:` | Extreme cases only — a brand mark neither set can provide (for example a mark Simple Icons removed under legal pressure) | `src/components/icons/local/` |

Every `IconName` is a hand-picked entry — there is no auto-generated list of every Lucide or Simple Icons icon. Add an icon to `src/utils/icon-names.ts` only when it's actually used somewhere in the site. See `src/components/icons/local/README.md` for when and how to add a local icon.

## Usage

### Standalone icon

```astro
---
import Icon from '@components/shared/elements/Icon.astro';
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
3. Add it to `src/utils/icon-names.ts` if it isn't already registered, then replace the `<svg>` with `<Icon name="prefix:icon-name" class="size-[1em]" />`.
4. If no equivalent exists in either set (for example a mark Simple Icons has removed), see `src/components/icons/local/README.md`.

## Choosing the right set

| Scenario | Icon set |
| --- | --- |
| GitHub, npm, X, Mastodon, etc. | `simple-icons:` |
| RSS, search, menu, close, chevron, etc. | `lucide:` |
| A brand mark Simple Icons can't ship (legal takedown) | `local:` — file an issue and add a local icon |

## Content-driven icon names

Some icon names come from JSON or frontmatter (`src/content/social.json`, `src/data/*navigation.json`, tag `badge.icon.name`) rather than a literal string in a component. Those values are plain strings at the content layer and are narrowed to `IconName` with a cast at the single point where they're rendered (see `ShareSeparator.astro`). Keep those content values in sync with the registry in `src/utils/icon-names.ts` — an unregistered name throws at render time.
