# Repository opportunities and action list

## Scope

This document contains active opportunities, issues, and recommendations for this repository.

The AI must interpret this file as the primary action registry for repository improvement work in this repository.

When the user says `solve item <ID>`, `do <ID>`, `work on <ID>`, or similar, the AI must:

1. locate the item by ID;
2. check dependencies first;
3. respect repository instructions and `ai/review/config.json`;
4. follow the item's action and execution mode;
5. run all required validation steps before returning work to the user;
6. update this file after the work is complete.

The AI must also read and respect:

* `ai/review/config.json`
* `ai/review/instructions.md`
* `ai/review/ignore.md`
* `ai/review/done.md`
* repository instruction files listed in config and found in common instruction locations

## How to interpret this file

* This file is an action registry, not just a scratchpad.
* IDs are stable string identifiers and must not be changed unless the scope of an item materially changes.
* Existing items must not be silently removed. Mark them as `obsolete`, move them to `ai/review/done.md`, or move them to `ai/review/ignore.md` with a reason.
* The AI may add new items when justified by the repository, its instructions, or the current codebase.
* The AI must preserve `Origin` values. If the AI creates a new item, use `Origin: ai`. If a human adds a new item directly, use `Origin: human`.
* The AI must preserve intent. Rewording is allowed when it improves clarity, but the meaning of an existing item must stay intact unless the repository state proves that the item changed.

## Suggested priorities

1. `ci-example-validation-gap`
2. `docs-example-readme-refresh`
3. `system-example-remove-obsolete-helper`

## Opportunities by topic

### CI

#### `ci-example-validation-gap`

* Status: active
* Origin: ai
* Rank: high
* Impact: high
* Effort: small
* Confidence: high
* Authority: template-example
* Execution mode: autonomous
* References mode: sample
* Dependencies: none

* Issue  
  Example item: validation commands are not yet aligned with the repository's actual scripts.

* Why it matters  
  The review system depends on validation being accurate. If the listed commands are wrong, later implementation work will either fail or skip required checks.

* References  
  * `ai/review/config.json`
  * `package.json`

* References coverage  
  Sample references only. Confirm the full set of required scripts before implementation.

* Action / recommendation  
  Review the repository's actual scripts and replace placeholder validation commands in `ai/review/config.json` with real commands. The AI may decide the exact command mapping based on repository contents.

### Documentation

#### `docs-example-readme-refresh`

* Status: active
* Origin: human
* Rank: medium
* Impact: medium
* Effort: small
* Confidence: high
* Authority: template-example
* Execution mode: needs-confirmation
* References mode: sample
* Dependencies: none

* Issue  
  Example item: repository documentation may not yet describe the AI review workflow.

* Why it matters  
  The system is easier to maintain when human contributors understand what the review files are for and how to use them.

* References  
  * `README.md`
  * `ai/review/README.md`

* References coverage  
  Sample references only. The full list depends on the repository's documentation structure.

* Action / recommendation  
  Add a short explanation to the main repository documentation if this review workflow should be visible to collaborators. Ask for confirmation before changing top-level documentation.

### System

#### `system-example-remove-obsolete-helper`

* Status: obsolete
* Origin: ai
* Rank: low
* Impact: low
* Effort: small
* Confidence: low
* Authority: template-example
* Execution mode: recommendation-only
* References mode: sample
* Dependencies: none

* Issue  
  Example item: an older helper may no longer be needed.

* Why it matters  
  Obsolete items should stay visible long enough to explain why they are being retired instead of disappearing without context.

* References  
  * `scripts/old-helper.mjs`

* References coverage  
  Sample references only. The referenced file may not exist in this repository.

* Action / recommendation  
  Confirm whether the helper still exists. If it is gone, move this item to `ai/review/done.md` or delete this example once the system is adopted.

## Validation requirements

### Always run

* Replace these placeholders in `ai/review/config.json` with repository-specific commands.
* Run every command listed under `validation.always`.

### Run depending on changed files

Use the matching rules in `ai/review/config.json` under `validation.whenChanged`.

## Ignore and done handling

* Move items that should not be re-added into `ai/review/ignore.md`.
* Move completed or intentionally closed items into `ai/review/done.md`.
* The AI must check both files before re-adding an item.
