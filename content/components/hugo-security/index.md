---
title: Security
linkTitle: hugo-security
description: ""
summary: ""

date: 2022-07-28T20:51:08+07:00
publishDate: 2022-07-28T20:51:08+07:00
lastmod: 2022-08-03T21:46:27+07:00

resources:
  - src: header-card.png

categories:
  - components

tags:
  - gohugo
  - component
  - seo

component:
  slug: hugo-security
  host: github.com
  user: davidsneighbour
  status: release
  list: true
---

This module adds a security.txt file to your Hugo website with information about your preferred procedures to notify the developer team of your website about security issues on your website. Read more about [security.txt](https://securitytxt.org/), a proposed standard which allows websites to define security policies.

Please note, that `security.txt` is still in the early stages of development and changes might occur. This module will implement all changes and notify you in the hugo.log about (possibly future) missing configuration steps, if they occur.

This module DOES NOT make your website more secure. Just in case you were assuming that 😸

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
path = "github.com/davidsneighbour/github.com/davidsneighbour/hugo-security"
disable = false
ignoreConfig = false
ignoreImports = false

```

The next time you run `hugo` it will download the latest version of the module.

## Updating

```bash
# update this module
hugo mod get -u github.com/davidsneighbour/github.com/davidsneighbour/hugo-security
# update to a specific version
hugo mod get -u github.com/davidsneighbour/github.com/davidsneighbour/hugo-security@v1.0.0
# update all modules recursively over the whole project
hugo mod get -u ./...
```
<!--- INSTALLUPDATE END --->

### Usage

Install this plugin, then add your configuration to `params.dnb.security.txt`. The following configuration parameters are available and correspond to the [values in security.txt](https://securitytxt.org/#genform):

```toml
[dnb.security.txt]
intro = "Information related to reporting security vulnerabilities of this site."
contact = ""
expires = 365
encryption = ""
acknowledgements = ""
languages = "en"
canonical = ""
policy = ""
hiring = ""
```

The values in this sample display the default configuration. The only required parameters are `contact` and `expires` (the latter being set to 365 days = 1 year by default). So the following configuration would be minimal and within the scope of the requirements:

```toml
[dnb.security.txt]
contact = "https://yourwebsite.com/contact/"
```

The module will warn you in the CLI log if this parameter is missing.

### Example Implementations

A few real-world implementation examples of `security.txt`

- <https://www.bbc.com/.well-known/security.txt>
- <https://www.theguardian.com/.well-known/security.txt>
- <https://www.google.com/.well-known/security.txt>

... and a few websites that are using `hugo-security`:

- <https://kollitsch.de/.well-known/security.txt>
