---
title: Centring Content in Markdown
date: 2022-08-18T00:02:45+07:00
lastmod: 2023-01-18T22:12:14+07:00

description: ""
summary: ""
draft: true

resources:
  - title: Photo by [Luis Villasmil](https://unsplash.com/@villxsmil) via
      [Unsplash](https://unsplash.com/)
    src: header.jpg
  - src: nicely-centred-badges.png

categories:
  - category1

tags:
  - tag1
  - tag2
  - tag3

keywords:
  - keyword1
  - keyword2
  - keyword3

unsplash:
  imageid: jPpHpgWNCKs
---

Every now and then I come upon use-cases where Markdown seems to have a huge blind spot. And yeah, sure, you will agree with me, that Markdown is great and unfallable and super awesome convenient.

Right?

Well, then, how do you centr content in Markdown?

I'll take my answer off the air... ;)

The CommonMark specification has a nice fallback, called [HTML Blocks](https://spec.commonmark.org/0.30/#html-blocks) for anything the markdown syntax can't add, which is basically HTML tags in Markdown.

While that might be a good solution for many applications using Markdown this is not the case with GoHugo, because it declares these tags as HTML (due to sanitisation in the name of safety) and either filters them out[^1] or has the user set an insecure configuration like the following:

```toml
[markup.goldmark.renderer]
# and everyone sleeps well tonight.
unsafe= true
```

Long story short: Markdown is not a design language, it's a content mark-up language. In end we will have to use more or less usable "hacks" to make our content centr.

Much of my ranting is in regards to GoHugo, mostly because other SSGs might interpret CommonMark HTML Blocks better or just don't filter HTML tags out when Markdown is parsed.

Following are some methods to centr your content in a more or less usable way, either for you as developer of a site or your users as content creators.

## Method 1: HTML and `unsafe=true` (please don't)

## Method 2: A shortcode

## Method 3: An inline class for block level Markup

## Method 4: A table, really

This last method is more or less my hack for GitHub, where, in a README.md, I needed to add a bunch of buttons and wanted them looking nicely centred. Methods 1 to 3 didn't work, so I fell back to a weird hack: Adding a Markdown table and centring the "column" (the only cell in the table) via `:---:`.

Have a look:

```markdown
| headline |
| :---: |
| centred text... |
```
This results in a nice table, looking like this:

| headline |
| :---: |
| centred text centred text centred text centred text centred text centred text centred text centred text centred text centred centred text centred text centred text centred text centred text centred text centred text centred text centred text centred text centred text centred text |

The headline cell (a table header) seems to be required, so you could add a nice title there or a simple `&nbsp;`. You won't be able to get rid of the lines around the table in Github, but I think it looks not too bad in the end.

![](/blog/2022/centring-content-in-markdown/nicely-centred-badges.png)


[^1]: resulting in those nice `&lt!-- raw HTML omitted -->` markers in the HTML
