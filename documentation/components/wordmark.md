# Wordmark

The site wordmark is the typographic representation of the configured site title. On kollitsch.dev its text currently comes from `src/data/setup.json`:

```json
{
  "title": "KOLLITSCH.dev*"
}
```

The wordmark implementation deliberately does not contain the kollitsch.dev name itself. The displayed text and typography are configuration concerns so the implementation can later be extracted and reused elsewhere.

## Astro component

Use `src/components/ui/Wordmark.astro` in Astro templates and components:

```astro
---
import Wordmark from '@components/ui/Wordmark.astro';
---

<p>Hello, this is <Wordmark /> and welcome.</p>
```

`<Wordmark />` renders an inline `<span>`. By default its text is `setup.title`.

An explicit text value can be supplied when required:

```astro
<Wordmark text="Example*" />
```

Normal `<span>` attributes and classes can also be passed through the component.

### Typography

The Astro component renders plain inline text and applies the semantic wordmark font:

```css
font-family: var(--font-wordmark, var(--font-title));
```

Size, weight, line height, decoration, opacity, and other surrounding typography continue to inherit from the context in which the wordmark is used. Colour is inherited from the surrounding text; inline wordmarks do not set a background image, background-clipped glyph fill, tint, shadow, or fallback brand colour.

`--font-wordmark` is the semantic override intended for the wordmark. If it is not defined, the component falls back to the site's existing `--font-title` token.

## Markdown shorthand

In site Markdown files, use:

```markdown
Hello, this is <wordmark/> and welcome.
```

The Markdown processor rewrites this authoring shorthand at build time to:

```html
<word-mark></word-mark>
```

The browser therefore never needs to interpret `<wordmark/>` directly.

### Why the Markdown spelling is different

`<wordmark/>` is intentionally a Markdown authoring convenience, not the actual Web Component API.

The Custom Elements specification requires custom-element names to contain a hyphen, so `wordmark` cannot be registered with `customElements.define()`. HTML custom elements are also not void elements and must not rely on XML-style self-closing syntax.

For those reasons:

- Markdown authoring syntax: `<wordmark/>`
- Actual Web Component: `<word-mark></word-mark>`

The conversion is implemented in `src/utils/markdown-typography.ts` before the generated HTML reaches the browser.

## Web Component

The Web Component implementation lives at:

```text
src/scripts/components/word-mark.ts
```

It is registered globally by `src/components/layout/footer/WebComponents.astro`, which is included by the main site layout. No per-post `options.head.components` entry is required.

The component therefore works in generated site HTML as:

```html
<p>Hello, this is <word-mark></word-mark> and welcome.</p>
```

The default text is passed to `defineWordMark()` from `setup.title`.

An individual instance can override that text with the `text` attribute:

```html
<word-mark text="Example*"></word-mark>
```

The rendered text lives in an open shadow root and exposes its text span as the `text` part:

```css
word-mark::part(text) {
  /* instance-specific styling when needed */
}
```

The host uses the same typography contract as the Astro component:

```css
font-family: var(--font-wordmark, var(--font-title, inherit));
color: inherit;
```

On kollitsch.dev, the existing title font therefore applies automatically. On a page that does not provide that CSS variable, the Web Component inherits the surrounding font and colour.

## Configuration contract

Current configuration is intentionally small:

| Setting | Source | Purpose |
| --- | --- | --- |
| Default text | `setup.title` | Text rendered by `<Wordmark />` and `<word-mark>` |
| Inline colour | surrounding text | Wordmarks inherit colour instead of supplying a brand fallback or image fill |
| Wordmark font | `--font-wordmark` | Optional semantic wordmark font override |
| Fallback font | `--font-title` | Current kollitsch.dev title font |
| Per-instance Astro text | `text` prop | Overrides the configured text for one `<Wordmark />` |
| Per-instance Web Component text | `text` attribute | Overrides the configured text for one `<word-mark>` |

## Portability

This is step 1 of the wordmark implementation. The component boundary is already generic, but kollitsch.dev currently supplies the font through its normal site stylesheet.

For the portable version, the intended next step is to package the Web Component so a foreign page can load it independently. That version should:

1. accept the wordmark text as configuration;
2. accept the font family and webfont source as configuration;
3. detect whether the required font is already available;
4. load the webfont only once when it is missing;
5. retain inherited size, colour, weight, and surrounding inline typography by default; and
6. keep `<word-mark></word-mark>` as the standards-compliant portable HTML API.

The kollitsch.dev-specific `setup.json` import belongs to the site registration layer, not the reusable Web Component implementation. This separation is intentional so the component can later be moved into its own package or distributable script without carrying site-specific configuration with it.
