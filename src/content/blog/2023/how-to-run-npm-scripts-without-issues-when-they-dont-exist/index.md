---
title: How to run NPM scripts without issues when they don't exist
description: >-
  Discover how to seamlessly handle optional npm scripts in various build
  environments using the --if-present flag. Avoid errors and streamline CI
  processes.
date: 2023-11-19T11:15:06.000Z
publishDate: 2023-11-19T11:15:06.000Z
lastmod: 2023-11-20T13:18:22.000Z
resources:
  - title: >-
      Photo by [Paul Esch-Laurent](https://unsplash.com/@pinjasaur) via
      [Unsplash](https://unsplash.com/)
    src: header.jpg
tags:
  - automation
  - npm
  - devops
  - howto
  - 100DaysToOffload
type: blog
unsplash:
  imageid: oZMUrWFHOB4
fmContentType: blog
---

A while back I started consolidating all my release scripts and ran into an issue, that on the second look is quite obvious to solve, but I still wanted to share it with you.

You might run into situations, where you have scripts that are only relevant for certain builds or environments. For instance, in a Continuous Integration (CI) setup, you might have specific scripts for deployment, linting, or testing that do not apply to every build.

My first idea was to load `package.json` into a JSON object and then search for the script I want to run. If it exists, I would run it, otherwise, I would skip it. This approach works, but it's not very elegant and requires a lot of boilerplate code.

Happily enough it turned out, that npm has a built-in option to handle this scenario. The [`--if-present`](https://docs.npmjs.com/cli/v9/commands/npm-run-script#if-present) flag alters the behavior of `npm run-script` (or `npm run`). Normally, if you try to execute a script that is not defined in your `package.json` file's `scripts` section, npm exits with an error code. When `--if-present` is set to `true`, npm will not throw an error. Great.

If the script is present *and* it fails during execution, npm will still exit with an error. This ensures that while the script's absence is tolerated, its failure is not, maintaining a level of strictness in your workflow.

```javascript
npm run lint --if-present
```

**Important Note:** It's crucial to note that the `--if-present` value does not get exported to the environment for child processes. This means that the flag's state won't be automatically passed to scripts triggered by the initially executed script.
