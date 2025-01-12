---
$schema: /static/_schemata/blog.schema.yaml
title: "`scroll-margin-top` property in CSS"
description: Simplify anchor link navigation with CSS's modern `scroll-margin-top` property. Learn how it replaces old hacks and enhances performance.
summary: Fixing navigation overflow for anchor links just got easier! Say goodbye to pseudo-element hacks and embrace CSS's `scroll-margin-top` for cleaner, efficient solutions.
date: 2025-01-12T19:23:22+07:00
publishDate: 2025-01-12T19:23:22+07:00
lastmod: 2025-01-12T12:32:39+00:00
resources:
- title: This is how hacking looks like. Trust me.
  src: getty-images-ltpb_WinC3Y-unsplash.jpg
tags:
- css
- howto
- hacks
- 100DaysToOffload
---

Navigating the world of CSS can be a mix of discovering creative workarounds and celebrating modern solutions. A great example is handling anchor link navigation, where overflowing content often creates frustrating visual issues. In the past, developers relied on clever hacks to fix this, but CSS has evolved to make it easier than ever.

Navigation overflow occurs when clicking an anchor link (e.g., `#section`) causes the target element to scroll into view but part of it is hidden behind a fixed header or navigation bar. For instance, if your website has a header navigation that's 50 pixels high, clicking an anchor link would position the target headline right under the navigation bar, effectively hiding it or part of it from view. To solve this, adding 50 pixels of spacing above the target ensures the headline is fully visible, making the experience more user-friendly.

Here's how we used to fix this problem:

```scss
// Old method: Using pseudo-elements and manual adjustments
:target::before {
  @extend .d-block;
  height: $heading-height;
  margin: -$heading-height 0 0;
  content: "";
}
```

The above method works by adding a `::before` pseudo-element to the target, simulating space at the top of the page to account for sticky headers. While effective, it introduces additional markup complexities and isn't as clean as we'd like.

Thankfully, CSS evolves to meet our needs. Modern browsers now support the `scroll-margin-top` property, a game-changer for this scenario:

```scss
// New method: Clean and modern
:target {
  scroll-margin-top: $heading-height;
}
```

This new method is obviously better:

1. **Simplicity**: No need for pseudo-elements or additional content. The property directly modifies the scrolling behavior.
2. **Readability**: Code is easier to understand, reducing the cognitive load for collaborators.
3. **Performance**: Fewer elements and styles mean less work for the browser, leading to better performance.
4. **Native Support**: `scroll-margin-top` is supported in all modern browsers (see [caniuse.com](https://caniuse.com/?search=scroll-margin-top)), making it a safe choice for production.

CSS is an ever-evolving language, and as developers, it's crucial to stay updated. The `scroll-margin-top` property is a perfect example of how modern CSS simplifies our workflow, making our code cleaner and more efficient. So next time you're tempted to use a workaround, remember to check if CSS has evolved to make your life easier. It probably has. 😊
