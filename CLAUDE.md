# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

Personal website at [KOLLITSCH.dev*](https://kollitsch.dev) - a digital garden, blog, and web development reference. Built with Astro 6 (static output), Tailwind CSS 4, and TypeScript. Deployed to Netlify.

**Node version:** The required Node version is defined in `package.json` → `engines.node` (currently `>=26`). This is the single source of truth. `.nvmrc` mirrors it for nvm users. Even-numbered major versions (LTS) are preferred; the latest even major is always the target.

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
node src/scripts/<file>.ts      # Run a TypeScript utility script (type stripping is native; see engines in package.json)
```

Run a single Vitest test file:

```bash
npx vitest run src/path/to/file.test.ts
```

**Do not run `npm run build` in sandboxed environments without API tokens** - it calls the `prebuild` image-index step and may fail. Use `npm run check` for type-checking only.

**`npm test` MUST pass after every change.** Run it before committing. If a change causes a new component or file to be picked up by an existing test suite (for example `components-props.test.ts` requires every `.astro` in `src/components/` to export a named `Props` interface/type), fix the source, not the test.

## Environment variables

Required for full builds and certain scripts (set in `.env`):

| Variable | Required for |
| --- | --- |
| `YOUTUBE_API_KEY` | YouTube-related build scripts; set to `fake_key_for_testing` for local dev |
| `FRESHRSS_BASE_URL`, `FRESHRSS_USERNAME`, `FRESHRSS_API_PASSWORD` | RSS follower feed generation in `build-hooks.ts` |
| `GH_TOKEN` / `GITHUB_TOKEN` | GitHub release/repo scripts in CI |

## Architecture

### Output and rendering

Astro generates a fully static site (`output: 'static'`). All pages are pre-rendered at build time. `compressHTML` is gated on `import.meta.env.PROD`. `pagefind` creates a client-side search index during the build.

**Integrations:** custom `buildHooks()` (from `src/scripts/build-hooks.ts`), `@astrojs/sitemap`, `astro-icon`, `astro-expressive-code`, `@astrojs/mdx`. Vite plugins: `vite-plugin-devtools-json`, `@tailwindcss/vite`.

**Experimental flags active:** `chromeDevtoolsWorkspace`, `clientPrerender`, `contentIntellisense`.

`trailingSlash` is not configured in Astro; trailing-slash enforcement is delegated to a Netlify 301 redirect in `netlify.toml`.

Layouts: `src/layouts/Site.astro` (root shell, Matomo inline tracker, Lenis smooth scroll, view-transition lock handling), `src/layouts/ContentPage.astro`, `src/layouts/DefaultPage.astro`.

### Content collections (`src/content.config.ts`)

Four collections:

* **blog** - Markdown/MDX posts from `src/content/blog/`. Uses a custom loader that injects `contentFormat` (`md`/`mdx`) derived from the file path before parsing. `blogSchema` is rich: cover object with image/video union and several cross-field refinements; optional `sourcecode` record; Markdown-rendered `title`/`summary`/`cover.alt`; computed `articleimage`. Refinements enforce `linktitle` rules and lowercase tag patterns (`[a-z0-9_-]`).
* **tags** - Tag metadata from `src/content/tags/`. Schema normalises `id`/`aliases`, derives `label`/`linktitle`.
* **social** - Social links loaded from `src/content/social.json`.
* **pages** - Markdown pages under `src/pages/` that require a `layout` frontmatter field.

Query helpers live in `src/utils/content.ts` (`getHomepagePosts`, `paginateBlogPostsByYear`, `getPostsSortedByDraft`, breadcrumbs, date formatting).

### Styling system

Single global stylesheet `src/styles/theme.css`, Tailwind CSS v4.

* Uses `@theme`, `@theme inline`, `@theme static`, `@layer base`, `@layer components`, `@utility`, `@plugin`, `@custom-variant`.
* Colour tokens defined in `oklch`; full grey/orange/red ramps. Tailwind colour namespace reset via `--color-*: initial`.
* Custom utilities include `prose-dnb`, `reading-*`, `scrollbar-red`, `scrollbar-wide`, `font-changa`. Custom scrollbar styling via `--sb-*` variables.
* **`DESIGN.md` is the single source of truth for all design tokens.** Read it before changing any visual styling; update it whenever a token is added or changed.

### Image and asset system

* **OG images**: `src/components/layout/head/OpenGraphImage.astro`. Pipeline: `satori-html` → Satori SVG → Resvg PNG → Sharp transcode. Two-tier cache with in-flight de-duplication; supports remote and local background images.
* **LQIP**: pre-build image index at `src/content/_generated/image-index.json` via `src/scripts/build-image-index.ts`. `src/utils/opengraph.ts` resolves cover image keys against this index.

### Build pipeline

1. **Pre-build**: `npm run build:image-index` (`src/scripts/build-image-index.ts`) generates the LQIP image index.
2. **Astro build hooks** (`src/scripts/build-hooks.ts`) register as Astro integrations and run during the Astro build lifecycle: `generateFeedsIntegration` (FreshRSS-gated RSS feeds) and `pagefind` indexing on `astro:build:done`.
3. **Build**: `astro check && astro build`—TypeScript checks run before the build.
4. **Scripts and automation**: many one-off scripts under `src/scripts/`, run via `node`. `wireit` orchestrates release, clean, package generation, linting, and update flows.

### CI/CD and deployment

* `tests.yml`—unit tests on push/PR to `main`; SHA-pinned actions, `contents: read`, `persist-credentials: false`.
* `lighthouse.yml`—post-deploy Lighthouse audits.
* `screenshot.yml`—weekly homepage screenshot commit.
* Deployed to Netlify; `netlify.toml` has `command = ""` — this is intentional and overrides any build command set in the Netlify web UI. The build is run separately before `netlify deploy` is called.

### Key directories

| Path | Purpose |
| --- | --- |
| `src/content/` | Blog posts (md/mdx), tags, and generated data |
| `src/content.config.ts` | Collection schemas and Zod validation |
| `src/layouts/` | Page layouts (`Site.astro`, `ContentPage.astro`, `DefaultPage.astro`) |
| `src/components/` | UI components, co-located with `*.test.ts` files |
| `src/utils/` | Shared helpers (`content.ts`, `path.ts`, `youtube.ts`, etc.), co-located tests |
| `src/scripts/` | One-off and build-time scripts, run via `node` |
| `src/data/` | Static JSON config (nav, site meta, theme, redirects) |
| `src/config/` | Tool configs (biome, stylelint, cspell, secretlint, htmlvalidate) |
| `src/styles/` | Global CSS (`theme.css`) |
| `.frontmatter/` | Frontmatter CMS database and templates |
| `.vscode/instructions/` | Project-specific AI assistant instructions |
| `.vscode/prompts/` | Project-specific reusable AI prompts |

### AI assistant file locations

**`ai/` is a global registry shared across all projects. It MUST NOT be written to unless explicitly instructed.** It contains non-project-specific rules, skills, and instructions that apply regardless of which repository is active.

All project-specific AI assistant files for kollitsch.dev belong in:

* `.vscode/instructions/` — instruction files (`.instructions.md`) loaded automatically by AI assistants when working in this project
* `.vscode/prompts/` — reusable prompt files (`.prompt.md`) invoked on demand

When adding documentation, rules, or guidance that is specific to this project (components, conventions, workflows), always write to `.vscode/instructions/` or `.vscode/prompts/`, never to `ai/`.

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

Note: `src/scripts/` is excluded from TypeScript compilation (no type-checking). Run scripts with `node script.ts` — the required Node version (see `package.json engines`) strips types natively without flags.

## Icons

Four icon sources are available via `astro-icon/components`:

| Source | Prefix | Use for |
| --- | --- | --- |
| `src/icons/` | none (for example `house-fill`) | Existing Bootstrap Icons—do not add new ones |
| `simple-icons` | `simple-icons:github` | Brand/logo icons |
| `lucide` | `lucide:rss` | All other UI icons |
| `fa7-brands` | `fa7-brands:x-twitter` | Legacy brand icons—prefer `simple-icons` for new additions |

Rules:

* **Always** use `<Icon name="..." />` from `astro-icon/components`—never inline raw SVG.
* **Always** use `<IconLink>` from `src/components/shared/links/IconLink.astro` when an icon appears inside a link or button. Do not compose `<Icon>` + `<a>` by hand.
* When you encounter an inline `<svg>` in existing code, check whether an equivalent icon exists in one of the sets above and replace it.
* For brand/social icons, search [simpleicons.org](https://simpleicons.org) first. For UI icons, search [lucide.dev](https://lucide.dev) first.

## Testing conventions

* Unit tests live **next to** the source files they test (`Component.test.ts` beside `Component.astro`).
* Every test file MUST start with `// @vitest-environment node`.
* Add a co-located unit test whenever changing observable behaviour.
* Browser tests live in `src/test/browser/` and require `VITEST_BROWSER=true`.

## Code conventions

* **ESM only** - `type: "module"` in `package.json`; use `import`/`export`.
* **Static versions** in `package.json` - no `^` or `~` ranges.
* **Formatting**: Biome with spaces (width from `.editorconfig`), multiline HTML attributes.
* **Run TS scripts** with `node script.ts` — the Node version in `package.json engines` handles type stripping natively (Node 26+).
* **Imports sorted** by Biome's `organizeImports` assist action.

## Git workflow

* **Never commit directly to `main`** - use feature branches for all changes.
* Use **conventional changelog** commit messages.
* Available scopes are defined in `.release-it.ts`.
* Pre-commit hooks run `lint-staged` (via `simple-git-hooks`).

## Important files for common tasks

| Task | Files |
| --- | --- |
| Change homepage feed | `src/utils/content.ts` (`getHomepagePosts`), homepage layout in `src/layouts/` |
| Update content frontmatter schema | `src/content.config.ts` |
| Add/change site metadata | `src/data/setup.json` |
| Change navigation | `src/data/topnavigation.json`, `src/data/footernavigation.json` |
| Change search/indexing | `src/scripts/integrations/pagefind.ts`, `astro.config.ts` |
| Add a new blog post | `npm run create:blog` or create in `src/content/blog/` |
| Change watcher behaviour (dev reload) | `astro.config.ts` → `watchExtraFiles` plugin |
| Add a redirect | `src/data/redirects.json` |
