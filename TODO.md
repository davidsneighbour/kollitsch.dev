# To-do

## Audit summary

A full read-through and validation pass of the `kollitsch.dev` Astro repository was performed on 2026-06-13. The codebase is in good health overall: unit tests pass, `astro check` reports zero errors and zero warnings across 255 files, and TypeScript strict mode is broadly respected. The build pipeline, content schemas, OG image generation, and styling system are well structured.

The most material open problems are content lint errors and missing test coverage rather than functional defects. The CI gate, scrollbar tokens, vitest environment headers, and env declarations have been resolved since the initial audit.

## System map

### Astro application

* Entry config: `astro.config.ts`. Static output (`output: 'static'`), `compressHTML` gated on `import.meta.env.PROD`, directory build format, `inlineStylesheets: 'auto'`.
* Integrations: custom `buildHooks()` (from `src/scripts/build-hooks.ts`), `@astrojs/sitemap`, `astro-icon`, `astro-expressive-code`, `@astrojs/mdx`. Vite plugins: `vite-plugin-devtools-json`, `@tailwindcss/vite`.
* Experimental flags enabled: `chromeDevtoolsWorkspace`, `clientPrerender`, `contentIntellisense`.
* `trailingSlash` is commented out in Astro; trailing-slash enforcement is delegated to a Netlify 301 redirect in `netlify.toml`.
* Layouts: `src/layouts/Site.astro` (root shell, Matomo inline tracker, Lenis smooth scroll, view-transition lock handling), `src/layouts/ContentPage.astro`, `src/layouts/DefaultPage.astro`.

### Content system

* `src/content.config.ts` defines four collections: `blog`, `tags`, `social`, `pages`.
* `blog` uses a custom loader that injects `contentFormat` (`md`/`mdx`) derived from the file path before parsing.
* `blogSchema` is rich: cover object with image/video union and several cross-field refinements; `sourcecode` record; Markdown-rendered `title`/`summary`/`cover.alt`; computed `articleimage`. Refinements enforce `linktitle` rules and lowercase tag patterns.
* `tags` schema normalises `id`/`aliases`, derives `label`/`linktitle`.
* Query helpers live in `src/utils/content.ts` (`getHomepagePosts`, `paginateBlogPostsByYear`, `getPostsSortedByDraft`, breadcrumbs, date formatting).

### Styling system

* Single global stylesheet `src/styles/theme.css`, Tailwind CSS v4.
* Uses `@theme`, `@theme inline`, `@theme static`, `@layer base`, `@layer components`, `@utility`, `@plugin`, `@custom-variant`, `@namespace`.
* Colour tokens defined in `oklch`; full grey/orange/red ramps; Tailwind colour namespace reset via `--color-*: initial`.
* Custom utilities: `prose-dnb`, `reading-*`, `text-boxlabel-*`, `scrollbar-red`, `scrollbar-wide`, `font-changa`. Custom scrollbar styling via `--sb-*` variables and `::-webkit-scrollbar`.
* `DESIGN.md` is the declared single source of truth for design tokens.

### Image and asset system

* `src/components/layout/head/OpenGraphImage.astro`: content-addressed OG image cache. Pipeline is `satori-html` to Satori SVG to Resvg PNG to Sharp transcode. Two-tier cache, in-flight de-duplication, remote and local background resolution, font load guard, conservative Sharp memory config.
* `src/utils/opengraph.ts` resolves cover image keys against a generated image index.
* Pre-build LQIP index at `src/content/_generated/image-index.json` via `src/scripts/build-image-index.ts`.

### Scripts and automation

* Build hooks (`src/scripts/build-hooks.ts`): `generateFeedsIntegration` (FreshRSS-gated) and `pagefind` indexing on `astro:build:done`.
* Many one-off scripts under `src/scripts/`, run from `package.json` and `wireit` blocks.
* `wireit` orchestrates release, clean, package generation, linting, and update flows.

### Tests and validation

