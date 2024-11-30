---
title: Hooks
description: This module provides hooks and filters as an easy way for theme developers to let users add partials and blocks at pre-defined safe places in their themes or modules.
summary: This module provides **Hooks and filters for GoHugo layouts** as an easy way for theme developers to let users add partials and blocks at pre-defined safe places in their themes or modules.
lastmod: 2024-11-30T18:37:44+07:00
date: 2024-03-13T22:57:56+07:00
resources:
- src: header-card.png
tags:
- gohugo
- component
- themeing
- extension
- plugin
- filter
- hooks
- module
- documentation
aliases:
- /components/hugo-hooks/
menus:
  main:
    parent: GoHugo
    params:
      bsicon: puzzle-fill
---

* [Key features](#key-features)
* [Hook and filter principle](#hook-and-filter-principle)
* [Setup and use hooks](#setup-and-use-hooks)
  * [Configure hooks](#configure-hooks)
  * [Simple calls (running just the call)](#simple-calls-running-just-the-call)
  * [Advanced use (adding parameters to the call)](#advanced-use-adding-parameters-to-the-call)
* [Setup and use filters](#setup-and-use-filters)
  * [Configure filters](#configure-filters)
  * [Call filters](#call-filters)
* [Configuration of other features](#configuration-of-other-features)
* [Best Practices](#best-practices)
  * ["Global" Reusable Hooks](#global-reusable-hooks)
  * [Namespaced Hooks](#namespaced-hooks)
  * [Sample usage](#sample-usage)

This module provides **Hooks and filters for GoHugo layouts** as an easy way for theme developers to let users add partials and blocks at pre-defined safe places in their themes or modules.

We often want to add locations and places in our templates and layouts where it's users can add something on their own. Be it some code for an analytics script, that arbitrary ad or popup or just some space for call to actions or individual footer sections, a banner at the top of the page or some specific JavaScript code, a separator after each fifth post, a button in each header.

This module provides a simple way **any theme developer** can add these "layout locations" to "hook" features and extensions into the workflow. **As the end-user** you can add simple layout files to "hook" into these locations and add whatever pizzazz, panache, flair or sparkle your website needs.

## Key features

* **Customization:** Users can add custom layout files to predefined locations in their themes, allowing for personalized enhancements and modifications.
* **Flexibility:** Suitable for a wide range of additions, from simple text blocks to complex scripts, making it adaptable to various needs and purposes.
* **Caching:** Hooks can be cached for improved performance, reducing creation times.
* **Ease of Integration:** Hooks can be added to other plugins or themes through configuration settings, facilitating seamless integration and expansion of features. This allows for greater interoperability and adaptability within the GoHugo ecosystem, enabling developers to enhance their themes or plugins with capabilities without extensive coding.

## Hook and filter principle

**Hooks** are actions that are executed at the predefined location. **Filters** are actions that take an input and return a modified output[^1].

Theme users save individual hooks to the `layouts/partials/hooks` and filters to the `layouts/partials/filtters` directory.

If a requested hook or filter is not found then there are no errors. Some themes or modules might offer feedback if their hook is unused and usage of them is required or encouraged to get important features working.

## Setup and use hooks

### Configure hooks

Hooks need to be configured in the `params` section of the configuration:

```toml
[[dnb.hooks.items.namespace.hookname]]
file = "filename without .html extension"
cached = false
```

`hookname` is to be replaced with the hook name and `file` denotes the filename within the `layouts/partials/hooks` directory.

Hooks **do not return any values**, they execute the layouts. To read more about ideas to extend the hooks to return values read [#2 RFC: Hooks that return values][3].

In params.toml (or under the `[params]` section of the configuration) add a table array as such:

```toml
[[dnb.hooks.items.namespace.hookname]]
file = "partial path"
weight = "integer"
cached = "boolean/string"
```

Notes:

* hookname without cached at the end. The hook must exist and be called by the calling template so that this hook is added. If the hookname does not exist, this hook will be ignored.
* weight is used for sorting hooks. Please leave this out to have the hook run in the order it is added. the default weight is 0. Use this only if you want a hook run before or after others.
* cached is either a boolean defining if the result of the hook is cached per page or run every time it's called or a string. in that case, it is cached with this string as an identifier. This string might be a simple string, which will cache the result globally (NOT per page), or it might contain a %random%, which will be replaced with a random string.

Note that the cached option is a work in progress. I'll need to find ways to cache, for instance, according to section. This might change over time.-

### Simple calls (running just the call)

Add the hook name as parameter to simple calls. The context inside of the hook layout will have a hook parameter with that name.

```golang
{{- partial "func/hook.html" "hookname" -}}
{{- partialCached "func/hook.html" "hookname" $CACHENAME -}}
```

### Advanced use (adding parameters to the call)

If the hook supports adding parameters you can call it by adding a `dict` object to your call. The `hook` parameter is required, everything else will be passed through as-is to the hook layout. You should always add `"context" .` to add the local layout-context to your parameters. Can't go wrong with that :)

```golang
{{- partial "func/hook.html" ( dict "hook" "hookname" "context" . ) -}}
{{- partialCached "func/hook.html" ( dict "hook" "hookname" "context" . ) $CACHENAME -}}
```

## Setup and use filters

### Configure filters

In `params.toml` (or under the `[params]` section of the configuration) add a table array as such:

```toml
[[dnb.hooks.filters.namespace.filtername]]
file = "partial path"
weight = "integer"
cached = "boolean/string"

# proper sample
[[dnb.hooks.filters.namespace.urlfilter]]
file = "func/urlfilter.html"
weight = 100
cached = false
```

Notes:

* `filtername` - The filter must exist and be called by the calling template so that this filter is added. If the `filtername` does not exist as a partial, then this filter is ignored.
* weight is used for sorting filter. Please leave this out to have the filter run in the order it is added. the default weight is 0. Use this only if you want a filter run before or after others.
* cached is either a boolean defining if the result of the filter is cached per page or run every time it's called or a string. in that case, it is cached with this string as an identifier. This string might be a simple string, which will cache the result globally (NOT per page), or it might contain a %random%, which will be replaced with a random string.

Note that the cached option is a work in progress. I'll need to find ways to cache, for instance, according to section. This might change over time.-

### Call filters

Call:

```go-html-template
{{- $filteredValue := partials.Include "func/filter.html" ( collections.Dictionary
                                            "filter" "filtername"
                                            "context" . ) -}}
```

The required parameter is `filter` with the filter name. everything else depends on the filter and its documentation.

## Configuration of other features

You can configure the module by setting the following options in the `params` section of your configuration:

```toml
[dnb.hooks]
disable_messages = [
  "unused_hooks",
  "running_hooks",
  "running_cached_hooks",
  "running_uncached_hooks",
]
```

**disable_messages**:

* `unused_hooks` - silences "unused hooks" messages
* `running_hooks` - silences ALL "running hook x" messages
* `running_cached_hooks` - silences all "running cached hook x" messages (`false` if `running_hooks` is false)
* `running_uncached_hooks` - silences all "running uncached hook x" messages (`false` if `running_hooks` is false)

The messages system also uses the methods implemented in [`debug`][1] to silence based on verbosity level.

## Best Practices

### "Global" Reusable Hooks

The "Global" Reusable Hooks in the GoHugo Hooks module are designed to ensure high portability and consistency across different themes and modules. These hooks, adopted by all of @davidsneighbour's GoHugo themes and modules, are recommended for widespread use to maintain a uniform approach in the Hugo community. The table below outlines each hook, its execution count, and its intended location within the layout:

| Hookname                | Runs | Location                                                                                               |
| :---------------------- | :--: | :----------------------------------------------------------------------------------------------------- |
| **setup**               |  1   | Before any output. Ideal for script setup and configuration.                                           |
| **head-init**           |  1   | Immediately after the `<head>` tag. Shouldn't print anything to allow initial head-tags to load first. |
| **head-start**          |  1   | After the initial head-tags, for early head content.                                                   |
| **head-pre-css**        |  1   | Inside the head, before adding stylesheets.                                                            |
| **head-post-css**       |  1   | Inside the head, after adding stylesheets.                                                             |
| **head-end**            |  1   | At the end of the head, just before `</head>`.                                                         |
| **body-start**          |  1   | At the start of the body.                                                                              |
| **container-start**     |  1   | At the start of the main container.                                                                    |
| **content-start**       |  1   | At the beginning of the main content area.                                                             |
| **content-end**         |  1   | At the end of the main content area.                                                                   |
| **container-end**       |  1   | At the end of the main container.                                                                      |
| **footer-start**        |  1   | At the start of the footer.                                                                            |
| **footer-inside-start** |  1+  | At the beginning of the inner footer area.                                                             |
| **footer-widget-start** |  1+  | Before footer widgets.                                                                                 |
| **footer-widget-end**   |  1+  | After footer widgets.                                                                                  |
| **footer-inside-end**   |  1+  | At the end of the inner footer area.                                                                   |
| **footer-end**          |  1   | At the end of the footer.                                                                              |
| **body-end-pre-script** |  1   | At the end of the body, before deferred theme JavaScripts.                                             |
| **body-end**            |  1   | At the end of the body, after deferred JavaScripts, before `</body>`.                                  |
| **teardown**            |  1   | After all output, for script cleanup.                                                                  |

These hooks are strategically placed to enhance the features and customization of themes, ensuring a smooth and consistent user experience across various implementations.

### Namespaced Hooks

For specific modules use a namespaced hook name (like `dnb.netlification.headers`, `dnb.netlification.redirects`, etc.) to avoid collisions with other modules and hooks. Please document your hooks and link them back to this README so users can dive into the details of the system if required.

### Sample usage

Have a look a the following projects to see usage of this module:

* [Hooks in the theme of kollitsch.dev][4]
* [Filters in the theme of kollitsch.dev][5]

[^1]: If you know about actions and filters in WordPress then you already have an idea how hooks and filters will work.

[1]: https://github.com/davidsneighbour/hugo-modules/tree/main/modules/debug#readme
[3]: https://github.com/davidsneighbour/hugo-modules/issues/14
[4]: https://github.com/davidsneighbour/hugo-theme/search?q=func%2Fhook
[5]: https://github.com/davidsneighbour/kollitsch.dev/search?q=func%2Ffilter
