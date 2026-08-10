---
fmContentType: article
title: "Stop tracking files ignored by `.gitignore`"
linktitle: "Stop tracking files ignored by .gitignore"
date: "2026-07-28T15:00:00+07:00"
description: "Find files that Git still tracks despite matching .gitignore rules, then remove them from the index without deleting the local copies."
summary: "List tracked files that now match .gitignore rules, dry-run their removal, and stop tracking them without deleting them locally."
tags:
- git
- gitignore
- dotfiles
- cli
- howto
cover:
  src: roman-synkevych-wX2L8L-fGeA-unsplash.jpg
  type: image
  title: Photo by [Roman Synkevych](https://unsplash.com/@synkevych) on [Unsplash](https://unsplash.com/photos/black-and-white-penguin-toy-wX2L8L-fGeA)
---

Changing `.gitignore` does not affect files Git already tracks.

Ignore rules prevent matching untracked files from being added. Files already present in Git's index remain tracked until they are removed from it explicitly.

The relevant command is:

```bash
git rm --cached
```

The `--cached` flag removes files from the index while keeping the local copies on disk.

## Example

Assume `.gitignore` contains:

```ini
generated/
```

Git will ignore new files inside `generated/`. However, files that were added before this rule was introduced remain tracked, for example:

```text
generated/example-file.ext
generated/cache.json
generated/debug.log
generated/output/data.json
```

Their changes can therefore continue to appear in `git status`.

## List tracked files that are now ignored

Use the following command to list files that are present in the index but match the current ignore rules:

```bash
git ls-files --cached --ignored --exclude-standard
```

Limit the result to `generated/`:

```bash
git ls-files --cached --ignored --exclude-standard -- generated/
```

## Dry-run the cleanup

Before changing the index, inspect what Git would remove:

```bash
git ls-files --cached --ignored --exclude-standard -z -- generated/ \
  | xargs -0 -r git rm --cached --dry-run --ignore-unmatch
```

The null-delimited output safely handles filenames containing spaces or other unusual characters.

## Stop tracking the files

When the dry-run output is correct:

```bash
git ls-files --cached --ignored --exclude-standard -z -- generated/ \
  | xargs -0 -r git rm --cached --ignore-unmatch
```

This stages the files for removal from the repository without deleting them from the working tree.

For a single file:

```bash
git rm --cached -- generated/example-file.ext
```

Do not omit `--cached` unless the file should also be deleted locally:

```bash
git rm -- generated/example-file.ext
```

Review the staged changes with `git status --short`, then commit the updated `.gitignore` and the removals from the index:

```bash
git add -- .gitignore
git commit --message "chore: stop tracking ignored generated files"
```

## List ignored untracked files

After the cleanup, the files are ordinary ignored files in the working tree.

Show ignored files alongside the normal status output:

```bash
git status --ignored --short
```

List only ignored untracked files:

```bash
git ls-files --others --ignored --exclude-standard
```

Limit the result to `generated/`:

```bash
git ls-files --others --ignored --exclude-standard -- generated/
```

## Optionally delete ignored files locally

Use `git clean` only when the ignored files should also be removed from disk.

Always start with a dry-run:

```bash
git clean --dry-run -d -X -- generated/
```

| Flag | Meaning |
| ----------- | -------------------------- |
| `--dry-run` | Show what would be deleted |
| `-d` | Include directories |
| `-X` | Delete only ignored files |

Run the deletion only after reviewing the output:

```bash
git clean --force -d -X -- generated/
```

Uppercase `-X` removes only ignored files. Lowercase `-x` also removes non-ignored untracked files and is considerably more destructive.

For generated files, caches, logs, and other local files that should remain available, `git rm --cached` is the appropriate operation.
