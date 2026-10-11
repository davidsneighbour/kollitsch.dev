# Publication

## Purpose

Establish publication readiness and action boundaries.

## Input

All publish-preset results, `documentation/content/draft-status.md`, `src/utils/content.pure.ts`, post route, repository gates, hooks, and deployment instructions.

## Verify

Draft state, intended publication date, route/aliases, rendered page and metadata, generated social assets/thumbnails, required checks, and authorised publication action. Do not assume future dates implement scheduling or `publisher: validate` publishes a post.

## Method

Inspect draft filtering and route consumers. Review final page output using the required dev-server lifecycle or an authenticated full build; type checking is not render evidence. Run `npm test` and `npx astro check` after changes, then required commit hooks. Hooks may generate/stage assets; inspect their diff. Follow issue/commit/push requirements; deploy only within explicit user authority.

## Output

Readiness blockers/warnings, draft/date, route, rendered evidence, gate results, generated assets, commit/push state, and deployment evidence separately.

## Pass/fail

Ready requires completed publish-preset checks and repository gates without unresolved errors/blockers. Partial checks or unavailable full validation cannot pass readiness. A draft may be ready for the requested state change but is not yet published.

## Remediation

Change draft/date only within the requested publication intent; preserve historical dates. Do not bypass hooks, fabricate scheduling, or report a push as verified live deployment.
