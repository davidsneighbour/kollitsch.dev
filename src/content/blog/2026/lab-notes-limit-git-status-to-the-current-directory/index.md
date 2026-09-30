---
title: "Lab Notes: Limit Git status to the current directory"
description: "Run git status -- . to show only changes in the current directory and below, and add a global statuss alias to make the scoped version a short command."
tags:
  - lab-notes
  - git
cover:
  type: image
  src: alexander-mils-Z9jrIi3pEQo-unsplash.jpg
  title: "Notes from the Laboratory"
date: 2026-09-30T22:53:04.799Z
fmContentType: blog
---

`git status` shows changes across the repository, even when you run it from a subdirectory. To see only changes in the current directory and its subdirectories, add a path:

```bash
git status -- .
```

The `--` separates options from paths. The `.` selects the current directory, recursively.

For a shorter command, create a global Git alias:

```bash
git config --global alias.statuss 'status -- .'
```

Then, from any directory inside a repository, run:

```bash
git statuss
```

The extra `s` gives the directory-scoped version its own name while keeping the usual `git status` command available.
