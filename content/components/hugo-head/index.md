---
title: GoHugo Components / Head
linktitle: hugo-head
summary: ""

date: 2022-07-27T21:25:17+07:00
publishDate: 2022-07-27T21:25:17+07:00
lastmod: 2022-07-28T21:05:32+07:00

resources:
  - src: github-card-dark.png

categories:
  - components

tags:
  - gohugo
  - component
  - seo

component:
  slug: null
  status: release
  list: true

comments: false
---


This is a GoHugo theme component that solves the old question "What tags belong into the `<head>` tag of my website?" Set it up, configure it, forget it's there. This component adds a multitude of tags and is extensively configurable.

If you want to independently of this module learn about all that is possible in the `<head>` tag then have a look at [htmlhead.dev](https://htmlhead.dev/)

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
path = "github.com/davidsneighbour/hugo-head"
disable = false
ignoreConfig = false
ignoreImports = false

```

The next time you run `hugo` it will download the latest version of the module.

## Updating

```bash
# update this module
hugo mod get -u github.com/davidsneighbour/hugo-head
# update to a specific version
hugo mod get -u github.com/davidsneighbour/hugo-head@v1.0.0
# update all modules recursively over the whole project
hugo mod get -u ./...
```
<!--- INSTALLUPDATE END --->

## Configuration parameters

### General setup

`hugo-head` uses opiniated defaults that can be overridden via configuration:

```toml
[dnb.head]
charset = "utf-8"
viewport = "width=device-width, initial-scale=1"
```

It also uses the `baseURL`-parameter of the global configuration object for the `base`-tag.

### `title` generation

The title will be generated from the title frontmatter of the content file. If we are on the home page the site title is used. On subsequent listpages a `(Page n)` is added. On all pages except the homepage a separator and the sites title is added at the end.

```toml
[dnb.head]
separator = " | "
```

The title generation is able to add a "(page n)" to the title on list pages if you save your pagination dictionary in a scratch called `paginator`. The following would be a sample of how to accomplish that:

```golang
{{- $paginator := dict -}}
{{- if eq "home" .Kind -}}
  {{- $paginator = $.Paginate (where site.RegularPages "Type" "in" site.Params.mainSections) -}}
{{- else if .IsNode -}}
  {{- $paginator = $.Paginator -}}
{{- end -}}
{{- .Scratch.Set "paginator" $paginator -}}
```

### Speed optimisation

To be written.

### `description` generation

The description is generated from the description frontmatter of the content file. If no description is configured then `site.Params.description` is used.

### Author generation

The author tags generation is quite small still, but expect larger changes in the future. Right now `hugo-head` can transform the following configuration parameters into header tags that add author information:

```toml
[author]
name = "name"
email = "email"
homepage = "website"
```

If you are using [`hugo-humans`](https://github.com/davidsneighbour/hugo-humans) then it will integrate the [required header tags](https://github.com/davidsneighbour/hugo-humans) automatically for you. Don't forget to individually [configure the module](https://github.com/davidsneighbour/hugo-humans#configuration) in your configuration.
If you are using [`hugo-publisher`](https://github.com/davidsneighbour/hugo-publisher) then it will integrate the [required header tags](https://github.com/davidsneighbour/hugo-publisher) automatically for you. Don't forget to individually [configure the module](https://github.com/davidsneighbour/hugo-publisher#configuration) in your configuration.

### Stylesheets

`hugo-head` adds a simple stylesheet pipeline to your website. It expects a SCSS entry point in `assets/scss/style.scss` or any other configured entry point.

```toml
[dnb.head.styles]
entrypoint = "scss/theme.scss"
```

### Translations

If the current page has a translation then it will be linked in your header. I don't see anything that requires configuration here, so please open a new issue if you need specific setups.

### SEO

To be written.

### Series

If the current page has a page following or coming before then `hugo-head` will automatically create links to those pages in the header. It uses the `.PrevInSection`/`.NextInSection` links for this.

### Social Graph

If you are using [`hugo-social`](https://github.com/davidsneighbour/hugo-social) then it will integrate the [required header tags](https://github.com/davidsneighbour/hugo-social) automatically for you.

### Open Search

If you are using [`hugo-opensearch`](https://github.com/davidsneighbour/hugo-opensearch) then it will integrate the [required header tags](https://github.com/davidsneighbour/hugo-pwa#setup-layouts) automatically for you. Don't forget to individually [configure the module](https://github.com/davidsneighbour/hugo-opensearch#configuration) in your configuration.

### PWA

If you are using [`hugo-pwa`](https://github.com/davidsneighbour/hugo-pwa) then it will integrate the [required header tags](https://github.com/davidsneighbour/hugo-pwa#setup-layouts) automatically for you. **Note**, that it does NOT include anything in the footer, so these tags still need to be added in your own templates.

### Verification

`hugo-head` can add verification-meta-tag to your header for any of the following services. Just add the value of the meta-tag to your configuration.

```toml
[dnb.head.verification]
google = ""
yandex = ""
bing = ""
alexa = ""
pinterest = ""
norton = ""
```

**Note: You should prefer to verify your ownership via a file in your site root or via DNS record to minimise the output on your pages. The less headers you have the better.**

### Alternates

`hugo-head` prints all configured alternate links for a page. If you find alternates for output types you do not wish to include, then you have configured your output format wrong. Have a look at the documentation of [`notAlternative`](https://gohugo.io/templates/output-formats#configure-output-formats) and [how to enable/disable output formats](https://gohugo.io/templates/output-formats/#customizing-output-formats).

### Others

`hugo-head` can add various obscure and weird other tags to your headers. You can enable and disable them by setting the following parameters. Think about the usefulnes of these tags though, less is more again.

```toml
[params.dnb.head.verification]
disable = ["referrer", "phone_transcription"]
notranslate = false
monetization = ""
latitude = ""
longitude = ""
region = ""
placename = ""
```

## Hooks

`hugo-head` implements template hooks via [`hugo-hooks`](https://github.com/davidsneighbour/hugo-hooks) and makes the following hooks available:

<!-- prettier-ignore -->
| Hook | Description |
| --- | :--- |
| head-init | Hooks in after the opening `head` tag. Do not open this to output anything. Just to initialise any of your plugins. |
| head-start | Hooks in after the initial first tags that belong at the beginning of your `head` section. |
| head-pre-css | Hooks in before the stylesheets are printed. |
| head-post-css | Hooks in after the stylesheets are printed. |
| head-end | Hooks in at the end of the `head` right before the closing tag. |

## Sites and Projects using `hugo-head`

- [Kollitsch.de](https://kollitsch.de)