* Vitest unit tests co-located with sources; `vitest.config.js` uses `getViteConfig` plus `vite-tsconfig-paths`.
* Playwright e2e (`playwright.config.ts`) with a single chromium project, `webServer` running `npm run dev`, `baseURL` `http://localhost:4321`.
* Validation commands: `npm test`, `npm run check`, `npm run lint:markdown`, `npm run lint:styles`, `npm run lint:secretlint`, `npm run biome:check`.

### CI/CD and deployment

* `.github/workflows/tests.yml`: unit tests on push/PR to `main`. SHA-pinned actions, `contents: read`, `persist-credentials: false` (fixed 2026-06-13).
* `.github/workflows/lighthouse.yml`: post-deploy Lighthouse audits, SHA-pinned actions, least-privilege permissions.
* `.github/workflows/screenshot.yml`: weekly homepage screenshot commit, SHA-pinned actions, `node-version: 25` hardcoded (should read `.nvmrc`).
* `.github/workflows/update-issues.yml`: label cleanup on issue close, unpinned `mondeja/remove-labels-gh-action@v2`.
* Deployment via Netlify; `netlify.toml` has an empty build command and a trailing-slash 301 redirect.

### Documentation and agent instructions

* `CLAUDE.md`: project overview, commands, architecture, conventions.
* `AGENTS.md`: core rules, design-system and task-tracking conventions, commit format. Delegates detail to `ai/` (symlinked to the sibling `../ai/ai/` repo).
* `.vscode/instructions/project.instructions.md`: project context for VSCode/Copilot agents.
* `.vscode/instructions/astro-components.instructions.md`: component-scoped rules (Props export contract, is:inline hint).
* `DESIGN.md`: token source of truth, linted via `npx @google/design.md`.

## Findings

### Critical

* None. Build, type-check, and unit tests all pass.

### High

* `npm run lint:markdown` exits non-zero with 38+ errors across `src/content/blog/**` (MD049 emphasis style, MD001 heading increment, MD045 missing alt text, MD060 table column style, MD033 inline `HTML`, MD040 fenced code language, MD036/MD054). This lint gate is currently red.

### Medium

* `npm audit` reports 45 vulnerabilities (3 low, 16 moderate, 26 high), almost all transitive: `yaml` via `@astrojs/check` toolchain, `uuid`/`tempfile` via `@davidsneighbour/imagemin-lint-staged`. None are in production runtime code paths.
* Duplicated helpers in `src/utils/content.ts`: `getVSCodeLink` and `getVSCodeURL` (lines 537–557) are byte-identical. Both use string concatenation (`projectRoot + relativePath`) rather than `path.join`, and re-import `node:path`/`node:url` mid-file.
* `@ts-ignore` in `src/utils/content.ts:402` suppresses a non-null narrowing that could be expressed type-safely. Additional `@ts-ignore` clusters in `src/components/features/comments/Giscus.astro` and `src/utils/tags.ts`.

### Low

* `.nvmrc` pins `25` but the local toolchain is `v26.3.0`. CI reads `.nvmrc` so CI is consistent; `screenshot.yml` hardcodes `node-version: 25` instead of `node-version-file: .nvmrc`.
* Playwright `webServer` launches `npm run dev` (served over HTTPS per project setup) while `baseURL` and `webServer.url` use `http://localhost:4321`. The scheme mismatch can cause connection failures depending on how `astro dev` binds.
* Fourteen `src/utils/*.ts` modules have no co-located test, including `opengraph.ts`, `tags.ts`, and `schema.ts` (the latter two feed `content.config.ts`): `content.pure.ts`, `datetime.ts`, `feed-og-image.ts`, `helpers.ts`, `icon-names.ts`, `image-index.ts`, `logger.ts`, `navigation.ts`, `opengraph.ts`, `releases.ts`, `schema.ts`, `tags.ts`, `tailwind.ts`, `theme.ts`.
* `astro.config.ts:13` imports `buildHooks` from `./src/scripts/build-hooks.ts`, but `src/scripts` is excluded from `tsconfig.json`. This works at runtime but means the integration code is outside type-checking coverage.
* `lint:design` depends on `npx @google/design.md`, which is not installed locally; it relies on an on-demand npx fetch each run.
* `OpenGraphImage.astro:460` has a bare `console.log("error")` inside a cleanup catch block instead of structured logging via the existing `log` instance.

