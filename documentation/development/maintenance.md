---
title: Maintenance skill
tags: []
created: 2026-11-26T00:00:00+07:00
updated: 2026-11-26T00:00:00+07:00
---

The repository-local `kdev-maintenance` skill runs a read-only health check of the repository. Its [entry point](../../.agents/skills/kdev-maintenance/SKILL.md) defines the checks, the rules, and the report format.

## What it checks

* Branches: every local and remote branch, with ahead and behind counts against `origin/main`, upstream state, conflicts (through `git merge-tree`, without a checkout), and pull requests. Data branches that a workflow writes, such as `ci/lighthouse`, are checked for recent updates and never proposed for merging.
* Dependabot: open alerts, open Dependabot pull requests, and whether each alert can be fixed now or has a tracking issue labelled `prio:high`.
* GitHub Actions: runs since the last maintenance run, or the last 14 days on the first run.

## When a workflow needs action

A workflow needs action only when it is broken (the newest two or more runs failed) or flaky (three or more failures in its last ten runs). A failure that a later successful run followed is not reported as a problem. A single new failure goes on the watch list for the next run.

## State

The time of the last completed run is stored in `scratch/kdev-maintenance/last-run.json`, which is local and gitignored. Without that file, the window is the last 14 days.

## Actions

The skill only reports. It proposes actions and carries out each one after the user approves it, following the issue and commit workflow in `AGENTS.md`. The report also lists optional checks, such as `npm run update` (`npm-check-updates -u --target minor`), `npm audit`, `npx nanny check`, a repository-wide link check, and a release check.
