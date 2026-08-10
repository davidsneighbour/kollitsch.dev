# Components directory

This directory is organized by the primary responsibility of each component so that
the purpose of a file is immediately visible from its location. Folder placement is
part of the project's structure, not a suggestion: see
[`.agents/instructions/component-structure.instructions.md`](../../.agents/instructions/component-structure.instructions.md)
for the rules that keep it that way.

## Top-level groups

* `content/` - pieces that render long-form content: `article/` (post rendering),
  `media/` (image/video embeds), `metadata/` (author, publish date, tags, share
  links), `navigation/` (breadcrumbs and pagination), `sourcecode/` (code block
  rendering), `taxonomy/` (tag lists, tag clouds, tag filtering), and
  `typography/` (headings, prose wrapper). `ColorGrid.astro` sits directly in
  `content/` as a one-off content block.
* `layout/` - building blocks that make up the global shell: `head/` (document
  `<head>`, meta, OG images, speculation rules), `header/` (site header, with its
  own `navigation/`, `search/`, `theme/`, and `title/` subfolders for the header's
  internal parts), and `footer/` (footer, colophon, web component registration).
* `features/` - standalone functional additions that can be dropped into pages:
  `comments/`, `feeds/`, `search/`, and `social/`.
* `pages/` - page-specific assemblies that only make sense within a particular
  route: `home/` (home page sections) plus loose single-use layouts such as
  `NotFoundLayout.astro`.
* `forms/` - reusable form fields and form-related UI, including the shadcn/ui
  `Input`/`Textarea` primitives used as the canonical class recipe for text
  fields (see "shadcn/ui" below).
* `shared/` - low-level UI primitives reused across multiple groups: `elements/`
  (buttons, cards, badges) and `links/` (link and icon-link wrappers).
* `ui/` - small, self-contained presentational components (currently
  `CardLink.astro`, `TextImageFill.astro`, `Wordmark.astro`). **Not shadcn/ui** -
  see note below.
* `gimmicks/` - visual novelties and canvas/animation experiments (for example
  `TvHead.astro`, `LetterGlitch.astro`, `glitch.tsx`) that are not part of the
  core UI.
* `devtools/` - development only utilities that assist during implementation.
* `seo/` - structured data helpers and related head metadata fragments, grouped
  under `schema/` (JSON-LD building blocks).
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
reintroduced. Generated components are **not** kept in a dedicated
`shadcn-ui/` folder - shadcn is a code generator, not a place components live.
Each generated file is filed into the same folder a hand-written component with
that responsibility would use:

* `shared/elements/button.tsx`, `shared/elements/card.tsx` - generic UI
  primitives, alongside the hand-written `Button.astro`/`Badge.astro`.
* `forms/input.tsx`, `forms/textarea.tsx` - form fields.
* `gimmicks/glitch.tsx` - Canvas UI's generated Glitch effect, filed with visual
  experiments because it is used as an isolated Astro island rather than a
  reusable UI primitive.

Generated files keep shadcn's own lowercase filename convention (`button.tsx`,
not `Button.tsx`), which doubles as a visual marker that a file was generated
rather than hand-written, and avoids clobbering an existing hand-written
component of the same name in the same folder (see
`shared/elements/button.tsx` next to `shared/elements/Button.astro`).

The toolchain itself:

* `@astrojs/react` + `react`/`react-dom` are installed so shadcn's generated
  `.tsx` components can run as Astro islands (`client:*` directives). In
  practice most generated `.tsx` files exist as the canonical class recipe, and
  the same literal class string is copied onto native, vanilla-JS-driven
  elements instead (see `DESIGN.md`'s "Form Fields" section). Browser-effect
  components such as `gimmicks/glitch.tsx` hydrate only where the runtime API is
  required.
* `components.json` at the repo root configures the CLI (`style: new-york`,
  `baseColor: gray`, CSS variables on). Its `ui` alias points at
  `src/components/shared/elements` as the default landing zone for newly
  generated components - move anything that isn't a generic UI primitive (for
  example a form field) to its proper folder immediately after generating it.
* `src/utils/shadcn-utils.ts` exports the `cn()` helper (`clsx` +
  `tailwind-merge`), aliased as `@utils/shadcn-utils`.
* The shadcn CSS variables (`--background`, `--primary`, `--card`, `--radius`,
  etc.) are defined in `src/styles/theme.css` under `:root` /
  `[data-theme="dark"]` and map 1:1 onto the semantic color/radius tokens in
  `DESIGN.md` - no new colors or radii were introduced. `--radius` is `0.5rem`
  (DESIGN.md's `rounded-lg`, the standard container radius).
* Generated components are not used as-is: check every new component against
  `DESIGN.md` before committing it (for example the stock `Card` primitive ships
  `rounded-xl` and a light/dark-agnostic shadow, both of which DESIGN.md forbids
  for cards - `card.tsx` here was hand-patched to `rounded-lg` and the
  shadow/outline split described in "Elevation & Depth").
* Add components with `npx shadcn@latest add <name>`, move the generated file
  into its proper folder, fix its imports (including any `@components/shared/elements/...`
  cross-imports the CLI generated), then review the diff against DESIGN.md
  before use.
* The shadcn registry MCP server is configured in `.mcp.json` (Claude Code)
  per [the shadcn registry MCP docs](https://ui.shadcn.com/docs/registry/mcp).

## Components to revisit

The following components still have sizeable TODOs or behavioural caveats and
should be reviewed during a future refactor:

* `content/article/Post.astro` - mixes content rendering, pagination, comments,
  and schema output; needs a decomposition plan.
* `content/metadata/PostMeta.astro` - accepts entire `post` objects and still
  delegates to several TODO-heavy subcomponents.
* `content/media/PostImage.astro` - embeds video fallbacks and performs cover
  lookups; verify that all edge cases are still handled after the move.
* `features/feeds/FeedReader.astro` - bespoke promotional component with hard
  coded defaults that likely deserves its own feature module.
* `features/social/ShareToMastodon.astro` & `features/social/SocialLinks.astro`
  * social integrations that should be audited for consistency and localization.
* `forms/input.tsx` & `forms/textarea.tsx` - unused as hydrated islands (see
  "shadcn/ui" above); confirm this stays intentional rather than dead code as
  the forms area grows.
