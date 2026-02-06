---
applyTo: "**/*"
---

# Project-specific instructions

Normative keywords follow RFC 2119 semantics. See [docs/rfc-2119.md](../../docs/rfc-2119.md).

## Project structure and module organisation

* `docs` contains notes and documentation of features.
* `public` hosts static files copied as-is to the build output.
* `src/assets` is used for dynamically created assets.
* `src/components` holds reusable UI components.
* `src/config` contains configuration for third-party tools that are not part of the website runtime.
* `src/content` contains Markdown and MDX content.
* `src/data` holds site configuration and static data.
* `src/layouts` defines shared layout shells.
* `src/netlify` contains Netlify-specific configuration and functions.
* `src/packages` contains the build system for packages.
* `src/pages` contains Astro routes.
* `src/scripts` contains automation scripts.
* `src/styles` stores global styles and utilities.
* `src/test` contains test suites (Vitest and Playwright).
* `src/types` contains TypeScript type definitions.
* `src/utils` contains TypeScript helpers and services.
* `dist` contains the build output after running `npm run build`.

## Building, testing, and development commands

* Use `npm ci` for dependency installation.
* `npx astro dev` starts the Astro development server on port 4321.  
  `npm run dev:verbose` enables additional verbosity.
* `npx astro build` runs `astro check` and then builds the site.  
  `npx astro preview` serves the production build locally.
* Lint and format using:
  * `npm run biome:check`
  * `npm run biome:format`
  * `npm run lint:markdown`
  * `npm run lint:styles`
  * `npm run lint:secretlint`
* Run tests via:
  * `npm test` (Vitest)
  * `npm run test:coverage`
  * `npm run test:e2e` (Playwright)
  * `npm run test:live` (runs tests against the live site)
* Changes that result in failing checks or tests are invalid for this repository.

## Coding style and naming conventions

* Biome formats TypeScript, Astro, and MDX.
* Components and layouts use PascalCase.
* Utilities use camelCase for functions and kebab-case for filenames.
* Content slugs and assets use kebab-case to match URLs.
* Keep Tailwind utility usage consistent and place shared tokens or globals in `src/styles`.
* Icons use the Lucide icon set.  
  The `<Icon />` component accepts icons in the format `lucide:ICONNAME`.  
  Available icons: <https://icon-sets.iconify.design/lucide/?keyword=lucide>

## Testing guidelines

* Prefer focused Vitest specs (`*.spec.ts` / `*.test.ts`) in `src/test` or colocated with the code.
* Add coverage for new logic and fixes.
* Keep Playwright suites in `src/test/browser`.
* Avoid live APIs in tests; use fixtures or mocks where possible.
* Document required environment variables for tests (e.g. `YOUTUBE_API_KEY`, `RESEND_API_KEY`) and provide safe defaults or skip logic for local runs.

## Commit and pull request guidelines

* Use Conventional Commits (`type: scope subject`), for example:
  * `feat: add hero animation`
  * `fix: normalize post metadata`
* Either run `npm run hooks:install` before committing and follow the interactive prompts, or format commits manually.
* Keep pull requests narrowly scoped.
* Include:
  * A concise summary
  * Linked issues
  * Tests executed
  * Screenshots for visual changes
* Pull requests are squashed when merged. Commit messages must be written accordingly.
* All tests and checks MUST pass before merging.
* `package-lock.json` MUST NOT be edited or committed unless explicitly requested.
* Dependency updates must be coordinated and documented when required; otherwise rely on `npm ci`.
* Added dependencies MUST be declared and documented in `src/packages/` with proper versioning.
  Run `npm compile:package` to update package builds.
* Package management is handled by Dependabot and Renovatebot.  
  AI tools may suggest updates if required for a task, but the final decision and execution MUST be confirmed by a human.

## Theme changes

* All theme changes MUST be approved by the design lead.
* Significant theme changes (for example colour palette or typography) MUST be documented in `docs/theme-changes.md` with rationale and impact analysis.

## Security practices

* Sensitive information such as API keys and secrets MUST NOT be hard-coded.
* Use environment variables for all secrets.
* New environment variables MUST be added to `.env.template` with comments explaining:
  * What to configure
  * How to obtain the values
