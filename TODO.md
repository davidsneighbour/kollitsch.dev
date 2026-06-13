# TODO

## Audit summary

A full read-through and validation pass of the `kollitsch.dev` Astro repository was performed on 2026-06-13. The codebase is in good health overall: unit tests pass (237 passing, 2 skipped), `astro check` reports zero errors and zero warnings across 254 files, and TypeScript strict mode is broadly respected. The build pipeline, content schemas, OG image generation, and styling system are well structured and thoroughly commented.

The most material problems are documentation drift and convention violations rather than functional defects:

* `AGENTS.md` points the agent at `ai/instructions/project.instructions.md` and `ai/agents/`, which do not exist — the `ai/` symlink was added during this session, so most of the layout is now present, but these two specific paths are still missing.
* `npm run lint:markdown` fails with 38+ errors across blog content (emphasis style, heading increments, missing alt text, table styling).
* Several `package.json` scripts run `node src/scripts/*.ts` directly, which contradicts the documented `npx tsx` convention.
* Several dependencies use floating ranges (`^4`, `>=5.0.6`) against the project's static-version convention.
* A dead Tailwind utility (`scrollbar-thumb-gray-800 scrollbar-track-gray-900`) is applied to `body` but no plugin defines it; it is silently dropped.
* Seven test files omit the mandatory `// @vitest-environment node` header.
* `npm audit` reports 45 vulnerabilities (mostly transitive, via `@astrojs/check` and image tooling).

No secrets are tracked in git, `.env` is correctly ignored, and the production-facing layout and content code are sound. None of the findings block the build.

## System map

### Astro application

* Entry config: `astro.config.ts`. Static output (`output: 'static'`), `compressHTML` gated on `import.meta.env.PROD`, directory build format, `inlineStylesheets: 'auto'`.
* Integrations: custom `buildHooks()` (from `src/scripts/build-hooks.ts`), `@astrojs/sitemap`, `astro-icon`, `astro-expressive-code`, `@astrojs/mdx`. Vite plugins: `vite-plugin-devtools-json`, `@tailwindcss/vite`.
* Experimental flags enabled: `chromeDevtoolsWorkspace`, `clientPrerender`, `contentIntellisense`.
* Draft pages are discovered at config-eval time by globbing `src/pages/**/*.{md,mdx}` and reading frontmatter, then excluded from the sitemap.
* `trailingSlash` is commented out in Astro; trailing-slash enforcement is delegated to a Netlify 301 redirect in `netlify.toml`.
* Layouts: `src/layouts/Site.astro` (root shell, Matomo inline tracker, Lenis smooth scroll, view-transition lock handling), `src/layouts/ContentPage.astro`, `src/layouts/DefaultPage.astro`.

### Content system

* `src/content.config.ts` defines four collections: `blog`, `tags`, `social`, `pages`.
* `blog` uses a custom loader that injects `contentFormat` (`md`/`mdx`) derived from the file path before parsing.
* `blogSchema` is rich: cover object with image/video union and several cross-field refinements; `sourcecode` record; markdown-rendered `title`/`summary`/`cover.alt`; computed `articleimage`. Refinements enforce `linktitle` rules and lowercase tag patterns.
* `tags` schema normalises `id`/`aliases`, derives `label`/`linktitle`.
* Query helpers live in `src/utils/content.ts` (`getHomepagePosts`, `paginateBlogPostsByYear`, `getPostsSortedByDraft`, breadcrumbs, date formatting).

### Styling system

* Single global stylesheet `src/styles/theme.css`, Tailwind CSS v4.
* Uses `@theme`, `@theme inline`, `@theme static`, `@layer base`, `@layer components`, `@utility`, `@plugin`, `@custom-variant`, `@namespace`.
* Colour tokens defined in `oklch`; full grey/orange/red ramps; Tailwind colour namespace reset via `--color-*: initial`.
* Custom utilities: `prose-dnb`, `reading-*`, `text-boxlabel-*`, `scrollbar-red`, `scrollbar-wide`, `font-changa`. Custom scrollbar styling via `--sb-*` variables and `::-webkit-scrollbar`.
* `DESIGN.md` is the declared single source of truth for design tokens, with `oklch` values mirroring `theme.css`.

### Image and asset system

* `src/components/layout/head/OpenGraphImage.astro`: content-addressed OG image cache. Pipeline is satori-html to Satori SVG to Resvg PNG to Sharp transcode. Two-tier cache (`public/og_image` plus `.cache/og_image`), in-flight de-duplication, remote and local background resolution with Sharp pre-sizing, font load guard, conservative Sharp memory config. Default format `jpeg`, quality 80.
* `src/utils/opengraph.ts` resolves cover image keys against a generated image index.
* Pre-build LQIP index at `src/content/_generated/image-index.json` via `src/scripts/build-image-index.ts`.
* Astro `image` config sets breakpoints, `constrained` layout, `cover` fit, responsive styles.