## Recommended changes

### 1. ~~Create the missing project.instructions.md~~: RESOLVED

Project-specific instructions are now at `.vscode/instructions/project.instructions.md`. `AGENTS.md §0` updated accordingly.

### 2. Fix the failing Markdown lint gate

* Priority: [P2]
* Area: Content system
* Evidence: `npm run lint:markdown` exits 1 with 38+ errors across `src/content/blog/**` (MD049, MD001, MD045, MD060, MD033, MD040, MD036, MD054).
* Why it matters: A red lint gate hides real content issues such as missing image alt text (accessibility).
* Suggested change (iterative; manual work required):
  1. Run `npm run lint:markdown:fix` for autofixable rules (MD049 emphasis style, MD060 table column style) and review the diff before committing.
  2. Manually fix MD001 heading-increment issues file by file.
  3. Manually add alt text for MD045 failures; each image needs a meaningful description.
  4. Address MD036/MD054 emphasis and link usage issues manually.
  5. Repeat until `npm run lint:markdown` exits 0.
* Validation command: `npm run lint:markdown`

### 3. Deduplicate and fix the VS Code link helpers

* Priority: [P3]
* Area: Build / TypeScript
* Evidence: `src/utils/content.ts:537-557` defines two identical functions; both use `projectRoot + relativePath` and re-import `node:path`/`node:url` at lines 529–530.
* Suggested change: Keep one function, build the path with `path.join`/`path.resolve`, move imports to the top of the file, and re-export the alias if both names are needed.
* Validation command: `npx vitest run src/utils/content.test.ts && npm run check`

### 4. Add tests for schema-feeding utility modules

* Priority: [P3]
* Area: Tests and validation
* Evidence: 14 `src/utils/*.ts` modules lack co-located tests, including `opengraph.ts`, `tags.ts`, and `schema.ts` which feed `content.config.ts`.
* Suggested change: Add focused unit tests for the pure functions in `schema.ts`, `tags.ts`, and `opengraph.ts` first.
* Validation command: `npm run test:coverage`

### 5. Update Node version pins

* Priority: [P2]
* Area: CI/CD
* Evidence: `.nvmrc` pins `25` while local Node is `v26.3.0`. `screenshot.yml` hardcodes `node-version: 25` instead of reading `.nvmrc`.
* Note: `src/env.d.ts` declarations were updated 2026-06-13; this item covers the Node version pins only.
* Suggested change:
  1. Decide on the intended Node major (26?) and update `.nvmrc`.
  2. Switch `screenshot.yml` from `node-version: 25` to `node-version-file: .nvmrc`.
* Validation command: `npm run check`

### 6. Fix "Tags: " showing when no tags are assigned

* Priority: [P2]
* Area: Templates
* Evidence: The tag meta line renders `Tags:` followed by nothing when a post has no tags, instead of hiding entirely.
* Suggested change: Wrap the tag meta line in a conditional so it only renders when `tags.length > 0`.
* Validation command: `npm run check && npm test`

### 7. Fix Netlify headers and redirects in `public/`

