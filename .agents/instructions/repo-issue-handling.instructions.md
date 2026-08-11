---
applyTo: "**"
---

# Issue and commit handling instructions

These instructions apply to all AI-assisted work in this repository.

## Branch policy

This is a single-developer project. Commit directly to `main`. Do not create feature branches or pull requests for routine work; open a PR only if explicitly asked to.

Never create merge commits on `main`. If work temporarily exists on another branch or ref, bring it into `main` with a rebase or squash so history stays linear—do not use `git merge` (or any equivalent that produces a two-parent commit).

## Commit and push when a task finishes

When an AI-assisted task in this repository reaches a finished, validated state, commit the change and push it to `main`—do not stop at a local commit and wait to be asked. This overrides the general default of asking before pushing; in this repository, pushing after a finished, validated commit is pre-authorized.

This applies once the task is actually done: validation (`npm test`, `npx astro check`, lint-staged) has passed and the commit follows the rules below. Do not push partial, unvalidated, or still-in-progress work.

## Documentation sync

Every feature must have documentation in `documentation/`. When a change modifies existing feature behaviour, update the documentation to describe the current state; do not add historical notes like "this used to work differently."

## Core rule

Every AI-assisted change that is committed must be connected to a GitHub issue.

The issue requirement applies only when work results in a commit, or when it is clear that the current work is intended to become part of a commit.

Do not create issues merely because files exist, changed files are visible, temporary files are present, or untracked files appear in the working tree.

## Tracked and untracked files

Before creating or updating an issue, inspect the repository state and distinguish between:

- tracked files with modifications,
- tracked files staged for commit,
- deleted tracked files,
- renamed tracked files,
- untracked files that are intentionally part of the requested work,
- untracked files that are temporary, generated, accidental, ignored, local-only, or should be deleted.

Do not create an issue for an untracked file unless the file is intentionally being added to the repository.

If an untracked file is clearly accidental, temporary, generated, or unrelated to the requested work:

- do not create an issue for it,
- do not include it in the commit,
- delete it only when that is safe and clearly appropriate,
- otherwise leave it alone and mention it in the work summary.

If an untracked file may be relevant but intent is unclear:

- do not create an issue yet,
- do not stage or commit the file,
- ask for confirmation or leave a clear note in the work summary.

Only create or require an issue for an untracked file when at least one of these is true:

- the user explicitly requested that the file be added,
- the file was created by the assistant as part of the requested work,
- the file is necessary for the implementation,
- the file is intentionally staged for commit,
- the assistant is certain that the file belongs in the repository.

## Before changing committed files

Before making changes that are expected to be committed, identify the issue that the work belongs to.

If a suitable issue already exists:

- read the issue description,
- read all comments,
- check whether another assistant, maintainer, code owner, or developer has already provided relevant context,
- integrate valid feedback into the implementation,
- explicitly reject unsuitable feedback only when there is a clear technical reason.

If no suitable issue exists and the work will modify tracked files or intentionally add new files:

- create a new issue before committing changes,
- explain what is currently happening,
- explain what should change,
- describe the relevant implementation options,
- document known trade-offs,
- apply suitable existing labels.

Do not invent new labels unless explicitly asked. Prefer existing repository labels.

## Issue body formatting

When creating GitHub issues, use plain Markdown labels or bullet lists by
default. Do not use Markdown headings (`#`, `##`, etc.) in issue bodies unless
the user explicitly asks for a structured issue-template format.

Use `gh issue create --body-file <file>` for issue bodies containing Markdown,
backticks, command examples, code spans, or multiple paragraphs. Do not pass
Markdown-heavy bodies through `--body` inside shell quotes.

## During implementation

Keep the change focused on the referenced issue.

If unrelated problems, ideas, recommendations, clean-ups, missing documentation, architectural concerns, or follow-up tasks are found while working on committed files:

- do not silently include them as part of the current issue scope,
- create a separate issue only when the follow-up is actionable and belongs in repository tracking,
- explain the problem and relevant thoughts clearly,
- apply suitable existing labels,
- reference the new follow-up issue from the current issue or final summary where useful.

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

- fix the failure before committing,
- rerun the failing command,
- do not commit until the relevant checks pass.

If validation fails because of pre-existing or unrelated problems:

- mention the failure in the issue or work summary,
- include the exact command that failed,
- include the relevant error summary,
- create a follow-up issue only when the problem is actionable and belongs in repository tracking,
- apply suitable existing labels.

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

- close the issue,
- add a short explanation of what was changed,
- mention the validation commands that passed.

If the commit does not fully solve the issue:

- keep the issue open,
- add a comment explaining what was done,
- list what remains,
- mention any new follow-up issues.

## Required final summary

When reporting completed work, include:

- issue number,
- whether the issue was closed or kept open,
- commit hash if available,
- tracked files changed,
- intentionally added untracked files,
- untracked files ignored, removed, or left alone,
- validation commands run,
- validation result,
- follow-up issues created,
- any unrelated validation problems noticed.

## Always link to GitHub in chat output

Whenever an issue, pull request, or commit is mentioned in the assistant's
chat responses (progress updates, final summaries, comments quoted back to
the user, etc.), give it as a full `https://github.com/<owner>/<repo>/...`
URL, not just a bare `#123` or short hash. This is about what the assistant
prints in conversation, not about repository file contents (commit messages,
code comments, etc. keep using the normal `#123` / short-SHA conventions
described above).

- Issues and PRs: `https://github.com/<owner>/<repo>/issues/123` or `.../pull/123`.
  Get the exact URL from `gh issue view`/`gh pr view` output rather than
  constructing it by hand.
- Commits: `https://github.com/<owner>/<repo>/commit/<full-sha>`, even when the
  commit has not been pushed yet. An unpushed commit's URL will 404 until a
  push happens; state that plainly rather than omitting the link.
- Determine `<owner>/<repo>` from `gh repo view --json nameWithOwner` or the
  `git remote` URL; do not guess it.