### Scripts and automation

* Build hooks (`src/scripts/build-hooks.ts`): `generateFeedsIntegration` (FreshRSS-gated, skips gracefully when env vars absent) and `pagefind` indexing on `astro:build:done`.
* Many one-off scripts under `src/scripts/`, run from `package.json` and `wireit` blocks.
* `wireit` orchestrates release, clean, package generation, linting, and update flows.

### Tests and validation

* Vitest unit tests co-located with sources; `vitest.config.js` uses `getViteConfig` plus `vite-tsconfig-paths`; optional browser project gated on `VITEST_BROWSER=true`.
* Playwright e2e (`playwright.config.ts`) with a single chromium project, `webServer` running `npm run dev`, `baseURL` `http://localhost:4321`.
* Validation commands available: `npm test`, `npm run check`, `npm run lint:markdown`, `npm run lint:styles`, `npm run lint:secretlint`, `npm run biome:check`.

### CI/CD and deployment

* `.github/workflows/tests.yml`: unit tests on push/PR to `main`. Uses unpinned `actions/checkout@v6` and `actions/setup-node@v6`, `contents: write` permission, no `persist-credentials: false`.
* `.github/workflows/lighthouse.yml`: post-deploy Lighthouse audits, SHA-pinned actions, `persist-credentials: false`, least-privilege permissions.
* `.github/workflows/screenshot.yml`: weekly homepage screenshot commit, SHA-pinned actions, `node-version: 25` hardcoded.
* `.github/workflows/update-issues.yml`: label cleanup on issue close, unpinned `mondeja/remove-labels-gh-action@v2`.
* Deployment via Netlify; `netlify.toml` has an empty build command (build handled outside the Netlify build step) and a trailing-slash 301 redirect.

### Documentation and agent instructions

* `CLAUDE.md`: accurate project overview, commands, architecture, conventions.
* `AGENTS.md`: core rules, design-system and TODO conventions, commit format. Delegates detail to `ai/` (symlinked to the sibling `../ai/ai/` repo). `ai/instructions/`, `ai/skills/`, `ai/prompts/`, `ai/templates/`, and `ai/workflows/` are now accessible; `ai/instructions/project.instructions.md` and `ai/agents/` are still absent.
* `DESIGN.md`: token source of truth, linted via `npx @google/design.md`.

## Findings

### Critical

* None. The build, type-check, and unit tests all pass; there are no findings that block shipping.

### High

* `ai/instructions/project.instructions.md` and `ai/agents/` are referenced in `AGENTS.md` but do not exist. The `ai/` symlink was added (pointing to the sibling `../ai/ai/` repo), so `ai/instructions/`, `ai/skills/`, `ai/prompts/`, `ai/templates/`, and `ai/workflows/` are now present; only `project.instructions.md` and the `agents/` directory are still missing.
* `npm run lint:markdown` exits non-zero with 38+ errors across `src/content/blog/**` (MD049 emphasis style, MD001 heading increment, MD045 missing alt text, MD060 table column style, MD033 inline HTML, MD040 fenced code language, MD036/MD054). This lint gate is currently red.
* `package.json` uses floating version ranges that violate the static-version convention: `@vitest/browser-playwright: "^4"`, `@vitest/coverage-v8: "^4"`, `@vitest/ui: "^4"`, `vitest: "^4"`, and `brace-expansion: ">=5.0.6"`.
* Dead Tailwind utility in `src/styles/theme.css:246`: `@apply scrollbar-thumb-gray-800 scrollbar-track-gray-900;` on `body`. No `tailwind-scrollbar` plugin is installed and these utilities are not defined, so Tailwind silently drops them. Real scrollbar styling is the unrelated `--sb-*` block below it.

### Medium

