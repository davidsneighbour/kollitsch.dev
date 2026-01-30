---
title: "The Pizening II: The tale of the untracked cache in Git"
description: "pizen post"
draft: true
date: 2025-10-10T12:17:16.215Z
tags: []
cover:
  src: "patrycja-jadach-1bS1PGDrdy4-unsplash.jpg"
  title: ""
---

audit: <https://chatgpt.com/c/695858ce-2d68-8321-80f0-cabe0d7d97de>

## Git untracked cache warnings and what they actually mean

When running `git status`, `git pull`, or similar commands, you may encounter the following notice:

> warning: Untracked cache is disabled on this system.

At first glance this looks alarming, but it is primarily a **performance-related warning**, not an indication of repository corruption or misconfiguration. Understanding why Git emits this message requires a closer look at what the untracked cache is and under which conditions Git will refuse to use it.

### What the untracked cache does

The untracked cache is an internal Git optimisation that speeds up commands such as `git status` by caching information about directories that contain untracked files. Instead of scanning the entire working tree on every invocation, Git can reuse cached directory metadata to determine whether anything has changed.

This optimisation relies on a critical assumption: **the filesystem must reliably update directory modification times (mtime) whenever files inside a directory change**. Git explicitly documents this requirement for the `core.untrackedCache` configuration option[^1].

If this assumption does not hold, Git may produce incorrect results. To avoid that risk, Git prefers correctness over performance.

### Why Git disables the untracked cache

Git will automatically disable the untracked cache if it determines that the underlying filesystem does not meet its requirements. This includes, but is not limited to:

* filesystems where directory mtimes are unreliable
* network or FUSE-based filesystems
* removable media or filesystems with unusual mount options

The official documentation makes it clear that enabling the untracked cache is conditional on filesystem behaviour and that users should verify filesystem support before relying on it[^1].

Git even provides a built-in mechanism to check this behaviour. The `git update-index --test-untracked-cache` command exists specifically to test whether the filesystem correctly reports directory changes in a way that makes the cache safe to use[^2].

If this test fails, Git will not use the untracked cache. In such cases, explicitly enabling `core.untrackedCache` may appear to work initially, but Git may silently disable it again if the filesystem proves unreliable. This is the situation commonly summarised as: _the filesystem is not considered safe for the untracked cache_.

### Is this a problem?

In most cases, no.

The absence of the untracked cache does not affect repository correctness. The only practical impact is performance, and even that is usually noticeable only in large repositories with many untracked files.

The `git status` documentation itself frames the untracked cache as an optional optimisation that should be enabled only when supported[^3].

### Practical takeaway

* The warning is informational, not an error.
* Git disables the untracked cache deliberately to avoid incorrect results.
* On filesystems that do not meet Git's expectations, disabling the cache is the correct and safe behaviour.
* If Git operations are fast enough for your workflow, no action is required.

---

[^1]: Git documentation, `core.untrackedCache` in `git-config`: The option assumes that directory modification times work correctly and recommends verifying filesystem behaviour before enabling it. [https://git-scm.com/docs/git-config](https://git-scm.com/docs/git-config)

[^2]: Git documentation, `git-update-index`: Describes the untracked cache mechanism and the `--test-untracked-cache` option used to verify filesystem support. [https://git-scm.com/docs/git-update-index](https://git-scm.com/docs/git-update-index)

[^3]: Git documentation, `git-status`: Mentions untracked cache as an optional performance optimisation to be enabled only when supported. [https://git-scm.com/docs/git-status](https://git-scm.com/docs/git-status)
