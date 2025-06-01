---
title: Installation and Update
description: Guide to installing and updating modules in GoHugo
summary: Learn how to enable and manage GoHugo modules in your project.
date: 2022-07-19T17:40:35+07:00
publishDate: 2022-07-19T17:40:35+07:00
lastmod: 2024-09-09T11:07:21.850Z
tags:
  - gohugo
  - component
  - reference
---

## Installing a GoHugo module

### Enable modules in your repository

First, initialize modules in your Hugo project by running:

```bash
hugo mod init github.com/username/reponame
```

### Add the module to your `config.toml`

Include the desired module in your project's configuration file:

```toml
[module]

[[module.imports]]
path = "github.com/davidsneighbour/hugo-robots"
```

### Download the module

The next time you run `hugo`, it will automatically download and integrate the latest version of the specified module.

## Updating GoHugo Modules

To update a specific module or all modules in your project:

### Update a specific module

```bash
hugo mod get -u github.com/davidsneighbour/hugo-robots
```

### Update all modules

```bash
hugo mod get -u ./…
```

Running these commands ensures that your project is using the most up-to-date versions of the modules.