* Priority: [P3]
* Area: Deployment
* Evidence: `public/_headers` and `public/_redirects` may have a broken or incomplete setup; the current `netlify.toml` only handles a trailing-slash 301 redirect. The [`abemedia/astro-static-headers`](https://github.com/abemedia/astro-static-headers) library is worth evaluating for per-route static header generation.
* Suggested change: Audit `public/_headers` and `public/_redirects` against the live Netlify deployment; resolve any mismatches and consider adopting `astro-static-headers` for fine-grained header control.
* Validation command: Deploy to a branch preview and inspect response headers.

## Questions

* Running `node src/scripts/*.ts` (rather than `npx tsx`) appears intentional given Node's native TypeScript support, but it contradicts `CLAUDE.md`. Should `CLAUDE.md` be updated to reflect `node` usage, or should the scripts move to `npx tsx`?
* Is the empty Netlify build command (`command = ""`) deliberate because the build runs in a pre-step or via the CLI deploy, and is the production build covered by any CI gate before deploy?
* For Playwright, does `astro dev` serve plain HTTP on `4321` in CI, or should `baseURL`/`webServer.url` use `https`?

## Deferred ideas

* [IDEA] Add a Markdown lint pre-commit hook (via `lint-staged`) so content style issues are caught before they accumulate.
* [IDEA] Introduce a CI job that runs `astro check` and `lint:markdown` on pull requests, so type and content gates run alongside the existing unit-test workflow.
* [IDEA] Replace the duplicated `@ts-ignore` clusters in `Giscus.astro` with a typed wrapper around the Giscus global, improving type coverage of the comments component.
* [IDEA] Move `src/scripts` back under type-checking (a dedicated `tsconfig.scripts.json`) so build-time integration code such as `build-hooks.ts` is validated.
* [IDEA] Carry forward the pre-existing DESIGN.md backlog (sidebar tokens, semantic colour roles, dark-mode token pairs, form/navigation/motion/component token coverage, icon-system documentation).
* [IDEA] Adopt the `ai/review/` structured action registry when it becomes available in the shared `ai` repo: stable item IDs, machine-readable validation commands in `ai/review/config.json`, and explicit `done`/`ignore` tracking files so completed items have a history rather than being deleted.
* [IDEA] Fix font sizes overall; review the typography scale against DESIGN.md and correct any deviations across components.
* [IDEA] Move the blog post preview into a container-based layout.
* [IDEA] Fix YouTube content type handling; the current content type for YouTube posts may not be correctly defined or validated.
* [IDEA] Nanny CLI: replace the `node src/scripts/*.ts` invocations in `package.json` and `wireit` entries with a `nanny <command>` wrapper, giving scripts a clean CLI surface. (Relates to the open question about `node` vs `npx tsx`.)
* [IDEA] Static quest web ring: audit and fix the current web ring implementation.
* [IDEA] Add page, link, and title transitions.
* [IDEA] Blog post cards: show link underlines on card hover and intensify them on link hover.
* [IDEA] 90% opacity page background so the body background colour shows through content areas.
* [IDEA] Add `excludeAgent: "code-review"` or `excludeAgent: "coding-agent"` frontmatter to `.vscode/instructions/` files where the instruction content should be hidden from specific Copilot agents.
* [IDEA] Extend the Playwright e2e suite with live site smoke tests: critical page uptime (`/about/`, `/contact/`, `/uses/`), Pagefind search overlay, primary navigation and footer link crawl, JSON-LD structured data on blog posts, `@axe-core/playwright` accessibility checks (already installed), Web Vitals / synthetic timing, Matomo opt-out validation, contact form end-to-end submission, service worker registration, and sitemap integrity check.
* [IDEA] Evaluate [`itshover.com/icons`](https://www.itshover.com/icons) as an icon enhancement option.
* [IDEA] Restore `::search-text` and `::search-text:current` CSS Highlight API rules in `src/styles/theme.css` once Lightning CSS recognises the pseudo-element without warnings. The colour tokens (`--color-red-600`/`--color-red-50`/`--color-red-900`) are already defined. See the comment in the `::target-text` block for context.
* [KNOWN ISSUE] Vite build warning: `Module "src/components/layout/head/OpenGraphImage.astro" tried to import "src/data/setup.json" with no attributes`. All source imports correctly include `with { type: "json" }` — this is a false positive caused by the Astro compiler stripping import attributes from `.astro` modules during SSR compilation. No source fix is possible; track for resolution in upstream Astro/Vite.
