# AGENT contract and PR checklist

Purpose
- Short, machine- and human-readable contract for automated agents making code changes in this repo.

What to include in an automated PR
- Title: short intent (e.g., "fix: normalize PostMeta dates").
- Description: 1–2 sentences of intent and user-visible change.
- Files changed: bullet list of modified files.
- Env required to validate: list required env vars (e.g., `YOUTUBE_API_KEY`, `GH_TOKEN`) or `none`.
- Tests run by author: list exact commands and results (see Validation below).

Expected outputs
- `npm test` passes for unit tests related to your change.
- Lint/format checks are either fixed or documented (`npm run biome:check`, `npm run biome:format`).
- If change touches scripts or content that affect builds, include a short smoke-check (see Validation).

Common error modes
- Missing API keys (YouTube, GitHub) — document required vars and add fallback behavior when possible.
- Long-running scripts (image generation, screenshots) — avoid running in CI unless necessary; provide time estimates.
- Permission errors when hitting GitHub APIs — note required scopes and tokens.

Minimal validation steps (author-run)
1. Install deps:

```bash
npm install
```

2. For local iterations that touch build integrations, set a fake YouTube key:

```bash
echo "YOUTUBE_API_KEY=fake_key_for_testing" > .env
```

3. Run unit tests:

```bash
npm test
```

4. Optional smoke checks (only when relevant):

```bash
# Verify sitemap script
npx tsx src/scripts/verify-sitemap.ts --sitemap-index https://kollitsch.dev/sitemap-index.xml --delay-ms 1000

# Run dev server (for manual inspection)
npm run dev
```

PR review checklist for humans
- Do the unit tests cover the changed behavior? If not, ask for tests or a plan.
- Are required env vars documented in the PR? Can the change fail silently if they are missing?
- Did the author run `npm run biome:check` / `npm run biome:format` or explain why not?
- If the change touches scripts in `src/scripts/`, verify the invocation and whether `npx tsx` is needed.

Template (copy into PR description)

```
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
2. [optional] `echo "YOUTUBE_API_KEY=fake_key_for_testing" > .env`
3. `npm test`

Notes:
- <any known issues, long-running steps, or follow-ups>
```

Keep this file minimal and machine-friendly. If you want a stricter automated template or a PR generator, I can add a GitHub PR template that agents can pre-fill.
