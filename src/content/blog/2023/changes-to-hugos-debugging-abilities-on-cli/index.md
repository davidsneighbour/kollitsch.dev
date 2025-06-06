---
title: Changes to Hugo's debugging abilities on the CLI
description: >-
  Hugo v0.114.0 dropped and deprecated various CLI flags, introducing --logLevel
  for verbosity. Theme developers though can only access WARN and ERROR
  loglines.
date: '2023-06-21T22:54:26+07:00'
resources:
  - title: >-
      Photo by [Vincent van Zalinge](https://unsplash.com/@vincentvanzalinge)
      via [Unsplash](https://unsplash.com/)
    src: header.jpg
tags:
  - gohugo
  - bash
  - pipes
  - logging
  - debugging
  - 100DaysToOffload
unsplash:
  imageid: abcdefghijk
fmContentType: blog
cover: header.jpg
---

[Hugo](https://gohugo.io) in [version 0.114.0](https://github.com/gohugoio/hugo/releases/tag/v0.114.0) finally introduced the changes [I wrote about a while back](/blog/2022/piping-output-to-files-in-bash/).

The `hugo` command on the CLI now dropped the `--log` and `--verboseLog` flags and deprecated the `--verbose` and `--debug` flags. Instead, it now uses the `--logLevel` as an indicator of verbosity. The `--logLevel` flag can be set to `error`, `info`, `warn`, or `debug`. The default seems to be `warn`.

If you wish to log the output of `hugo` you can refer to my post from last year about [ways to pipe output to files in Bash](/blog/2022/piping-output-to-files-in-bash).

As a theme developer you still have [only ways to access WARN loglines via `warnf` and ERROR loglines via `errorf`](https://gohugo.io/functions/errorf/). DEBUG and INFO loglines are not accessible from within a theme and belong to Hugo only. This is a bit of a bummer, but I guess it is what it is.
