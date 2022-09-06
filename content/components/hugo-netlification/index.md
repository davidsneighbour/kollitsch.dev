---
title: Netlification
linkTitle: hugo-netlification
description: ""
summary: ""

date: 2022-07-28T20:48:52+07:00
publishDate: 2022-07-28T20:48:52+07:00
lastmod: 2022-08-07T20:10:51+07:00

resources:
  - src: header-card.png

categories:
  - components

tags:
  - gohugo
  - component
  - seo

component:
  slug: hugo-netlification
  host: github.com
  user: davidsneighbour
  status: release
  list: true
---

This is a Hugo theme component with helpers to host your [GoHugo](https://gohugo.io/) generated static website on [Netlify](https://www.netlify.com/). If you don't use Netlify, you DO NOT need this module.

{{< component-box >}}

# Features

**Redirects:** Adds redirects via HTTP headers. This redirection is faster and SEO wise better than Hugo's method of adding `meta-refresh` commands in dedicated files.

**CSP:** Adds Content Security Policies for improved security.

**Headers:** Adds headers with caching and security directives to improves security and speed.

# Installation and setup

**Step 1:** enable modules in your own repository

```bash
hugo mod init github.com/username/reponame
```

**Step 2:** add the module to your required modules in `config.toml`:

```toml
[module]
[[module.imports]]
path = "github.com/davidsneighbour/hugo-netlification"
```

or in your `config/module.toml`:

```toml
[[imports]]
path = "github.com/davidsneighbour/hugo-netlification"
```

The next time you run hugo it will download the latest version of the module.

**Step 3:** Add `REDIR` and `HEADERS` to your home output formats:

```toml
[outputs]
home = [ "REDIR", "HEADERS" ]
```

You should already have an `[outputs]` section, add `"REDIR", "HEADERS"` to it. Add them to the `home` parameter, not to other definitions.

# Configuration

## Redirects

### Per post

Redirection takes aliases that are defined in the pages frontmatter and creates a 301 redirect for them. This is done via HTTP headers as opposed to the redirects via HTML meta tags that Hugo is doing. This is faster and might be better for SEO.

Keep defining them via frontmatter and let _Netlification_ do the rest.

```yaml
aliases:
  - url1
  - url2
  - url3
```

### Additional Redirects

- A redirect for 404 errors to Hugo's 404 page (`/layouts/404.html`) - no action by you required

- A redirect for your default netlify.com URL to your live URL via data configuration in `data/dnb/netlification/config.toml`

  ```toml
  [[redirects]]
  netlify = "https://eloquent-morse-196fd2.netlify.com/"
  ```

  The URL will be redirected to your `baseURL`. Right now this feature requires a trailing slash on both, baseURL and netlify parameter

- Add more redirects as required. Each redirect requires a header `[[redirects]]` followed by at least the parameters `from` and `to`:

  ```toml
  [[redirects]]
  from = "/old-contact-form/"
  to = "/contact/"
  status = 200
  ```

  You can add a status property, if you wish to output any other code than 301 for the redirect. The status property is optional and is explicitly intended for redirect cases.

  The format of these redirect tables is identical to redirects format used in the [Netlify configuration file format](https://docs.netlify.com/routing/redirects/#syntax-for-the-netlify-configuration-file).

### Disable internal alias creation in Hugo

If you are using Netlification you can speed up Hugo's page creation process a little bit by setting the config variable `disableAliases` to `true`. This will disable the default behaviour of creating an HTML file per alias to redirect via meta tags and speed up site generation.

## Headers

Netlification uses considerate caching options. Stylesheets, javascripts, images and other media files are cached for a full year. Netlification expects you to use Hugo pipes to create those files, which will result in unique URLs after you change the content of the files.

### Content Security Policy

Have a look in [data/dnb/netlification/config.toml](https://github.com/davidsneighbour/hugo-netlification/blob/main/data/dnb/netlification/config.toml) or [data/dnb/netlification/sample-config.toml](https://github.com/davidsneighbour/hugo-netlification/blob/main/data/dnb/netlification/sample-config.toml) to learn more.

You can check your content security policy using these following services and audits:

- [https://csp-evaluator.withgoogle.com/?csp=https://kollitsch.dev](https://csp-evaluator.withgoogle.com/?csp=https://kollitsch.dev)

# Sample Configuration

Add your configuration in `data/dnb/netlification/config.toml`. A sample configuration can be found in [data/dnb/netlification/sample-config.toml](https://github.com/davidsneighbour/hugo-netlification/blob/main/data/dnb/netlification/sample-config.toml)

# Updating

To update this module:

```shell
hugo mod get -u github.com/davidsneighbour/hugo-netlification
```

To update all modules:

```shell
hugo mod get -u
```

# Extend netlification headers from other modules

`hugo-netlification` offers an easy way to plug into the `_headers` file. Just add a file at `/data/namespacename/modulename/netlification.toml` and [follow the instructions about header formats at docs.netlify.com](https://docs.netlify.com/routing/headers/). These rules are added after the rules by `hugo-netlification`.

# Notes

- [Netlify's redirects engine](https://docs.netlify.com/routing/redirects/#rule-processing-order) will process the first matching rule it finds, reading from top to bottom. Rules in the `_redirects` file are always processed first, followed by rules in the Netlify configuration file.

# Testing output

- [Netlify Playground for redirects](https://play.netlify.com/redirects)
