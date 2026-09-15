# CLAUDE.md

**Read `AGENTS.md` first.** It is the single onboarding source for every AI assistant in this repository — project overview, commands, environment variables, architecture, icons, testing/code conventions, commit rules, and the `.agents/` instruction/prompt/skill layout all live there. Nothing in this file overrides or duplicates it.

This file exists only for behaviour specific to Claude Code:

* **Skill loading**: `.claude/skills` is a directory symlink to `.agents/skills`, generated once after local skill installation and tracked by `skills-lock.json`. It is gitignored — do not create real files there, and do not edit through the symlink; edit the source under `.agents/skills/` instead.
* **Globally installed skills** (e.g. anything under `~/.claude/skills/`) may be used in this project. Skills installed locally in this repository at `$REPOROOT/.agents/skills/` (surfaced through the `.claude/skills/` symlinks above) are additional to, not a replacement for, global skills — when a local and a global skill share a name, the local one takes precedence.
* **`.claude/settings*.json`** (Claude Code permissions/hooks config) is gitignored — it is local machine configuration, not shared project policy.
