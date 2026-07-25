# kollitsch.dev project architecture and agent guidance

Use these notes when working in this repository.

## Project baseline

This repository is the source for `kollitsch.dev`.

The stack is:

* Astro 5+
* Tailwind CSS v4+
* TypeScript with strict settings
* ESM-only Node scripts
* Node: see `package.json` → `engines.node` for the required version
* npm
* Vitest
* Playwright
* Netlify
* Markdown, remark, and markdownlint tooling

Do not assume React is available unless a specific file proves it. Prefer Astro components, vanilla JavaScript, and progressive enhancement.

## General working rules

Before changing behaviour:

1. Inspect the surrounding files.
2. Follow imports.
3. Check existing conventions.
4. Prefer small, isolated changes.
5. Run the narrowest useful validation first.
6. Record unresolved questions instead of guessing.

Do not make unrelated refactors.

Do not deploy, publish, commit, push, or delete generated assets unless explicitly asked.

## Language and formatting

Use British English in prose and documentation.

Use metric units only.

Do not use emojis in repository files.

Do not use typographic quotes.

Use backticks for paths, commands, file names, package names, and identifiers.

## TypeScript and Node rules

Use ESM.

Do not use `any`.

Use `unknown` with type guards when dealing with untrusted input.

Do not leave empty `catch` blocks. Log, rethrow, or handle the error.

Prefer explicit return types for exported functions.

Prefer configuration through function parameters, config objects, or config files instead of hard-coded values.

Load environment variables according to project convention: user-level `~/.env` first, then project `.env`, where applicable.

Use npm scripts. Do not introduce another package manager.

Prefer `fast-glob` over `glob`.

## Astro architecture

Keep Astro-only logic separate from pure utilities.

Pure utilities should not import server-only Astro modules such as `astro:content`.

When a utility is intended to be testable without the Astro runtime, keep it in a `.pure.` file or another clearly pure module.

Astro collection utilities may import Astro APIs, but tests should avoid loading those modules unless the test environment is configured for them.

## Styling architecture

This project uses Tailwind CSS v4.

Prefer Tailwind v4-native patterns:

* `@theme` for design tokens
* `@utility` for custom utilities
* component classes with `@apply` where appropriate
* base layer only for true document-level defaults

Avoid reintroducing old Tailwind v3 assumptions.

Avoid `@layer utilities` for custom utilities unless there is a repository-specific reason.

Multiple `@theme` blocks are acceptable when they improve locality and readability.

Keep reading typography, UI typography, content width utilities, and theme tokens aligned. Avoid duplicated magic values.

## Astro scoped styles

Astro supports `:global()` in component styles, but generic CSS linters may flag it as an unknown pseudo-class.

Do not remove valid Astro syntax just to satisfy a generic CSS linter.

If the linter complains about valid Astro syntax, prefer a targeted linter configuration or scoped ignore over changing working Astro code.

## Content system

Content collection code should be split between:

* pure utilities that can be tested directly
* Astro-specific collection utilities that can import Astro APIs

Do not import `astro:content` from files used by generic Node or Vitest tests unless the test is specifically configured for Astro.

Descriptions in frontmatter should follow the project’s custom length expectations, currently 110 to 160 characters where enforced.

## Image and asset system

Image metadata, post images, and Open Graph images are centralised through project utilities.

Before changing image logic, inspect the existing image index and Open Graph helpers.

Avoid duplicating image lookup logic in components.

When adding image automation, make sure generated assets are deterministic where possible.

## Scripts

Scripts under `src/scripts/` are expected to be ESM and TypeScript-friendly.

CLI scripts should:

* expose configurable options
* validate input
* report errors clearly
* exit non-zero on failure
* avoid silent failure
* avoid destructive behaviour unless explicitly requested

Generated logs should go to the established project log location where applicable.

## Tests

Use Vitest for unit tests.

Keep pure utility tests independent of Astro server-only modules.

Use Playwright for browser/e2e behaviour.

When fixing tests, prefer splitting server-bound logic from pure logic over mocking large parts of Astro.

Useful validation commands include:

```bash
npm test
npx astro check
npm run lint:markdown
```

Check `package.json` for additional project-specific validation scripts before assuming the list is complete.

## GitHub Actions

Workflows should be hardened.

For `actions/checkout`, use:

```yaml
persist-credentials: false
```

Prefer pinned action hashes where the workflow already follows that convention.

Do not leave unnecessary write permissions enabled.

Only grant the minimum permissions needed by each job.

Schedule times are UTC unless explicitly converted. For tasks requested in UTC+7, convert the cron expression carefully.

Avoid workflows that commit, push, deploy, or open issues unless the user explicitly requested that behaviour.

## Lighthouse and audits

Lighthouse-related configuration belongs under `src/config/audits/` and should include `lighthouse` in the file name.

Prefer separate mobile and desktop runs through a matrix or clearly separated jobs.

Record run duration where audits are automated.

Avoid pretending to test slow networks unless the configuration actually does so.

## Documentation and AI instructions

**`ai/` is a global registry shared across all projects. It MUST NOT be written to unless the user explicitly asks.** It contains non-project-specific rules, skills, and instructions.

All project-specific AI assistant files for kollitsch.dev belong in:

* `.vscode/instructions/`—instruction files (`.instructions.md`) loaded automatically by AI assistants
* `.vscode/prompts/`—reusable prompt files (`.prompt.md`) invoked on demand

When adding documentation, rules, or guidance specific to this project (components, conventions, workflows), always write to `.vscode/instructions/` or `.vscode/prompts/`, never to `ai/`.

Prompt files use frontmatter where appropriate.

When adding or changing reusable prompts, prefer clear names such as `project-health-check.prompt.md`.

Instruction specificity matters. More specific instructions override broader ones, but must not weaken core AGENTS.md rules.

## TODO.md audit workflow

When asked to audit the repository, create or update `TODO.md`.

The audit should include:

* a short repository summary
* a system map
* findings by priority
* concrete recommendations
* evidence
* validation commands
* unresolved questions
* deferred ideas

Do not mix speculative ideas with confirmed issues. Mark uncertainty clearly.

Every TODO item should be actionable by a future agent.
