TODO: integrate this into scrolling-and-animation.md

# Astro ClientRouter gotchas: bfcache, inert, and smooth scrolling

IMPORTANT:
If you touch scrolling, wheel handling, animation, or page transitions, read this file first.

## Context

This site uses Astro's <ClientRouter /> for client-side navigation and view transitions.

This means:

* pages are swapped in the DOM instead of fully reloaded
* browser Back/Forward navigation may restore pages from Back/Forward Cache (bfcache)
* DOM state and parts of JS state can be restored exactly as they were at the moment of navigation

This creates failure modes that do not exist with full page reloads.

## Observed symptoms

After navigating within the site and using the browser Back button:

* the previous page renders correctly
* clicks may be ignored (page appears 'dead')
* mouse wheel scrolling may not work
* dragging the scrollbar can suddenly 'wake up' scrolling
* hard reload (F5) always fixes the issue

These symptoms are reproducible both on production and during astro dev.

## Root causes

Two independent issues were identified.

### 1) Transition lock state persists after bfcache restore

During view transitions, Astro temporarily applies a navigation lock to prevent interaction during DOM swaps.

This lock may involve:

* astro-transitioning class on <html>
* inert attribute on <html> and/or <body>

If the page is restored from bfcache while this lock is active or cleanup did not run, the restored page can remain locked.

'inert' is especially critical:

* it disables pointer events
* it removes focus and keyboard interaction
* visually the page looks fine, but it is not interactive

### 2) Smooth scrolling library state becomes stale

This site uses Lenis for smooth scrolling.

Lenis:

* intercepts wheel and touch events
* often prevents native scrolling
* relies on RAF loops and internal scroll state

After a bfcache restore:

* Lenis event listeners may still intercept wheel
* internal state or RAF timing may be stale
* wheel input is captured but does not move scroll
* dragging the scrollbar forces a native scroll update and 'wakes' Lenis

## Fix 1: force-release navigation locks

Navigation locks must be explicitly released after swaps and after bfcache restore.

```js
(() => {
  const releaseNavigationLocks = () => {
    document.documentElement.classList.remove('astro-transitioning');
    document.documentElement.removeAttribute('inert');
    document.body?.removeAttribute('inert');
  };

  document.addEventListener('astro:after-swap', releaseNavigationLocks);
  window.addEventListener('pageshow', releaseNavigationLocks);
})();
```

## Fix 2: Lenis must be lifecycle-aware

Lenis must be treated as a singleton and must be reinitialised when the page lifecycle changes.

```js
import Lenis from 'lenis';

(() => {
  const getNamespace = () => {
    if (!window.kdev || typeof window.kdev !== 'object') {
      window.kdev = {};
    }
    return window.kdev;
  };

  const destroyLenis = () => {
    const ns = getNamespace();
    const instance = ns.lenis;
    if (instance && typeof instance.destroy === 'function') {
      instance.destroy();
    }
    ns.lenis = undefined;
  };

  const initLenis = () => {
    const ns = getNamespace();
    destroyLenis();

    const lenis = new Lenis({ autoRaf: true });

    if (typeof lenis.resize === 'function') lenis.resize();
    if (typeof lenis.start === 'function') lenis.start();

    ns.lenis = lenis;
  };

  initLenis();
  document.addEventListener('astro:page-load', initLenis);
  window.addEventListener('pageshow', initLenis);
})();
```

## Rule of thumb

Any library that:

* intercepts wheel, touchmove, or keydown
* uses RAF loops
* caches DOM references
* modifies scroll behaviour

must be initialised with ClientRouter lifecycle events and bfcache behaviour in mind.
