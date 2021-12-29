---
title: CSP vs. syntax highlighting in GoHugo
date: '2021-10-27T21:52:14+07:00'
description:
  If you are using the codestyling functionality of Hugo then you might
  have stumbled over a common issue in connection with Content Security Policies (CSP)
  and inline styles.
lastmod: '2021-10-27T21:52:14+07:00'
publishDate: '2021-10-27T21:52:14+07:00'
resources:
  - name: image name if other than src
    src: christopher-gower-m_HRfLhgABo-unsplash.jpg
    title: Photo by [Christopher Gower](https://unsplash.com/@cgower) via [Unsplash](https://unsplash.com)
tags:
  - gohugo
  - syntaxhighlighting
  - SRI
  - CSP
---

If you are using the code styling functionality of GoHugo then you might have stumbled over a common issue when you are using Content Security Policies (CSP) and inline styles. Using CSPs is the proper way these days to secure your site code but it is considered (in the realm of CSPs) bad style to have your style sheets or JavaScript inlined into your page.

Proper CSP rules will not allow `unsafe-inline` in your CSP rules (because there is a reason, why it starts with `unsafe`). You could set this parameter to get rid of the error messages in your console, or you could ignore those errors. Or, configure your site setup to stop using inline styles for the `highlight` function, Markdown rendering and shortcodes.

First step: [Configure GoHugo to use classes for syntax highlighting](https://gohugo.io/getting-started/configuration-markup#highlight) in your configuration:

```toml
[markup]

[markup.highlight]
noClasses = false
style = "monokai"

```

Then on the command prompt create the style sheet for the highlight shortcode or Markdown code fences:

```shell
hugo gen chromastyles --style=monokai > path/to/_syntaxhighlighting.scss
```

Add this file in your theme or style sheet pipeline and the code will be highlighted as before, but uses style sheet classes instead of inline styles.

Now everyone is happy. You and your CSP.

To see a list of available syntax highlight themes to use instead of "monokai" in the sample above go to the [Chrome Style Gallery](https://xyproto.github.io/splash/docs/longer/all.html).
