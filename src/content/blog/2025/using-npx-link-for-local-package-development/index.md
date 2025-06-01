---
$schema: /assets/schemas/blog.schema.yaml
title: Using `npx link` for local package development
description: ''
summary: ''
date: '2025-03-05T18:54:58+07:00'
resources:
  - title: >-
      Photo by [Paul Esch-Laurent](https://unsplash.com/@pinjasaur) via
      [Unsplash](https://unsplash.com/)
    src: paul-esch-laurent-oZMUrWFHOB4-unsplash.jpg
tags:
  - npm
  - how to
  - development
  - 100DaysToOffload
fmContentType: blog
cover: paul-esch-laurent-oZMUrWFHOB4-unsplash.jpg
---

When working on multiple interdependent packages, managing them efficiently within a monorepo or a workspace structure is crucial. Traditionally, `npm link` was used to create symlinks between local packages, but it has its pitfalls, including version mismatches and unintended dependencies.

A better approach is to use [`npx link`](https://www.npmjs.com/package/link), a modern alternative that simplifies local package linking while avoiding the issues inherent to `npm link`. [This blog post by the developer](https://hirok.io/posts/avoid-npm-link) outlines the problems with `npm link` in detail and why `npx link` is a superior choice.

If you want, install `npx link` globally:

```bash
npm install -g link
```

This is not necessary, as you can (and probably will) use `npx link` directly without installing it globally.

I defined my local packages in a configuration file (`link.config.json`) in my project root, for example:

```jsonc
{
  "packages": [
    "../configurations/packages/biome-config",
    "../configurations/packages/bootstrap-config",
    // …more packages…
    "../configurations/packages/stylelint-config",
    "../configurations/packages/tools",
    "../debuglogger",
    "../hugo-darkskies",
    "../imagemin-lint-staged",
    "../netlify-plugin-hugo-helper"
  ]
}
```

Run the following command inside your main project directory to link all packages:

```bash
npx link
```

This creates symlinks for all listed packages, making them available as dependencies in your main project without having to publish them.

If you frequently develop multiple packages in parallel, this approach can greatly simplify your setup and make dependency management more predictable.
