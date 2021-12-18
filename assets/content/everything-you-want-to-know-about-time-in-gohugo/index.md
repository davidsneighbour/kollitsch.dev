---
title: "Everything you want to know about time in GoHugo"

# dates
date: 2021-10-30T17:27:47+07:00
publishDate: 2021-10-30T17:27:47+07:00
lastmod: 2021-10-30T16:22:18+07:00

# add multiple resources to create a slider gallery
resources:
  - title: "Photo by [Murray Campbell](https://unsplash.com/@murrayc) via [Unsplash](https://unsplash.com/s/photos/time)"
    src: "murray-campbell-B_TdfGFuGwA-unsplash.jpg"

# taxonomification
categories: ["category1"]
tags: ["tag1", "tag2"]
keywords: ["keyword1", "keyword2"]
---

{{< config path="config" >}}
test: "value"
{{< /config >}}





- https://pkg.go.dev/time#pkg-variables
- https://gohugo.io/functions/dateformat/#readout
- https://gohugo.io/functions/time/#readout


{{ $foo := dict "bar" "baz" }}
{{ printf "%T" $foo }}          --> map[string]interface {}
{{ $foo }}                      --> map[bar:baz]

The last line produces a string representation of the data structure; it's not useful. Instead, I probably want to do something like:

{{ printf "The bar is %s." $foo.bar }} --> The bar is baz.

The same is true with dates:

{{ printf "%T" .Date }}         --> time.Time
{{ printf "%T" .ExpiryDate }}   --> time.Time
{{ printf "%T" .Lastmod }}      --> time.Time
{{ printf "%T" .PublishDate }}  --> time.Time


    https://pkg.go.dev/time#Time
    https://cs.opensource.google/go/go/+/refs/tags/go1.17.2:src/time/time.go;l=127-148
{{ .PublishDate | time.Format "2006-01-02T15:04:05-07:00" }}
