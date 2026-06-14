---
title: Navigation
tags: []
created: 2026-06-14T00:00:00+07:00
updated: 2026-06-14T00:00:00+07:00
---

The site navigation is driven by two JSON files and three components. Top-level items and dropdown submenus are defined in data files; the components handle rendering, active-state detection, and responsive behaviour.

## File locations

| Purpose | Path |
| --- | --- |
| Top navigation data | [`src/data/topnavigation.json`](../src/data/topnavigation.json) |
| Footer navigation data | [`src/data/footernavigation.json`](../src/data/footernavigation.json) |
| Navigation type definitions | [`src/utils/navigation.ts`](../src/utils/navigation.ts) |
| Top navigation shell | [`src/components/layout/header/TopNavigation.astro`](../src/components/layout/header/TopNavigation.astro) |
| Individual nav item | [`src/components/layout/header/navigation/NavItem.astro`](../src/components/layout/header/navigation/NavItem.astro) |

## Data format

Each entry in `topnavigation.json` is a `NavItem` object:

```ts
type NavItem = {
  label: string;
  link: string;
  icon: IconName;
  match?: 'full' | 'prefix';
  matchPaths?: string[];
  children?: NavItem[];
  devOnly?: boolean;
};
```

| Field | Required | Description |
| --- | --- | --- |
| `label` | yes | Display text |
| `link` | yes | URL the item links to |
| `icon` | yes | Bootstrap Icon name (from `src/icons/`) |
| `match` | no | `"full"` (exact URL match) or `"prefix"` (URL starts-with). Defaults to `"full"`. |
| `matchPaths` | no | Additional path prefixes that also activate this item |
| `children` | no | Sub-items; presence triggers the dropdown UI |
| `devOnly` | no | When `true`, the item is visible only during `astro dev` (filtered out of production builds) |

## Adding a simple top-level item

Add an object to `topnavigation.json`:

```json
{
  "icon": "star",
  "label": "Favourites",
  "link": "/favourites/"
}
```

An item with a `match: "prefix"` is active for any path starting with its `link`:

```json
{
  "icon": "journal-text",
  "label": "Posts",
  "link": "/blog/",
  "match": "prefix"
}
```

## Adding a dropdown

Set `children` on any item. The parent link remains clickable; a separate chevron button opens the dropdown:

```json
{
  "icon": "journal-text",
  "label": "Posts",
  "link": "/blog/",
  "match": "prefix",
  "children": [
    {
      "icon": "clock",
      "label": "Latest",
      "link": "/blog/latest/"
    },
    {
      "icon": "archive",
      "label": "Archive",
      "link": "/blog/archive/"
    }
  ]
}
```

### Dropdown behaviour

* **Desktop** (`@md:` container-query breakpoint and above): the submenu appears on hover via CSS (`@md:group-hover/navitem:block`).
* **Mobile**: the chevron button toggles an `.open` class on the parent `<li>`. The Tailwind variant `group-[.open]/navitem:block` reveals the submenu.
* Clicking anywhere outside an open dropdown closes it (JavaScript dismiss handler).
* The chevron rotates 180 degrees when the submenu is open (`group-[.open]/navitem:rotate-180`).

## Development-only items

Set `devOnly: true` on an item or child to exclude it from production builds:

```json
{
  "devOnly": true,
  "icon": "file-earmark-lock",
  "label": "Drafts",
  "link": "/blog/drafts/"
}
```

`TopNavigation.astro` filters items where `devOnly` is `true` unless `import.meta.env.DEV` is `true`. This filtering runs at build time for static output, so dev-only items are never included in production HTML.

## Active state

`TopNavigation.astro` computes the active item using `findActive()` from `src/utils/navigation.ts`. When an item is active its `<li>` receives `font-bold`.

Special-case: all paths under `/tags/` and `/tag/` activate the Tags item regardless of its `match` setting, because tag pages are generated at paths under those prefixes.

## How TopNavigation passes data to NavItem

```astro
typedNavData
  .filter((item) => import.meta.env.DEV || !item.devOnly)
  .map((value) => (
    <NavItem
      icon={value.icon}
      name={value.label}
      link={value.link}
      subItems={value.children?.filter(
        (child) => import.meta.env.DEV || !child.devOnly,
      )}
      classes={`px-3 py-4 @md:px-2 @md:py-2 ${isNavItemActive(value) ? "font-bold" : ""}`}
    />
  ))
```

The `subItems` prop triggers the dropdown branch in `NavItem`. When `subItems` is `undefined` or empty the component renders a plain `<li>`.

## Component documentation

See [`documentation/components/nav-item.md`](components/nav-item.md) for the full `NavItem` component reference.