* Seven test files omit the mandatory `// @vitest-environment node` header (documented as a MUST in `CLAUDE.md`): `src/utils/content.test.ts`, `src/utils/github.test.ts`, `src/utils/color.test.ts`, `src/utils/content-object.test.ts`, `src/test/browser/heading.browser.test.ts`, `src/test/theme.tokens.test.ts`, `src/content/blogroll.test.ts`.
* CI inconsistency: `tests.yml` uses unpinned action tags (`actions/checkout@v6`, `actions/setup-node@v6`), lacks `persist-credentials: false`, and grants `contents: write` to a read-only test job. The other workflows pin actions to SHAs and set least-privilege permissions.
* `npm audit` reports 45 vulnerabilities (3 low, 16 moderate, 26 high), almost all transitive: `yaml` via `@astrojs/check` toolchain, `uuid`/`tempfile` via `@davidsneighbour/imagemin-lint-staged`. None are in production runtime code paths.
* Duplicated, fragile helpers in `src/utils/content.ts`: `getVSCodeLink` and `getVSCodeURL` (lines 537-557) are byte-identical. Both build a path with `projectRoot + relativePath` (string concatenation, not `path.join`), which only produces a valid path because callers pass a leading-slash argument; `node:path`/`node:url` are re-imported mid-file (lines 529-530) duplicating top-of-file usage.
* `@ts-ignore` in `src/utils/content.ts:402` (`getHomepagePosts`) suppresses a non-null narrowing that could be expressed type-safely. Additional `@ts-ignore` clusters in `src/components/features/comments/Giscus.astro` and `src/utils/tags.ts`.

### Low

* `.nvmrc` pins `25` but the local toolchain is `v26.3.0`. CI reads `.nvmrc` so CI is consistent; only local dev drifts. The `screenshot.yml` workflow hardcodes `node-version: 25` instead of `node-version-file: .nvmrc`.
* Playwright `webServer` launches `npm run dev` (served over HTTPS per project setup) while `baseURL` and `webServer.url` use `http://localhost:4321`. `ignoreHTTPSErrors` masks TLS issues but the scheme mismatch can cause connection failures depending on how `astro dev` binds.
* Fourteen `src/utils/*.ts` modules have no co-located test, including `opengraph.ts`, `tags.ts`, and `schema.ts` (the latter two feed `content.config.ts`): `content.pure.ts`, `datetime.ts`, `feed-og-image.ts`, `helpers.ts`, `icon-names.ts`, `image-index.ts`, `logger.ts`, `navigation.ts`, `opengraph.ts`, `releases.ts`, `schema.ts`, `tags.ts`, `tailwind.ts`, `theme.ts`.
* `astro.config.ts:13` imports `buildHooks` from `./src/scripts/build-hooks.ts`, but `src/scripts` is excluded from `tsconfig.json`. This works at runtime but means the integration code is outside type-checking coverage.
* `src/env.d.ts` declares `ImportMetaEnv` with only `DB_PASSWORD` and `PUBLIC_POKEAPI`, neither of which matches the documented env vars (`YOUTUBE_API_KEY`, `FRESHRSS_*`, `GH_TOKEN`). The declaration appears stale.
* `lint:design` depends on `npx @google/design.md`, which is not installed locally; it relies on an on-demand npx fetch each run.
* `OpenGraphImage.astro:460` has a bare `console.log("error")` inside a cleanup catch block instead of structured logging via the existing `log` instance.

## Recommended changes

### 1. Create the missing `ai/instructions/project.instructions.md` and `ai/agents/` directory

* Title: Add missing project.instructions.md and agents/ to the ai/ layout
* Priority: [P1]
* Area: Documentation and agent instructions
* Evidence: `AGENTS.md` line 5 names `ai/instructions/project.instructions.md` as the source of project purpose and context; `AGENTS.md` line 13 lists `ai/agents/` as the composed-agent-profile directory. Neither path exists in the now-symlinked `ai/` layout. `find -L ai/ -type f | sort` confirms only `instructions/systems/`, `instructions/tailwindplus.instructions.md`, `instructions/typescript-programming.instructions.md`, `skills/`, `prompts/`, `templates/`, and `workflows/` are present.
* Why it matters: Agents are told to look at `project.instructions.md` for the scope and context of this repository. Without it the instruction-precedence chain still has a broken first link.
* Suggested change: Create `ai/instructions/project.instructions.md` (in the sibling `ai` repo or directly in the symlinked path) with project purpose, scope, and context. Create `ai/agents/` as an empty directory or with a placeholder agent profile.
* Risk: Low. Documentation-only.
* Validation command: `ls ai/instructions/project.instructions.md && ls ai/agents/`

### 2. Fix or auto-fix the failing markdown lint gate

* Title: Resolve markdownlint failures in blog content
* Priority: [P1]
* Area: Content system
* Evidence: `npm run lint:markdown` exits 1 with 38+ errors (MD049, MD001, MD045, MD060, MD033, MD040, MD036, MD054) across `src/content/blog/**`.
* Why it matters: A red lint gate erodes trust in the check and hides real content issues such as missing image alt text (accessibility).
* Suggested change: Run `npm run lint:markdown:fix` for auto-fixable rules (MD049, MD060), then manually address MD045 (alt text) and MD001/MD036 (heading structure).
* Risk: Low to medium. Auto-fix touches published content; review the diff before committing.
* Validation command: `npm run lint:markdown`

