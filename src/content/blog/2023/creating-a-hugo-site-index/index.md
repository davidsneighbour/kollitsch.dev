---
$schema: /static/_schemata/blog.schema.yaml
title: Creating a Hugo site index
description: >-
  How to export all the content of your Hugo website to a JSON file, to populate
  a search index.
date: '2023-05-23'
resources:
  - title: >-
      Photo by [Maksym Kaharlytskyi](https://unsplash.com/@qwitka) via
      [Unsplash](https://unsplash.com/)
    src: header.jpg
tags:
  - search
  - gohugo
  - 100DaysToOffload
type: blog
fmContentType: blog
---

I recently cut out a feature from this website that exported all the content to a JSON file, which I then used to populate my Algolia search index. However, I removed this functionality because I found a more efficient search engine for my small blog.

Because it could be helpful for other use cases that need a complete copy of their content, I decided to share the process I followed in this blog post.

**Step 1: Creating a custom output format**

The first step is to create a custom output format in Hugo. This is done by adding the following to your config.toml file:

```toml
[outputformats.DNBINDEX]
baseName = "dnbindex"
isPlainText = true
mediaType = "application/json"
notAlternative = true

[outputs]
home = ["DNBINDEX", "HTML", "RSS", "JSON"]

```

The `[outputs]` configuration part probably already exists in your config.toml file or configuration structure. Still, you need to add the `DNBINDEX` output format to the list of outputs. You need to add this to the `home` output.

**Step 2: Create a template for the output format**

Let's create a layout template for our new output format at `layouts/_default/list.dnbindex.json`:

```go-html-template
{{- $.Scratch.Add "index" slice -}}
{{- $section := $.Site.GetPage "section" .Section -}}
{{- range .Site.RegularPages -}}
  {{- if or (and (.IsDescendant $section) (and (not .Draft) (not .Params.private))) $section.IsHome -}}
    {{- $.Scratch.Add "index" (dict
      "objectID" (sha1 .Permalink)
      "date" (time.Format "Monday, Jan 2, 2006" .Date)
      "description" .Description
      "expirydate" .ExpiryDate.UTC.Unix
      "fuzzywordcount" .FuzzyWordCount
      "keywords" .Keywords
      "kind" .Kind
      "lang" .Lang
      "lastmod" .Lastmod.UTC.Unix
      "permalink" .Permalink
      "publishdate" .PublishDate
      "relpermalink" .RelPermalink
      "html" .Params.Description
      "title" .Title
      "type" .Type
      "url" .Permalink
      "section" .Section
      "tags" .Params.Tags
      "categories" .Params.Categories
      "author" .Params.authors
      "content" .Params.Description
      )
    -}}
  {{- end -}}
{{- end -}}
{{- $.Scratch.Get "index" | jsonify -}}
```

Looking at this layout, you can see how old it is ;) Nobody in their right mind would use a scratch these days to create a list of pages. But it works, so I won't spend time finding out how to do it better. As I wrote above, I do not need an individually created search index. You can add as much or less information as you like in the loop that makes the `dict` for your pages. Reading length and word count might be nice in your search results.

**Step 3: Use the index**

After setting the index file up as described in steps 1 and 2, you can now run `hugo` to generate the index. You can find it in `public/list.dnbindex.json`. In my build routine, I let `hugo` create this file, then uploaded it to Algolia and removed it from the output before uploading my website to the production site.
