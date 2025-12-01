# Repository Guidelines

## Project Structure & Module Organization

* `src/pages` holds Astro routes; `src/layouts` wraps shared shells; `src/components` contains reusable UI; `src/styles` hosts global and utility styles.

* Content lives in `src/content` and `src/data`; assets/icons stay under `src/assets` or `public`. Scripts and automation reside in `src/scripts`.
* Tests live in `src/test` (Vitest and Playwright) with configs in the repo root. Build output goes to `dist/`.

## Build, Test, and Development Commands

* Install dependencies with `npm ci` to respect the existing `package-lock.json` (do not edit or commit the lockfile unless the task explicitly requires it).

* `npm run dev` starts the Astro dev server on port 4321; `npm run dev:verbose` adds frontmatter/debug logging.
* `npm run build` performs `astro check` and produces the production bundle; use `npm run preview` to serve the build locally.
* Lint with `npm run biome:check`; format via `npm run biome:format`. Extra linting: `npm run lint:markdown` or `npm run lint:styles`.
* Test with `npm test` (Vitest), `npm run test:coverage` for coverage, and `npm run test:e2e` or `npm run test:live` for Playwright suites.

## Coding Style & Naming Conventions

* TypeScript, Astro, and MDX use Biome formatting (2-space indentation). Run Biome before opening a PR.

* Components and layouts use PascalCase filenames; utilities and hooks use camelCase; content slugs and asset files use kebab-case to match URL paths.
* Keep Tailwind utility usage consistent; place shared tokens and global styles in `src/styles`.

## Testing Guidelines

* Prefer focused Vitest specs (`*.spec.ts`/`*.test.ts`) in `src/test` or near the code under test. Add coverage when introducing new logic or fixing bugs.

* For end-to-end checks, favor Playwright suites in `src/test/browser`; avoid hitting live APIs and use fixtures/mocks where possible.
* Document required environment variables for tests (e.g., `YOUTUBE_API_KEY`, `RESEND_API_KEY`) and provide safe defaults for local runs.

## Commit & Pull Request Guidelines

* Use Conventional Commits (`type: scope subject`), e.g., `feat: add hero animation` or `fix: normalize post metadata`.

* Keep PRs narrowly scoped; include a summary, linked issues, test commands executed, and screenshots or recordings for visual changes.
* Ensure `npm run biome:check`, `npm test`, and relevant Playwright suites are green; note any intentional skips or follow-ups.
* Do not include `package-lock.json` changes unless the work is explicitly about dependency updates. Remove accidental lockfile diffs before requesting review.

## Package management rules

* Do not edit `package-lock.json` by hand.
* Do not stage or commit changes to `package-lock.json` unless explicitly requested in the task.
* When installing dependencies, prefer:
  * `npm ci` to install dependencies without changing `package-lock.json`.
* Never run `npm audit fix` or similar commands that update dependencies automatically.

## Git rules

* Avoid committing lockfile changes as part of feature PRs, unless the task is specifically about dependency updates.
* If `package-lock.json` ends up modified, revert it before committing unless the user explicitly asked to update it.

## Project notes

* This repository treats lockfiles as manually maintained; Codex should not regenerate or reformat them on its own.
