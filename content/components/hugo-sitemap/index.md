---
title: GoHugo Components / Sitemap
linktitle: hugo-sitemap
description: ""
summary: ""

date: 2022-07-19T17:40:35+07:00
publishDate: 2022-07-19T17:40:35+07:00
lastmod: 2022-08-02T21:10:02+07:00

resources:
  - src: github-card-dark.png

categories:
  - components

tags:
  - gohugo
  - component
  - seo

github:
  slug: davidsneighbour/hugo-sitemap
---

This is a Hugo theme component with layouts to add a configurable sitemap to your website. Hugo itself has internal templates that add sitemaps, but this component has additional setup options per page.

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
