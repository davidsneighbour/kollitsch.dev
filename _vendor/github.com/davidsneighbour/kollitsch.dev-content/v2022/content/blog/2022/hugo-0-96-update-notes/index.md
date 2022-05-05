---
title: "Hugo 0.96 update notes"
linkTitle: "Hugo 0.96"
description: ""
date: 2022-03-28T17:58:49+07:00
publishDate: 2022-03-28T17:58:49+07:00
lastmod: 2022-03-28T17:58:49+07:00
resources:
  - title: "GoHugo"
    src: "header.png"
tags:
  - gohugo
  - notes
  - golang
  - 100DaysToOffload
---

[Hugo 0.96.0](https://github.com/gohugoio/hugo/releases/tag/v0.96.0) was published last weekend with two new features and many smaller changes and fixes under the hood. Here is a quick overview of the release.

### New features

#### Vertical merging of content mounts

Under this title hides a useful feature for Hugo Modules that mount `content` directories. This new feature lets you mount multiple module directories into each other to fill in missing translations of the first mount.

```toml {lineAnchors=code1}
[[module.mounts]]
source = 'content/de'
target = 'content'
lang = 'de'

[[module.mounts]]
source = 'content/en'
target = 'content'
lang = 'de'
```

The interesting thing to note here is, that the merging is not happening from the left to the right, but the other way around. People coming from other programming languages might expect, that everything in the second module mount is overriding things in the first one, if there is already content under the same name available. In fact it is the other way around in Hugo (or Go as such). Following module mounts will fill missing parts of the first mount, or, in the widest sense, everything in tha last module will be overridden by the contents of each successive previous module. The first mount wins.

#### HTTP error objects for Get* functions

Previously errors in the `.GetRemote` function only returned the status of the request. This was not very helpful for fully featured APIs that would in error cases return more data. This has now been rectified and errors return an additional `.Data` object with the common HTTP response values. This lets the developer have more control over the error handling. Errors due to rate limiting for instance will be easily detectable now.

```go-html-template {lineAnchors=code2}
{{ with $result := resources.GetRemote $url }}
  {{ with .Err }}
  <ul>
    <li>Error: {{ .Error }}
      <ul>
      {{ range .Data }}
        <li>StatusCode: {{ .StatusCode }}</li>
        <li>Status: {{ .Status }}</li>
        <li>Body: {{ .Body }}</li>
        <li>TransferEncoding: {{ .TransferEncoding }}</li>
        <li>ContentLength: {{ .ContentLength }}</li>
        <li>ContentType: {{ .ContentType }}</li>
      {{ end }}
      </ul>
    </li>
  </ul>
  {{ else }}
    {{ with .Content | unmarshal }}
      {{ . }}
    {{ end }}
  {{ end }}
{{ end }}
```

#### Adding content type to `hmac` function

The [hmac](https://gohugo.io/functions/hmac/#readout) function creates a cryptographic hash from input by using a key.

With this release you can set an optional argument to define, what the function returns, either `hex` (default) or `binary` format.

```go-html-template {lineAnchors=code3}
{{ hmac "sha256" $key $message "hex" }}
{{ hmac "sha256" $key $message "binary" }}
```

#### Better validation of image processing options

In older releases it was possible to pass invalid sizing options to `resize`, `crop`, `fill` and `fit` in the [image processing options](https://gohugo.io/content-management/image-processing/). From this release on an error will be returned on the CLI. `resize` requires either a width or a height and `crop`, `fill` and `fit` require both, width and height.

#### @debug and @warn in SCSS

Logging commands in Hugo's dartsass implementation were ignored until now. This has been fixed and `@warn` and `@deprecated` in your SCSS will result in warning in the CLI as well as `@debug` in info levels in the log. To see `@debug` messages you will have to run `hugo` with the `--verbose` flag.

### Deprecations

* `.File.Extension` on the page object was deprecated. This was [never documented](https://gohugo.io/variables/files/). Use `File.Ext` instead.

### Under the hood

Bep continued to add features new in Go 1.18 to this release. All else are smaller fixes and improvements. You can find all changes on [Github](https://github.com/gohugoio/hugo/compare/v0.95.0...v0.96.0).