### 3. Pin floating dependency versions

* Title: Replace `^`/`>=` ranges with static versions
* Priority: [P2]
* Area: Dependencies
* Evidence: `package.json` lines 70-72, 79, 123: `@vitest/*: "^4"`, `vitest: "^4"`, `brace-expansion: ">=5.0.6"`.
* Why it matters: `CLAUDE.md` mandates static versions ("no `^` or `~` ranges") for reproducible installs.
* Suggested change: Resolve each to its currently installed exact version (from `package-lock.json`) and write that literal into `package.json`.
* Risk: Low. No behavioural change; locks reproducibility.
* Validation command: `npm install && npm test`

### 4. Remove the dead scrollbar utility on body

* Title: Drop undefined `scrollbar-thumb-*`/`scrollbar-track-*` utilities
* Priority: [P2]
* Area: Styling
* Evidence: `src/styles/theme.css:246` `@apply scrollbar-thumb-gray-800 scrollbar-track-gray-900;`; no `tailwind-scrollbar` plugin in `package.json`; functional scrollbar styling is the separate `--sb-*` block (lines 508-562).
* Why it matters: The utilities are silently dropped, so the line is misleading dead code that implies styling that never applies.
* Suggested change: Delete the `@apply scrollbar-thumb-* scrollbar-track-*` line, or install and configure a scrollbar plugin if those classes are genuinely wanted.
* Risk: Low. Removes a no-op.
* Validation command: `npm run lint:styles && npm run build`

### 5. Add missing `@vitest-environment node` headers

* Title: Add mandatory environment header to seven test files
* Priority: [P2]
* Area: Tests and validation
* Evidence: `grep -rL "@vitest-environment node"` finds `content.test.ts`, `github.test.ts`, `color.test.ts`, `content-object.test.ts`, `heading.browser.test.ts`, `theme.tokens.test.ts`, `blogroll.test.ts`.
* Why it matters: `CLAUDE.md` states every test file MUST start with this header; the default jsdom environment can mask node-specific behaviour.
* Suggested change: Prepend `// @vitest-environment node` to each non-browser file (the browser test should instead carry the browser environment if intentional).
* Risk: Low. Test-only.
* Validation command: `npm test`

### 6. Harden the unit-test workflow to match CI conventions

* Title: Pin actions and tighten permissions in tests.yml
* Priority: [P2]
* Area: CI/CD and deployment
* Evidence: `.github/workflows/tests.yml` uses `actions/checkout@v6`, `actions/setup-node@v6`, `permissions: contents: write`, and omits `persist-credentials: false`; sibling workflows pin SHAs and use least privilege.
* Why it matters: Inconsistent supply-chain hardening; a write-scoped token on a test job is unnecessary privilege.
* Suggested change: Pin both actions to commit SHAs, set `permissions: contents: read`, and add `persist-credentials: false` to the checkout step.
* Risk: Low. CI-only.
* Validation command: `gh workflow run tests.yml` (or push to a branch and observe the run)

### 7. Deduplicate and fix the VS Code link helpers

* Title: Consolidate getVSCodeLink/getVSCodeURL and use path.join
* Priority: [P3]
* Area: Build / TypeScript
* Evidence: `src/utils/content.ts:537-557` defines two identical functions; both use `projectRoot + relativePath` and re-import `node:path`/`node:url` at lines 529-530.
* Why it matters: Duplicated logic and string-concatenated paths are fragile (correct only because callers pass a leading slash) and the mid-file imports break the ESM import-ordering convention.
* Suggested change: Keep one function, build the path with `path.join`/`path.resolve`, move imports to the top of the file, and re-export the alias if both names are needed.
* Risk: Low. Verify callers still receive a valid `vscode://file/...` link.
* Validation command: `npx vitest run src/utils/content.test.ts && npm run check`

### 8. Add tests for schema-feeding utility modules

* Title: Cover opengraph/tags/schema utilities with unit tests
* Priority: [P3]
* Area: Tests and validation
* Evidence: 14 `src/utils/*.ts` modules lack co-located tests, including `opengraph.ts`, `tags.ts`, and `schema.ts` which feed `content.config.ts`.
* Why it matters: `CLAUDE.md` requires a co-located test whenever observable behaviour changes; these modules influence build-time content validation and OG output.
* Suggested change: Add focused unit tests for the pure functions in `schema.ts`, `tags.ts`, and `opengraph.ts` first.
* Risk: Low. Additive.
* Validation command: `npm run test:coverage`

