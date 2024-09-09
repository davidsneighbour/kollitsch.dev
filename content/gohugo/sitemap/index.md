---
title: Sitemap
description: Elevate your website's sitemap with a versatile Hugo theme component. Customizable setup options per page. Discover more!
summary: This is a Hugo theme component with layouts to add a configurable sitemap to your website. Hugo itself has internal templates that add sitemaps, but this component extends this by providing setup options per page and keeping up-to-date with current SEO practices.
date: 2024-01-14T18:11:57+07:00
publishDate: 2022-07-19T17:40:35+07:00
lastmod: 2024-09-09T11:07:16.656Z
resources:
  - src: header-card.png
tags:
  - gohugo
  - component
  - seo
keywords:
  - gohugo
  - hugo
  - component
  - module
  - sitemap
  - google
  - searchengine
  - layout
  - template
  - seo
  - optimization
aliases:
  - /components/hugo-sitemap
---

This is a Hugo theme component with layouts to add a configurable sitemap to your website. Hugo itself has internal templates that add sitemaps, but this component extends this by providing setup options per page and keeping up-to-date with current SEO practices.

## Installation

```toml
[[module.imports]]
path = "github.com/davidsneighbour/hugo-modules/modules/sitemap"
```

## Usage

This module works out of the box and there is no need for any configuration. Once you ran `hugo` you can find the file `sitemap.xml` in your `public` directory. This is the file you want to submit to search engines.

If you are using the [Robots component](https://kollitsch.dev/gohugo/robots/), then your resulting `robots.txt` includes [a pointer to the sitemap file](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap?hl=en#addsitemap) as well.

### Exclude a page from sitemap

To exclude a specific page from all sitemaps add it to the `config` variable in the frontmatter of that page:

```yaml
config:
  sitemap: false
```

| sitemap | boolean | true | include this page in the sitemap |

Without any configuration the default is true, meaning to include any page into the sitemap.

### Global sitemap configuration

Add/edit global defaults in `hugo.toml`:

```toml
[params.dnb.sitemap]
enabled = true
```

You can edit the following additional configuration parameters:

- full (boolean, default false) - show `priority` and `changefreq` tags (ignored by Google)
- format (string, default "2006-01-02") - date format for `lastmod` tag

**DEPRECATED**: Frontmatter `robotsdisallow` from earlier `hugo-robots` versions did result in the page being omitted from the sitemap. This is deprecated, but currently still supported. The module will echo a note on CLI about this.

### HTML Sitemap

This module also provides an HTML sitemap, that you can include via shortcode:

```go-html-template
{{</* sitemap */>}}
```

Add the sitemap as shortcode `{{</* sitemap */>}}` anywhere you want.

A sample implementation can be found on [kollitsch.dev](https://kollitsch.dev/sitemap/). The following configuration was used:

```toml
[[params.dnb.sitemap.htmlmap.item]]
type = ".Type"
section = "blog"
label = "Blog Posts"

[[params.dnb.sitemap.htmlmap.item]]
type = ".Type"
section = "components"
label = "GoHugo Components by DNB"
sortvalue = ".Title"
sortdirection = "ASC"

[[params.dnb.sitemap.htmlmap.item]]
type = ".Type"
section = "tags"
selection = "in-pages"
label = "Tags"
sortvalue = ".Title"
sortdirection = "ASC"

[[params.dnb.sitemap.htmlmap.item]]
type = ".Type"
selection = "not-in"
section = ["blog", "tags", "components"]
label = "Other pages"
sortvalue = ".Title"
sortdirection = "ASC"
```

The parameters are as follows:

- `selection` - Type of page selection.
  - `in-regular` (default, just omit the parameter) - selects the pages from the `site.RegularPages` collection.
  - `in-pages` - selects from `site.Pages`
  - `not-in` - selects all pages NOT in `site.Pages`
- `type` - field option for the page selection
- `section` - value option for the page selection
- `label` - Label for the section headline
- `sortvalue` - if you wish to sort the selection set this to the field to sort by
- `sortdirection` (default `ASC`) - direction to sort in, `ASC` or `DESC`

Page selection:

Sample:

```toml
[[dnb.sitemap.htmlmap.item]]
type = ".Type"
section = "tags"
selection = "in-pages"
```

Results in the pages being selected via:

```go-html-template
{{- $pages = (where site.Pages .Type "tags") -}}
```

You can add a sitemap also to any template as a partial:

```go-html-template
{{- $config := site.Params.dnb.sitemap.htmlmap -}}
{{- $sitemapdata := (dict "config" $config) -}}
{{- partialCached "sitemap.html" $sitemapdata $sitemapdata -}}
```

The above is the current shortcode, ehm, code. You can just use the global configuration or build your own configuration `dict`ionary to fill your sitemap. This makes the sitemap also usable to just show a collection of pages anywhere:

```go-html-template
{{ $config := dict "config" (dict "item" (dict
    "type" ".Type"
    "section"  "components"
    "label" "GoHugo Components by DNB"
    "sortvalue" ".Title"
    "sortdirection" "ASC"
)) }}
{{- partialCached "sitemap.html" $config $config -}}
```

This template would show all items in my `content/components` section, sorted by title.
