---
title: Installation and Update
description: ""
summary: ""

date: 2022-07-19T17:40:35+07:00
publishDate: 2022-07-19T17:40:35+07:00
lastmod: 2022-08-02T20:58:29+07:00

resources:
  - src: header-card.png
  -
categories:
  - components

tags:
  - gohugo
  - component
  - reference
---

## Installing

First enable modules in your own repository:

```bash
hugo mod init github.com/username/reponame
```

Then add this module to your required modules in config.toml.

```toml
[module]

[[module.imports]]
path = "github.com/davidsneighbour/hugo-robots"

```

The next time you run `hugo` it will download the latest version of the module.

## Updating

```shell
# update this module
hugo mod get -u github.com/davidsneighbour/hugo-robots
# update all modules
hugo mod get -u ./...
```
