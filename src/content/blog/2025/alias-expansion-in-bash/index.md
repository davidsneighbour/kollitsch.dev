---
title: Alias Expansion in Bash
linkTitle: Alias Expansion in Bash
description: Learn how alias expansion works and how to use builtin to override it.
summary: >-
  Bash aliases expand dynamically, meaning for instance an alias referencing cd
  will use the modified version if cd is aliased. This post explains how alias
  expansion works, what happens when aliases reference other aliases, and how to
  use builtin to ensure the original command runs.
date: '2025-02-05T08:34:49+07:00'
resources:
  - title: >-
      Photo by [Gabriel Heinzer](https://unsplash.com/@6heinz3r) via
      [Unsplash](https://unsplash.com/)
    src: gabriel-heinzer-xbEVM6oJ1Fs-unsplash.jpg
tags:
  - bash
  - 100daystooffload
fmContentType: blog
cover:
  src: ./gabriel-heinzer-xbEVM6oJ1Fs-unsplash.jpg
  type: image
publisher: rework
---

Aliases in Bash are a powerful way to simplify repetitive commands or add parameters you *always* use, but they can also lead to problems when one alias calls another. One common issue that comes up is whether an alias that references another alias uses the original command or an aliased version of it --- if the alias overrides the original command.

As an example, I have a `cd` alias, that changes the directory and runs `nvm` if there is a `.nvmrc` file in that directory. Then I define other aliases that traverse two or more directories upwards. Here is the `cd` alias:

```bash
alias cd='change_directory'
alias ..='cd ..'
alias …='cd ../..'
alias ….='cd ../../..'
alias …..='cd ../../../..'
alias ……='cd ../../../../..'
alias cdhist='dirs -v'
```

When you create an alias, Bash replaces its invocation with the defined command before execution. For example:

```bash
alias cd='change_directory'
alias ..='cd ..'
```

Now, running `..` expands to `cd ..` which has been aliased to `change_directory`, so the actual executed command is `change_directory ..`.

This means **aliases always expand to whatever `cd` is currently defined as**, not what it was at the time the alias was created.

If you define `cd` **after** other aliases that use it, the new alias still applies:

Sometimes, you may want to use the original `cd` instead of the aliased version. Bash provides the `builtin` keyword to force execution of built-in commands instead of aliases:

```bash
alias ..='builtin cd ..'
```

Now, running `..` always uses the original `cd`, regardless of any alias.

In summary:

* **Aliases expand at runtime**, so if for instance `cd` is aliased, any alias using `cd` uses the aliased version.
* **The Order of alias definitions does not matter** because aliases reference commands when they are called, not when they are defined.
* **Use `builtin` to bypass aliases** and ensure the original bash command is executed instead.
