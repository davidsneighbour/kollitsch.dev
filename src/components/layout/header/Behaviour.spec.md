---
folder: src/components/layout/header
components:
  - SiteHeader.astro
  - SiteTitle.astro
  - TopNavigation.astro
  - Progress.astro
required_sections:
  - scope
  - vocabulary
  - invariants
  - behaviours
  - test-mapping
---

# Header behaviour specification

## Scope

This specification defines the expected behaviour of the site header system.

Covered components:

* `SiteHeader.astro`
* `SiteTitle.astro`
* `TopNavigation.astro`
* `Progress.astro`

The header system is responsible for:

* rendering site identity
* rendering primary navigation
* linking the site title placeholder and sticky navigation title
* mobile navigation toggling
* displaying reading progress

## Vocabulary

* "visible"
  * Present in the rendered page
  * Not intentionally hidden from the user

* "hidden"
  * Not intended to be perceivable by the user
  * Includes CSS-driven hidden states and off-screen states used for concealment

* "sticky header"
  * Header remains attached to the top of the viewport while scrolling

* "sticky brand"
  * The compact site title shown in the top navigation area after the main site title placeholder scrolls out of view

* "main navigation"
  * The primary nav landmark rendered inside `TopNavigation.astro`

* "mobile navigation open"
  * The mobile nav section is visible and interactive

* "mobile navigation closed"
  * The mobile nav section is hidden on small viewports

* "desktop"
  * Viewport width at or above the component's medium breakpoint

* "mobile"
  * Viewport width below the component's medium breakpoint

## Invariants

* `SiteHeader.astro` renders both `SiteTitle` and `TopNavigation`
* `SiteHeader.astro` passes the same `siteTitleId` to both child components
* The site title is always rendered
* The site title links to `/`
* The top navigation is rendered on every page that includes the header
* A navigation landmark is present
* Navigation remains keyboard accessible
* The progress indicator is present in the top navigation

## Behaviours

### SiteHeader composition

* `SiteHeader.astro` creates a `siteTitleId`
* The generated `siteTitleId` begins with `sitetitle-`
* The same `siteTitleId` is passed to:
  * `SiteTitle.astro`
  * `TopNavigation.astro`

### Site title

* `SiteTitle.astro` renders a `<header>` element
* The site title header has `aria-label="Site title"`
* The site title header uses the provided `siteTitleId` as its `id`
* The site title contains a homepage link
* The homepage link text is the configured site title

### Top navigation structure

* `TopNavigation.astro` renders a sticky header
* `TopNavigation.astro` renders a `<nav>` landmark with `aria-label="Main navigation"`
* The progress component is included in the navigation header
* At least one navigation link is rendered
* Navigation links must be keyboard reachable

### Sticky brand behaviour

* A sticky brand element exists in the top navigation
* The sticky brand is associated with the site title placeholder via `siteTitleId`
* The sticky brand visibility changes when the site title placeholder enters or leaves view
* The sticky brand behaviour is driven by viewport visibility, not by arbitrary timeouts

### Mobile navigation behaviour

* On mobile, navigation can be toggled open and closed
* On first mobile render, the mobile menu is closed
* Activating the mobile menu toggle changes the mobile-open state
* Opening the mobile menu makes the nav section visible
* Closing the mobile menu hides the nav section again
* On desktop, the nav is visible without requiring mobile toggle interaction

### Theme selector

* A theme toggle control is rendered in the top navigation
* The theme toggle is a button
* The theme toggle has `aria-label="Toggle theme"`

### Progress indicator

* `Progress.astro` renders a `<progress>` element
* The progress element has `aria-label="Reading progress"`
* The progress element starts at `value="0"`
* The progress value updates when page scroll position changes
* The progress element exposes scroll progress as a visual state

### Accessibility

* The top navigation exposes a navigation landmark
* All interactive controls in the header have an accessible name
* Header navigation can be used with keyboard-only interaction
* Focus order follows the rendered navigation order

## Test mapping

* `SiteHeader.test.ts`
  * verifies composition
  * verifies generated `siteTitleId` pattern
  * verifies the same `siteTitleId` is passed to both child components

* `SiteTitle.test.ts`
  * verifies site title header element
  * verifies `aria-label`
  * verifies provided `id`
  * verifies homepage link

* `TopNavigation.test.ts`
  * verifies sticky header structure
  * verifies main navigation landmark
  * verifies progress component inclusion
  * verifies presence of navigation links
  * verifies theme selector accessibility
  * verifies mobile menu markup hooks

* `Progress.test.ts`
  * verifies progress element markup
  * verifies `aria-label`
  * verifies initial value

Browser-level tests:

* sticky brand appears when the placeholder title leaves view
* sticky brand hides when the placeholder title returns into view
* mobile menu opens and closes correctly
* keyboard navigation works through the top navigation
* progress updates after scrolling

## Open questions

* What exact visual state marks the sticky brand as "visible" and "hidden"?
* Should the mobile menu close automatically after navigation selection?
* Should the theme selector itself have a dedicated browser-level interaction test in this folder, or only accessibility coverage here?
