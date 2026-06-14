# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

Personal website at [kollitsch.dev](https://kollitsch.dev) — a digital garden, blog, and web development reference. Built with Astro 6 (static output), Tailwind CSS 4, and TypeScript. Deployed to Netlify.

RFC 2119 keywords (MUST, SHOULD, MAY, etc.) in this repository's documentation carry their standard meanings.

## Commands

```bash
npm run dev               # Dev server at https://localhost:4321
npm run build             # astro check + astro build (requires API tokens for some hooks)
npm run check             # astro check only (type-check without building)
npm run preview           # Preview production build locally
npm test                  # Vitest unit tests (fast, no API keys needed)
npm run test:coverage     # Vitest with v8 coverage
npm run test:e2e          # Playwright e2e (run after build)
npm run test:e2e:ui       # Playwright with interactive UI
npm run biome:check       # Lint and format check
npm run biome:lint        # Auto-fix lint/format issues
npm run lint:markdown     # markdownlint on src/content/blog/**
npm run lint:styles       # stylelint on src/styles/**
npm run lint:secretlint   # Scan for leaked secrets
npm run create:blog       # Interactive script to scaffold a new blog post
npx tsx src/scripts/<file>.ts   # Run a TypeScript utility script
```

Run a single Vitest test file:

```bash
npx vitest run src/path/to/file.test.ts
```

**Do not run `npm run build` in sandboxed environments without API tokens** — it calls the `prebuild` image-index step and may fail. Use `npm run check` for type-checking only.

**`npm test` MUST pass after every change.** Run it before committing. If a change causes a new component or file to be picked up by an existing test suite (for example `components-props.test.ts` requires every `.astro` in `src/components/` to export a named `Props` interface/type), fix the source, not the test.

## Environment variables

Required for full builds and certain scripts (set in `.env`):

| Variable | Required for |
|---|---|
| `YOUTUBE_API_KEY` | YouTube-related build scripts; set to `fake_key_for_testing` for local dev |
| `FRESHRSS_BASE_URL`, `FRESHRSS_USERNAME`, `FRESHRSS_API_PASSWORD` | RSS follower feed generation in `build-hooks.ts` |
| `GH_TOKEN` / `GITHUB_TOKEN` | GitHub release/repo scripts in CI |

## Architecture

### Output and rendering

Astro generates a fully static site (`output: 'static'`). All pages are pre-rendered at build time. `pagefind` creates a client-side search index during the build.

### Content collections (`src/content.config.ts`)

Four collections:

* **blog** — Markdown/MDX posts from `src/content/blog/`. Schema enforces `title`, `description`, `date`; tags must be lowercase `[a-z0-9_-]`; `linktitle` must be shorter than `title` and differ from it.
* **tags** — Tag metadata from `src/content/tags/`. Each tag has an `id`, optional `icon`, and `aliases`.
* **social** — Social links loaded from `src/content/social.json`.
* **pages** — Markdown pages under `src/pages/` that require a `layout` frontmatter field.

### Build pipeline

1. **Pre-build**: `npm run build:image-index` (`src/scripts/build-image-index.ts`) generates a LQIP image index at `src/content/_generated/image-index.json`.
2. **Astro build hooks** (`src/scripts/build-hooks.ts`) register as Astro integrations and run during the Astro build lifecycle (e.g., RSS feed generation, pagefind indexing).
3. **Build**: `astro check && astro build` — TypeScript checks run before the build.

### Key directories

| Path | Purpose |
|---|---|
| `src/content/` | Blog posts (md/mdx), tags, and generated data |
| `src/content.config.ts` | Collection schemas and Zod validation |
| `src/layouts/` | Page layouts (`Site.astro`, `ContentPage.astro`, `DefaultPage.astro`) |
| `src/components/` | UI components, co-located with `*.test.ts` files |
| `src/utils/` | Shared helpers (`content.ts`, `path.ts`, `youtube.ts`, etc.), co-located tests |
| `src/scripts/` | One-off and build-time scripts, run via `npx tsx` |
| `src/data/` | Static JSON config (nav, site meta, theme, redirects) |
| `src/config/` | Tool configs (biome, stylelint, cspell, secretlint, htmlvalidate) |
| `src/styles/` | Global CSS (`theme.css`) |
| `.frontmatter/` | FrontMatter CMS database and templates |

### TypeScript path aliases

Defined in `tsconfig.json`. Use these instead of relative `../..` imports:

```plaintext
@/*           → src/*
@components/* → src/components/*
@utils/*      → src/utils/*
@layouts/*    → src/layouts/*
@data/*       → src/data/*
@scripts/*    → src/scripts/*
@config/*     → src/config/*
@content/*    → src/content/*
@contentconfig → src/content.config.ts
```

Note: `src/scripts/` is excluded from TypeScript compilation — always run scripts with `npx tsx`, not `node`.

## Testing conventions

* Unit tests live **next to** the source files they test (`Component.test.ts` beside `Component.astro`).
* Every test file MUST start with `// @vitest-environment node`.
* Add a co-located unit test whenever changing observable behaviour.
* Browser tests live in `src/test/browser/` and require `VITEST_BROWSER=true`.

## Code conventions

* **ESM only** — `type: "module"` in `package.json`; use `import`/`export`.
* **Static versions** in `package.json` — no `^` or `~` ranges.
* **Formatting**: Biome with spaces (width from `.editorconfig`), multiline HTML attributes.
* **Run TS scripts** with `npx tsx`, not `node`.
* **Imports sorted** by Biome's `organizeImports` assist action.

## Git workflow

* **Never commit directly to `main`** — use feature branches for all changes.
* Use **conventional changelog** commit messages.
* Available scopes are defined in `.release-it.ts`.
* Pre-commit hooks run `lint-staged` (via `simple-git-hooks`).

## Important files for common tasks

| Task | Files |
|---|---|
| Change homepage feed | `src/utils/content.ts` (`getHomepagePosts`), homepage layout in `src/layouts/` |
| Update content frontmatter schema | `src/content.config.ts` |
| Add/change site metadata | `src/data/setup.json` |
| Change navigation | `src/data/topnavigation.json`, `src/data/footernavigation.json` |
| Change search/indexing | `src/scripts/integrations/pagefind.ts`, `astro.config.ts` |
| Add a new blog post | `npm run create:blog` or create in `src/content/blog/` |
| Change watcher behaviour (dev reload) | `astro.config.ts` → `watchExtraFiles` plugin |
| Add a redirect | `src/data/redirects.json` |
