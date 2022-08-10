---
title: Sitemap
linktitle: hugo-sitemap
description: ""
summary: ""

date: 2022-07-19T17:40:35+07:00
publishDate: 2022-07-19T17:40:35+07:00
lastmod: 2022-08-03T21:46:21+07:00

resources:
  - src: github-card-dark.png

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

## Installing

Step 1: enable modules in your own repository:

```bash
hugo mod init github.com/username/reponame
```

Then add this module to your required modules in config.toml.

```toml
[module]
[[module.imports]]
path = "github.com/davidsneighbour/hugo-sitemap"
```

The next time you run `hugo` it will download the latest version of the module.

## Updating

```shell
hugo mod get -u github.com/davidsneighbour/hugo-sitemap
hugo mod get -u # update all modules
```

## Usage

There is no need to configure anything without having any special needs. Add the module to your repository structure and run it. Once you ran `hugo` you will find a file `sitemap.xml` in your `public` directory. This is the file you want to submit to search engines.

If you are using the [Robots component](/components/hugo-robots/), then your resulting `robots.txt` will have a pointer to the sitemap file as well.

## Exclude page from sitemap

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

__DEPRECATED__: Frontmatter `robotsdisallow` from earlier `hugo-robots` versions did result in the page being ommited from the sitemap. This is deprecated, but currently still supported. The module will echo a note on CLI about this.

## HTML Sitemap

If you want to add an HTML sitemap you can do so via shortcode:

```gotemplate
{{</* sitemap */>}}
```

This sitemap requires additional configuration via `config.toml > params` or `config/_defaults/params.toml`, have a look at this following sample:

```toml
[[dnb.sitemap.htmlmap.item]]
type = ".Type"
section = "blog"
label = "Blog Posts"

[[dnb.sitemap.htmlmap.item]]
type = ".Type"
section = "components"
label = "GoHugo Components by DNB"

[[dnb.sitemap.htmlmap.item]]
type = ".Type"
section = "tags"
selection = "in-pages"
label = "Tags"

[[dnb.sitemap.htmlmap.item]]
type = ".Type"
selection = "not-in"
section = ["blog", "tags", "components"]
label = "Other pages"
```

Each item of the `htmlmap` needs the following parameters:

- `type` - for the "where type in something" enquiry
- `selection` - in-regular, in-pages, not-in
- `section` - string or slice that defines the section to load into the page object
- `label` - headline label for the overview of the object, defaults to titled section string
