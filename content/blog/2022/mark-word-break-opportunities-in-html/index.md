---
type: blog
title: Mark word break opportunities in HTML
linkTitle: Mark word break opportunities in HTML
description: ""
summary: ""

date: 2022-08-21T18:52:10+07:00
publishDate: 2022-08-21T18:52:10+07:00
lastmod: 2022-08-21T19:38:20+07:00

resources:
  - title: Photo by Patrick Kollitsch
    src: header.png

tags:
  - html
  - today i learned
  - 100DaysToOffload
---

Today I tried to check my website, while frolicking on a beach somewhere on Koh Samui and was presented with the view on the left in the image above. That box looked weird, and of course that very long hashtag was the reason for it. On desktop it looks relatively ok. Now I could start playing around with the sentence structure and word order, but I remembered, that HTML has indeed a tag that marks a potential word break.

After a little googling I came across [`wbr`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/wbr), the "word break opportunity tag". Add this tag where ever a browser would be allowed to break down longer words.

The before:

```html
I am taking part in the
<a href="/blog/2022/100-days-to-offload/">
	#100DaysToOffload
</a>
project... 100 posts within a year.
```

The after:

```html
I am taking part in the
<a href="/blog/2022/100-days-to-offload/">
	#100Days<wbr>To<wbr>Offload
</a>
project... 100 posts within a year.
```

You can see the result above. A nice formatted box on mobile, a normal text flow on desktop.

Now... that is not the last word in this discussion. I remember there are CSS properties to properly break words with a dash, based on the language of the text. I'll look into these next.
