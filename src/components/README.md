# Components directory

This directory is organized by the primary responsibility of each component so that
the purpose of a file is immediately visible from its location.

## Top-level groups

* `content/` - pieces that render long-form content (articles, metadata, typography,
  media helpers, taxonomy blocks, and breadcrumb navigation).
* `layout/` - building blocks that make up the global shell such as the document
  head, navigation, footer, and branding utilities.
* `features/` - standalone functional additions that can be dropped into pages
  (search, comments, social sharing helpers, feed promotions, etc.).
* `pages/` - page-specific assemblies that only make sense within a particular
  route (home sections, release listings, and similar composites).
* `forms/` - reusable form fields and form related UI.
* `shared/` - low-level UI primitives like buttons and links that are reused
  across multiple groups.
* `ui/` - small, self-contained presentational components (currently
  `CardLink.astro`, `TextImageFill.astro`). **Not shadcn/ui** - see note below.
* `shadcn-ui/` - generated shadcn/ui React components (`button.tsx`,
  `card.tsx`, ...), used as Astro islands. See "shadcn/ui" below.
* `gimmicks/` - visual novelties and canvas/animation experiments (e.g.
  `TvHead.astro`, `LetterGlitch.astro`) that are not part of the core UI.
* `devtools/` - development only utilities that assist during implementation.
* `seo/` - structured data helpers and related head metadata fragments.
* `support/fixtures/` - test fixtures and miscellaneous building blocks that do
  not belong to any of the functional buckets. Use this as a parking spot until a
  clearer category appears.

## `ui/` is not shadcn/ui

`ui/` groups small, generic presentational components, but every file in it
is a hand-written `.astro` component with a Zod-validated `Props`/schema,
following the same conventions as the rest of `src/components/`. It predates
and is unrelated to shadcn/ui.

## shadcn/ui

shadcn/ui was integrated once, removed (see the "remove shadcn and fix
tailwind generation" entry in `CHANGELOG.md`), and has since been
reintroduced. It now lives alongside the rest of the toolchain:

* `@astrojs/react` + `react`/`react-dom` are installed so shadcn's generated
  `.tsx` components can run as Astro islands (`client:*` directives).
* `components.json` at the repo root configures the CLI (`style: new-york`,
  `baseColor: gray`, CSS variables on). Its `ui` alias points at
  `src/components/shadcn-ui`, kept deliberately separate from the
  hand-written `ui/` folder above.
* `src/utils/shadcn-utils.ts` exports the `cn()` helper (`clsx` +
  `tailwind-merge`), aliased as `@utils/shadcn-utils`.
* The shadcn CSS variables (`--background`, `--primary`, `--card`, `--radius`,
  etc.) are defined in `src/styles/theme.css` under `:root` /
  `[data-theme="dark"]` and map 1:1 onto the semantic color/radius tokens in
  `DESIGN.md` - no new colors or radii were introduced. `--radius` is `0.5rem`
  (DESIGN.md's `rounded-lg`, the standard container radius).
* Generated components are not used as-is: check every new component against
  `DESIGN.md` before committing it (e.g. the stock `Card` primitive ships
  `rounded-xl` and a light/dark-agnostic shadow, both of which DESIGN.md
  forbids for cards - `card.tsx` here was hand-patched to `rounded-lg` and
  the shadow/outline split described in "Elevation & Depth").
* Add components with `npx shadcn@latest add <name>`, then review the diff
  against DESIGN.md before use.
* The shadcn registry MCP server is configured in `.mcp.json` (Claude Code)
  per [the shadcn registry MCP docs](https://ui.shadcn.com/docs/registry/mcp).

## Components to revisit

The following components still have sizeable TODOs or behavioural caveats and
should be reviewed during a future refactor:

* `content/article/Post.astro` - mixes content rendering, pagination, comments,
  and schema output; needs a decomposition plan.
* `content/metadata/PostMeta.astro` - accepts entire `post` objects and still
  delegates to several TODO-heavy subcomponents.
* `content/media/PostImage.astro` - embeds YouTube fallbacks and performs cover
  lookups; verify that all edge cases are still handled after the move.
* `features/feeds/FeedReader.astro` - bespoke promotional component with hard
  coded defaults that likely deserves its own feature module.
* `features/social/ShareToMastodon.astro` & `features/social/SocialLinks.astro`
  * social integrations that should be audited for consistency and localization.
