---
title: How to make browsers download a linked file
description: >-
  Learn how to use the download attribute in anchor tags to prompt file
  downloads in browsers.
links:
  - 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a#attr-download'
  - 'https://www.w3schools.com/tags/att_a_download.asp'
date: '2023-11-12T20:29:27+07:00'
resources:
  - src: header.jpg
tags:
  - html
  - howto
  - 100daystooffload
fmContentType: blog
cover: ./header.jpg
publisher: rework
---

The download attribute for anchor (`<a>`) tags is a nifty feature that often flies under the radar but can significantly enhance the user experience on a website. This attribute, when added to an `<a>` tag, instructs the browser to download the resource linked by the anchor tag instead of navigating to it. This functionality is particularly useful for creating direct download links for files like PDFs, images, or documents.

```html
<a href="/path/to/filename.pdf" download>Download filename.pdf</a>
<a href="/path/to/filename.pdf" download="document.pdf">Download document.pdf</a>
```

If you use the attribute without a value, like `<a href="path/to/filename.pdf" download>`, the file will be downloaded with its original filename. By assigning a value to the download attribute, you can specify a different filename for the downloaded file. For instance, `<a href="path/to/filename.pdf" download="document.pdf">` will download the file as `document.pdf` instead of its original name.

While this attribute is widely supported in modern browsers \[[caniuse](https://caniuse.com/download)], it has certain limitations. It works only with same-origin URLs or `data:` and `blob` values. Also, not all file types may be supported for renaming due to browser security restrictions.

Despite these limitations, the download attribute remains a simple yet powerful tool for enhancing file interactions on the web, allowing web developers to provide more context or branding to file downloads and helps with removing the dreaded "right click to download" instructions from websites.