### 9. Refresh stale env and node-version declarations

* Title: Align env.d.ts and node version pins with documented env
* Priority: [P3]
* Area: Build / TypeScript
* Evidence: `src/env.d.ts` declares only `DB_PASSWORD`/`PUBLIC_POKEAPI`; documented vars are `YOUTUBE_API_KEY`, `FRESHRSS_*`, `GH_TOKEN`. `.nvmrc` is `25` while local Node is `v26.3.0`; `screenshot.yml` hardcodes `node-version: 25`.
* Why it matters: The type declarations no longer reflect real configuration, and the node-version pins drift between local, `.nvmrc`, and one workflow.
* Suggested change: Update `ImportMetaEnv` to the env vars actually consumed; switch `screenshot.yml` to `node-version-file: .nvmrc`; confirm the intended Node major and update `.nvmrc` accordingly.
* Risk: Low.
* Validation command: `npm run check`

## Questions

* `ai/` is now symlinked to `../ai/ai/` — should `project.instructions.md` be created in the shared `ai` repo and pulled in via the symlink, or should it live in this repo directly (perhaps as `ai/instructions/kollitsch-dev.instructions.md` to avoid collision with other consumers of the shared layout)?
* Running `node src/scripts/*.ts` (rather than `npx tsx`) appears intentional given Node's native TypeScript support, but it contradicts `CLAUDE.md`. Should `CLAUDE.md` be updated to reflect `node` usage, or should the scripts move to `npx tsx`?
* Is the empty Netlify build command (`command = ""`) deliberate because the build runs in a pre-step or via the CLI deploy, and is the production build covered by any CI gate before deploy?
* For Playwright, does `astro dev` serve plain HTTP on `4321` in CI, or should `baseURL`/`webServer.url` use `https`?

## Deferred ideas

* [IDEA] Add a markdown lint pre-commit hook (via `lint-staged`) so content style issues are caught before they accumulate.
* [IDEA] Introduce a CI job that runs `astro check` and `lint:markdown` on pull requests, so type and content gates run alongside the existing unit-test workflow.
* [IDEA] Replace the duplicated `@ts-ignore` clusters in `Giscus.astro` with a typed wrapper around the Giscus global, improving type coverage of the comments component.
* [IDEA] Move `src/scripts` back under type-checking (a dedicated `tsconfig.scripts.json`) so build-time integration code such as `build-hooks.ts` is validated.
* [IDEA] Carry forward the pre-existing DESIGN.md backlog (sidebar tokens with no defined values, semantic colour roles, dark-mode token pairs, form/navigation/motion/component token coverage, icon-system documentation) noted in the previous TODO.md.

## Validation log

```text
$ npm install 2>&1 | tail -5
Some issues need review, and may require choosing
a different dependency.
Run `npm audit` for details.
# exit 0 (install succeeded; audit advisory only)

$ npm test 2>&1
 Test Files  79 passed | 1 skipped (80)
      Tests  237 passed | 2 skipped (239)
   Duration  3.98s
# exit 0

$ npx astro check --minimumSeverity=warning 2>&1 | tail -60
Result (254 files):
- 0 errors
- 0 warnings
# exit 0

$ npm run lint:markdown
# 38+ errors across src/content/blog/** (MD049, MD001, MD045, MD060, MD033, MD040, MD036, MD054)
# exit 1

$ npm audit 2>&1 | tail
45 vulnerabilities (3 low, 16 moderate, 26 high)
# mostly transitive (yaml via @astrojs/check; uuid/tempfile via imagemin-lint-staged)

$ cat .nvmrc; node --version
25
v26.3.0

$ ls -la ai
lrwxrwxrwx 1 patrick patrick 9 Jun 13 17:41 ai -> ../ai/ai/
$ find -L ai/ -type f | sort
ai/docs/conventions.md
ai/docs/repository-structure-and-features.md
ai/instructions/systems/design-governance.instructions.md
ai/instructions/systems/es2025-js.instructions.md
ai/instructions/tailwindplus.instructions.md
ai/instructions/typescript-programming.instructions.md
ai/prompts/...  (14 prompt files)
ai/skills/...   (6 skill directories)
ai/templates/behaviour-spec.template.md
ai/workflows/behaviour-spec-workflow.md
# ai/instructions/project.instructions.md — MISSING
# ai/agents/                              — MISSING

$ git ls-files | grep -E '^\.env$'
# (no output) — .env is correctly untracked
```
