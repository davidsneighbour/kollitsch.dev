---
title: Icons
tags: []
created: 2026-06-14T00:00:00+07:00
updated: 2026-11-14T00:00:00+07:00
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

Some icon names come from content or data instead of a literal string in a component. Each source is checked against the registry before any page renders:

| Source | Checked by | Fails at |
| --- | --- | --- |
| Tag frontmatter `icon` and `badge.icon` (`src/content/tags/`) | `tagSchema` in `src/content.config.ts` | `astro sync`, `astro check`, `astro build` |
| Blog frontmatter `sourcecode.*.icon` | `blogCollectionSchema` in `src/content.config.ts` | `astro sync`, `astro check`, `astro build` |
| `social.networks[].icon` in `src/data/setup.json` | `src/data/social.test.ts` | `npm test` |
| `src/data/topnavigation.json`, `src/data/footernavigation.json` | `src/utils/navigation.test.ts` | `npm test` |

The error names the icon and the registry, for example: `Unknown icon name "lucide:notebook-pen". Register it in src/utils/icon-names.ts`. To fix it, import the component in `src/utils/icon-names.ts` and add it to the map for its set. The schemas use `isIconName()` from the registry. `blogSchema` in `src/content/blog-schema.ts` stays free of the registry, because Node scripts import it and cannot load `.astro` components, so the check for blog posts lives in `blogCollectionSchema`.

After validation, these values are still plain strings in TypeScript. They are narrowed to `IconName` with a cast at the point where they are rendered (see `ShareSeparator.astro` and `SourceCode.astro`).

## Why the registry stays

GitHub issue #2050 reviewed whether the registry can go. Decision: keep it, keep it small, and validate content against it. Reasons:

- Icons render on the server into inline SVG. The registry has no effect on client JavaScript or on the size of the deployed pages. Its only costs were the manual registration step and errors that appeared only at render time. The validation above removes the second cost.
- Literal names in components are checked by the `IconName` union at `astro check`, so a typo fails before the build. A catch-all type such as `` `lucide:${string}` `` would lose that check.
- Names from content and data need a string-to-component map. Resolving any name dynamically would make the build compile the full sets (2056 Lucide files and 3358 Simple Icons files at the time of the review) instead of the icons in use. This cost was estimated, not measured.
- A generated registry would need a scanner over components, JSON data, and frontmatter, and a generated file in the commit flow. That is more machinery than a list of about 70 icons that changes a few times a year needs.
- All registered icons were in use at the time of the review, so the registry could not be made smaller.

Components with a fixed icon may still import an icon component directly from `@lucide/astro` or `simple-icons-astro` in special cases, but the default remains `<Icon name="..." />` and `<IconLink>`, so every icon goes through one API.
