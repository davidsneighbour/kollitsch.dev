---
applyTo: "src/components/**/*.astro,src/layouts/**/*.astro,src/pages/**/*.astro,src/utils/icon-names.ts"
---

# Icons

Icons render through `@components/shared/elements/Icon.astro`, backed by a small hand-maintained registry in `src/utils/icon-names.ts` (see `documentation/theme/icons.md`).

| Source | Prefix | Use for |
| --- | --- | --- |
| `lucide` (`@lucide/astro`) | `lucide:rss` | All UI icons |
| `simple-icons` (`simple-icons-astro`) | `simple-icons:github` | Brand/logo icons |
| `local` (`src/components/icons/local/`) | `local:name` | Extreme cases only: a brand mark neither set provides |

`IconName` contains only the entries registered in `src/utils/icon-names.ts`, not every Lucide or Simple Icons icon. Register a new icon there before using it.

* Always use `<Icon name="..." />`. Never write inline `<svg>`.
* When an icon appears inside a link or button, use `<IconLink>` from `@components/shared/links/IconLink.astro`. Do not compose `<Icon>` and `<a>` by hand.
* When you find an inline `<svg>` in existing code, look for an equivalent on [lucide.dev](https://lucide.dev) (UI) or [simpleicons.org](https://simpleicons.org) (brands), register it, and replace the SVG. For brand marks neither set provides, see `src/components/icons/local/README.md`.
* Size icons with a CSS class such as `size-[1em]` so they scale with the surrounding font size. Do not rely only on the SVG `width`/`height` attributes.
