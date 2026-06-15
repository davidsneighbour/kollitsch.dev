---
applyTo: "**"
---

# Issue and commit handling instructions

These instructions apply to all AI-assisted work in this repository.

## Core rule

Every AI-assisted change that is committed must be connected to a GitHub issue.

The issue requirement applies only when work results in a commit, or when it is clear that the current work is intended to become part of a commit.

Do not create issues merely because files exist, changed files are visible, temporary files are present, or untracked files appear in the working tree.

## Tracked and untracked files

Before creating or updating an issue, inspect the repository state and distinguish between:

* tracked files with modifications,
* tracked files staged for commit,
* deleted tracked files,
* renamed tracked files,
* untracked files that are intentionally part of the requested work,
* untracked files that are temporary, generated, accidental, ignored, local-only, or should be deleted.

Do not create an issue for an untracked file unless the file is intentionally being added to the repository.

If an untracked file is clearly accidental, temporary, generated, or unrelated to the requested work:

* do not create an issue for it,
* do not include it in the commit,
* delete it only when that is safe and clearly appropriate,
* otherwise leave it alone and mention it in the work summary.

If an untracked file may be relevant but intent is unclear:

* do not create an issue yet,
* do not stage or commit the file,
* ask for confirmation or leave a clear note in the work summary.

Only create or require an issue for an untracked file when at least one of these is true:

* the user explicitly requested that the file be added,
* the file was created by the assistant as part of the requested work,
* the file is necessary for the implementation,
* the file is intentionally staged for commit,
* the assistant is certain that the file belongs in the repository.

## Before changing committed files

Before making changes that are expected to be committed, identify the issue that the work belongs to.

If a suitable issue already exists:

* read the issue description,
* read all comments,
* check whether another assistant, maintainer, code owner, or developer has already provided relevant context,
* integrate valid feedback into the implementation,
* explicitly reject unsuitable feedback only when there is a clear technical reason.

If no suitable issue exists and the work will modify tracked files or intentionally add new files:

* create a new issue before committing changes,
* explain what is currently happening,
* explain what should change,
* describe the relevant implementation options,
* document known trade-offs,
* apply suitable existing labels.

Do not invent new labels unless explicitly asked. Prefer existing repository labels.

## During implementation

Keep the change focused on the referenced issue.

If unrelated problems, ideas, recommendations, clean-ups, missing documentation, architectural concerns, or follow-up tasks are found while working on committed files:

* do not silently include them as part of the current issue scope,
* create a separate issue only when the follow-up is actionable and belongs in repository tracking,
* explain the problem and relevant thoughts clearly,
* apply suitable existing labels,
* reference the new follow-up issue from the current issue or final summary where useful.

Do not create follow-up issues for temporary, accidental, generated, ignored, or local-only untracked files unless they reveal a real repository problem.

Small unrelated fixes discovered by validation tools may be included in the same commit only when they are required to make the repository pass validation and are low-risk.

## Validation before commit

Before committing, run the repository validation steps:

```bash
npm test
npx astro check
```

Also ensure automatic lint-staged checks pass during commit.

If validation fails because of the current change:

* fix the failure before committing,
* rerun the failing command,
* do not commit until the relevant checks pass.

If validation fails because of pre-existing or unrelated problems:

* mention the failure in the issue or work summary,
* include the exact command that failed,
* include the relevant error summary,
* create a follow-up issue only when the problem is actionable and belongs in repository tracking,
* apply suitable existing labels.

Unrelated validation problems may be committed in the same commit only when they are required to unblock the current issue and the fix is safe, minimal, and documented.

## Commit message rules

Every AI-assisted commit message must reference the relevant issue number.

Use one of these forms:

```text
type(scope): summary (#123)
```

or, when the commit closes the issue:

```text
type(scope): summary

Closes #123
```

Use `Closes #123`, `Fixes #123`, or `Resolves #123` only when the commit fully solves the issue.

Use `Refs #123` or `Related to #123` when the commit is related but does not close the issue.

Do not reference an issue for files that were merely observed, ignored, deleted as temporary clutter, or deliberately left untracked.

## After commit

If the commit fully solves the issue:

* close the issue,
* add a short explanation of what was changed,
* mention the validation commands that passed.

If the commit does not fully solve the issue:

* keep the issue open,
* add a comment explaining what was done,
* list what remains,
* mention any new follow-up issues.

## Required final summary

When reporting completed work, include:

* issue number,
* whether the issue was closed or kept open,
* commit hash if available,
* tracked files changed,
* intentionally added untracked files,
* untracked files ignored, removed, or left alone,
* validation commands run,
* validation result,
* follow-up issues created,
* any unrelated validation problems noticed.
