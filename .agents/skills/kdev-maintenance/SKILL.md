---
name: kdev-maintenance
description: Run a read-only maintenance check of the kollitsch.dev repository. Use when asked for a maintenance run, repository health check, branch cleanup overview, Dependabot status, or a question about what is broken in CI. Checks all local and remote branches for status and mergeability, open Dependabot alerts and pull requests, and GitHub Actions runs since the last maintenance run, and reports only workflows that fail repeatedly or permanently.
---

# KDEV maintenance

Check the repository state and report what needs action. This skill reads and reports. It does not merge, delete, push, close, or create anything unless the user approves that specific action after the report.

Read `AGENTS.md` first. Issue and commit rules are in `.agents/references/issue-and-commit-workflow.md`. Dependency update rules are in `documentation/development/dependency-updates.md` and `.agents/instructions/package-json.instructions.md`.

## Time window

The state file is `scratch/kdev-maintenance/last-run.json` (gitignored, local only). It holds one key: `{"lastRun": "<ISO 8601 UTC timestamp>"}`.

- If the file exists, the window starts at `lastRun`.
- If it does not exist, the window starts 14 days ago.
- If the user names a window, for example the last 30 days, use that.

State the window at the start of the report. Update the file only at the end of a completed run (see [Finish](#finish)).

## 1. Branches

Run `git fetch --prune origin` first. Then check every local branch (`refs/heads/*`) and every remote branch (`refs/remotes/origin/*`) except `main` and `origin/HEAD`.

For each branch, collect:

- last commit date and author: `git log -1 --format='%ci %an' <ref>`
- ahead and behind counts against `origin/main`: `git rev-list --left-right --count origin/main...<ref>`
- upstream state for local branches: `git for-each-ref --format='%(refname:short) %(upstream:short) %(upstream:track)' refs/heads`; `[gone]` means the remote branch was deleted
- mergeability without touching the work tree: `git merge-tree --write-tree --name-only origin/main <ref>`; exit code `1` means conflicts, and the output lists the conflicting files
- the net change: `git diff --stat origin/main...<ref>`
- an open or closed pull request: `gh pr list --head <branch> --state all --json number,state,url`

Classify each branch:

| Class | Condition | Recommendation |
| --- | --- | --- |
| merged | ahead count is `0` | Safe to delete (local and remote). |
| gone | local branch whose upstream is `[gone]` | Delete the local branch after checking it has no unpushed work. |
| clean | ahead > 0, no conflicts | Can be brought to `main` by rebase or cherry-pick (no merge commits). Summarise what it adds. |
| conflicting | ahead > 0, merge-tree reports conflicts | List conflicting files. Needs a rebase decision. |
| stale | last commit older than 90 days and not merged | Ask whether to keep, finish, or delete. |
| data branch | maintained by a workflow (see below) | Do not merge or delete. Check that the workflow still updates it. |

Known data branches: `ci/lighthouse` is written by `.github/workflows/lighthouse.yml` every run and is rebuilt from `main`. Its last commit date shows whether the Lighthouse workflow still saves results. When a workflow writes to another branch, treat that branch the same way; find these with `grep -rn 'BRANCH' .github/workflows`.

## 2. Dependabot

Collect:

- open alerts: `gh api 'repos/{owner}/{repo}/dependabot/alerts?state=open&per_page=100' --paginate --jq '.[] | {number, severity: .security_advisory.severity, package: .dependency.package.name, ghsa: .security_advisory.ghsa_id, patched: .security_vulnerability.first_patched_version.identifier, url: .html_url}'`
- open Dependabot pull requests: `gh pr list --author app/dependabot --state open --json number,title,url,mergeable,statusCheckRollup`
- local findings for comparison: `npm audit --json`

For each open alert:

1. Check if a patched version exists and if it is installable (peer ranges of the dependants, `npm ls <package>`).
2. Search for a tracking issue: `gh issue list --state open --search "<ghsa-id> in:title,body"`.
3. Classify: fixable now (package update or `overrides`), tracked (open issue labelled `prio:high`), or untracked. `AGENTS.md` requires every unfixable finding to have an open issue labelled `prio:high`; report untracked ones as action items.

For each Dependabot pull request, report checks state and mergeability. Recommend applying the version change on `main` (fragments first, see the `package-json` instruction) and closing the pull request, because this project commits directly to `main`.

## 3. GitHub Actions

List runs in the window per workflow:

```bash
gh run list --limit 200 --created ">=<window start date>" \
  --json databaseId,workflowName,conclusion,status,createdAt,headSha,event,url
```

If a workflow has fewer than 5 runs in the window, also load its last 10 runs (`gh run list --workflow <file> --limit 10 ...`) so the streak rules below have enough history. Ignore runs with conclusion `cancelled` or `skipped` and runs still in progress.

Per workflow, sort runs from newest to oldest and apply these rules:

| Status | Rule | Action |
| --- | --- | --- |
| healthy | newest completed run succeeded, and at most 2 failures in the last 10 runs | None. Earlier failures that were followed by a success are not broken and need no fix. Do not list them as problems. |
| watch | only the newest run failed (streak of 1) | No action yet. Mention it in one line and check it again on the next run. |
| broken | the newest 2 or more completed runs failed | Action needed. Report `failing since <date>, <n> runs in a row`, where the date is the oldest failure in the current streak. |
| flaky | newest run succeeded, but 3 or more of the last 10 runs failed | Action needed. Report the failure rate and the failing steps. |

Other problems that count as issues even when the run succeeded:

- a scheduled workflow that has not run at all in the window (`gh workflow list --all` shows it as disabled, or there are no runs)
- a workflow whose data branch (section 1) has not changed since its last successful run, although it should commit every run

For every broken or flaky workflow, find the failing step and the first error line:

```bash
gh run view <id> --json jobs --jq '.jobs[].steps[] | select(.conclusion=="failure") | .name'
gh run view <id> --log-failed | grep -v '##\[debug\]' | grep -E '##\[error\]|Error|error:|rejected|fatal' | head
```

Compare two or three failed runs. If they fail with the same error, report it as one cause. If an open issue already tracks the failure (`gh issue list --search "<workflow name>"`), link it and do not propose a new one.

## Report

Write the report in this order. Keep each item to one or two lines and give issues, pull requests, runs, and commits as full GitHub URLs.

1. Window: start and end.
2. Action needed: broken and flaky workflows, untracked Dependabot alerts, conflicting branches, and data branches that stopped updating. For each: evidence, likely cause (label it as an inference when it is not verified), and a proposed fix.
3. Branches: a table with branch, class, ahead/behind, last commit, and recommendation.
4. Dependabot: alerts and pull requests with their classification.
5. Actions: one line per workflow with its status. Healthy workflows may be grouped in one line.
6. Watch list: single failures and items to check on the next run.
7. Optional checks (see below) that the user can ask for.

Then ask which proposed actions to carry out. Use the interactive question tool when available. Each approved change follows the issue and commit workflow in `AGENTS.md`.

## Finish

After the report is complete, write the current UTC time to `scratch/kdev-maintenance/last-run.json` (create the folder if needed). Do not update it when the run stopped early or a section could not complete; report that section as blocked instead.

## Optional checks

These are not part of the default run. Offer them in the report, and run them only when the user asks:

- Dependency updates: `npm run update` (runs `npm-check-updates -u --target minor`, `fixpack`, the browserslist database update, tests, and git hooks), or `ncu -u` for all versions including majors. Follow `documentation/development/dependency-updates.md`: update Vitest packages together, sync fragments with `npx nanny update-package`, and run `npx nanny check`.
- Major updates: `npm outdated` and a peer dependency check for packages held back by `.ncurc.json` (for example `typescript`).
- Security: `npm audit`, and `npm run lint:secretlint` for committed secrets.
- Repository drift: `npx nanny check`, `npm run check`, and `npm run biome:check` (compare new findings with the previous Biome version before blaming a change).
- Links: a repository-wide Lychee run, followed by the `kdev-postreview` link review procedure for any failures.
- Node.js policy: compare `engines.node` and `.nvmrc` with the current Node.js release schedule.
- Vale styles: the documented sync command in `documentation/content/vale.md` when styles are outdated.
- Lighthouse: the newest entries in `src/data/lighthouse/history.json` and the score trend.
- Releases: commits on `main` since the last tag (`git log $(git describe --tags --abbrev=0)..origin/main --oneline`), to decide if a release is due.
- Local task files: open items in `TODO.md` and `RESUME.md` (`RESUME.md` must be resolved first, see `AGENTS.md`).
- Issues: open issues labelled `prio:high` or `status:blocked` without activity in 30 days, to check if a blocker was resolved upstream.
