---
title: Piping output to files in Bash
date: 2022-05-06T19:02:32+07:00
publishDate: 2022-05-06T19:02:32+07:00
lastmod: 2022-05-06T19:08:29+07:00
resources:
  - title: Photo by [Vincent van Zalinge](https://unsplash.com/@vincentvanzalinge)
      via [Unsplash](https://unsplash.com/)
    id: vincent-van-zalinge-vUNQaTtZeOo-unsplash.jpg
    src: header.jpg
tags:
  - bash
  - pipes
unsplash:
  id: vUNQaTtZeOo
---

There is [a recent commit in GoHugo's repository](https://github.com/gohugoio/hugo/pull/9649) that removes several CLI parameters I was using in my projects. Those flags were `--debug`, `--log`, `--logFile` and `--verboseLog`. While I am not discussing this decision (I don't like it, but I understand that keeping these things in need someone able to keep them up to date and conclusive) I am still interested in the idea of having a file with all output of Hugo available so I can parse through this information and see what is going on on building a site.

The [comment in the attached issue](https://github.com/gohugoio/hugo/issues/9648) (classic Bep) says:

> If people want to log to file, they need to pipe the output.

So let's see how we can pipe the output to a file.

Long story short, here is the gist:

| Syntax | Terminal: StdOut | StdErr | File: StdOut | StdErr
|---|:---:|:---:|:---:|:---:|:---:|
| `>>` | ✕ | ✓ | ✓ | ✕ |
| `2>>` | ✓ | ✕ | ✕ | ✓ |
| `&>>` | ✕ | ✕ | ✓ | ✓ |
| `tee -a` | ✓ | ✓ | ✓ | ✕ |
| `& tee -a` | ✓ | ✓ | ✓ | ✓ |

| Syntax | Terminal: StdOut | StdErr | File: StdOut | StdErr
|---|:---:|:---:|:---:|:---:|:---:|
| `>` | ✕ | ✓ | ✓ | ✕ |
| `2>` | ✓ | ✕ | ✕ | ✓ |
| `&>` | ✕ | ✕ | ✓ | ✓ |
| `tee` | ✓ | ✓ | ✓ | ✕ |
| `& tee` | ✓ | ✓ | ✓ | ✓ |

