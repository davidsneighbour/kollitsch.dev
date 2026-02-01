# Scrolling and animation conventions

This file uses normative language as defined in RFC 2119. See [docs/rfc-2119.md](docs/rfc-2119.md) for details.

IMPORTANT: If you touch scrolling, wheel handling, animation, or page transitions, read this file first.

## Global rules

* This site uses `<ClientRouter />`
* There is no guarantee of full page reloads
* Back/Forward Cache (bfcache) must be assumed

## Lenis rules

* Exactly one Lenis instance is allowed
* Lenis MUST be stored on window.kdev
* Lenis MUST be destroyed before reinitialisation
* Lenis MUST be reinitialised on:
  * astro:page-load
  * pageshow

DO NOT initialise Lenis with a plain new Lenis(...) without lifecycle handling.

## Scrolling and wheel handling

* Any code that calls preventDefault() on wheel or touch events must be reviewed for bfcache safety
* Event listeners must tolerate being restored from a frozen state
* Assume RAF timing and internal state can be stale after Back navigation

## Transitions and interaction locks

* inert and astro-transitioning must never persist after navigation
* Defensive cleanup is preferred over trusting framework internals
* Interaction must be restored whenever the page becomes visible

## Default stance

Prefer explicit lifecycle hooks and defensive cleanup over implicit assumptions.
