---
title: Back to the Top without Javascript
description: >-
  In my lifelong quest to minimize the code to display my view of the world (aka
  this website) I realised, that I can get rid of all JS to display my "Back to
  top" button.
date: 2023-12-03T15:51:00.000Z
publishDate: 2023-12-03T15:51:00.000Z
lastmod: 2024-03-03T14:36:15.000Z
resources:
  - src: header.jpg
tags:
  - javascript
  - css
  - back-to-top
  - 100DaysToOffload
unsplash:
  imageid: bEOrxHU2Op8
fmContentType: blog
---

In my lifelong quest to minimize the code required to display my view of the world (aka this website) I today realised, that I can get rid of all the Javascript to display my "Back to top" button. Just look at [this commit](https://github.com/davidsneighbour/hugo-theme/commit/519ce475cd81488ceafd846eeb5549e4de1dff95).

Up to now I had a button that was hidden by default and shown when the user scrolled down a certain amount of pixels. This was done with a bit of Javascript. I also had a bit of Javascript to scroll to the top of the page when the button was clicked.

It turns out this is not necessary. I can do all of this with CSS.

And it's not even a lot of CSS.

The two pillars of this "trick" are `position: sticky` and `margin-top: 105vh`. Basically, what I am doing is positioning the back to top button just below the bottom of the page and then make it sticky, once it scrolls into the viewport. Of course, this whole procedure needs some positioning and floating or flexing, but that's it.

My final SCSS snippet looks like this:

```scss
.btn-back-to-top {

  @extend .btn;
  @extend .btn-dark;

  @extend .d-flex;
  @extend .flex-row-reverse;
  @extend .justify-content-end;

  margin-top: 105vh;
  position: sticky;
  bottom: 1rem;
  right: 1rem;
  float: right;

}
```

Most of this is just styling the button.

CSS has come a long way since back in the days when we used HTML tables to put layouts together.
