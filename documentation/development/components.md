---
title: Component development
tags: []
created: 2026-09-16T00:00:00+07:00
updated: 2026-09-16T00:00:00+07:00
---

Components under `src/components/` follow a small set of repository-wide authoring rules so the rendered HTML stays stable, shallow, and documented.

## Placement

Before adding, moving, or renaming a component, read [`src/components/README.md`](../../src/components/README.md). Place new components in the folder whose documented responsibility matches the component. If a new top-level or notable nested folder is necessary, update the README in the same change.

Generated shadcn/ui components are not kept in a staging folder. Generate them with `npx shadcn@latest add <name>`, move the generated file into the folder that matches its real responsibility, fix imports, keep the generated lowercase filename such as `button.tsx`, and review the result against [`DESIGN.md`](../../DESIGN.md) before using it.

## Props contract

Every `.astro` component under `src/components/` exports a named `Props` type or interface, even when it accepts no props:

```astro
export interface Props {}
```

The unit test suite checks this contract for every component. Run `npm test` after creating or editing components.

## Documentation mirror

Every new or meaningfully changed component has a matching documentation file under `documentation/components/`, with a path that mirrors the source path under `src/components/`. For example, `src/components/layout/header/theme/ThemeSelector.astro` documents to `documentation/components/layout/header/theme/theme-selector.md`.

Move the documentation file in the same change as a component move. If a generated lowercase shadcn component and a hand-written Astro component would both map to the same kebab-case documentation filename, suffix the generated component's documentation file with `-shadcn`, for example `button-shadcn.md`.

Component documentation uses this section order:

1. Opening paragraph.
2. `## File locations`.
3. `## Props`.
4. `## Usage`.
5. `## Behaviour`.
6. `## Extending`, only when useful.

## DOM shape

Astro templates do not need a single root element. Do not add wrapper elements only to satisfy JSX habits. Use sibling top-level markup, `Fragment`, or `<>...</>` when grouping is needed without outputting another element.

Keep wrappers that provide layout, styling, semantics, ids, ARIA attributes, script hooks, or CSS selectors. Before removing a wrapper, grep for its id, class, and data attributes across `.astro`, `.css`, and `.ts` files.

## Stable ids

Use stable, human-readable ids for singleton server-rendered components. Do not use `createIdentifier()`, `generateUniqueHtmlId()`, `Math.random()`, or another per-render random value unless a component can legitimately render more than once on the same page and the ids must not collide.

Stable ids keep unchanged builds byte-stable, which avoids unnecessary Pagefind churn, Wrangler uploads, and cache invalidation.

## Icons

Render icons through `astro-icon/components`. Do not write inline SVG in components. Use `IconLink` from `@components/shared/links/IconLink.astro` when a link or button contains an icon. See [Icons](../theme/icons.md) for icon set selection and sizing.

## Inline scripts

When a component script uses `define:vars`, add `is:inline` explicitly:

```astro
<script is:inline define:vars={{ value }}>
```

For keyboard shortcuts, use `tinykeys` and store the unsubscribe function. In Astro components with view transitions, unsubscribe on `astro:before-swap` and register again on `astro:page-load`. The current registered project shortcut is `Shift+A` for restoring the hidden dev breakpoint bar in `src/components/devtools/Breakpoints.astro`.
