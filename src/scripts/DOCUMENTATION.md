# src/scripts

Node build and dev-tooling scripts. All are plain TypeScript and run with `node path/to/script.ts` (Node 26 strips types natively). None are part of the Astro compilation — `src/scripts/` is excluded from the main `tsconfig.json`.

Scripts are organised into four topic groups:

---

## build/

Scripts that run as part of the Astro build pipeline or are invoked by it.

| Script | What it does | npm script |
| --- | --- | --- |
| `build-hooks.ts` | Astro integration exported as `buildHooks()`. Registers FreshRSS feed generation on `astro:build:start` and Pagefind search indexing on `astro:build:done` plus a dev-server middleware. Imported by `astro.config.ts`. | — (imported) |
| `build-image-index.ts` | Scans `src/assets/images/`, merges metadata from Frontmatter CMS `mediaDb.json`, and writes `src/content/_generated/image-index.json` with per-image dimensions and LQIP data URIs. | `npm run build:image-index` |
| `build-theme.ts` | Reads `src/data/theme.json` and generates `src/styles/theme-setup.css` via `src/utils/theme.ts`. | — |
| `starred-feed.ts` | Fetches starred/labelled items from a FreshRSS instance (Google Reader API) and writes an RSS 2.0 feed to a file or stdout. Called by `build-hooks.ts`. Requires `FRESHRSS_*` env vars. | — (called by build-hooks) |
| `integrations/pagefind.ts` | Standalone Astro integration for Pagefind — earlier version of the inline code in `build-hooks.ts`. Not currently imported anywhere; kept for reference. | — |

---

## content/

Scripts for managing blog content and media assets.

| Script | What it does | npm script |
| --- | --- | --- |
| `blogroll-screenshots.ts` | Takes Playwright screenshots of blogroll URLs and saves them as JPGs. Reads `src/content/blogroll.json` by default. Supports `--dry-run`, `--concurrency`, `--verbose`. | `npm run bbuild:blogroll` |
| `create-blog-post.ts` | Interactive CLI to scaffold a new blog post. Prompts for title and tags, generates a slug directory under `src/content/blog/YYYY/slug/`, and optionally opens the file in VS Code. | `npm run create:blog` |
| `featured.ts` | Manages `featured: true` frontmatter across blog posts. Accepts commands `list` (default), `clean` (remove all featured flags), or `show` (print current). | `node src/scripts/content/featured.ts` |

---

## linting/

Quality-gate scripts. All exit non-zero on failure.

| Script | What it does | npm script |
| --- | --- | --- |
| `lighthouse-audit.ts` | Runs Lighthouse mobile + desktop audits against a URL using `chrome-launcher`. Writes timestamped JSON (and optionally HTML) reports. Accepts `--url`, `--output-dir`, `--save-html`, `--chrome-flags`. | `npm run lighthouse:audit` |
| `lint-descriptions.ts` | Validates `description` frontmatter length (110–160 chars) across all content. Hard error (exit 1) for missing/empty. Soft warning (exit 0) for out-of-range lengths. | `npm run lint:descriptions` |
| `verify-sitemap.ts` | Fetches the live sitemap index, extracts all URLs, and makes HTTP requests to verify 2xx responses. Rate-limited. Useful for post-deploy smoke testing. | `npm run lint:sitemap` |

---

## maintenance/

One-off and recurring tooling scripts for the dev environment and repository.

| Script | What it does | npm script |
| --- | --- | --- |
| `check-ai-symlink.ts` | Creates or updates the `ai/ → ../ai/ai` symlink. Run automatically on `postinstall`. | `npm run postinstall:ai` |
| `create-icon-types.ts` | Copies Bootstrap Icons SVGs to `src/icons/` and generates `src/utils/icon-names.ts` with TypeScript union types for all Bootstrap + Lucide icon names. | `npm run icons:sync` |
| `create-releases.ts` | Creates GitHub releases for all tags that have no existing release. Supports `--dry-run`, `--draft`, regex tag filters, and concurrent creation. Requires `GITHUB_PERSONAL_ACCESS_TOKEN`. | `node src/scripts/maintenance/create-releases.ts` |
| `export-schema.ts` | Exports the Zod `blogSchema` from `content.config.ts` as a JSON Schema draft-7 file at `schemas/blog.schema.json`. | `node src/scripts/maintenance/export-schema.ts` |
| `screenshot.ts` | Full-page website screenshot via Playwright. Supports `--url`, `--output`, `--width`, `--format`, `--scheme`, and scroll/settle timing options. Writes atomically via temp file. | `node src/scripts/maintenance/screenshot.ts --url=...` |
| `tsc-config-to-instructions.ts` | Runs `tsc --showConfig` and injects the JSON output into a Markdown file between HTML comment markers. Keeps `.github/instructions/typescript.instructions.md` in sync. | `node src/scripts/maintenance/tsc-config-to-instructions.ts` |
| `vscode/merge-vscode-config.ts` | Merges `settings.base.jsonc` + `settings.local.jsonc` into `settings.json`. Modes: `--audit` (drift detection, exit 3 on issues), `--check` (validate output), `--apply` (write). | `npm run vscode:audit / vscode:check / vscode:sync` |
| `vscode/vscode-extensions.ts` | Compares installed VS Code extensions against workspace recommendations. `--check` reports drift; `--apply` updates `.vscode/extensions.json`. | `npm run build:vscode:recommendations` |

---

## Notes

* `src/vendor/lite-youtube.ts` — TypeScript source for the `<lite-youtube>` web component (client-side, not a Node script). The compiled output lives at `public/vendor/lite-youtube-embed/lite-yt-embed.js`.
* `tsconfig.json` in this directory covers all `.ts` files here for editor support only (`noEmit: true`). Scripts are excluded from the main project `tsconfig.json`.
