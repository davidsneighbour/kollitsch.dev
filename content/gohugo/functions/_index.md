---
title: Functions
linkTitle: functions
description: ""
summary: ""
date: 2022-08-16T20:28:30+07:00
publishDate: 2022-08-16T20:28:30+07:00
lastmod: 2024-11-30T16:38:57+07:00
resources:
- src: header-card.png
tags:
- gohugo
- component
- content
aliases:
- /components/hugo-functions/
cascade:
  params:
    config:
      overviewLabel: All functions
---

This documentation is work in progress. Please check back later.

A GoHugo theme component with helper functions for other projects.

## Installing

First enable modules in your own repository if you did not already have done so:

```bash
hugo mod init github.com/username/reponame
```

Then add this module to your required modules in `config.toml`.

```toml
[module]

[[module.imports]]
path = "github.com/davidsneighbour/hugo-functions"
disable = false
ignoreConfig = false
ignoreImports = false

```

The next time you run `hugo` it will download the latest version of the module.

## Updating

```bash
# update this module
hugo mod get -u github.com/davidsneighbour/hugo-functions
# update to a specific version
hugo mod get -u github.com/davidsneighbour/hugo-functions@v1.0.0
# update all modules recursively over the whole project
hugo mod get -u ./...
```

### Working principle

While being named `functions` this component adds merely partials that return values. In these partials calculations are done, so we might un-nerdily call them functions. The reason for this is that Hugo does not allow for functions to be added to a theme component. So we are using partials instead.
