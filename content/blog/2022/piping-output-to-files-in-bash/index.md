---
title: Piping output to files in Bash
date: 2022-05-08T15:18:20+07:00
publishDate: 2022-05-08T15:18:20+07:00
lastmod: 2022-05-08T20:13:39+07:00
resources:
  - title: Photo by [Vincent van Zalinge](https://unsplash.com/@vincentvanzalinge)
      via [Unsplash](https://unsplash.com/)
    src: header.jpg
tags:
  - bash
  - pipes
  - logging
  - debugging
  - 100DaysToOffload
unsplash:
  id: vUNQaTtZeOo
---

There is [a recent commit in GoHugo's repository](https://github.com/gohugoio/hugo/pull/9649) that removes several CLI parameters I was using in my projects. Those flags were `--debug`, `--log`, `--logFile` and `--verboseLog`. While I am not discussing this decision (I don't like it, but I understand that keeping these things in the software needs someone able to keep them up to date and conclusive and the developer of the software seems to be unable to) I am still interested in the idea of having a file with all output of my Hugo runs available so I can parse through it and see what is going on while building the site. Apart from the fact that basically every software has a parameter like this available.

The [comment in the attached issue](https://github.com/gohugoio/hugo/issues/9648) says:

> If people want to log to file, they need to pipe the output.

Well, so let's see how we can pipe the output of `hugo` to a file.

## What are Linux standard streams?

First of all we need to learn about Linux standard streams. Those are "pipelines" that any command can send content to for display in the CLI or other uses. `stdin` is the _standard input_ stream. This accepts text as its input. Text output to the shell is delivered via the `stdout` (_standard out_) stream. Error messages are sent through the `stderr` (_standard error_) stream.

This leaves us with two streams that output of the Hugo command could be sent to: `stdout` and `stderr`.

We might want to pipe the output to one file, the errors to another, or display the errors and pipe the output or display any output (including errors) and save it to a file too. There are many possibilities to pipe.

## How to pipe or display output and errors in Bash?

| Syntax | Append | Terminal: StdOut | StdErr | File: StdOut | StdErr
|---|:---:|:---:|:---:|:---:|:---:|:---:|
| `>>` | ✓ | ✕ | ✓ | ✓ | ✕ |
| `2>>` | ✓ | ✓ | ✕ | ✕ | ✓ |
| `&>>` | ✓ | ✕ | ✕ | ✓ | ✓ |
| `tee -a` | ✓ | ✓ | ✓ | ✓ | ✕ |
| `2>&1 \| tee -a` | ✓ | ✓ | ✓ | ✓ | ✓ |
| `>` | ✕ | ✕ | ✓ | ✓ | ✕ |
| `2>` | ✕ | ✓ | ✕ | ✕ | ✓ |
| `&>` | ✕ | ✕ | ✕ | ✓ | ✓ |
| `tee` | ✕ | ✓ | ✓ | ✓ | ✕ |
| `2>&1 \| tee` | ✕ | ✓ | ✓ | ✓ | ✓ |

## Example uses that either pipe or display

```bash
hugo server > hugo-output.log 2> hugo-error.log
```

Runs Hugo, pipes output to `hugo-output.log` and errors to `hugo-error.log`. If either of these files already exists the output will be appended to the file.

```bash
hugo server 2> hugo-error.log
```

Runs Hugo, displays the output and does not save it, but adds all errors to `hugo-error.log`.

```bash
hugo server >> hugo-output.log
```

Runs Hugo, pipes the output to `hugo-output.log` (which will be overridden) and displays errors.

## Piping AND displaying output or errors

Now onto the problem at hand. With the removal of `--debug`, `--log`, `--logFile` and `--verboseLog` we can no longer send the output of Hugo on the CLI to a file for later use. The way `--log` worked was to show the output and errors on the CLI _and_ pipe them into the file designated by `--logFile`. The `--verboseLog` option resulted in more detailled output in the log file only. To achieve the same effect we run `hugo` with the `--verbose` option and pipe output as well as errors into our log file, appending to existing content.

The command for this is the following:

```bash
hugo server --verbose 2>&1 | tee -a hugo-log.txt
```
