# Copilot instructions

This repo is *kollitsch.dev*—an Astro + Tailwind + TypeScript site and digital garden. Use the notes below to act quickly and safely.

Core facts

* Astro (TypeScript), Tailwind CSS, ESM imports.
* Node: see `package.json` → `engines.node` for the required version (currently `>=26`). Install deps with `npm install`.
* External APIs: `YOUTUBE_API_KEY` and GitHub tokens affect `build` and `check`. For local work set `.env` with `YOUTUBE_API_KEY=fake_key_for_testing`.

Architecture

* Output: Astro generates static HTML (`output: 'static'`).
* Content: Markdown/MDX in `src/content/`, typed by `content.config.ts`. `astro:content` + `src/utils/content.ts` provide helpers (breadcrumbs, homepage feed, defaults).
* Integrations: `src/scripts/` contains data-sync scripts (YouTube, GitHub) used by CI or run manually; they require env tokens.
* Search: `pagefind` is configured in `astro.config.ts` and builds a client-side search index at build time.
* Dev server: `npm run dev` runs Vite. `astro.config.ts` registers `watchExtraFiles` to watch `src/assets/images` and `src/content/blog`; adding/removing files triggers a full reload.
* CI: workflows build the static site and run Playwright e2e against the preview.

Key commands

* `npm test`—Vitest unit tests. Tests are co-located with components.
* `npm run dev`—dev server.
* `npm run build` / `npm run preview`—production build and preview (requires API tokens for some scripts).
* `npm run test:e2e`—Playwright e2e (run after build).
* Lint/format: `npm run biome:check`, `npm run biome:lint`, `npm run prettier:check`/`fix`.

Project-specific patterns

* Vitest tests live next to components and must start with `// @vitest-environment node`.
* Run TS helper scripts with `node` directly—Node 26+ strips TypeScript types natively, no transpile step needed.
* Prefer ESM `import`/`export`.
* Don't change trailing-comma style.

Files to inspect when working on a feature

* `astro.config.ts`, `package.json`, `vitest.config.js`, `playwright.config.ts`—tooling and task entrypoints.
* `src/components/`—UI components and co-located tests.
* `src/content/` and `content.config.ts`—content collections and frontmatter handling.
* `src/scripts/`—project scripts; run with `node` (type stripping is native in Node 26+).

CI and PR expectations

* Unit tests run on PRs (`.github/workflows/tests.yml`). Make sure `npm test` passes locally.
* Pre-commit hooks via `lint-staged` and simple-git-hooks enforce formatting and secret checks. Run the linter/formatter early to avoid noisy CI failures.

Quick examples

* Add a component: create `src/components/MyThing.astro` and `src/components/MyThing.test.ts` (test must include `// @vitest-environment node`).
* If APIs are missing, set `YOUTUBE_API_KEY=fake_key_for_testing` in `.env` and run `npm run dev` for local work.

Do / Don't (short)

* Do run `npm test` before opening PRs. Focus on unit tests for rapid validation.
* Do use `node` for TS scripts (Node 26+ strips types natively) and ESM imports for code edits.
* Don't run `npm run build` or `npm run check` in a sandboxed environment without API keys—they will fail and slow iteration.

If something is ambiguous

* Point to the specific file (path + brief intent). The repo prefers concrete, small patches and co-located unit tests—include one when changing behavior.

Feedback request

* If any important build step, script path, or convention is missing from this short guide, tell me which area to expand and I will iterate.

Integration table (scripts and required env)

* `src/scripts/*youtube*.ts` or `src/scripts/youtube-*.ts`—requires `YOUTUBE_API_KEY` (set in `.env`). Without it `npm run build` or `npm run check` may fail.
* `src/scripts/*github*.ts`—scripts that interact with releases or repo data require a GitHub token (GH_TOKEN or GITHUB_TOKEN) in CI.
* `src/scripts/verify-sitemap.ts`—run with `node` for quick checks: `node src/scripts/verify-sitemap.ts --sitemap-index <url> --delay-ms 1000`.
* `src/scripts/blogroll-screenshots.ts`—used by workflows to generate images; example invocation in `.github/workflows/update-blogroll.yml`.

Developer quickstart (minimal)

1. Install deps: `npm install` (required Node version in `package.json` → `engines.node`; use `.nvmrc` with nvm to switch).
2. Create `.env` with at least: `YOUTUBE_API_KEY=fake_key_for_testing` for local iterations that touch build integrations.
3. Start dev server: `npm run dev` (Vite dev server; content changes will hot reload, added images trigger full reload).
4. Run tests: `npm test` (Vitest unit tests; fast and reliable).

Content and data flow (one-paragraph)

* Authors write Markdown/MDX in `src/content/` using frontmatter defined in `content.config.ts`. At build time Astro's content collection system (`astro:content`) loads these entries. Utilities in `src/utils/content.ts` transform and provide site data (breadcrumbs, homepage posts, defaults). Templates and components in `src/layouts/` and `src/components/` render pages. During build `pagefind` (configured in `astro.config.ts`) indexes the generated pages to create a client-side search index. Auxiliary scripts under `src/scripts/` may fetch or sync external data (YouTube, GitHub) before or during builds.

Watcher & dev reload details

* The project registers a small Vite plugin (see `watchExtraFiles` in `astro.config.ts`) that watches `src/assets/images` and `src/content/blog`. Adding or removing files in those locations triggers a full reload because the static output depends on their presence.

CI / PR checklist (concise)

* Run `npm test` locally and include test results in PR if failing.
* Run `npm run biome:check` and `npm run prettier:check` to avoid lint/format failures.
* If your change touches scripts or integrations, note required env vars in PR and consider adding a small test or run instruction.
* Do not rely on `npm run build` in sandboxed environments unless required API keys are available; CI will run full builds.

Agent contract for changes (what an automated agent should include in a PR)

* Inputs: list files changed, primary intent (1 sentence), env variables required to validate (for example, `YOUTUBE_API_KEY`).
* Outputs: tests that should pass (`npm test`) and a short smoke-check (for example, `node src/scripts/verify-sitemap.ts` if relevant).
* Error modes: missing API keys, permission errors from GitHub, long-running script timeouts. Add notes and fallback behavior where appropriate.

Troubleshooting (common fixes)

* Build or check fails referencing YouTube: set `YOUTUBE_API_KEY=fake_key_for_testing` in `.env` for local work.
* TypeScript helper scripts in `src/scripts/` use modern ESM/TS features: run them with `node` directly—Node 26+ handles type stripping natively without flags.
* Biome lint output is noisy; focus on changed files and run `npm run biome:lint` to autofix formatting for your edits.

AI assistant file locations

* **`ai/` MUST NOT be written to.** It is a global registry shared across all projects and contains non-project-specific rules only. Do not add anything there unless the user explicitly asks.
* Project-specific instructions belong in `.vscode/instructions/` (`.instructions.md` files, loaded automatically).
* Project-specific reusable prompts belong in `.vscode/prompts/` (`.prompt.md` files, invoked on demand).

Where to look for common tasks

* Change homepage feed: `src/utils/content.ts` (`getHomepagePosts`) and the homepage layout in `src/layouts/`.
* Update content schema/frontmatter: `content.config.ts`.
* Change search or indexing: `src/scripts/integrations/pagefind.ts` and `astro.config.ts` integrations.
* Change watcher behavior: `astro.config.ts` -> `watchExtraFiles` plugin.
