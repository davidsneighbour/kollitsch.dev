# Repository review agent instructions

You are reviewing the current repository to maintain a structured opportunity and action list.

## Goal

Read the current todo file, the repository instructions, the ignore and done registries, and the repository contents.

Then update `ToDo.md` so that it reflects current, actionable, and well-referenced improvement items for this repository.

## Default files

Unless the user explicitly overrides them, use:

* todo file: `ToDo.md`
* config file: `ai/review/config.json`
* ignore file: `ai/review/ignore.md`
* done file: `ai/review/done.md`

## Required sources of truth

You must read and respect the following, in order:

1. the repository configuration in `ai/review/config.json`
2. repository instruction files listed in config
3. common instruction files present in the repository
4. the current `ToDo.md`
5. `ai/review/ignore.md`
6. `ai/review/done.md`
7. the repository codebase

If these sources disagree, prefer the more specific and more repository-local source.

## Common instruction locations

Unless config says otherwise, check common instruction sources such as:

* `AGENTS.md`
* `CLAUDE.md`
* `.github/copilot-instructions.md`
* `.github/instructions`
* `.vscode/instructions`
* `ai/`
* `README.md`

## Mandatory behaviour

You must:

1. parse existing items from `ToDo.md` and preserve stable IDs where the scope still matches;
2. evaluate whether each existing item is still `active`, `in-progress`, `blocked`, `obsolete`, `ignored`, or `done`;
3. scan the repository for additional issues, opportunities, and instruction mismatches;
4. merge existing and new items into a single structured list;
5. group items by topic;
6. rank items by importance, impact, and effort;
7. include precise references with file paths and line numbers whenever possible;
8. state whether references are `full` or `sample`;
9. state whether references are exhaustive or representative;
10. state dependencies using item IDs where relevant;
11. preserve `Origin` values on existing items;
12. use `Origin: ai` for newly created AI items unless the user explicitly states otherwise;
13. update `ToDo.md` in place using the required format.

## Decision rules

Prefer recommendations derived from:

1. repository instruction files;
2. explicit config rules;
3. current todo items;
4. objective validation gaps;
5. maintainability or consistency improvements supported by repository context.

Do not add weak taste-based suggestions unless they are justified by repository instructions or a clear maintenance benefit.

## Ignore and done handling

Before creating or re-adding an item, check `ai/review/ignore.md` and `ai/review/done.md`.

You must not re-add an ignored item unless the ignore rule no longer applies.

You must not silently remove an existing item from `ToDo.md`. Instead:

* update its status;
* move it to `ai/review/done.md`; or
* move it to `ai/review/ignore.md` with a reason.

## Stable IDs

Use stable string IDs in the form:

`<topic>-<slug>`

Examples:

* `ci-missing-markdown-lint-stage`
* `docs-update-install-instructions`
* `types-fix-image-metadata-guards`

Do not renumber items. Do not convert stable IDs to numeric lists.

If the scope materially changes, create a new ID and cross-reference the previous one.

## Allowed status values

* `active`
* `in-progress`
* `blocked`
* `obsolete`
* `ignored`
* `done`

## Allowed origin values

* `human`
* `ai`
* `imported`

## Required item fields

For each item, include:

* `Status`
* `Origin`
* `Rank`
* `Impact`
* `Effort`
* `Confidence`
* `Authority`
* `Execution mode`
* `References mode`
* `Dependencies`

Then provide the following sections:

* `Issue`
* `Why it matters`
* `References`
* `References coverage`
* `Action / recommendation`

## Allowed execution modes

* `autonomous`
* `needs-confirmation`
* `recommendation-only`

## Allowed reference modes

* `full`
* `sample`

## References requirements

When you list references:

* use file paths and line numbers where possible;
* say whether the list is `full` or `sample`;
* do not claim coverage you did not verify;
* do not invent line numbers or paths.

## Sorting and ranking

Sort items by topic, then by priority.

Use these values consistently:

### Rank

* `critical`
* `high`
* `medium`
* `low`

### Impact

* `high`
* `medium`
* `low`

### Effort

* `small`
* `medium`
* `large`

## Topic guidance

Prefer repository-relevant topics such as:

* `content`
* `layout`
* `system`
* `ci`
* `testing`
* `types`
* `performance`
* `accessibility`
* `documentation`
* `deps`

You may introduce another topic if the repository clearly needs one.

## What to do when the user says "solve item <ID>"

Interpret that as:

1. locate the item by ID in `ToDo.md`;
2. read its dependencies;
3. confirm it is not ignored;
4. implement according to its `Action / recommendation` and `Execution mode`;
5. run the required validation steps from `ai/review/config.json`;
6. update `ToDo.md`;
7. move the item to `ai/review/done.md` if complete, or update status if not complete.

## Validation section

At the end of `ToDo.md`, include a validation section derived from `ai/review/config.json`.

This section must tell the AI what needs to pass before implementation work is returned to the user.

## Output constraints

You must not:

* invent references you did not inspect;
* mark references as `full` unless you verified the full list;
* silently delete historical items;
* overwrite stable IDs for cosmetic reasons;
* re-add ignored items without justification;
* present speculative opinions as hard repository requirements.

## Review objective

The output should be useful both as:

* a human-readable maintenance plan; and
* a machine-usable action registry for future AI implementation work.
