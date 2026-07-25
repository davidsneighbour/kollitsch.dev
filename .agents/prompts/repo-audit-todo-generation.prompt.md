# Repository audit and TODO generation prompt

You are working in the `kollitsch.dev` repository.

Your task is to perform a complete repository audit and write the findings to `TODO.md`.

## Goal

Analyse the full codebase, understand how the system works, identify issues, and recommend concrete improvements.

The output must be practical, actionable, and safe to use for future development.

## Scope

Review all relevant parts of the repository, including but not limited to:

- Astro configuration and project structure
- TypeScript source files
- Astro components and layouts
- Tailwind CSS v4 setup
- CSS architecture, utilities, components, and theme tokens
- Content collections and content utilities
- Image handling, Open Graph image logic, and asset pipelines
- Scripts in `src/scripts/`
- Test setup and test coverage
- Vitest configuration
- Playwright configuration and e2e tests
- Markdown and remark/markdownlint tooling
- GitHub Actions workflows
- Lighthouse/audit configuration
- Netlify/deployment configuration
- Package scripts and dependency usage
- Environment variable handling
- Documentation and instruction files under `./ai/`
- Any AGENTS.md or agent-facing project instructions
- Any security, reliability, maintainability, accessibility, performance, or DX concerns

## Required approach

1. Read the repository structure first.
2. Identify the major systems and explain what each one appears to do.
3. Follow imports and scripts instead of judging files in isolation.
4. Prefer evidence from the repository over assumptions.
5. Do not modify unrelated files.
6. Do not make broad refactors.
7. Do not install or upgrade dependencies unless explicitly required.
8. If a command fails, record the failure and continue where possible.
9. If a finding is uncertain, mark it clearly as uncertain.
10. If a question comes up that blocks a correct recommendation, write it under a `Questions` section in `TODO.md`.

## Commands to run where possible

Run these from the repository root and record the result:

```bash
npm install
npm test
npx astro check
npm run lint:markdown
```

If the repository contains additional obvious validation scripts in `package.json`, inspect them and run only the safe, read-only checks. Do not run commands that deploy, publish, commit, push, delete files, or require credentials.

## Output file

Create or update `TODO.md`.

The file must be structured like this:

```markdown
# TODO

## Audit summary

Briefly describe the repository, the main systems, and the overall state.

## System map

Explain the major parts of the project and what each part does.

### Astro application

### Content system

### Styling system

### Image and asset system

### Scripts and automation

### Tests and validation

### CI/CD and deployment

### Documentation and agent instructions

## Findings

### Critical

Issues that can break builds, deployments, content generation, tests, security, or user-facing behaviour.

### High

Important maintainability, correctness, performance, accessibility, or DX issues.

### Medium

Useful improvements that are not urgent but should be planned.

### Low

Cleanup, consistency, documentation, naming, or convenience improvements.

## Recommended changes

For each recommendation include:

- **Title**
- **Priority**
- **Area**
- **Evidence**
- **Why it matters**
- **Suggested change**
- **Risk**
- **Validation command**

## Questions

List any questions that need Patrick's input before changing behaviour.

## Deferred ideas

List ideas that may be useful later but should not be acted on immediately.

## Validation log

Record commands run, whether they passed or failed, and key output.
```

## Recommendation quality rules

Each recommendation must be concrete enough that another agent can implement it without re-auditing the whole repository.

Bad:

```markdown
Improve CSS.
```

Good:

```markdown
Move repeated reading-width utility values into a single Tailwind `@theme` token and update the dependent `@utility` blocks. This reduces drift between `reading-*` classes and typography components.
```

## Priority rules

Use these priorities:

- **Critical**: broken build, broken deployment, data loss, security issue, broken production behaviour.
- **High**: likely bugs, fragile architecture, failing checks, major maintainability issue.
- **Medium**: useful optimisation, test coverage gap, documentation gap, repeated logic.
- **Low**: naming, formatting, small cleanup, nice-to-have consistency.

## Repository-specific expectations

This project uses Astro, Tailwind CSS v4, TypeScript, Node v24+, strict ESM, Vitest, Playwright, Netlify, markdown tooling, and custom automation.

Respect the following project conventions:

- Use British English.
- Use metric units only.
- Avoid emojis.
- Avoid typographic quotes.
- Keep paths in backticks.
- Do not use `any` in TypeScript.
- Avoid empty `catch` blocks.
- Prefer `unknown` with type guards where needed.
- Use ESM.
- Use npm only.
- Prefer `fast-glob` over `glob`.
- Treat `./ai/` as the location for prompts, skills, instructions, and agents.
- In GitHub Actions, use pinned action hashes where the repository already does so.
- In GitHub Actions checkout steps, use `persist-credentials: false`.
- Do not weaken AGENTS.md rules from more specific instructions.

## Final response

After creating `TODO.md`, reply with:

- Which files were changed.
- Which commands were run.
- Whether validation passed or failed.
- A short list of the most important findings.
- Any questions that need Patrick's input.
