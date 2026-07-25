---
applyTo: "**"
---

# KOLLITSCH.dev: Project Context

## Identity

Personal website and digital garden for Patrick Kollitsch at [KOLLITSCH.dev](https://kollitsch.dev).
The site is a blog, web-development reference, and portfolio, built on Koh Samui, Thailand.

## Technology stack

* **Astro 6**: static output (`output: 'static'`), MDX, content collections
* **Tailwind CSS 4**: `@theme`/`@layer`/`@utility` architecture, single stylesheet at `src/styles/theme.css`
* **TypeScript**: strict mode, ESM only, path aliases via `tsconfig.json`
* **Vitest**: unit tests co-located with sources
* **Playwright**: e2e tests under `src/test/`
* **Netlify**: static deployment, trailing-slash 301 handled in `netlify.toml`

## Key file locations

| Purpose | Path |
| :------ | :--- |
| Project config | `astro.config.ts` |
| Content schemas | `src/content.config.ts` |
| Global styles | `src/styles/theme.css` |
| Design tokens | `DESIGN.md` |
| Site metadata | `src/data/setup.json` |
| Navigation | `src/data/topnavigation.json`, `src/data/footernavigation.json` |
| Build hooks | `src/scripts/build-hooks.ts` |
| OG image pipeline | `src/components/layout/head/OpenGraphImage.astro` |

## Project conventions

* All agent-facing core rules are in `AGENTS.md`.
* All design decisions are in `DESIGN.md`; read it before touching CSS or components.
* Open tasks are in `TODO.md` with priority labels `[P0]` to `[P3]` and `[IDEA]`.
* Commit messages follow the conventional-changelog format defined in `AGENTS.md §5`.
* Blog posts live in `src/content/blog/YYYY/slug/index.{md,mdx}`.
* Scripts run with `npx tsx`, never with `node` directly.
* Static dependency versions only; no `^` or `~` ranges in `package.json`.
* British English throughout.

## Icons

Four icon sources are registered with `astro-icon`:

| Source | Prefix | Use for |
| :--- | :--- | :--- |
| `src/icons/` | none (for example `house-fill`) | Existing Bootstrap Icons; do not add new ones here |
| `simple-icons` | `simple-icons:github` | Brand and logo icons |
| `lucide` | `lucide:rss` | All other UI icons |
| `fa7-brands` | `fa7-brands:x-twitter` | Legacy brand icons; prefer `simple-icons` for new work |

* Render every icon with `<Icon name="…" />` from `astro-icon/components`. Never use inline `<svg>`.
* When an icon is inside a link or button, use `<IconLink>` from `src/components/shared/links/IconLink.astro` instead of composing `<Icon>` + `<a>` manually.
* When encountering an existing inline `<svg>`, replace it with the equivalent `<Icon>` if one exists.
* Look up brand icons at [simpleicons.org](https://simpleicons.org) and UI icons at [lucide.dev](https://lucide.dev).

## JSON imports

* **Never import `.json` files directly in `.astro` frontmatter.** The Astro compiler strips `with { type: 'json' }` import attributes from compiled `.astro` modules, which causes a `INCONSISTENT_IMPORT_ATTRIBUTES` Vite/Rollup warning at build time.
* Import JSON data through a `.ts` utility that re-exports it. The `with { type: 'json' }` attribute is preserved in `.ts` files.
* In `.ts` files, all JSON imports **must** carry `with { type: 'json' }`: `import data from '@data/file.json' with { type: 'json' }`.
* Never import the same JSON module twice in one file; use a local alias (`const alias = data;`) instead.

## Environment variables

Required for full builds; set in `.env` (gitignored):

| Variable | Used by |
| :------- | :------ |
| `YOUTUBE_API_KEY` | YouTube build scripts (use `fake_key_for_testing` locally) |
| `FRESHRSS_BASE_URL` | RSS feed generation |
| `FRESHRSS_USERNAME` | RSS feed generation |
| `FRESHRSS_API_PASSWORD` | RSS feed generation |
| `GH_TOKEN` / `GITHUB_TOKEN` | GitHub release scripts in CI |
