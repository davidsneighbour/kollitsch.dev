# Issue and commit workflow

Read this before creating or updating a GitHub issue, and before committing. The short universal rules (commit to `main`, push after validation, every commit references an issue) are in `AGENTS.md`; this file holds the full procedure.

## When an issue is required

Every AI-assisted change that is committed must be connected to a GitHub issue. The requirement applies only when work results in a commit, or when it is clear that the current work will become part of a commit.

Do not create issues merely because files exist, changed files are visible, temporary files are present, or untracked files appear in the working tree.

## Tracked and untracked files

Before creating or updating an issue, inspect the repository state and distinguish between:

- tracked files with modifications,
- tracked files staged for commit,
- deleted tracked files,
- renamed tracked files,
- untracked files that are intentionally part of the requested work,
- untracked files that are temporary, generated, accidental, ignored, local-only, or should be deleted.

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

## Plans handed over without an issue

When the user hands over a plan, design doc, or spec and no GitHub issue covers it, create the issue immediately, at the start of the work, not at the commit step. Use `gh issue create --body-file <path-to-plan>` so the plan becomes the issue body verbatim.

Reference that issue in every commit made while implementing the plan (`Refs #123` for intermediate commits, `Closes #123` on the finishing commit). If the plan spans multiple commits or sessions, use issue comments to track meaningful progress. Close the issue once the plan is fully implemented and validated.

## Before changing committed files

Identify the issue the work belongs to.

If a suitable issue already exists:

- read the issue description and all comments,
- check whether another assistant, maintainer, or developer has already provided relevant context,
- integrate valid feedback into the implementation,
- explicitly reject unsuitable feedback only when there is a clear technical reason.

If no suitable issue exists and the work will modify tracked files or intentionally add new files, create an issue before committing that:

- explains what is currently happening,
- explains what should change,
- describes the relevant implementation options,
- documents known trade-offs,
- carries suitable existing labels.

Do not invent new labels unless explicitly asked.

## Content-wide refactors use per-year sub-issues

When a task changes all (or nearly all) files under `src/content/blog/` (for example a site-wide Vale cleanup, a frontmatter schema migration, or a bulk rewrite), split the work into one sub-issue per yearly folder (`src/content/blog/2021/`, `.../2022/`, and so on) with `gh issue create --parent <parent-issue-number>`. Apply this whenever the task spans all years of blog content, not a single post or a handful of posts.

## Issue body formatting

- Use plain Markdown labels or bullet lists. Do not use Markdown headings in issue bodies unless the user asks for a structured template.
- Use `gh issue create --body-file <file>` for bodies containing Markdown, backticks, command examples, code spans, or multiple paragraphs. Do not pass such bodies through `--body` inside shell quotes.
- Use the same rule for `gh issue comment`: write multi-line bodies to a temporary file and use `--body-file`. Escaped `\n` sequences passed through `--body` end up as literal text. A one-line `--body` must not contain escaped newlines, backticks, or shell-sensitive formatting.

## During implementation

Keep the change focused on the referenced issue.

If unrelated problems, ideas, clean-ups, missing documentation, architectural concerns, or follow-up tasks are found:

- do not silently include them in the current issue scope,
- create a separate issue only when the follow-up is actionable and belongs in repository tracking,
- explain the problem clearly and apply suitable existing labels,
- reference the follow-up issue from the current issue or final summary where useful.

Small unrelated fixes discovered by validation tools may be included in the same commit only when they are required to make the repository pass validation and are low-risk.

## Validation before commit

Run:

```bash
npm test
npx astro check
```

lint-staged runs automatically during commit and must pass.

If validation fails because of the current change, fix it, rerun the failing command, and do not commit until it passes.

If validation fails because of pre-existing or unrelated problems:

- mention the failure in the issue or work summary with the exact command and an error summary,
- create a follow-up issue only when the problem is actionable,
- include an unrelated fix in the same commit only when it is required to unblock the current issue and is safe, minimal, and documented.

## Commit message

Format:

```text
type(scope): short imperative subject (72 characters or fewer)

Body: describe every meaningful change. Use one bullet per logical
unit. Cover what changed, why it changed, and any non-obvious
decisions or constraints that informed the approach.

Closes #123
```

The issue reference may also go in the subject as `type(scope): summary (#123)`.

- Use `Closes #123`, `Fixes #123`, or `Resolves #123` only when the commit fully solves the issue; otherwise use `Refs #123` or `Related to #123`.
- Do not reference an issue for files that were merely observed, ignored, deleted as temporary clutter, or deliberately left untracked.
- Breaking changes must be prefixed `BREAKING CHANGE:` in the body.

Use only these types (as handled by `.release-it.ts`):

| Type | Use for |
| :--------- | :------ |
| `content` | Blog posts, page copy, taxonomy changes |
| `feat` | New user-visible features or components |
| `fix` | Bug fixes and corrections |
| `build` | Build tooling, package.json, lock files, scripts |
| `chore` | Maintenance without user-visible effect |
| `ci` | CI/CD workflow files |
| `docs` | Documentation, `AGENTS.md`, `.agents/`, `DESIGN.md` |
| `perf` | Performance improvements |
| `refactor` | Code restructuring without behaviour change |
| `revert` | Reverts a prior commit |
| `style` | Visual/CSS changes with no logic change |
| `test` | Test files and test configuration |

Scopes are optional but strongly preferred: a noun naming the affected area (`components`, `layout`, `styles`, `config`, `scripts`, `ci`, `deps`, `design`, `content`, `ai`, or a component name).

## After commit

If the commit fully solves the issue: close it, add a short explanation of what changed, and mention the validation commands that passed.

If it does not: keep the issue open, comment on what was done and what remains, and mention any new follow-up issues.

## Final summary

When reporting completed work, include:

- issue URL, and whether it was closed or kept open,
- commit URL if available,
- tracked files changed,
- intentionally added untracked files,
- untracked files ignored, removed, or left alone,
- validation commands run and their result,
- follow-up issues created,
- unrelated validation problems noticed.

Give issues, pull requests, and commits as full URLs in chat (`https://github.com/<owner>/<repo>/issues/123`, `.../commit/<full-sha>`). Take the URL from `gh issue view` / `gh pr view` output or `gh repo view --json nameWithOwner`; do not guess it. An unpushed commit's URL returns 404 until pushed; say so instead of omitting the link. Repository content (commit messages, code comments) keeps the normal `#123` / short-SHA conventions.
