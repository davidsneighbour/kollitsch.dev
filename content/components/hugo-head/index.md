---
title: Head
linktitle: hugo-head
summary: ""
date: 2023-06-30T17:31:25+07:00
publishDate: 2022-07-27T21:25:17+07:00
lastmod: 2023-06-30T17:31:32+07:00
resources:
  - src: header-card.png
categories:
  - components
tags:
  - gohugo
  - component
  - seo
component:
  slug: hugo-head
  host: github.com
  user: davidsneighbour
  status: release
  list: true
---

This is a GoHugo theme component that solves the old question "What tags belong into the `<head>` tag of my website?" Set it up, configure it, forget it's there. This component adds a multitude of tags and is extensively configurable.

If you want to learn about all that is possible in the `<head>` tag then have a look at [htmlhead.dev](https://htmlhead.dev/) --- or just trust this module to do "all the right things".

{{< component-box >}}

{{< toc >}}

## General setup

```go-html-template
<head>
 {{ partial "head.html" . }}
</head>
```

Set up `hugo-head` by adding it to your `head` tag and remove all other tags from your `head` -- they are included in `hugo-head`. Then configure the module, setup all other features and forget about it.

`hugo-head` uses opiniated defaults that can be overridden via configuration.

```toml
[dnb.head]
charset = "utf-8"
viewport = "width=device-width, initial-scale=1"
nobase = false
```

* `charset`: Sets the global charset for the page. Do not set or change this if you have no reason for it. UTF8 is the proper way to encode your content. If your content (language, encoding) is located in a multibyte region this might change to UTF16 or UTF32.
* `nobase`: Use the websites BaseURL as base tag. This means all relative links will be based on this URL. Depending on your way of writing markup this might be useful to fix local links and references. If you keep this setting out of your configuration then the base-tag will be set to your BaseURL setting. Set it to true and no `base` tag will be used, all references on any page will be based on that pages URL.
* `viewport`: This is a tag that defines how to display the website on various devices and with what setup. If you don't know about this, then keep it out of your config and the best default setting will be used.

## `title` and `description` generation

The title will be generated from the title frontmatter of the content file. If we are on the home page the site title is used. On subsequent list-pages a `(Page n)` is added. On all pages except the homepage a separator and the sites title is added at the end.

```toml
[dnb.head]
separator = " | "
```

The title generation is able to add a "(page n)" to the title on list pages if you save your pagination dictionary in a scratch called `paginator`. The following would be a sample of how to accomplish that:

```go-html-template
{{- $paginator := dict -}}
{{- if eq "home" .Kind -}}
 {{- $paginator = $.Paginate (where site.RegularPages "Type" "in" site.Params.mainSections) -}}
{{- else if .IsNode -}}
 {{- $paginator = $.Paginator -}}
{{- end -}}
{{- .Scratch.Set "paginator" $paginator -}}
```

It is also possible to add an additional `sectiontitle` between page and site title. This is set via `sectiontitle` frontmatter. Either add that value individually per page or via `cascade` in the section's `_index.md`.

The description is generated from the description frontmatter of the content file. If no description is configured then `site.Params.description` is used.

## Speed optimisation

To be written.

## Author generation

`hugo-head` can transform the following configuration parameters into header tags that add author information (Note: this is for compatibility reasons directly under the `author` section in the configuration, NOT the `dnb.head` section):

```toml
[author]
name = "name"
email = "email"
homepage = "website"
```

If you are using [`hugo-humans`](https://github.com/davidsneighbour/hugo-humans) or [`hugo-publisher`](https://github.com/davidsneighbour/hugo-publisher) then `hugo-head` will integrate these header tags in addition to these modules features automatically for you after you configure the module.

## Stylesheets

`hugo-head` adds a simple stylesheet pipeline to your website. It expects an entry point in `assets/scss/style.scss` or any other configured file in `assets`.

```toml
[dnb.head.styles]
entrypoint = "scss/theme.scss"
```

Configuration for GoHugo's SASS/SCSS processing can be piped through via the configuration. The available options for the compilation of SCSS can be found in [GoHugo's documentation](https://gohugo.io/hugo-pipes/transform-to-css/#options).

```toml
[dnb.head.styles]
method = "postcss"

[dnb.head.styles.options]
outputStyle = "compressed"
targetPath = "assets/theme.css"
enableSourceMap = true
includePaths = ["node_modules/"]
```

## Translations

If the current page has a translation then it will be linked in your header. This feature does not require additional configuration.

## SEO

To be written.

## Series

If the current page has a page following or coming before then `hugo-head` will automatically create `.PrevInSection`/`.NextInSection` links for the head. This feature does not require additional configuration.

## Social Graph

If you are using [`hugo-social`](https://github.com/davidsneighbour/hugo-social) then `hugo-head` will integrate these header tags in additon to these modules features automatically for you after you configure the module.

## Open Search

If you are using [`hugo-opensearch`](https://github.com/davidsneighbour/hugo-opensearch) then `hugo-head` will integrate these header tags in additon to these modules features automatically for you after you configure the module.

## PWA

If you are using [`hugo-pwa`](https://github.com/davidsneighbour/hugo-pwa) then `hugo-head` will integrate these header tags in additon to these modules features automatically for you after you configure the module. **Note**, that it does NOT script inclusion in the site footer, so these tags still need to be added in your footer layouts.

## Humans.txt

If you are using [`hugo-humans`](https://github.com/davidsneighbour/hugo-humans) then `hugo-head` will integrate these header tags in additon to these modules features automatically for you after you configure the module.

## Alternates

`hugo-head` prints all configured alternate links for a page. If you find alternates for output types you do not wish to include, then you have configured your output format wrong. Have a look at the documentation of [`notAlternative`](https://gohugo.io/templates/output-formats#configure-output-formats) and [how to enable/disable output formats](https://gohugo.io/templates/output-formats/#customizing-output-formats).

## Verification

`hugo-head` can add verification-meta-tag to your header for any of the following services. Just add the value of the meta-tag (NOT the full `meta`-tag) to your configuration.

```toml
[dnb.head.verification]
google = ""
yandex = ""
bing = ""
alexa = ""
pinterest = ""
norton = ""
```

**Note: You should prefer to verify your ownership via a file in your site root or via DNS record to minimise the output on your pages. The less headers you have the better.**

## Others

`hugo-head` can add various obscure and weird other tags to your headers if you configure them. Think about the usefulness of these tags though, less is more.

```toml
[params.dnb.head.verification]
disable = ["referrer", "phone_transcription"]
notranslate = false
monetization = ""
latitude = ""
longitude = ""
region = ""
placename = ""
```

## Hooks

`hugo-head` implements template hooks via [`hugo-hooks`](https://github.com/davidsneighbour/hugo-hooks) and provides the following hooks:

{{< b5/div class="table--hooks" >}}
| Hook | Description |
| --- | :--- |
| head-init | hooks in after the opening `head` tag. Do not open this to output anything. Just to initialise any of your plugins. |
| head-start | hooks in after the initial first tags that belong at the beginning of your `head` section. |
| head-post-speed-optimisation | |
| head-post-description | |
| head-post-author | |
| head-pre-css | hooks in before the stylesheets are printed. |
| head-post-css | hooks in after the stylesheets are printed. |
| head-post-translations | |
| head-post-seo | |
| head-post-series | |
| head-post-social | |
| head-post-opensearch | |
| head-post-pwa | |
| head-post-humans | |
| head-post-alternates | |
| head-post-verification | |
| head-end | hooks in at the end of the `head` right before the closing tag. |
{{< / b5/div >}}

## Sites and Projects using `hugo-head`

* [Kollitsch.dev](https://kollitsch.dev)
