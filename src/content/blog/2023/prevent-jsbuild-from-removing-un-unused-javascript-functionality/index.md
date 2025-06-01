---
title: Prevent js.Build from removing un-used Javascript functionality
description: >-
  Discover how I solved an ESBuild issue removing the unused 'themeSwitcher'
  function in my Alpine.js integration, and learn about Alpine.js startup
  nuances.
date: 2023-11-11T14:16:05.000Z
publishDate: 2023-11-11T14:16:05.000Z
lastmod: 2023-11-11T14:35:27.000Z
resources:
  - src: header.png
tags:
  - alpinejs
  - esbuild
  - component
  - 100DaysToOffload
type: blog
fmContentType: blog
---

Today, I reworked my theme changer script from vanilla JavaScript to an [Alpine.js](https://alpinejs.dev/)-based component. This change cut down the code lines by 50%. However, initially, it didn't work. The console error messages indicated that my theme switcher function was unrecognized. Intrigued, I decided to investigate.

My setup uses [`js.Build`](https://gohugo.io/hugo-pipes/js/), which integrates [ESBuild](https://esbuild.github.io/) into [GoHugo](https://gohugo.io/).

Initially, my script was:

```js
import './scripts/theme-toggle';
import Alpine from 'alpinejs';

window.Alpine = Alpine
Alpine.start();
```

The theme switcher function was within `theme-toggle.js`:

```js
function themeSwitcher() {
  // function details
};
```

And in my template, I initialized the theme switcher like this:

```go-template
<li class="nav-item" id="themeswitcher" x-data="themeSwitcher()">
  …
</li>
```

The final JavaScript was built using `js.Build` and loaded into the page:

```go-template
{{ $scripts := resources.Get "js/script.ts" |
      js.Build (dict "targetPath" "assets/js/script.js") |
      minify |
      fingerprint "sha512" }}
<script
  src="{{- $scripts.Permalink -}}"
  async
  defer
  integrity="{{- $scripts.Data.Integrity -}}"
></script>
```

Nothing too complicated, I thought, but still, on the console, I could see that while Alpine.js was properly initialized, the `themeSwitcher` function was not being recognized or found.

It turned out ESBuild was excluding the `themeSwitcher` function from the final build. I suspect it's because the function wasn't explicitly "used" elsewhere in the script, although it was clearly utilized in the theme.

After several trials (including an unsuccessful attempt to directly call `themeSwitcher()` in my JavaScript), I stumbled upon a straightforward solution. I registered the function in the `window` object, similar to how I did with Alpine:

```js
import Alpine from 'alpinejs';
window.Alpine = Alpine
function themeSwitcher() {
  // function details
}
window.themeSwitcher = themeSwitcher;
Alpine.start();
```

However, a minor issue arose with this change: Alpine.js generated a warning about being loaded before the `<body>` was fully available. To address this, and to ensure proper script loading order, I modified the `Alpine.start()` call to be done on `DOMContentLoaded`:

```js
import Alpine from 'alpinejs';
window.Alpine = Alpine
function themeSwitcher() {
  // function details
}
window.themeSwitcher = themeSwitcher;
document.addEventListener('DOMContentLoaded', () => {
  Alpine.start();
});
```

With this adjustment, everything fell into place smoothly. Feel free to maniacally toggle the theme switcher in the top right corner of this page to see the result.
