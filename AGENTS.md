# Repository Guidelines

## Project Structure & Module Organization
- `src/pages` contains Astro routes; `src/layouts` wraps shared shells; `src/components` holds reusable UI; `src/styles` stores global and utility styles.
- Content/data live in `src/content` and `src/data`; assets/icons stay in `src/assets` or `public`. Automation sits in `src/scripts`.
- Tests reside in `src/test` (Vitest and Playwright) with root configs. Production builds emit to `dist/`.

## Build, Test, and Development Commands
- Use `npm ci`; do not edit or commit `package-lock.json` unless explicitly requested.
- `npm run dev` starts the Astro dev server on port 4321; `npm run dev:verbose` adds logging.
- `npm run build` runs `astro check` then builds; `npm run preview` serves the build locally.
- Lint/format with `npm run biome:check` / `npm run biome:format`; extra checks: `npm run lint:markdown`, `npm run lint:styles`, `npm run lint:secretlint`.
- Test via `npm test` (Vitest), `npm run test:coverage`, and `npm run test:e2e` or `npm run test:live` for Playwright suites.

## Coding Style & Naming Conventions
- Biome formats TypeScript, Astro, and MDX (2-space indent). Run Biome before opening a PR.
- Components/layouts use PascalCase; utilities use camelCase; content slugs and assets use kebab-case to match URLs.
- Keep Tailwind utility usage consistent and place shared tokens or globals in `src/styles`.

## Testing Guidelines
- Prefer focused Vitest specs (`*.spec.ts`/`*.test.ts`) in `src/test` or near the code; add coverage with new logic or fixes.
- Keep Playwright suites in `src/test/browser`; avoid live APIs and use fixtures/mocks where possible.
- Note required env vars for tests (e.g., `YOUTUBE_API_KEY`, `RESEND_API_KEY`) and provide safe defaults for local runs.

## Commit & Pull Request Guidelines
- Use Conventional Commits (`type: scope subject`), e.g., `feat: add hero animation` or `fix: normalize post metadata`.
- Keep PRs narrowly scoped; include a summary, linked issues, tests executed, and screenshots for visual changes.
- Ensure `npm run biome:check`, `npm test`, and relevant Playwright suites are green; call out any intentional skips.
- Do not include `package-lock.json` changes unless the task is explicitly about dependency updates. Remove accidental lockfile diffs.

## Package Management Rules
- Never edit `package-lock.json` by hand or run commands that rewrite it (e.g., `npm audit fix`).
- If a task requires dependency updates, coordinate and document it; otherwise rely on `npm ci`.

## Git Rules & Project Notes
- Avoid committing lockfile changes unless dependency updates are the goal; otherwise revert accidental diffs.
- Lockfiles are manually maintained; automated regeneration is discouraged.
