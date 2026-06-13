---
applyTo: "**"
---

# kollitsch.dev — Project Context

## Identity

Personal website and digital garden for Patrick Kollitsch at [kollitsch.dev](https://kollitsch.dev).
The site is a blog, web-development reference, and portfolio, built on Koh Samui, Thailand.

## Technology stack

* **Astro 6** — static output (`output: 'static'`), MDX, content collections
* **Tailwind CSS 4** — `@theme`/`@layer`/`@utility` architecture, single stylesheet at `src/styles/theme.css`
* **TypeScript** — strict mode, ESM only, path aliases via `tsconfig.json`
* **Vitest** — unit tests co-located with sources
* **Playwright** — e2e tests under `src/test/`
* **Netlify** — static deployment, trailing-slash 301 handled in `netlify.toml`

## Key file locations

| Purpose | Path |
| :------ | :--- |
| Project config | `astro.config.ts` |
| Content schemas | `src/content.config.ts` |
| Global styles | `src/styles/theme.css` |
| Design tokens | `DESIGN.md` |
| Site metadata | `src/data/setup.json` |
| Navigation | `src/data/topnavigation.json`, `src/data/footernavigation.json` |
| Build hooks | `src/scripts/build-hooks.ts` |
| OG image pipeline | `src/components/layout/head/OpenGraphImage.astro` |

## Project conventions

* All agent-facing core rules are in `AGENTS.md`.
* All design decisions are in `DESIGN.md`; read it before touching CSS or components.
* Open tasks are in `TODO.md` with priority labels `[P0]`–`[P3]` and `[IDEA]`.
* Commit messages follow the conventional-changelog format defined in `AGENTS.md §5`.
* Blog posts live in `src/content/blog/YYYY/slug/index.{md,mdx}`.
* Scripts run with `npx tsx`, never with `node` directly.
* Static dependency versions only — no `^` or `~` ranges in `package.json`.
* British English throughout.

## Environment variables

Required for full builds; set in `.env` (gitignored):

| Variable | Used by |
| :------- | :------ |
| `YOUTUBE_API_KEY` | YouTube build scripts (use `fake_key_for_testing` locally) |
| `FRESHRSS_BASE_URL` | RSS feed generation |
| `FRESHRSS_USERNAME` | RSS feed generation |
| `FRESHRSS_API_PASSWORD` | RSS feed generation |
| `GH_TOKEN` / `GITHUB_TOKEN` | GitHub release scripts in CI |
