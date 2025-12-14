# Agent instructions and normative rules

This file uses normative language as defined in RFC 2119. See [docs/rfc-2119.md](docs/rfc-2119.md) for details.

## Project Structure & Module Organization

* `docs` contains notes and documentation of features;
* `public` hosts static files copied as-is to the build output;
* `src/assets` will be used for dynamically created assets;
* `src/components` holds reusable UI;
* `src/config` contains configuration for any third-party tools that are not part of the website itself;
* `src/content` contains Markdown/MDX blog posts;
* `src/data` holds site configuration and static data/content;
* `src/layouts` wraps shared shells;
* `src/netlify` has Netlify-specific settings and functions;
* `src/packages` contains the build system for package.json;
* `src/pages` contains Astro routes;
* `src/scripts` contains automation scripts;
* `src/styles` stores global and utility styles;
* `src/test` holds test suites (Vitest and Playwright);
* `src/types` has TypeScript type definitions;
* `src/utils` has TypeScript helpers and services;
* `dist` will contain the build output after running `npm run build`;

## Building, Testing, and Development Commands

* Use `npm ci`; do not edit or commit `package-lock.json` unless explicitly requested.

* `npx astro dev` starts the Astro dev server on port 4321; `npm run dev:verbose` adds verbosity.

* `npx astro build` runs `astro check` then builds; `npx astro preview` serves the build locally.

* Lint/format with `npm run biome:check` / `npm run biome:format`; extra checks: `npm run lint:markdown`, `npm run lint:styles`, `npm run lint:secretlint`.

* Test via `npm test` (Vitest), `npm run test:coverage`, and `npm run test:e2e` for Playwright suites. `npm run test:live` will run tests on the live site.

* DO NOT commit any changes that result in failing checks or tests.

## Coding Style & Naming Conventions

* Biome formats TypeScript, Astro, and MDX.

* Components/layouts use PascalCase; utilities use camelCase for functions and kebab-case for filenames; content slugs and assets use kebab-case to match URLs.

* Keep Tailwind utility usage consistent and place shared tokens or globals in `src/styles`.

## Testing Guidelines

* Prefer focused Vitest specs (`*.spec.ts`/`*.test.ts`) in `src/test` or near the code; add coverage with new logic or fixes.

* Keep Playwright suites in `src/test/browser`; avoid live APIs and use fixtures/mocks where possible.

* Note required env vars for tests (e.g., `YOUTUBE_API_KEY`, `RESEND_API_KEY`) and provide safe defaults or skipped tests for local runs.

## Commit & Pull Request Guidelines

* Use Conventional Commits (`type: scope subject`), e.g., `feat: add hero animation` or `fix: normalize post metadata`. Either run `npm run hooks:install` before committing and follow the instructions on `git commit` or manually follow the format.

* Keep PRs narrowly scoped; include a summary, linked issues, tests executed, and screenshots for visual changes.

* PRs will be squashed when merged; write clear commit messages as they will appear in the main branch history.

* All tests MUST pass. `npm run biome:check`, `npm test`, and relevant Playwright suites MUST pass; call out any intentional skips.

* DO NOT commit lockfile changes. These changes will be done explicitly as needed to keep PRs clean. If a specific version is required for a package, specify it in `package.json` and document the reason in the MR. Revert accidental diffs.

* If a task requires dependency updates, coordinate and document it; otherwise rely on `npm ci`.

* Added dependencies MUST be added to `src/packages/` with proper versioning and documentation. Run `npm compile:package` to update package builds.

* Package management is maintained by Dependa- and Renovatebot. AI tools MAY suggest updating if that is required for a task, but the actual update MUST be confirmed by a human.

## Theme changes

* All theme changes MUST be approved by the design lead.

* Significant theme changes (e.g., color palette, typography) MUST be documented in `docs/theme-changes.md` with rationale and impact analysis.

## Security Practices

* Sensitive information (API keys, secrets) MUST NOT be hardcoded; use environment variables. Add new env vars to `.env.template` with comments what to configure, how to obtain the values.
