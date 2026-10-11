# AGENTS.md — Core Rules

This is the single onboarding document for every AI assistant working in this repository (Claude, Codex, Copilot, or any other agent). Read it before doing anything else. Do not add tool-specific entry files such as `CLAUDE.md`: Claude Code and Codex read this file directly, and a project `CLAUDE.md` would stop Claude Code from using it.

## Protected project rules

`AGENTS.md`, `DESIGN.md`, and all files under `.agents/instructions/` define binding rules for this project.

- Treat every applicable rule in these files as mandatory. Do not silently override, ignore, reinterpret, or weaken a rule because a user request conflicts with it.
- Each conflicting rule requires separate, explicit user confirmation before it may be violated. A confirmation covers only that rule and that change; it does not create a general exception. Do not combine several rule conflicts into one approval request.
- When the user confirms a change that contradicts a rule, update the relevant documentation or instruction in the same change so the written rules match the approved behaviour.

## Project overview

Personal website at [KOLLITSCH.dev*](https://kollitsch.dev): a digital garden, blog, and web development reference. Astro 6 (static output), Tailwind CSS 4, TypeScript, and React for a few UI components. Deployed locally to Cloudflare Workers Static Assets with Wrangler.

**Node version:** `package.json` `engines.node` (currently `>=26`) is the single source of truth; `.nvmrc` mirrors it. Even-numbered (LTS) majors are preferred.

RFC 2119 keywords (MUST, SHOULD, MAY, and so on) in this repository's documentation carry their standard meanings.

## Instructions, references, and skills

All project-specific agent assets live under `.agents/`.

- `.agents/instructions/`: behavioural rules with an `applyTo` glob. Evaluate every file and apply each one whose `applyTo` matches the files you work on. Applicable instructions are mandatory.
- `.agents/references/`: task knowledge without `applyTo`. Read the matching file when the task needs it:
  - `architecture.md`: orientation, directory layout, content collections, styling system, files for common tasks.
  - `build-and-deploy.md`: build pipeline, OG images, environment variables, Cloudflare hosting, deployment, workflows.
  - `issue-and-commit-workflow.md`: before creating or updating an issue, and before committing.
  - `keyboard-shortcuts-tinykeys.md`: adding or changing a keyboard shortcut.
  - `youtube-embed.md`: adding a YouTube video to a post.
- `.agents/skills/`: `kdev-*` skills are authored here and tracked (`kdev-kurzschnitte` for Kurzschnitte link-collection posts, `kdev-postreview` for reviewing one blog post). Other skills installed with `npm run skills:add` land here and are gitignored. `.claude/skills` and `.codex/skills` are tracked symlinks to `.agents/skills`; edit skills only under `.agents/skills/`. Globally installed skills may also be used; a project skill takes precedence over a global skill with the same name.
- Tool-local configuration such as `.claude/settings*.json` is gitignored machine configuration, not shared project policy.

If several instructions apply, the most specific scope wins, but no instruction may weaken or contradict this file.

## Global constraints

- Use strict British English and metric units.
- Do not use emojis or typographic (curly) quotes in repository files.
- Use backticks for paths, commands, file names, package names, and identifiers.
- If information is unknown or unverifiable, state: "I don't know".
- Previously established preferences are binding defaults. Do not re-question established conventions.
- Never expose internal reasoning, chain-of-thought, or meta-commentary.

## Communication

Communicate in a neutral, cordial but transactional technical register, like a CLI.

- Never apologise or express regret.
- Do not use discourse markers, filler, or evaluative acknowledgements ("Good.", "Great.", "Perfect.", "Good catch.", "Sure.", "Okay."), casual social phrases, rhetorical questions, or deferential phrasing ("let me also check", "want me to do that?").
- State information and actions directly: "Checking the config.", not "Let me also check the config."
- Do not end a response with an offer or a question about next steps. End with a factual status or a summary of what was produced; the user directs next steps.
- Do not imply a human agent. Avoid first-person "I"; use direct statements or passive voice ("Analysing", "This session lacks the context to parse this code", "High prediction confidence this will work").

## When to refuse

Refuse, briefly and neutrally, if a request violates established rules or locked decisions, requires speculation presented as fact, or demands hidden reasoning.

## Design system

`DESIGN.md` is the single source of truth for visual design.

- Read `DESIGN.md` first for any decision about colour, typography, spacing, radius, elevation, animation, or component styling. Do not use design values from memory.
- Update `DESIGN.md` with every design change (new tokens, changed values, new components, revised rationale), then run `npm run lint:design` until it reports 0 errors.
- Do not introduce values that are absent from `DESIGN.md`; add them there first. Use token references (`{colors.primary}`, `{rounded.md}`) in component token definitions, never inline raw values.

## Task tracking

GitHub Issues are the source of truth for actionable work. `PROJECT.md`, `TODO.md`, and `RESUME.md` are gitignored and local-only.

- Before larger work (issue-sized tasks, the first project task in a conversation), use the `resume-interrupted-work` skill when available. At minimum, if `RESUME.md` exists, read it, resolve or explicitly abandon that work, and delete `RESUME.md` before unrelated work.
- `PROJECT.md` is generated by the `project-task-triage` skill. Read it if useful; do not edit it unless the user says so.
- `TODO.md` is an append-only inbox: add entries, never remove or rewrite existing ones unless the user says so. When you find deferred or out-of-scope work and cannot open an issue, add it here, prefixed `[P0]` (blocking) to `[P3]` (nice to have) or `[IDEA]`; unlabelled items count as `P3`.

## Commits and documentation

This is a single-developer project.

- Commit directly to `main`. Do not create branches or pull requests unless asked, and never create merge commits; rebase or squash. Do not comment on working on `main`.
- Every committed AI-assisted change references a GitHub issue (`Closes #123` when it fully resolves it, `Refs #123` otherwise). When work starts from a plan with no issue, create the issue at the start, not at commit time. Read `.agents/references/issue-and-commit-workflow.md` before creating issues or committing.
- When a task is finished and validated (`npm test`, `npx astro check`, and lint-staged pass), commit and push to `main` without waiting to be asked. Do not push partial or unvalidated work. Commit validated config and content edits too, even small ones; uncommitted changes are not durable.
- Every feature has documentation in `documentation/`. Keep it describing the current state, not a history of changes.
- Give issues, pull requests, and commits as full GitHub URLs in chat.

## Scratch directory

`scratch/` is a gitignored directory for notes, prompts, plans, and one-off scripts that are useful later or elsewhere but must not be committed.

- Create a scratch file only when its content is useful outside the current task; one piece of work per file.
- Never modify a file in `scratch/` unless the instruction names its full path.
- If a referenced filename exists only under `scratch/`, ask: "Did you mean `scratch/<filename>`? Or should I look elsewhere?" and wait for the answer.

## Commands

```bash
npm run dev               # Astro dev server (https://localhost:4321) and documentation server (http://127.0.0.1:4322), auto-restarting
npm run check             # Type checks without building
npm test                  # Vitest unit tests (no API keys needed)
npm run test:e2e          # Playwright e2e (after a build)
npm run biome:check       # Lint and format check (biome:lint fixes)
npm run lint:markdown     # markdownlint on blog posts
npm run lint:styles       # stylelint on src/styles
npm run create:blog       # Scaffold a new blog post
node src/scripts/<file>.ts  # Run a TypeScript script (native type stripping)
```

Build and deploy commands are in `.agents/references/build-and-deploy.md`. Do not run `npm run build` in sandboxed environments without API tokens; use `npm run check`.

## Validation

- `npm test` MUST pass after every change. Fix the source, not the test.
- Add a co-located unit test whenever you change observable behaviour.
- "Visible" means visible to the human eye. Before reporting a visual change as working, confirm it in a real screenshot or live view, not only through DOM presence, computed opacity, or script-read pixels.
- When a check fails unexpectedly, read `documentation/development/known-false-positives.md` before re-diagnosing. Treat a failure as a real regression unless it is documented there; add a new entry only with hard evidence (computed values, screenshots, rasterised pixels) and a tracking issue, and never disable a check without that evidence.

## Dev server

Port `4321` is the Astro dev server. Other preview servers, Playwright `webServer` processes, and temporary HTTP servers use a port from `4400` to `4499`.

AI assistants own the full Astro dev-server lifecycle for every task that needs it and MUST NOT leave it running. Starting such a task is explicit authorisation to stop any existing Astro dev server, including one the user started. Run `npx astro dev stop`, start with `npx astro dev --background`, do the work, and run `npx astro dev stop` again, every time. Use `npx astro dev status` and `npx astro dev logs` when needed. Stopping a pre-existing server is expected cleanup: do not apologise or draw attention to it; "Stopped existing dev server." is enough.

## Code conventions

- ESM only (`"type": "module"`).
- Biome formats and lints (spaces, width from `.editorconfig`, multiline HTML attributes, imports sorted by `organizeImports`).
- Use the TypeScript path aliases from `tsconfig.json` (`@components/*`, `@utils/*`, and others) instead of deep relative imports.
- Use `fast-glob` for file globbing; `glob` is not installed.
- Explicit return types on exported functions are preferred. No tool enforces this; check it in review.
- Never import `.json` directly in `.astro` frontmatter (Astro strips `with { type: 'json' }` and warns `INCONSISTENT_IMPORT_ATTRIBUTES`); re-export it through a `.ts` module. In `.ts` files, every JSON import carries `with { type: 'json' }`, and the same JSON module is imported only once per file.
