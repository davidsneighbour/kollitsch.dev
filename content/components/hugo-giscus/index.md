---
title: Giscus
linkTitle: hugo-giscus
description: ""
summary: ""
date: 2022-08-16T20:28:30+07:00
publishDate: 2022-08-16T20:28:30+07:00
lastmod: 2023-04-14T23:57:12+07:00
resources:
  - src: header-card.png
categories:
  - components
tags:
  - gohugo
  - component
  - content
component:
  slug: hugo-giscus
  status: release
  list: true
  host: github.com
  user: davidsneighbour
---

This is a Hugo theme component to add the [Giscus comment system](https://giscus.app/), powered by GitHub Discussions, to static websites.

{{< b5/notice type="info" heading="Note:">}}Giscus is still under active development. GitHub is also still actively developing Discussions and its API. Thus, some features of Giscus may break or change over time. We will keep an eye out for any updates and implement them here in time.{{< / b5/notice >}}

## Configuration

The module accepts configuration via the `[params]` section in your configuration file.

```toml
[dnb.giscus]
src = "https://giscus.app/client.js"
dataRepo = "username/reponame"
dataRepoId = "ABCDEFGHIJKLMNOPQSTUVXYZABCDEFGH"
dataCategory = "Comments"
dataCategoryId = "ABCDEFGHIJKLMNOPQRST"
dataMapping = "specific"
dataLoading = "lazy"
dataReactionsEnabled = "1"
dataEmitMetadata = "0"
dataInputPosition = "top"  # top, bottom
dataThemeType = "default"
dataTheme = "light"
dataLang = "en"
```

The data-parameter correspond with the parameters of Giscus. The four parameters `dataRepo`, `dataRepoId`, `dataCategory`, and `dataCategoryId` are required. All other parameters are optional and have default values as shown in the sample above.

You can find the proper values for your setup by filling out the form on the [Giscus page](https://giscus.app/).

The default `dataMapping` is set to specific and will use the title of the post as term.

### Advanced setup

With a little bit of more work you can set Giscus up to allow only connections from specific sources and define the comment order.

This can be done with this module's configuration and future updates to these features will be integrated. Or you create the giscus.json in your static directory manually and keep it up to date. The instructions are [here](https://github.com/giscus/giscus/blob/main/ADVANCED-USAGE.md#giscusjson).

To configure the module to create the giscus.json add the custom output format `GISCUS` to your home section:

```toml
[outputs]
home = ["HTML", "GISCUS"]
```

Be careful to not override the existing home output formats.

Once added you will find a `giscus.json` in your website root.

**Comment sort order:**

Available options are `oldest` (sorting from oldest to newest comment) and `newest` (sorting newest to oldest).

```toml
[dnb.giscus.extended]
defaultCommentOrder = "oldest"
```

**Origin setup:**

```toml
[dnb.giscus.extended]
origins = ["https://yourdomainname.ext", "http://localhost:1313"]
originsRegex = ["http://localhost:(1313|8080)"]
```

Add your origins to the params configuration. Leave the options out to not add them to your `giscus.json`.

## Setup your own theme

Using `dataThemeType` set to `local` you can add a relative path as theme. This will be translated to the absolute URL depending on development or production environment. If your theme is finished you can remove `dataThemeType` and just add the full URL to your theme to the `dataTheme` variable.
