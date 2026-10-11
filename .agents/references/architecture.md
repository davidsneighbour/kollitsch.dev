# Architecture overview

Read this when you need orientation in the codebase: where something lives, how content is loaded, how styling is organised, or which file to change for a common task. For build, deploy, and hosting details read `build-and-deploy.md` in this directory.

## Rendering

Astro generates a fully static site (`output: 'static'`). All pages are pre-rendered at build time. `compressHTML` is gated on `import.meta.env.PROD`.

- Integrations (`astro.config.ts`): `buildHooks()` from `src/scripts/build/build-hooks.ts`, `@astrojs/sitemap`, `astro-expressive-code`, `@astrojs/mdx`, `@astrojs/react`.
- Vite plugins include `vite-plugin-devtools-json` and `@tailwindcss/vite`.
- Experimental flags: `chromeDevtoolsWorkspace`, `clientPrerender`, `contentIntellisense`.
- Layouts: `src/layouts/Site.astro` (root shell, Matomo inline tracker, Lenis smooth scroll, view-transition lock handling), `src/layouts/ContentPage.astro`, `src/layouts/DefaultPage.astro`.

## Content collections (`src/content.config.ts`)

- **blog**: Markdown/MDX posts from `src/content/blog/`. A custom loader injects `contentFormat` (`md`/`mdx`) from the file path before parsing. `blogSchema` has a cover object with an image/video union and cross-field refinements, an optional `sourcecode` record, Markdown-rendered `title`/`summary`/`cover.alt`, and a computed `articleimage`. Refinements enforce `linktitle` rules and lowercase kebab-case tag ids.
- **tags**: tag metadata from `src/content/tags/`. The schema normalises `id`/`aliases`, derives `label`/`linktitle`, and accepts `badge` presentation metadata.
- **social**: social links from `src/content/social.json`.
- **pages**: Markdown pages under `src/pages/` that require a `layout` frontmatter field.

Query helpers live in `src/utils/content.ts` (`getHomepagePosts`, `paginateBlogPostsByYear`, `getPostsSortedByDraft`, breadcrumbs, date formatting).

## Markdown extensions

`astro.config.ts` wires `remark-kbd-nested` (nested `<kbd>` shortcuts), `remark-definition-list` (PHP-Markdown-Extra definition lists), and the local `remarkDnbTypography` plugin (`src/utils/markdown-typography.ts`, Hugo-style `--`/`---` dash shortcuts, see `documentation/development/markdown-typography.md`) into `markdown.processor`.

## Styling

- One global stylesheet, `src/styles/theme.css`, with Tailwind CSS v4 (`@theme`, `@layer`, `@utility`, `@plugin`, `@custom-variant`).
- Colour tokens are `oklch`; the Tailwind colour namespace is reset with `--color-*: initial`.
- Custom utilities include `prose-dnb`, `reading-*`, `scrollbar-red`, `scrollbar-wide`, and `font-changa`; scrollbars use `--sb-*` variables.
- `DESIGN.md` is the source of truth for design tokens.
- shadcn/ui (`components.json`, `ui` alias `@components/shared/elements`) uses Radix UI (`radix-ui`, `@radix-ui/react-slot`) as its primitive layer. Do not introduce Base UI packages.

## Key directories

| Path | Purpose |
| --- | --- |
| `src/content/` | Blog posts (md/mdx), tags, and generated data |
| `src/layouts/` | Page layouts |
| `src/components/` | UI components with co-located tests; see `src/components/README.md` |
| `src/utils/` | Shared helpers with co-located tests |
| `src/scripts/` | Build-time and maintenance scripts, run with `node` |
| `src/data/` | Static config (navigation, site meta, redirects, Cloudflare header rules) |
| `src/config/` | Tool configs (stylelint, cspell, secretlint, markdownlint, and others) |
| `src/packages/` | `package.json` fragments (see the `package-json` instruction) |
| `src/styles/` | Global CSS (`theme.css`) |
| `src/worker.ts` | Cloudflare Worker (`www` redirect, contact form endpoint) |
| `.frontmatter/` | Frontmatter CMS database and templates |
| `documentation/` | Feature documentation, served by `npm run dev:docs` |

TypeScript path aliases are defined in `tsconfig.json` (`@/*`, `@components/*`, `@utils/*`, and others). Use them instead of deep relative imports.

## Files for common tasks

| Task | Files |
| --- | --- |
| Change homepage feed | `src/utils/content.ts` (`getHomepagePosts`) |
| Update content frontmatter schema | `src/content.config.ts` |
| Add/change site metadata | `src/data/setup.json` |
| Change navigation | `src/data/topnavigation.json`, `src/data/footernavigation.json` |
| Change search/indexing | `src/scripts/build/integrations/pagefind.ts`, `astro.config.ts` |
| Add a new blog post | `npm run create:blog` or create in `src/content/blog/` |
| Change dev server watcher behaviour | `src/scripts/webserver.ts` (`EXTRA_WATCH_PATTERNS`, `NEW_FILE_WATCH_DIRS`, `RESTART_POLL_INTERVAL_MS`); trigger an external restart with `touch RESTART` |
| Add a redirect | `src/data/redirects.json` |
| Change Cloudflare response headers | `src/data/headers.ts` (`headerRules` / `moduleHeaderRules`) |

## External documentation

Astro documentation: [https://docs.astro.build](https://docs.astro.build). Consult the relevant guide (routing, components, framework components, content collections, styling) before larger work in that area.
