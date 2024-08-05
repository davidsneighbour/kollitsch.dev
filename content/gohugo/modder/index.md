---
title: Modder
date: 2022-11-15T15:04:51+07:00
publishDate: 2022-11-15T15:04:51+07:00
lastmod: 2024-02-01T19:41:14+07:00
description: "This Hugo theme component is designed to be used with the Hugo Pipes feature. It offers ways to have modules add their own assets or particles to JavaScript and Stylesheet pipelines."
summary: "This Hugo theme component is designed to be used with the Hugo Pipes feature. It offers ways to have modules add their own assets or particles to JavaScript and Stylesheet pipelines."
resources:
- src: header-card.png
categories:
- components
tags:
- gohugo
- component
- design
- theming
aliases:
- /components/modder
- /components/hugo-modder
- /gohugo/modder
---

This Hugo theme component is designed to be used with the [Hugo Pipes](https://gohugo.io/hugo-pipes/) feature. It offers ways to have modules add their own assets or particles to JavaScript and Stylesheet pipelines.

> [!NOTE]
> It's currently in development and while it's ready for use, its documentation might lack. Open an issue to find out more or to contribute.

## Javascript

### Automatic import via GoHugo Pipes

```js
@import 'modder/main';
```

will import all plugged in Javascripts that are registered via modules. For this to work the `@import` or initialization call needs to be processed within a [GoHugo JS Pipe](https://gohugo.io/hugo-pipes/js/).

### Import via precompiled JS

## Stylesheets and SASS

### Automatic import via GoHugo Pipes

`assets/scss/plugins.scss` imports all plugged in stylesheets that are registered via modules. For this to work the file needs to be processed in the layout file and then imported from your [GoHugo SASS pipe](https://gohugo.io/hugo-pipes/transpile-sass-to-css/)

```scss
{{- $sassTemplate := resources.Get "scss/plugins.scss" -}}
{{- $style := $sassTemplate | resources.ExecuteAsTemplate "plugins.scss" . | css.Sass -}}
```

Afterward you can [concatenate it to your own styles](https://gohugo.io/hugo-pipes/bundling/) with `$style` and complete processing.

### Import via precompiled SASS

For instance for use within WebPack.

Probably like this:

Run `hugo server`, then run

```bash
node public/modder-create-scss.js
```

This should have created a file in `assets/scss/plugins_generated.scss` that can be imported via

```scss
@import 'plugins_generated'
```
