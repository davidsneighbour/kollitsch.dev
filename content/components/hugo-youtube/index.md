---
title: Youtube
linkTitle: hugo-youtube
description: ""
summary: ""

date: 2022-08-03T21:21:58+07:00
publishDate: 2022-08-03T21:21:58+07:00
lastmod: 2022-08-03T21:26:36+07:00

resources:
  - src: github-card-dark.png

categories:
  - components

tags:
  - gohugo
  - component
  - shortcode
  - media

component:
  slug: hugo-youtube
---

# GoHugo Component / Youtube

A responsive and very fast shortcode to add youtube videos to your Hugo website.

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

First enable modules in your own repository if you did not already have done so:

```bash
hugo mod init github.com/username/reponame
```

Then add this module to your required modules in `config.toml`.

```toml
[module]

[[module.imports]]
path = "github.com/davidsneighbour/hugo-youtube"
disable = false
ignoreConfig = false
ignoreImports = false

```

The next time you run `hugo` it will download the latest version of the module.

## Updating

```bash
# update this module
hugo mod get -u github.com/davidsneighbour/hugo-youtube
# update to a specific version
hugo mod get -u github.com/davidsneighbour/hugo-youtube@v1.0.0
# update all modules recursively over the whole project
hugo mod get -u ./...
```
<!--- INSTALLUPDATE END --->

## Overriding shortcodes

To override shortcodes just add a file in your own shortcode directory with the name of the shortcode that you want to replace.

[Read more about theme components](https://gohugo.io/themes/theme-components/).

## Usage

This shortcode replaces the internal `youtube` shortcode and adds an unobtrusive, privacy conscious and unbloated custom element for YouTube videos. It uses [lite-youtube-embed](https://github.com/paulirish/lite-youtube-embed).

```go
{{</* youtube id="_BM3zCMRPcw" */>}}
{{</* youtube "_BM3zCMRPcw" */>}}
{{</* youtube id="_BM3zCMRPcw" title="Lower your eyelids to die with the sun - M83" */>}}
```

Run `hugo server` in this module and a list of sample usages will be presented at [http://localhost:1313](http://localhost:1313)

### Parameters

| parameter | default | notes |
| --- | --- | --- |
| *class* | w-100 | classnames to add to the video container |
| *id* |  | ID of the YouTube video to embed |
| *params* |  | [custom parameters](https://developers.google.com/youtube/player_parameters#Parameters) to be added to influence the display and functionality of the player. These parameters should be URLized. |
| *title* |  | title of the video, will be displayed as banner on top of the preview image |

### Resources

If you are not using the dnb-org asset dropin configuration you need to add JavaScript and SCSS files to your Hugo pipes:

- `libs/liteyoutube/lite-yt-embed.js`
- `libs/liteyoutube/lite-yt-embed.scss`

Both resources are mounted into the assets folder, so they can be easily integrated into your pipelines.

If you are not using any Hugo pipelines (shame on you) then add the Javascript at the end of the page before the `</body>` tag and CSS in the header before the `</head>` tag. These files are available via mount into the `static` folder.

```html
<link href="/libs/liteyoutube/lite-yt-embed.css" rel="stylesheet">
<script src="/libs/liteyoutube/lite-yt-embed.js"></script>
```

## Content Security Policy (CSP) rules for this plugin

Using a CSP on your website you will need to whitelist YouTube frame-src for the video and img-src for the preview thumbnail, if you have no local preview thumbnail available. The following rules are required in addition to your normal setup to allow videos to load:

```ini
frame-src = ["https://www.youtube-nocookie.com"]
img-src = ["https://i.ytimg.com", "https://ytimg.googleusercontent.com"]
```
