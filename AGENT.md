# Agent contract and pull request checklist

## Purpose

* Short, explicit rules for automated agents that make code changes here.

## What to include in an automated pull request

* Title: one short intent (for example, "fix: normalize PostMeta dates").
* Description: one or two short sentences of intent and user-visible change.
* Files changed: list changed files.
* Environmental variables needed: list them (for example `YOUTUBE_API_KEY`, `GH_TOKEN`) or `none`.
* Tests run by author: exact commands and results.

## Expected outputs

* `npm test` passes for related unit tests.
* Lint and format checks are fixed or noted (`npm run biome:check`, `npm run biome:format`).
* If builds are affected, include a short smoke-check step.

## Common error modes

* Missing API keys (YouTube, GitHub) - list required vars and provide a fallback.
* Long scripts (screenshots, image work) - note runtime and avoid running in CI when applicable.
* GitHub API permission errors - list required token scopes.

## Minimal validation steps (author-run)

1. Install dependencies:

```bash
npm install
```

1. For local iterations that use build integrations, set a fake YouTube key:

```bash
echo "YOUTUBE_API_KEY=fake_key_for_testing" > .env
```

1. Run unit tests:

```bash
npm test
```

1. Optional smoke checks (when applicable):

```bash
# Verify sitemap script
npx tsx src/scripts/verify-sitemap.ts --sitemap-index https://kollitsch.dev/sitemap-index.xml --delay-ms 1000

# Run dev server (for manual inspection)
npm run dev
```

## Pull request review checklist for humans

* Do the unit tests cover the changed behavior? If not, ask for tests or a plan.
* Are required environmental vars documented in the PR, and do changes fail when missing?
* Did the author run `npm run biome:check` / `npm run biome:format` or explain why not?
* If the change touches scripts in `src/scripts/`, verify the invocation and whether `npx tsx` is needed.

## Template (copy into the pull request description)

```markdown
Summary: <one-line summary>

Files changed:
- <file1>
- <file2>

Env required to validate: <list|none>

Tests run:
- `npm test` -> <pass|fail>
- `npm run biome:check` -> <pass|warnings>

Validation steps for reviewer:
1. `npm install`
1. [optional] `echo "YOUTUBE_API_KEY=fake_key_for_testing" > .env`
1. `npm test`

Notes:
- <any known issues, long-running steps, or follow-ups>
```
