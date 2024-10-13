---
title: Icons
description: ""
summary: ""
date: 2022-07-22T19:10:17+07:00
publishDate: 2022-07-22T19:10:17+07:00
lastmod: 2024-10-13T04:41:06.659Z
resources:
  - src: header-card.png
tags:
  - gohugo
  - component
  - design
aliases:
  - /components/hugo-icons/
---

This GoHugo module streamlines the addition of SVG-based icon sets to your Hugo website, utilizing the efficient method of defining icons once using `<symbol>` and reusing them with `<use>`. By default, the module includes icon sets as an example, but is designed to support any SVG icon set you wish to integrate.

## Key features

- **Flexible Icon Integration**: Add any SVG-based icon set to your website.
- **Efficient Caching Mechanism**: Icons are defined once and reused, improving performance.
- **Bootstrap Icons Included**: The Bootstrap Icons set is provided by default for immediate use and as an example for integrating other icon sets.

## Documentation links

- SVG `<symbol>` Element: [MDN Documentation](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/symbol)
- SVG `<use>` Element: [MDN Documentation](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/use)

## Included icon sets

- [**Bootstrap Icons**](https://icons.getbootstrap.com/)
- [**Tabler Icons**](https://github.com/tabler/tabler-icons)

## Usage

### Adding icons

To use an icon in your layout, call it as a partial in your templates. The example below demonstrates how to include a Bootstrap icon, but the same method applies to any SVG icon you add to the module:

```go-html-template
{{- includes.Partial "icon.html" "arrow-right" -}}
{{- includes.Partial "icon.html" (dict "icon" "arrow-right") -}}
```

Another option is to include the icon as a shortcode from your content files:

```markdown
{{</* icon "arrow-right" */>}}
```

### Development mode

When running your Hugo site in development mode, the module provides sample pages listing all available icons from the included sets:

- Access Bootstrap Icons at `http://localhost:1313/icons/bootstrap-icons/`.

### Adding custom icon sets

This module is designed to support any SVG-based icon set. To add a new set:

1. Place your SVG icons in the appropriate directory within your Hugo site.
2. Add a configuration to the `config.toml` file, specifying the path to your icons and the icon set name:

   ```toml
   [dnb.icons]
   default = "custom"

   [dnb.icons.custom]
   path = "node_modules/custom-icon-set/icons/%s.svg"
   slug = "custom"
   ```

   Make sure to replace `custom` with the name of your icon set and `node_modules/custom-icon-set/icons/%s.svg` with the path to your icons. The `%s` placeholder is being replaced with the icon name when the icon is called.

   The `slug` parameter is used to reference the icon set in your layouts and shortcodes and add classes to format them. The classes created in the preceding sample would be `icon--custom` and `icon--iconname` where `iconname` is the icon loaded.

3. Reference your custom icons using the partials methods preceding.

## Notes 

- **Do not cache** the icon-partial calls in your layouts; the module handles this for you.
