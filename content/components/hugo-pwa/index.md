---
title: PWA
linkTitle: hugo-pwa
description: ""
summary: ""

date: 2022-07-28T20:50:54+07:00
publishDate: 2022-07-28T20:50:54+07:00
lastmod: 2022-08-03T21:46:37+07:00

resources:
  - src: github-card-dark.png

categories:
  - components

tags:
  - gohugo
  - component
  - seo

component:
  slug: hugo-pwa
  host: github.com
  user: davidsneighbour
  status: release
  list: true
---

This is a Hugo theme component with helpers to convert your static [GoHugo](https://gohugo.io/) website into a [PWA](https://web.dev/progressive-web-apps/).

This is work in progress and while many parts are already working, some changes to the setup will occur. Please watch the releases of this repository to be alerted about changes.

{{< component-box >}}

## Features

- :heavy_check_mark: Favicon for apps and sites
- :heavy_check_mark: simple PWA setup
- :x: Happy Google lighthouse testing
- :x: Improvements for easier "drop in" to other websites/modules
- :x: Add layout system for offline page creation
- :x: Add configuration system
- :x: improve configuration of implemented functionality in the service worker
- :x: add detailed documentation for all configuration options

<!--- THINGSTOKNOW BEGIN --->

## Some things you need to know

These are notes about conventions in this README.md. You might want to make yourself acquainted with them if this is your first visit.

<details>

<summary>:heavy_exclamation_mark: A note about proper configuration formatting. Click to expand!</summary>

The following documentation will refer to all configuration parameters in TOML format and with the assumption of a configuration file for your project at `/config.toml`. There are various formats of configurations (TOML/YAML/JSON) and multiple locations your configuration can reside (config file or config directory). Note that in the case of a config directory the section headers of all samples need to have the respective section title removed. So `[params.dnb.something]` will become `[dnb.something]` if the configuration is done in the file `/config/$CONFIGNAME/params.toml`.

</details>
<!--- THINGSTOKNOW END --->

<!--- INSTALLUPDATE BEGIN --->

## Installing

First enable modules in your own repository if you did not already have done so:

```bash
hugo mod init github.com/username/reponame
```

Then add this module to your required modules in `config.toml`.

```toml
[module]

[[module.imports]]
path = "github.com/davidsneighbour/github.com/davidsneighbour/hugo-pwa"
disable = false
ignoreConfig = false
ignoreImports = false

```

The next time you run `hugo` it will download the latest version of the module.

## Updating

```bash
# update this module
hugo mod get -u github.com/davidsneighbour/github.com/davidsneighbour/hugo-pwa
# update to a specific version
hugo mod get -u github.com/davidsneighbour/github.com/davidsneighbour/hugo-pwa@v1.0.0
# update all modules recursively over the whole project
hugo mod get -u ./...
```
<!--- INSTALLUPDATE END --->

## Configuration

To make this component work you need to add the manifest to your _home_ output formats in `config.toml`:

```toml
[outputs]
home = [ ... others ... , "manifest" ]
```

or in `config/_default/outputs.toml`:

```toml
home = [ ... others ... , "manifest"]
```

You already should have an `[output]` section, add `"manifest"` to it. Do not add it anywhere other than in the `home` directive.

### Setup layouts

In your themes header (before `</head>`):

```gotemplate
{{ partialCached "head/pwa.html" . }}
```

This will add a link to the automatically created webmanifest with options to install the PWA. Check [Detailed configuration](#detailed-configuration) for information how to configure the contents of this file.

In your footer layout (before `</body>`):

```gotemplate
{{ partialCached "footer/service-worker.html" . }}
```

This will set up the service worker script in the footer of your website.

Notes:

- both layouts can be cached and contain no page-individual information
- check out the [todo section of the readme](#todo) for missing parts or open an issue.

### Detailed configuration

... to be written ...

## Updating

Hugo itself will check on a regular base for updates. To force an update of this module run one of the following commands on your CLI.

```shell
hugo mod get -u github.com/davidsneighbour/hugo-pwa # or
hugo mod get -u # update all modules
```
