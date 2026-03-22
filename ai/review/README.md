# AI review workflow

## What this is

This folder contains a repository-local review system for regular AI-assisted maintenance passes.

The goal is to let an agent inspect a repository, read its current `ToDo.md`, understand existing work and repository instructions, scan the codebase, and then update the todo list with structured opportunities and recommendations.

The workflow is designed to be:

* repeatable
* repository-specific
* stable across runs
* usable by both humans and AI agents

## Main idea

The review task does not treat `ToDo.md` as a loose note file.

Instead, `ToDo.md` acts as the primary action registry for repository improvement work. Each item gets a stable ID and a structured format so the user can later say things like:

* `solve item ci-missing-markdown-lint-stage`
* `do docs-update-install-instructions`
* `work on types-fix-image-metadata-guards`

The AI then uses that item as an implementation brief.

## Files in this folder

* `config.json`  
  Repository-specific review configuration.

* `config.schema.json`  
  JSON Schema for `config.json`.

* `instructions.md`  
  The main instruction file for the AI review pass.

* `ignore.md`  
  Items that must not be re-added while the ignore rule still applies.

* `done.md`  
  Closed, finished, or intentionally retired items.

* `template.md`  
  A reference template for how todo items should be structured.

* `review.ts`  
  A helper script that gathers review context and generates a review bundle for an agent.

## Recommended workflow

### Manual testing first

1. Adjust `ai/review/config.json`.
2. Clean up the example items in `ToDo.md`.
3. Generate a review bundle:

   ```bash
   node --experimental-strip-types ai/review/review.ts --write-bundle
   ```

4. Give the resulting bundle to your agent, or use the contents in Codex.
5. Let the agent update `ToDo.md`.

### Regular use later

Once the output looks stable, run it on a schedule such as:

* weekly local cron or systemd timer
* a scheduled GitHub Action
* a manual Codex or agent task triggered when needed

## Human vs AI origin

Each todo item includes an `Origin` field.

Allowed values:

* `human`
* `ai`
* `imported`

This field answers who first created the item. It should not flip just because the item is later edited.

If useful later, you can extend this with fields like `Last updated by` or `Reviewed by`, but the starter version keeps this simple.

## Ignore handling

When you decide that something should not be re-added, move it from `ToDo.md` to `ai/review/ignore.md` and add a reason.

That is the repository's explicit memory of "yes, this was seen, but do not keep suggesting it".

## Done handling

When something is finished or intentionally retired, move it to `ai/review/done.md`.

This keeps historical context without leaving the active todo list cluttered.

## What the script does

`review.ts` does not try to replace the AI.

Instead, it prepares the repository context for the AI by:

* reading the config file
* reading `ToDo.md`, `ignore.md`, and `done.md`
* discovering instruction files
* scanning the repository tree
* capturing selected file excerpts
* writing a single review bundle markdown file

That bundle can then be given to an agent as the source context for the review pass.

## Why this split is useful

A prompt alone is too loose.

A script alone cannot do the judgement work.

This system keeps the responsibilities separate:

* the script gathers context consistently
* the instructions define behaviour
* the AI performs the judgement and updates `ToDo.md`

## Notes before first use

The starter files contain example placeholders. Replace them with repository-specific content before trusting the output.

At minimum you should review:

* `ai/review/config.json`
* `ToDo.md`
* `ai/review/instructions.md`

## Suggested next improvement

Once this works well in one repository, the next sensible step is to create:

* a reusable package or template for bootstrapping `ai/review/`
* an optional scheduled task that regenerates the review bundle regularly
* an optional script mode that archives older bundles automatically

## Bundle modes

The review script supports two output modes:

* Default mode: compact manifest. This only lists the files the agent must read. Use this when the agent already has repository access.
* `--inline-content`: embeds selected file contents into the generated markdown bundle. Use this only when you need to copy the bundle into a system that does not have repository access.

For most Codex or repository-connected workflows, the default compact manifest is the correct mode.

## Recommended usage

Generate the compact manifest bundle:

```bash
npx tsx ai/review/review.ts --write-bundle
```

Lint `ToDo.md` manually after human edits:

```bash
npx tsx ai/review/review.ts --lint-todo
```

Optional full bundle mode:

```bash
npx tsx ai/review/review.ts --write-bundle --inline-content
```

## Config rendering in the bundle

The generated review bundle contains both:

* a short human-readable config summary
* the raw JSON config as the authoritative machine-readable source
* a reference to `ai/review/config.schema.json`

This keeps the bundle readable without losing exact field names or structured data.

## Linting manually added todo items

Yes. `review.ts` can lint `ToDo.md` for common structural problems such as:

* missing required metadata fields
* missing required content sections
* invalid values like unsupported status or origin names
* duplicate IDs
* missing top-level sections like `## Scope` and `## Validation requirements`

This is intentionally lightweight and Markdown-specific. It is not a generic Markdown linter. It is a workflow linter for this todo format.
