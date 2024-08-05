---
title: Development
date: 2023-11-16T15:46:47+07:00
lastmod: 2024-03-15T20:21:19+07:00
resources:
- src: header-card.png
categories:
- components
tags:
- gohugo
- component
- development
---

## Formatters

Formatters are dedicated layout files for certain variable types. dnb-hugo offers reusable templates for any structural need (two and three column tables or plain printout) and takes over the markup and styling of the output.

The configuration for a single formatter offers the following parameters:

```toml
[[dnb.debug.formatters]]
type = "navigation.MenuEntry"
catch = "navigation\\.MenuEntry$"
class = "struct"
internal = "map"
weight = 100
slug = "menuentry"
label = "Menu Entry"
description = ""
```

* **internal** (required, if no `catch` or `type` is used) - Set to `map` or `slice` to give a general indicator of the variable type.
* **catch** (required, if no `type` or `internal` is used) - A regular expression to match on the type. For instance `"navigation\\.MenuEntry$"`
* **type** (required, if no `catch` or `internal` is used) - A string expression to match on the type. For instance `boolean`.
* **class** - A type class to define the output format. Not yet implemented.
* **weight** - This parameter is used to sort the formatters before they are used to display a variable type. If no weight is given then the order in the configuration is used. First come (based on `type` or `catch`) first serve.
* **slug** (required) - Filename part for the formatter layout in `layouts/partials/debugging-formatters/SLUG.html`.
* **label** (required) - A title to show for the debugging-table that is used to debug dictionaries and slices.
* **description** (required) - A description to show as overlay for the debugging-table that is used to debug dictionaries and slices.

Evaluation of the type is done in the order or `internal`, then `catch`, then `type`. First come first serve.
