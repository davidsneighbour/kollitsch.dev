---
type: blog
title: Simple multi-language pre-commit hooks
description: This is one of the posts that spent months in draft (fka ideas) mode. Recently
  I got to convert some people to use the tool described by this post, so I
  thought I might as well add some context to it.
summary: This is one of the posts that spent months in draft (fka ideas) mode. Recently
  I got to convert some people to use the tool described by this post, so I
  thought I might as well add some context to it.
date: 2022-08-14T22:28:21+07:00
publishDate: 2022-08-14T22:28:21+07:00
lastmod: 2022-08-28T18:44:23+07:00

resources:
  - title: Photo by [Mohammad Rahmani](https://unsplash.com/@afgprogrammer) via
      [Unsplash](https://unsplash.com/)
    src: header.jpg

tags:
  - pre-commit
  - git
  - code quality
  - automation
  - 100DaysToOffload
---

This is one of the posts that spent months in draft (fka ideas) mode. Recently I got to convert [some](https://github.com/danielfdickinson/dfd-template/commit/aecb3a68dfcb7a63492cf79df7c3b58b86f29095) people to use the tool described by this post, so I thought I might as well add some context to it. This is one of the posts that will be posted "quick and dirty" and I will update and optimise them over time.

Introducing [pre-commit](https://pre-commit.com/) 🎉🎊🍾🙌

Pre-Commit is my go-to-tool to fix stuff before it "hits the repository". It's a Python based tool that hooks into `git` and runs hooks before you do stuff like committing, pushing, pulling, etc.

You can even program your own checks in any programming language required.

## Installing pre-commit

Python (or pip) needs to be installed to use `pre-commit`, which is the case on most Linux systems. You are on your own if you use another system.

```bash
pip install pre-commit
pre-commit install
```

With `pre-commit install` you install the local setup. Read on to know what you can configure.

## Configuring pre-commit

Your configuration is situated in `.pre-commit-config.yaml`. Feel free to have a look at [mine](https://github.com/davidsneighbour/kollitsch.dev/blob/main/.pre-commit-config.yaml) for some (slightly COD) examples. There is a lot that `pre-commit` can do. Be it line endings, formattings, linting of your stylesheets or markdown documents, keeping an eye on rules for your binary files, and so on, and even more...

Some of my favourite examples are the following ones:

```yaml
- repo: 'https://github.com/pre-commit/pre-commit-hooks'
  rev: v4.2.0
  hooks:
  - id: trailing-whitespace
    exclude: ^(_vendor)
    args: [--markdown-linebreak-ext=md]
  ```

This will remove trailing whitespaces on all files, but markdown files (because, well, if you do Markdown right then two spaces at the end of a line are the same as an `<br/>` tag, which you of course knew already).

```yaml
- repo: 'https://github.com/crate-ci/typos'
  rev: v1.8.1
  hooks:
    - id: typos
      args: ['--config', './config/local/typos.toml', './content/']
      files: ^content|i18n
```

Typos is a great source code spell checker. Use it, check it.

```yaml
- repo: 'https://github.com/zricethezav/gitleaks'
  rev: v8.8.4
  hooks:
    - id: gitleaks
```

Gitleaks checks if you accidentally left any codes, apikeys or secrets in your commits. Very convenient for the light headed developer apprentice.

Long story short: `pre-commit` can fix your problems before they hit your repository, it can lint, optimise and clean up your commits. Some times it just fixes things, I add it's changes and retry my commit and all is well.

`pre-commit` for the win.
