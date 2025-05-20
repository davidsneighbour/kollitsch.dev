---
title: Icons
description: This GoHugo module helps you to add SVG-based icon sets to your site. Icons are efficiently used, offering seamless integration of any SVG icon set you choose.
summary: This GoHugo module simplifies adding SVG-based icon sets to your site. Icons are efficiently defined once with `<symbol>` and reused with `<use>`, offering seamless integration of any SVG icon set you choose.
date: 2022-07-22T19:10:17+07:00
publishDate: 2022-07-22T19:10:17+07:00
lastmod: 2024-11-30T18:40:00+07:00
resources:
- src: header-card.png
tags:
- gohugo
- component
- design
aliases:
- /components/hugo-icons/
menus:
  main:
    parent: GoHugo
    params:
      bsicon: puzzle-fill
---

This GoHugo module simplifies adding SVG-based icon sets to your site. Icons are efficiently defined once with `<symbol>` and reused with `<use>`, offering seamless integration of any SVG icon set you choose.

## Key features

* **Flexible Integration**: Add any SVG icon set.
* **Performance-Optimized**: Icons are cached and reused for faster load times.
* **Defaults**: [Bootstrap Icons](https://icons.getbootstrap.com/) are included as a ready-to-use example.

## Resources

* **[SVG `<symbol>` Element](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/symbol)**
* **[SVG `<use>` Element](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/use)**

## Usage

### Adding Icons

To include an icon in your template or layout files, use it as a partial. Here's an example with the default Bootstrap icon set:

```go-html-template
{{- partials.Include "icon.html" "arrow-right" -}}
{{- partials.Include "icon.html" (dict "icon" "arrow-right") -}}
```

You can also add it with the `icon` shortcode in your markdown files:

```markdown
{{</* icon "arrow-right" */>}}
{{</* icon icon="arrow-right" */>}}
```

> [!WARNING]
> **Avoid caching** any icon partials in layouts, as the module already manages caching for optimal performance.

Both methods apply the following parameters to the icon partial:

* `icon`: The icon name.
* `set` (optional): The icon set name (default is `bootstrap`).

### Overview Shortcode

Showing a list of all icons configured is easy, but should not be done in production. It will slow down the creation of your site and might lead to timeouts. To see a list of all icons, use the following shortcode. Using the configured slug of your icon set for the `set` parameter. The default is `bootstrap`.

```markdown
{{</* icons/overview set="bootstrap" */>}}
```

### Set default icon set

By default `bootstrap` is used as the icon set. To change the default icon set you can add the following to your `params.toml`:

```toml
[dnb.icons]
default = "custom"
```

Set `custom` to the slug of the icon set you want to use as the default.

### Adding custom icon sets

This module is compatible with any SVG-based icon set. To add a custom icon set:

1. **Mount the icons as module** in your Hugo project.

   ```toml
   [[imports]]
   path = "github.com/tabler/tabler-icons"
   disable = false
   ignoreConfig = true
   ignoreImports = true

   [[imports.mounts]]
   source = "icons/filled"
   target = "assets/icons/tabler-filled"
   ```

2. **Configure your icon set** in `params.dnb.icons`

   ```toml
   [dnb.icons]
   default = "tabler-filled"
   [dnb.icons.tabler-filled]
   slug = "tbf"
   ```

3. **Use them** in your templates and content files.

Check out the [Icon set examples](#icon-set-examples) for more details.

### CSS class naming convention

Icons are assigned classes like `icon--custom` and `icon--$iconname`, where `$iconname` is the icon's name. You can use these classes to style based on the icon.

## Icon set examples

The following is a list of configurations for popular icon sets. You can use these as a reference to configure your own icon sets or quickly add one of these sets to your project.

> [!WARNING]
> Again. Do not configure icon sets that you do not use. This can slow down the creation of your site, lead to large and unused deployments, and might lead to timeouts.

* [Tabler Icons](#tabler-icons)
* [Font Awesome Icons](#font-awesome-icons)
* [Lineicons](#lineicons)
* [Iconoir](#iconoir)
* [Boxicons](#boxicons)

### Tabler Icons

[Tabler icons](https://tabler.io/icons) are available under a [MIT License](https://github.com/tabler/tabler-icons?tab=MIT-1-ov-file#readme).

In your `module.toml`, add the following configuration:

```toml
[[imports]]
path = "github.com/tabler/tabler-icons"
disable = false
ignoreConfig = true
ignoreImports = true

[[imports.mounts]]
source = "icons/filled"
target = "assets/icons/tabler-filled"

[[imports.mounts]]
source = "icons/outline"
target = "assets/icons/tabler-outline"
```

Then, in your `params.toml`, add the following configuration:

```toml
[dnb.icons.tabler-filled]
slug = "tbf"
[dnb.icons.tabler-outline]
slug = "tbo"
```

Use the following shortcodes to display Tabler icons overviews:

```markdown
{{</* icons/overview set="tabler-filled" */>}}
{{</* icons/overview set="tabler-outline" */>}}
```

### Font Awesome icons

[Font Awesome icons](https://fontawesome.com/) are available under a [CC BY 4.0 License](https://creativecommons.org/licenses/by/4.0/).

> [!IMPORTANT]
> Due to some weird behaviour of the Font Awesome repository you need to explicitly require the `6.x` branch of the site to require the SVG icons. You can do this by running the following command in your Hugo project:
>
> ```bash
> hugo mod get -u github.com/FortAwesome/Font-Awesome@6.x
> ```
>
> This leads to the following line (or similar) in your go.mod file:
>
> ```go
> github.com/FortAwesome/Font-Awesome v0.0.0-20240716171331-37eff7fa00de // indirect
> ```
>
> If it shows something like v4.7.0, you need to run the command again.

In your `module.toml`, add the following configuration:

```toml
[[imports]]
path = "github.com/FortAwesome/Font-Awesome"
disable = false
ignoreConfig = true
ignoreImports = true

[[imports.mounts]]
source = "svgs/brands"
target = "assets/icons/fa-brands"

[[imports.mounts]]
source = "svgs/regular"
target = "assets/icons/fa-regular"

[[imports.mounts]]
source = "svgs/solid"
target = "assets/icons/fa-solid"
```

Then, in your `params.toml`, add the following configuration:

```toml
[dnb.icons.fa-brands]
slug = "fab"

[dnb.icons.fa-regular]
slug = "far"

[dnb.icons.fa-solid]
slug = "fas"
```

Use the following shortcodes to display Font Awesome icons overviews:

```markdown
{{</* icons/overview set="fa-regular" */>}}
{{</* icons/overview set="fa-solid" */>}}
{{</* icons/overview set="fa-brands" */>}}
```

### Lineicons

[Lineicons](https://lineicons.com/) are available under a [MIT License](https://github.com/LineiconsHQ/Lineicons/blob/main/LICENSE.md).

In your `module.toml`, add the following configuration:

```toml
[[imports]]
path = "github.com/LineiconsHQ/Lineicons"
disable = false
ignoreConfig = true
ignoreImports = true

[[imports.mounts]]
source = "assets/svgs/regular"
target = "assets/icons/lineicons"
```

Then, in your `params.toml`, add the following configuration:

```toml
[dnb.icons.lineicons]
slug = "li"
```

Use the following shortcodes to display a Lineicons overview:

```markdown
{{</* icons/overview set="lineicons" */>}}
```

### Iconoir

[Iconoir](https://github.com/iconoir-icons/iconoir) icons are available under a [MIT license](https://github.com/iconoir-icons/iconoir/blob/main/LICENSE).

In your `module.toml`, add the following configuration:

```toml
[[imports]]
path = "github.com/iconoir-icons/iconoir"
disable = false
ignoreConfig = true
ignoreImports = true

[[imports.mounts]]
source = "icons/regular"
target = "assets/icons/iconoir-regular"

[[imports.mounts]]
source = "icons/outline"
target = "assets/icons/iconoir-solid"
```

Then, in your `params.toml`, add the following configuration:

```toml
[dnb.icons.iconoir-regular]
slug = "inr"

[dnb.icons.iconoir-solid]
slug = "ins"
```

Use the following shortcodes to display an Iconoir overview:

```markdown
{{</* icons/overview set="iconoir-regular" */>}}
{{</* icons/overview set="iconoir-solid" */>}}
```

### Boxicons

[Boxicons](https://github.com/atisawd/boxicons) icons are available under a [MIT License](https://github.com/atisawd/boxicons?tab=MIT-1-ov-file#readme).

In your `module.toml`, add the following configuration:

```toml
[[imports]]
path = "github.com/atisawd/boxicons"
disable = false
ignoreConfig = true
ignoreImports = true

[[imports.mounts]]
source = "svg/logos"
target = "assets/icons/boxicons-logos"

[[imports.mounts]]
source = "svg/regular"
target = "assets/icons/boxicons-regular"

[[imports.mounts]]
source = "svg/solid"
target = "assets/icons/boxicons-solid"
```

Then, in your `params.toml`, add the following configuration:

```toml
[dnb.icons.boxicons-logos]
slug = "bxl"

[dnb.icons.boxicons-regular]
slug = "bxr"

[dnb.icons.boxicons-solid]
slug = "bxs"
```

Use the following shortcodes to display a Boxicons overview:

```markdown
{{</* icons/overview set="boxicons-logos" */>}}
{{</* icons/overview set="boxicons-regular" */>}}
{{</* icons/overview set="boxicons-solid" */>}}
```
