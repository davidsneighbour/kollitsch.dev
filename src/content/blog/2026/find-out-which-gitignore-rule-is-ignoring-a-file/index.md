---
title: "Why is Git ignoring this file?"
date: "2026-07-27T13:00:00Z"
description: "Use git check-ignore to find the exact ignore file, line number, and pattern when Git unexpectedly ignores a file or directory."
summary: "This post shows how git check-ignore reveals which .gitignore, nested exclude, or global ignore rule matches a path, including tracked-file checks."
cover:
  src: roman-synkevych-wX2L8L-fGeA-unsplash.jpg
  type: image
  title: Photo by [Roman Synkevych](https://unsplash.com/@synkevych) on [Unsplash](https://unsplash.com/photos/black-and-white-penguin-toy-wX2L8L-fGeA)
tags:
  - quickie
  - git
  - gitignore
  - howto
---

When Git ignores a file and I do not know why, I ask Git.

The `git check-ignore` command identifies the exact ignore rule responsible:

```bash
git check-ignore --verbose -- path/to/file
```

For example:

```bash
git check-ignore --verbose -- scratch/test.txt
```

The output contains the ignore file, line number, matching pattern, and ignored path:

```text
/home/example/.gitignore:42:scratch/ scratch/test.txt
```

| Part | Meaning |
| ---------------------------------- | -------------------------------------------- |
| `/home/example/.gitignore` | The ignore file containing the matching rule |
| `42` | The rule's line number |
| `scratch/` | The matching pattern |
| `scratch/test.txt` | The path being checked |

This immediately answers the important question:

> Why is this file ignored?

It is usually faster and more reliable than searching through every `.gitignore` file manually.

## Where ignore rules can come from

Git can load ignore patterns from several places:

```text
.gitignore
subdirectory/.gitignore
.git/info/exclude
global Git ignore file
```

For example:

```text
docs/.gitignore:3:build/ docs/build/index.html
```

This path is ignored by a rule in `docs/.gitignore`.

Another result might be:

```text
/home/example/.gitignore:12:*.log debug/output.log
```

That rule comes from the global Git ignore file rather than the repository.

This distinction matters. Editing the root `.gitignore` will not change a rule defined in a nested `.gitignore`, `.git/info/exclude`, or your global ignore configuration.

## Check a tracked file

Ignore rules normally apply to untracked files. Once a file is tracked, adding it to `.gitignore` does not remove it from the repository.

To check whether a tracked file also matches an ignore rule, add `--no-index`:

```bash
git check-ignore --verbose --no-index -- path/to/file
```

For example:

```bash
git check-ignore --verbose --no-index -- .claude/history.jsonl
```

When a tracked file matches an ignore rule and should no longer be tracked, remove it from Git's index without deleting the local file:

```bash
git rm --cached -- path/to/file
```

The ignore rule will then apply to it.

## Check multiple paths

Pass several paths directly:

```bash
git check-ignore --verbose -- \
  path/one \
  path/two \
  path/three
```

For a longer list, send the paths through standard input:

```bash
printf '%s\n' \
  'scratch/test.txt' \
  'content/posts/example/scratch/notes.md' \
  '.claude/history.jsonl' \
  | git check-ignore --verbose --stdin
```

Add `--no-index` when the list may contain tracked files:

```bash
printf '%s\n' \
  'scratch/test.txt' \
  'content/posts/example/scratch/notes.md' \
  '.claude/history.jsonl' \
  | git check-ignore --verbose --no-index --stdin
```

## Show paths that are not ignored

By default, `git check-ignore` only reports matching paths.

Add `--non-matching` to include paths that do not match an ignore rule:

```bash
git check-ignore \
  --verbose \
  --non-matching \
  -- path/to/file
```

This is particularly useful in scripts or when checking a mixture of ignored and non-ignored paths.
