---
title: Hugo Component / Hugo Icons
description: ""
summary: ""

date: 2022-07-22T19:10:17+07:00
publishDate: 2022-07-22T19:10:17+07:00
lastmod: 2022-07-22T19:13:05+07:00

resources:
  - src: github-card-dark.png

categories:
  - components

tags:
  - gohugo
  - component
  - design

component:
  slug: null
  status: release
  list: true
---

This is a Hugo theme component that adds several icon sets to your Hugo website.

## Available Icon Fonts

- **(bs/bootstrap)**: [Bootstrap Icons](https://icons.getbootstrap.com/)
- **(hr/heroicon)**: [Hero Icons](https://heroicons.com/)

## Usage

This module adds a content page at <http://localhost:1313/dnb/bootstrap-icons/> that shows an overview of all available icons and their code.
This module adds a content page at <http://localhost:1313/dnb/heroicons/> that shows an overview of all available icons and their code.

Call these icons as partials:

```gotemplate
{{ partialCached "bsicon" "arrow-right" "arrow-right" }}
{{ partialCached "heroicon" "arrow-right" "arrow-right" }}
```

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

First enable modules in your own repository:

```bash
hugo mod init github.com/username/reponame
```

Then add this module to your required modules in config.toml.

```toml
[module]

[[module.imports]]
path = "github.com/davidsneighbour/hugo-icons"
```

The next time you run `hugo` it will download the latest version of the module.

## Updating

```shell
# update this module
hugo mod get -u github.com/davidsneighbour/hugo-icons
# update all modules recursively over the whole project
hugo mod get -u ./...
```
<!--- INSTALLUPDATE END --->

## FAQ

<details><summary>Why are there no actual icon fonts included in this module?</summary>
</details>
