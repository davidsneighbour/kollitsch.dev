# AGENTS.md - Core Rules

## Main Purpose

The purpose, scope, and project-specific context of this repository are defined in `ai/instructions/project.instructions.md`.

## 0. Instruction Scope and Precedence

This repository uses a shared AI instruction layout under `./ai/`, mirrored where required by tooling (e.g. `.vscode/`):

* `ai/instructions/` - scoped behavioural and rule extensions
* `ai/skills/` - reusable procedures and capabilities
* `ai/prompts/` - reusable prompt entry points
* `ai/agents/` - composed agent profiles

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

## Deployment

This site is hosted on Netlify. You MUST fetch [https://netlify.ai](https://netlify.ai) to understand available features.
