
# NavSearch (Astro Component)

Accessible, flexible navigation bar with integrated search toggle.

## Features

* Full-width navigation
* Three-region layout (`left`, `center`, `right`)
* Accessible search toggle
* Replaceable search content
* Replaceable icons
* No duplicate close controls (single toggle controls state)
* CSS variable for responsive search width

## Layout Model

```plaintext

[left]   [center]   [right]

````

### Default mapping

* left → title
* center → navigation
* right → search toggle

## Slot Rules

### Region slots (layout)

* `left`
* `center`
* `right`

### Semantic slots (fallbacks)

* `title`
* `nav`
* `search`
* `search-open-icon`
* `search-close-icon`

## ⚠️ Important

Do NOT nest slots like this:

```astro
<Fragment slot="left">
  <Fragment slot="title">...</Fragment>
</Fragment>
````

Use either region slots OR semantic slots — not both nested.

## Example Usage (Recommended)

```astro
<NavSearch
  navLabel="Main navigation"
  openSearchLabel="Open site search"
  closeSearchLabel="Close site search"
  searchRegionLabel="Site search"
  centerClass="justify-end"
>
  <Fragment slot="left">
    <a href="/" class="flex items-center gap-2 text-lg font-semibold">
      MyBrand
    </a>
  </Fragment>

  <Fragment slot="center">
    <nav aria-label="Main navigation">
      <ul class="flex items-center gap-6">
        <li><a href="/blog/">Blog</a></li>
        <li><a href="/projects/">Projects</a></li>
        <li><a href="/about/">About</a></li>
      </ul>
    </nav>
  </Fragment>

  <Fragment slot="search">
    <div class="flex w-full items-center gap-3">
      <label for="search" class="sr-only">Search</label>
      <input
        id="search"
        type="search"
        placeholder="Search..."
        class="w-full border-0 outline-none"
        data-nav-search-input
      />
    </div>
  </Fragment>

  <Fragment slot="search-open-icon">
    <span>🔍</span>
  </Fragment>

  <Fragment slot="search-close-icon">
    <span>✕</span>
  </Fragment>
</NavSearch>
```

## Behaviour

| State  | Nav     | Search  | Toggle Icon |
|  | - | - | -- |
| Closed | visible | hidden  | search      |
| Open   | hidden  | visible | close       |

## Accessibility

* `aria-expanded` on toggle
* `aria-controls` linking panel
* `role="search"` on panel
* `aria-hidden` + `inert` on nav
* Focus moves into search on open
* Escape closes search
* Click outside closes search

## CSS Variable

```plaintext
--search-outer-width
```

Available on the search panel.

## Notes

* Only **one close mechanism** exists (toggle button)
* No duplicate close icons
* Toggle remains clickable above search panel via z-index layering

## Props

| Prop                  | Type    | Description          |
|  | - | -- |
| `title`               | string  | Fallback title       |
| `navItems`            | array   | Fallback nav         |
| `navLabel`            | string  | Accessible nav label |
| `searchPlaceholder`   | string  | Input placeholder    |
| `openSearchLabel`     | string  | Accessible label     |
| `closeSearchLabel`    | string  | Accessible label     |
| `searchRegionLabel`   | string  | Accessible label     |
| `searchInitiallyOpen` | boolean | Initial state        |
| `class`               | string  | Outer wrapper        |
| `innerClass`          | string  | Inner container      |
| `leftClass`           | string  | Left region          |
| `centerClass`         | string  | Center region        |
| `rightClass`          | string  | Right region         |

## Final Notes

* Keep toggle above search panel (`z-index`)
* Use region slots for layout flexibility
* Keep search implementation swappable via slot
