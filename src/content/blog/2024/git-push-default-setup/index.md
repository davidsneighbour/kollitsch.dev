---
title: Git `push.default` setup
description: >-
  Pushing a new branch to a repository's remote often requires two attempts by
  the scatterbrained developer, but there is help in `push.autoSetupRemote`.
summary: >-
  Pushing a new branch to a repository's remote often requires two attempts by
  the scatterbrained developer, but there is help in `push.autoSetupRemote`.
resources:
  - title: >-
      Photo by [Roman Synkevych](https://unsplash.com/@synkevych) via
      [Unsplash](https://unsplash.com/)
    src: header.jpg
tags:
  - git
  - configuration
  - 100daystooffload
date: '2024-04-12T21:09:32+07:00'
fmContentType: blog
cover: ./header.jpg
publisher: rework
---

Pushing a new branch to a repository's remote often requires two attempts by the scatterbrained developer:

```bash
❯ git push origin
fatal: The current branch newbranchname has no upstream branch.
To push the current branch and set the remote as upstream, use

    git push --set-upstream origin newbranchname
```

While it's easy to copy and paste that hint, there is a way to tell Git to create that missing branch the first time we attempt to push.

With the `push.autoSetupRemote` configuration option in Git, it automatically sets up the remote branch when pushing for the first time, eliminating the need to set the upstream branch or encountering errors due to missing upstream references.

Enabling `push.autoSetupRemote` is simple. Just use the following command:

```bash
git config --global --add --bool push.autoSetupRemote true
```

This command sets the `push.autoSetupRemote` option to `true` globally, ensuring that Git automatically sets up the remote branch whenever you push for the first time in any repository on your system.

By enabling `push.autoSetupRemote`, you can avoid the hassle of thinking when setting up remote branches manually.
