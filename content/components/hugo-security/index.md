---
title: Security
linkTitle: hugo-security
description: ''
summary: ''
date: 2022-07-28T20:51:08+07:00
publishDate: 2022-07-28T20:51:08+07:00
lastmod: 2023-05-09T19:16:01+07:00
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
