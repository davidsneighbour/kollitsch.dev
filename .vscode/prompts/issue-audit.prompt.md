---
agent: agent
description: Audit all open GitHub issues for relevance, correct labels, and completeness.
---

# Issue audit

Audit all open issues on GitHub for the `davidsneighbour/kollitsch.dev` repository.

## Steps

1. Fetch all open issues: `gh issue list --repo davidsneighbour/kollitsch.dev --state open --limit 100 --json number,title,labels,createdAt,updatedAt,body`
2. Fetch all available labels: `gh label list --repo davidsneighbour/kollitsch.dev --limit 100`
3. Inspect the codebase and recent git log to verify which issues are still unsolved.
4. For each issue, decide:
   - **Close as completed**: if the implementation exists in the codebase or a recent commit. Use `gh issue close <n> --reason completed --comment "..."`.
   - **Close as not planned**: if the issue is no longer relevant, superseded, or out of scope. Use `gh issue close <n> --reason "not planned" --comment "..."`.
   - **Keep open**: if the issue still needs work.
5. For every open issue, ensure:
   - Exactly one `prio:*` label (`prio:critical`, `prio:high`, `prio:medium`, `prio:low`).
   - Exactly one `status:*` label (`status:unconfirmed`, `status:confirmed`, `status:in-progress`, `status:blocked`, `status:review`, `status:done`). Default for untriaged issues: `status:unconfirmed`.
   - At least one `type:*` label (`type:bug`, `type:enhancement`, `type:chore`, `type:refactor`, `type:dependencies`, `type:documentation`, `type:tests`, `type:data`).
   - Add missing labels with: `gh issue edit <n> --repo davidsneighbour/kollitsch.dev --add-label "<label>"`.

## What to verify for each issue

For **bug issues**: run the relevant linter, test, or manual check to see if the bug still reproduces.

For **chore/ci issues**: check if the proposed change is already in the relevant config file (`.lintstagedrc.ts`, `.github/workflows/*.yml`, `package.json`, etc.).

For **content issues** (MD001, MD033, MD036, MD040, MD045, MD052, MD054, etc.): run `npm run lint:markdown` and check if the specific files mentioned in the issue still have errors.

For **dependency issues**: run `npm audit` and compare the current count against the issue description.

For **refactor/test issues**: check if the described gap in the codebase still exists by reading the relevant files.

## Label rules

- Prefer `status:confirmed` over `status:unconfirmed` when a check proves the issue still exists.
- Do not add `resolution:*` labels to open issues. Only use them when closing.
- Do not create new labels. Use only the labels listed by `gh label list`.
- Use `meta:keep-open` for issues that should stay open intentionally (long-running trackers, etc.).

## Procedure notes (learned from first run, 2026-06-16)

- The `gh issue close` command does not accept `--label`. Add resolution labels separately with `gh issue edit --add-label "resolution:completed"`.
- The `gh issue list` default limit is 30; always pass `--limit 100` (or higher if there are more issues).
- Issues from AI-generated audit sessions often arrive in batches missing `prio:*` and `status:*` labels—check for those first before reading individual issue bodies.
- Always verify against the actual codebase, not just the issue description. A common false open: issues proposing to add something to `.lintstagedrc.ts` or a workflow that was already added by a subsequent commit.
- The `npm run lint:markdown` command validates `src/content/blog/**`. Content-fix issues (1666-1672 pattern) are almost certainly still open unless specific posts were fixed.

## Required output format

After completing the audit, present a table:

| #     | Title (truncated)    | Action                                 | Reason                                                   |
| ----- | -------------------- | -------------------------------------- | -------------------------------------------------------- |
| #1234 | fix(foo): some issue | Closed (completed)                     | Already implemented in `.lintstagedrc.ts` commit abc1234 |
| #1235 | feat(bar): other     | Added `prio:low`, `status:unconfirmed` | Missing labels                                           |
| #1236 | chore(baz): thing    | No change                              | Labels and status correct, still open                    |

Then add a summary line:

> Closed N issue(s). Added/fixed labels on M issue(s). N issues unchanged. Total open after audit: X.
