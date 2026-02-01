# SKILL: agent knowledge packaging

Purpose:
Turn a solved issue (bug, decision, refactor, integration) into durable, agent-consumable documentation that prevents regressions and reduces repeated context loading.

This SKILL is optimised for repositories that:

* use an AGENTS.md as a minimal index of rules and gotchas
* prefer detailed explanations in docs/
* routinely use AI agents (ChatGPT, Codex, Copilot) that need explicit constraints and canonical implementations

IMPORTANT:
If the user asks to 'make this AI-proof', 'document this for future agents', 'turn this into instructions', or similar, apply this SKILL.

## Inputs required

Collect the following (use what the user already provided; do not ask for more unless essential):

* Symptom description (what fails, what 'feels' broken)
* Reproduction steps (minimal, deterministic)
* Environment context (frameworks, runtime constraints, notable integrations)
* Final chosen fix (canonical code snippet(s))
* Any non-negotiable constraints (eg ClientRouter, bfcache, strict TypeScript, global namespaces)

## Outputs to produce

Always produce these artefacts:

1) Gotchas doc (deep explanation)
2) Conventions doc (short rules)
3) AI preamble doc (prompt-ready directive text)
4) AGENTS.md pointer snippet (minimal)

All artefacts MUST be written as Markdown files.

If the user asks for download links, generate the files as downloadable artefacts.

## File naming and placement conventions

Use the following naming patterns. The user may adjust paths, but content should follow this structure.

* docs/$TOPIC$-gotchas.md
* docs/$TOPIC$-conventions.md
* docs/ai-preamble-$TOPIC$.md

Topic slug rules:

* lowercase
* words separated by hyphens
* include major system noun phrases (eg 'astro-clientrouter', 'scrolling-animation', 'content-schema')

AGENTS pointer:

* one short bullet under a suitable section
* no long explanations in AGENTS.md
* always include doc paths explicitly

## Content requirements

### 1) Gotchas doc (deep explanation)

Must include:

* 'IMPORTANT' banner:
  * 'If you touch $TOPIC$, read this file first.'
* Context:
  * what systems are involved and why this area is fragile
* Observed symptoms:
  * bullet list
* Minimal reproduction:
  * bullet list or numbered list
* Root causes:
  * explain at least one plausible failure mode
  * if multiple root causes exist, separate them
* Fix:
  * include canonical code snippet(s)
  * explain why the fix works
  * include lifecycle hooks or invariants if relevant
* Rule of thumb:
  * a generalisable principle so agents can apply it to similar problems

Style constraints:

* short paragraphs
* minimal headings (only what is needed)
* avoid hype, avoid vague statements
* use strict British English spelling

### 2) Conventions doc (short rules)

Must include:

* same 'IMPORTANT' banner
* a small set of non-negotiable rules
* explicit prohibitions (what must not be done)
* default stance (what to do when uncertain)

This doc should be short and rule-driven. It is not a narrative.

### 3) AI preamble doc (prompt-ready)

Must include:

* a strict directive opening that can be pasted into future prompts
* explicit 'MUST read' references to the gotchas and conventions docs
* 'non-negotiable constraints' section (MUST, MUST NOT)
* default stance / completeness criterion:
  * 'If your proposal does not explicitly account for these constraints, it is incomplete.'

Keep it short and copy/paste friendly.

### 4) AGENTS.md pointer snippet

Must include:

* one bullet under a 'Runtime behaviour and known gotchas' (or similar) section
* a single sentence describing the gotcha
* explicit links (paths) to the docs

No code in AGENTS.md.

## Verification checklist (optional but recommended)

If the issue is runtime/interaction related, include a small checklist in the gotchas doc, eg:

* reproduce before fix
* verify after fix
* verify Back/Forward behaviour
* verify hard reload behaviour
* verify mobile/touch if relevant

Do not overdo this. 5 to 8 items max.

## When to create downloadable artefacts

Create downloadable files when:

* the user asks for download links
* the content contains code blocks that might break copying
* the docs are intended to be copied into a repo as-is

Otherwise, inline Markdown is acceptable.

## Example trigger phrases

* 'put this into a format future agent interaction will understand'
* 'make this AI-proof'
* 'document this so future agents understand'
* 'create a preamble I can paste into prompts'
* 'add a minimal pointer to AGENTS but keep it lean'
