# Page, link, and title transitions

Astro's `ClientRouter` (imported in `src/components/layout/head/Head.astro`) drives
cross-document view transitions between full page navigations. `src/layouts/Site.astro`
owns the surrounding lock and animation behaviour.

## Navigation lock

While a transition is in flight, the outgoing page is locked so stray clicks or
scroll input can't land mid-swap:

* `astro:before-preparation` adds the `astro-transitioning` class to `<html>` and
  `inert` to `<body>`.
* `astro:after-swap` and the `pageshow` event (bfcache restores) remove both.

`astro-transitioning` currently sets `cursor: wait` (see the "view transitions"
section of `src/styles/theme.css`); extend that rule for further lock styling.

## Title transitions

Blog post titles morph between the preview card and the single-post view. Both
share a `transition:name` of `post-title-<post.id>`:

* Card title: `src/components/content/article/Preview.astro` (`<h2>`)
* Post page title: `src/layouts/ContentPage.astro`, via the new `transitionName`
  prop on `src/components/content/typography/Heading.astro`

Because `transition:name` must be unique per rendered page, only pass
`transitionName` when a single instance of that post's title is on the page.

## Reduced motion

`prefers-reduced-motion: reduce` disables all view-transition animations
(`::view-transition-group/old/new`) via the same theme.css section, regardless
of what `transition:animate` directive is used elsewhere in the markup.

## Link hover

All inline links (`src/styles/theme.css`, base `a` rule) already transition
color on hover/focus (`transition-colors duration-300 ease-in-out`); this is
the site-wide interactive-link motion and needs no per-component repetition.
