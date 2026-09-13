# Dark heading and link prototypes

This prototype explores dark-mode treatments for headings and linked headings on article pages and post preview cards.

## Route

Open the prototype overview at:

```text
/prototypes/
```

Open the picker route at:

```text
/prototypes/dark-heading-links/
```

With the local Astro server used in this session:

```text
https://127.0.0.1:4401/prototypes/dark-heading-links/
```

## Run

The route is a normal Astro page under `src/pages/prototypes/`. Start the local site server, then open the route:

```bash
ASTRO_DEV_BACKGROUND=0 npx astro dev --port 4401 --host 127.0.0.1 --ignore-lock
```

In this agent environment, Astro may otherwise automatically switch to background mode. If that happens, use the command above so the foreground server stays attached.

## Picker

Use the picker at the bottom of the page, or these keys:

* `1` - Quiet
* `2` - Editorial
* `3` - Whole card
* `4` - Orange wave
* `5` - Soft wave
* `6` - Straight line
* Left/right arrow keys - move between variants

The variant is also persisted in the URL with `?v=1`, `?v=2`, `?v=3`, `?v=4`, `?v=5`, or `?v=6`.

## Preview deploy

Prototype pages are removed from normal production-safe build output. Use only the prototype preview command when somebody outside this workstation needs to inspect the picker:

```bash
npm run deploy:preview:prototypes
```

Do not use `npm run deploy`, `wrangler deploy`, `npm run build:clean`, or `clean:build-caches` for prototype review.

## Variants

* **Quiet:** Neutral headings with clearer underline affordance for links.
* **Editorial:** Structural rules and small link marks distinguish plain headings from linked headings.
* **Whole card:** Preview cards become one large link target, while article headings stay plain.
* **Orange wave:** All headings are orange. Linked headings keep orange text but gain a thick wavy underline that turns red on hover.
* **Soft wave:** All headings are orange. Linked headings keep orange text and the same red underline colour, but with a thinner, calmer wave.
* **Straight line:** All headings are orange. Linked headings keep the Soft wave colour, thickness, and offset settings, but use a straight underline.
