---
title: Sitemap
linktitle: hugo-sitemap
description: Elevate your website's sitemap with a versatile Hugo theme component. Customizable setup options per page. Discover more!
date: 2023-06-29T21:44:47+07:00
publishDate: 2022-07-19T17:40:35+07:00
lastmod: 2023-06-29T21:44:53+07:00
resources:
  - src: header-card.png
categories:
  - components
tags:
  - gohugo
  - component
  - seo
component:
  slug: hugo-sitemap
  host: github.com
  user: davidsneighbour
  status: release
  list: true
---

This is a Hugo theme component with layouts to add a configurable sitemap to your website. Hugo itself has internal templates that add sitemaps, but this component has additional setup options per page.

{{< component-box >}}

## Usage

There is no need to configure anything without having any special needs. Add the module to your repository structure and run it. Once you ran `hugo` you will find a file `sitemap.xml` in your `public` directory. This is the file you want to submit to search engines.

If you are using the [Robots component](/components/hugo-robots/), then your resulting `robots.txt` will have a pointer to the sitemap file as well.

## Exclude a page from sitemap

Add frontmatter to individual pages with the following setup:

```yaml
config:
  sitemap: true
```

_sitemap_ (boolean): include this page in the sitemap

Add/edit global defaults in `config.toml > params` or `config/_defaults/params.toml`:

```toml
[dnb.sitemap]
enabled = true
```

Without any configuration the default is true, meaning to include any page into the sitemap.

You can edit the following additional configuration parameters:

- full (boolean, default false) - show `priority` and `changefreq` tags (ignored by Google)
- format (string, default "2006-01-02") - date format for `lastmod` tag

__DEPRECATED__: Frontmatter `robotsdisallow` from earlier `hugo-robots` versions did result in the page being omitted from the sitemap. This is deprecated, but currently still supported. The module will echo a note on CLI about this.

## HTML Sitemap

If you want to add an HTML sitemap you can do so via shortcode:

```go-html-template
{{</* sitemap */>}}
```

Add the sitemap as shortcode `{{</* sitemap */>}}` anywhere you want.

A sample implementation can be found on [kollitsch.dev](https://kollitsch.dev/sitemap/). The following configuration was used:

```toml
[[dnb.sitemap.htmlmap.item]]
type = ".Type"
section = "blog"
label = "Blog Posts"

[[dnb.sitemap.htmlmap.item]]
type = ".Type"
section = "components"
label = "GoHugo Components by DNB"
sortvalue = ".Title"
sortdirection = "ASC"

[[dnb.sitemap.htmlmap.item]]
type = ".Type"
section = "tags"
selection = "in-pages"
label = "Tags"
sortvalue = ".Title"
sortdirection = "ASC"

[[dnb.sitemap.htmlmap.item]]
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
