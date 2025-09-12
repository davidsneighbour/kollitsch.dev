---
title: Font-weight enforcement in TailwindCSS 4.1
description: "A quick guide, that covers the steps to ensure a custom font uses a single font weight with a quick linting setup."
summary: "A quick guide, that covers the steps to ensure a custom font uses font-weight: 400 in all occurrences in TailwindCSS 4.1, including creating utility classes and setting up linting for misuse."
date: 2025-09-12T14:02:11.569Z
tags:
  - tailwindcss
  - how-to
  - font-weight
  - 100daystooffload
cover:
  src: ./the-quick-brown-fox.png
  type: image
---

When I, earlier this year, was reworking my website _from Hugo to Astro&trade;_ I realised that my headline font ([the great Changa One](https://fonts.google.com/specimen/Changa+One) from Google Fonts) had only a single weight --- 400 --- and browsers were making it bolder when I added it to headlines (to "emulate" a weight of, for instance, 700). This is of course not what we want and will result in, let's say, inconvenient rendering issues when the font is bolder by browser synthesis (see the article image above) - so I tried to find a way to enforce the font weight to be 400 in all occurrences.

The solution I ended up using is relatively easy to implement, but it took me a while to find all the edge cases and hidden overrides of the weight.

This is how I did it in TailwindCSS 4.1+, but it is probably applicable to other CSS frameworks or plain vanilla CSS as well.

## Step 1: Define the custom font

```css
@font-face {
  font-family: changa;
  src:
    url('/fonts/changa/changaone-regular-webfont.woff2') format('woff2'),
    url('/fonts/changa/changaone-regular-webfont.woff2')
      format('woff2-variations');
  font-weight: 400;
  font-style: normal;
  font-display: fallback;
  text-rendering: optimizelegibility;
}

@font-face {
  font-family: changa;
  src:
    url('/fonts/changa/changaone-italic-webfont.woff2') format('woff2'),
    url('/fonts/changa/changaone-italic-webfont.woff2')
      format('woff2-variations');
  font-weight: 400;
  font-style: italic;
  font-display: swap;
  text-rendering: optimizelegibility;
}
```

Note that I have defined a font-weight of 400 for this font. This tells the browser that this font has a single weight. It also makes the browser synthesize a bold version of the font when it's used in other weights. Let's fix that in the next step.

## Step 2: Create a utility class for the font

```css
@theme {
  --font-changa: changa, sans-serif;
}
@layer utilities {
  /* Custom font utility - always normal weight */
  .font-changa {
    font-family: changa, sans-serif;
    font-weight: 400;
    font-synthesis: none;
  }
}
```

I added again a weight of 400 here, just to be sure that the resulting font is always normal weight. I also added `font-synthesis: none;` to prevent the browser from synthesizing a bold or italic version of the font if a developer tries to apply `font-bold` or `font-italic` to an element with this class.

The property [`font-synthesis`](https://developer.mozilla.org/en-US/docs/Web/CSS/font-synthesis) (in Baseline since 2022) tells the browser not to create processed bold or italic styles, which is particularly useful for fonts that don't have those variants.

This should be enough to ensure that any element with the class `.font-changa` will use the Changa One font at weight 400. However, if someone adds another font-weight utility class (eg. `font-bold` or `font-light`) to the same element, it might override the weight set in `.font-changa`. This is prevented in the next step.

## Step 3: Override and/or neutralize other font weights

The challenge is preventing developers from accidentally applying another weight (for example `font-bold`, `font-semibold`) to an element using the custom font. By default, utility classes like `font-bold` would override the weight since they also target the `font-weight` property. We need to counteract that.

```css
@layer utilities {
  .font-changa { /* as above... */ }

  /* Override any other weight utility when used with font-changa */
  .font-changa.font-thin,
  .font-changa.font-extralight,
  .font-changa.font-light,
  .font-changa.font-normal,
  .font-changa.font-medium,
  .font-changa.font-semibold,
  .font-changa.font-bold,
  .font-changa.font-extrabold,
  .font-changa.font-black {
    font-weight: 400;
  }
}
```

We could add all available font utility-classes we know and encounter here. This way, if a developer adds `font-some-nice-function` to an element with `font-changa` as font class, the combined selector `.font-changa.font-some-nice-function` will have higher specificity than just `.font-some-nice-function` alone, and thus our rule will win and keep the weight at 400.

This CSS ensures that if an element has both `font-custom` and, say, `font-bold` in its class list, the selector `.font-custom.font-bold` will win and keep the weight at 400. The combined selector has two classes and therefore a higher specificity than a single-class selector like `.font-bold`. In other words, **two class qualifiers (.font-custom.font-bold) outweigh one (.font-bold)**, so the browser applies font-weight 400 from our rule instead of 700. You should include all the weight utilities (from `font-thin` through `font-black`) in this override rule to cover every case.

**Nuclear Option:** Use `!important`:** Another way is to enforce the weight in the custom class with `!important`. For example:

```css
.font-changa { font-weight: 400 !important; }
```

… but please, don't use `!important`. Apart from it being a bad practice nuclear options tend to pollute the system long after they take effect.

## 4. Preventing overrides and audit styles

To make sure that no overrides sneak in, I created a simple audit stylesheet that outlines any element that has both the custom font class and any other font-weight class applied. This way, if I (or any other component) accidentally add `font-bold` to an element with `font-changa`, it will be visually highlighted during development.

```css
.font-changa.font-thin,
.font-changa.font-extralight,
.font-changa.font-light,
.font-changa.font-medium,
.font-changa.font-semibold,
.font-changa.font-bold,
.font-changa.font-extrabold,
.font-changa.font-black,
{
  outline: 2px dashed #c11414;
}
```

This is an excerpt, my current full version of this audit style can be found [in my GitHub repository](https://github.com/davidsneighbour/kollitsch.dev/blob/main/src/assets/styles/audit.css) and takes care of a couple of headlines. I add it only in development mode, so it doesn't affect production.

```astro
{
  import.meta.env.DEV && (
    <link
      rel="stylesheet"
      href="/src/assets/styles/audit.css"
    />
  )
}
```
