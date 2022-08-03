---
title: Robots
linktitle: hugo-robots
description: ""
summary: ""

date: 2022-07-19T17:40:35+07:00
publishDate: 2022-07-19T17:40:35+07:00
lastmod: 2022-08-03T19:17:10+07:00

resources:
  - src: github-card-dark.png

categories:
  - components

tags:
  - gohugo
  - component
  - seo

component:
  slug: hugo-robots
---

This component for [GoHugo](https://gohugo.io/) adds a customizable robots.txt to your website.

See this component in action at [kollitsch.de/robots.txt](https://kollitsch.de/robots.txt)

{{< component-box >}}

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
path = "github.com/davidsneighbour/hugo-robots"

```

The next time you run `hugo` it will download the latest version of the module.

## Updating

```shell
# update this module
hugo mod get -u github.com/davidsneighbour/hugo-robots
# update all modules
hugo mod get -u ./...
```
<!--- INSTALLUPDATE END --->

## Usage

This component can be used as drop-in without much configuration. However, robots.txt generation needs to be enabled in your configuration, eg. config.toml:

```toml
enableRobotsTXT = true
```

You can add configuration parameters per page in your frontmatter:

```yaml
robotsdisallow: true
```

This will add a `Disallow` line for the current URL. Note, that with clean URLs this will disallow bot-access for all sub-folders and sub-urls of the current item.

## Adding global (Dis/allows)

You can add global additions to your robots.txt via `config.toml` configuration:

```toml
[[params.dnb.robot.useragents]]
name = "Googlebot"
disallow = ["/nogooglebot/", "/anotherdirectory/"]

[[params.dnb.robot.useragents]]
name = "Googlebot2"
allow = ["/nogooglebot/", "/anotherdirectory/"]
```

## Are you into ASCII-art?

If you like to do your robots.txt proud --- you know what I mean --- then you can use the following data configuration parameters in `config.toml` to add some flourish to your robots.txt:

```toml
[params.dnb.robots]
initialComment = '''
# comment at the beginning of robots.txt
'''
concludingComment = '''
# comment at the end of robots.txt
'''
```

## remove dnb-org notices

The plugin adds some notes about dnb-org to your robots.txt. All for the awareness, you know? It's a free plugin. If you wish to remove these mentions feel free to set the branding option in your `config.toml` to true:

```toml
[params.dnb.robots]
disableBranding = true
```
