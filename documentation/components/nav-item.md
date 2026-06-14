---
title: NavItem
tags: []
created: 2026-06-14T00:00:00+07:00
updated: 2026-06-14T00:00:00+07:00
---

Renders a single item in the top navigation bar, either as a plain link or as a link with a collapsible dropdown submenu when `subItems` are provided.

## File locations

| Field | Value |
| --- | --- |
| Component | [`src/components/layout/header/navigation/NavItem.astro`](../../src/components/layout/header/navigation/NavItem.astro) |
| Data | none (receives all data via props from `TopNavigation.astro`) |
| Tests | [`src/components/layout/header/navigation/NavItem.test.ts`](../../src/components/layout/header/navigation/NavItem.test.ts) |

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `icon` | `IconName` | required | Bootstrap Icon name for the item |
| `name` | `string` | required | Display label |
| `link` | `string` | required | URL the label links to |
| `classes` | `string` | `""` | Tailwind classes applied to the outer `<li>` |
| `subItems` | `NavDataItem[]` | `undefined` | Child items; triggers the dropdown branch when non-empty |

`NavDataItem` is the `NavItem` type exported from [`src/utils/navigation.ts`](../../src/utils/navigation.ts).

## Usage

Plain item (no dropdown):

```astro
---
import NavItem from '@components/layout/header/navigation/NavItem.astro';
---

<NavItem icon="house-fill" name="Home" link="/" classes="px-3 py-2" />
```

Item with a dropdown:

```astro
---
import NavItem from '@components/layout/header/navigation/NavItem.astro';
---

<NavItem
  icon="journal-text"
  name="Posts"
  link="/blog/"
  classes="px-3 py-2"
  subItems={[
    { icon: 'clock', label: 'Latest', link: '/blog/latest/' },
    { icon: 'archive', label: 'Archive', link: '/blog/archive/' },
  ]}
/>
```

## Behaviour

### Plain item

Renders a `<li>` containing an `IconLink`: an icon followed by the label text.

### Dropdown item

When `subItems` is non-empty the component renders:

* A `<li data-nav-dropdown>` with named group `group/navitem`.
* The primary `<a>` link (the label) stays clickable at all times.
* A `<button data-nav-dropdown-toggle>` with a caret icon next to the label opens and closes the submenu.
* A `<ul role="menu">` containing one `IconLink` per sub-item.

#### CSS hover (desktop, `@md:` breakpoint)

The submenu is hidden by default (`hidden`). At the `@md:` container-query breakpoint, hovering the parent `<li>` reveals the submenu via `@md:group-hover/navitem:block`. The submenu is absolutely positioned below the parent item.

#### Click toggle (mobile and keyboard)

The toggle button adds or removes the class `open` on the parent `<li>`. The Tailwind variant `group-[.open]/navitem:block` shows the submenu. On mobile (below `@md:`), no absolute positioning is applied so the submenu expands inline in the vertical nav list.

The caret rotates 180 degrees when the submenu is open, via `group-[.open]/navitem:rotate-180` on the `Icon`.

#### Click-outside dismiss

A document-level click listener (added once per page, guarded by `data-nav-dismiss-init` on `<body>`) removes `open` from all open dropdowns when the user clicks outside a `[data-nav-dropdown]` element.

#### View-transition navigation

The `initNavDropdowns` function is called on every `astro:page-load` event to re-attach toggle listeners after view-transition navigations. The dismiss handler guard (`data-nav-dismiss-init`) lives on `<body>`, which Astro replaces on each swap, so the handler is automatically re-registered on the new body.

## Key Tailwind classes

| Class | Applied to | Purpose |
| --- | --- | --- |
| `group/navitem` | `<li>` | Named group scope for hover and open-state variants |
| `data-nav-dropdown` | `<li>` | JS selector for toggle and dismiss logic |
| `hidden` | `<ul>` | Default hidden state |
| `group-[.open]/navitem:block` | `<ul>` | Show submenu when parent has `.open` class |
| `@md:group-hover/navitem:block` | `<ul>` | Show submenu on hover at desktop widths |
| `@md:absolute @md:top-full` | `<ul>` | Position as overlay below parent on desktop |
| `group-[.open]/navitem:rotate-180` | caret `Icon` | Rotate caret when submenu is open |
