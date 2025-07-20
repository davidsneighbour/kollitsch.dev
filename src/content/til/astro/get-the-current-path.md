---
title: Get the current page path in Astro
date: 2025-07-20T06:24:08.703Z
tags:
  - astro
  - typescript
  - javascript
---

`Astro.url` returns the current page URL from the Request object. The return value is a URL object which contains properties like `pathname` and `origin`.

```js
const currentPath = Astro.url.pathname;
```

This is useful when I need to highlight navigation links based on the current page:

```astro
<a href="/me" class={currentPath === '/me' ? 'active' : ''}>
  About Me
</a>
```
