# AGENTS.md - Core Rules

## Main Purpose

The purpose, scope, and project-specific context of this repository are defined in `.vscode/instructions/project.instructions.md`.

## 0. Instruction Scope and Precedence

This repository uses a shared AI instruction layout under `./ai/` (symlinked from the sibling `ai` repository) for globally reusable instructions. Project-specific instructions live under `.vscode/instructions/`.

Shared layout directories:

* `ai/instructions/` - globally reusable scoped behavioural rules
* `ai/skills/` - reusable procedures and capabilities
* `ai/prompts/` - reusable prompt entry points

Project-specific instruction files (kollitsch.dev only):

* `.vscode/instructions/` - project context and project-scoped rules

AGENTS.md defines core, always-on rules only. Most detailed behaviour is delegated to the directories above.

### Precedence

If multiple documents apply:

1. The most specific scope wins
2. Core rules in AGENTS.md cannot be weakened or contradicted

### Instruction applicability

All files under `ai/instructions/` use `applyTo` frontmatter to declare their scope.  
The agent must evaluate all instruction files and apply every instruction whose `applyTo` pattern matches the current task context.  
Applicable instructions are mandatory, override default behaviour, and cannot be ignored or selectively applied.

## 1. Non-negotiable global constraints

* Use strict British English at all times.
* Maintain a cordial but transactional tone.
* Never apologise or express regret.
* If information is unknown or unverifiable, state: "I don't know".
* Previously established preferences are binding defaults.
* Do not re-question established conventions.
* Never expose internal reasoning, chain-of-thought, or meta-commentary.

## 2. When to refuse

The agent must refuse if:

* The request violates established rules or constraints.
* The request requires speculation presented as fact.
* The request demands hidden reasoning or internal chain-of-thought.
* The request conflicts with previously locked decisions.

Refusals must be:

* Short
* Neutral
* Without apology

## 3. Design System (DESIGN.md)

`DESIGN.md` in the repository root is the single source of truth for all visual design decisions.

* **Always read DESIGN.md first** for any decision involving colour, typography, spacing, border radius, elevation, animation, or component styling. Do not use design values from memory or inference.
* **Always update DESIGN.md** when any design-related change is made: new tokens, modified values, new components, or revised rationale. A design change without a DESIGN.md update is incomplete.
* Run `npm run lint:design` after every DESIGN.md edit to confirm 0 errors remain.
* Do not introduce design values that are absent from DESIGN.md. If a value is missing, add it to DESIGN.md before using it in code.
* Use token references (`{colors.primary}`, `{rounded.md}`, etc.) in component token definitions — never inline raw values.

## 4. Task and Idea Tracking (TODO.md)

`TODO.md` in the repository root tracks all open tasks, ideas, and deferred work.

### Priority levels

| Label | Meaning |
| :------ | :------- |
| `P0` | Address immediately — blocks progress or is a critical defect |
| `P1` | High priority — complete in the next working session |
| `P2` | Medium priority — planned, no hard deadline |
| `P3` | Nice to have — complete when convenient |
| `IDEA` | Worth thinking about — not committed, no timeline |

### Usage rules

* **Add an entry** whenever you identify work that is deferred, speculative, or out of scope for the current task.
* **Assign a priority label** (`P0`–`P3` or `IDEA`) to every new entry using the format `[P2]` at the start of the item.
* **Remove completed entries** immediately — do not leave stale checked items.
* Items without a priority label are treated as `P3`.
* Do not use TODO.md for current-session task tracking — only for deferred or future work.

## 5. Committing Changes

Commit at the end of every completed topic. Do not leave related changes uncommitted when moving to a different task.

### Format

```text
type(scope): short imperative subject (≤72 chars)

Body: describe every meaningful change. Use one bullet per logical
unit. Cover what changed, why it changed, and any non-obvious
decisions or constraints that informed the approach.
```

### Types

Use only the types defined in `.release-it.ts`:

| Type | Use for |
| :--------- | :------ |
| `content` | Blog posts, page copy, taxonomy changes |
| `feat` | New user-visible features or components |
| `fix` | Bug fixes and corrections |
| `build` | Build tooling, package.json, lock files, scripts |
| `chore` | Maintenance without user-visible effect |
| `ci` | CI/CD workflow files |
| `docs` | Documentation, AGENTS.md, CLAUDE.md, DESIGN.md |
| `perf` | Performance improvements |
| `refactor` | Code restructuring without behaviour change |
| `revert` | Reverts a prior commit |
| `style` | Visual/CSS changes with no logic change |
| `test` | Test files and test configuration |

### Scopes

Scopes are optional but strongly preferred. Use a noun that names the affected area, for example: `components`, `layout`, `styles`, `config`, `scripts`, `ci`, `deps`, `design`, `content`, or a specific component name such as `SourceCodeLink`.

### Body requirements

* List every file or area changed with a one-line explanation.
* State the reason for each change, not just what it does.
* Note any constraints, trade-offs, or follow-up work introduced.
* Breaking changes must be prefixed `BREAKING CHANGE:` in the body.

### Example

```text
feat(components): add SourceCode and SourceCodeLink components

- SourceCodeLink.astro: renders a single styled link to a source file;
  derives label from GitHub/GitLab URL path when not supplied explicitly;
  supports line and range deep-linking via #L{n}-L{m} fragments
- SourceCode.astro: wraps a frontmatter record of slug → url|entry pairs
  and renders a flex-wrapped list of SourceCodeLink badges; normalises
  the shorthand (slug: url) and detailed (slug: { source, ... }) forms
- content.config.ts: adds optional `sourcecode` Zod field to blogSchema;
  value is a record keyed by slug with a string or object union
- exactOptionalPropertyTypes required passing optional props via spread
  rather than direct attribute assignment to avoid TS2375
```

## 6. Scratch Directory

`scratch/` is a gitignored working directory for ephemeral notes, prompts, and artefacts that are useful in the current session or for use in another project but must not be committed to this repository.

### When to use scratch/

* Write a new file in `scratch/` whenever you produce something (a prompt, a plan, a reference note, a one-off script) that is useful for later or for another project but does not belong in the committed codebase.
* Each piece of work goes in its own individual file — do not append unrelated content to an existing scratch file.

### Hard rules

* **Never modify a file in `scratch/` unless the instruction names the full path explicitly** (e.g. `scratch/fix-dnbhq-release-config.prompt.md`). A bare filename such as `fix.md` is not sufficient.
* **Never create a scratch file unless its content would be genuinely useful outside the current task.** Do not use scratch as a scratchpad for intermediate reasoning.
* **Filename collision check:** if a filename referenced in a task cannot be found anywhere in the repository except under `scratch/`, stop immediately and ask: "Did you mean `scratch/<filename>`? Or should I look elsewhere?" Do not proceed, read, edit, or act on the scratch file until the answer is explicit.

## Deployment

This site is hosted on Netlify. You MUST fetch [https://netlify.ai](https://netlify.ai) to understand available features.
