---
title: Mesh
tags: []
created: 2026-09-21T00:00:00+07:00
updated: 2026-09-21T00:00:00+07:00
---

Renders a fixed, bottom-anchored Canvas 2D field of small glowing dots connected by thin lines ("the mesh"), fading in once the visitor scrolls past the site title and fading out again near the top of the page. Every visual and physics property is a prop, tuned from a single call site rather than by editing the renderer.

This document is intentionally more thorough than a typical entry in this tree: the component embeds real physics (forces, easing, a graph-connectivity guarantee), and the extra depth here — vocabulary, formulas, and the reasoning behind each decision — exists so a future change starts from a correct mental model instead of re-deriving one from the code.

## File locations

| Field | Value |
| --- | --- |
| Component | `src/components/gimmicks/Mesh.astro` |
| Global mount point | `src/layouts/Site.astro` (first child of `<body>` — see [Why it has to stay first](#why-it-has-to-stay-first-in-siteastro)) |
| Activation sentinel | `src/components/layout/header/Header.astro` (`<div data-mesh-trigger>`, right after `<SiteTitle />`) |
| Opaque boxes that hide the mesh from the pointer | `src/components/content/article/Post.astro`, `src/components/content/article/Preview.astro` (both carry `data-obscures-mesh`) |
| Data | none |
| Tests | none |

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `colorVar` | `string` | `"--color-primary"` | CSS custom property name resolved (via a 1×1 offscreen canvas fill) into the dots'/lines' RGB colour; re-resolved on the site's `theme-changed` event |
| `nodeOpacity` | `number` | `0.14` | Base dot opacity, before the pointer-glow multiplier |
| `connectionOpacity` | `number` | `0.05` | Base connection opacity at zero distance, before the distance falloff and the pointer-glow multiplier |
| `particleRadiusMin` / `particleRadiusMax` | `number` | `1` / `2.2` | Dot radius range in pixels, randomised per particle |
| `movementSpeed` | `number` | `0.08` | Strength of the ambient drift nudge (not gravity — see [Ambient drift](#ambient-drift-motion-not-gravity)) |
| `pointerRadius` | `number` | `200` | Reach, in pixels, of both the pointer repulsion and the pointer glow |
| `pointerForce` | `number` | `0.04` | Maximum repulsion force at the cursor's exact position |
| `pointerGlowStrength` | `number` | `1.2` | Brightness multiplier bonus at the cursor's exact position; `0` disables the glow |
| `particleMinDistance` | `number` | `26` | Minimum gap enforced between any two particles (see [Separation force](#separation-force-declustering)) |
| `particleSeparationForce` | `number` | `0.06` | Push strength when two particles are closer than `particleMinDistance` |
| `scrollInfluence` | `number` | `0.002` | How much Lenis scroll velocity feeds into the field's vertical offset target |
| `scrollDamping` | `number` | `0.04` | How quickly the field's scroll offset eases toward that target each frame |
| `heightMin` / `heightPreferred` / `heightMax` | `string` | `"280px"` / `"66vh"` / `"850px"` | The three terms of the box's `clamp()` height; `heightPreferred` is what actually drives it day to day |
| `fadeDuration` | `string` | `"900ms"` | CSS `transition-duration` for the box's opacity fade |
| `fadeEasing` | `string` | `"ease"` | CSS `transition-timing-function` for the fade; accepts a `linear(...)` multi-stop curve for a shape a single `cubic-bezier()` can't express (see [The fade curve](#the-fade-curve-a-three-phase-linear-curve)) |
| `density` | `{ desktop?, tablet?, mobile?: { particles?: number; connectionRadius?: number } }` | `{ desktop: 110/135, tablet: 70/115, mobile: 40/95 }` (particles/connectionRadius) | Particle count and connection reach per breakpoint tier (`min-width: 1024px` / `768px` / below) |

Two internal constants are **not** props — deliberately, since they are the kind of value only touched while actively redesigning the physics feel, not during ordinary visual tuning: `CONCAVE_DEPTH` (how deep the top-edge "bowl" recesses, near the top of the `<script>` block) and the containment margin/strength/damping constants inside `updateParticles()`. See [Where to change what](#where-to-change-what).

## Usage

```astro
---
import Mesh from '@components/gimmicks/Mesh.astro';
---

<Mesh
  nodeOpacity={0.4}
  connectionOpacity={0.16}
  particleRadiusMin={3.5}
  particleRadiusMax={5.5}
  pointerRadius={130}
  fadeDuration="6000ms"
  fadeEasing="linear(0, 0.6 12%, 0.92 55%, 1)"
  density={{
    desktop: { particles: 190 },
    tablet: { particles: 130 },
    mobile: { particles: 80 },
  }}
/>
```

This is, verbatim, the single live call in `Site.astro` — the site renders exactly one instance, globally, and every page inherits it. There is no per-page usage; tune the effect by editing that one call.

## Behaviour

### Vocabulary

- **Dot / node / particle** — the individual glowing points; the code calls them particles (`Particle` interface). Each carries `x`/`y` (position), `vx`/`vy` (velocity), `angle` (ambient-drift direction), and `radius`.
- **Connection / line / edge** — a thin line between two particles closer than `connectionRadius` for the current tier. Recalculated fresh every frame; nothing is persisted.
- **Bridge** — a special connection added only when ordinary proximity connections would otherwise leave two or more disconnected clusters on screen (see [Guaranteeing full connectivity](#guaranteeing-full-connectivity-union-find-and-bridging)).
- **The box** — the `<div class="mesh">`, `position: fixed` to the bottom of the viewport (not the page — it never moves as you scroll, only fades). All particle coordinates live inside its own space: `x` from `0` to box width, `y` from `0` (top) to box height (bottom).
- **Density / tier** — how many particles exist and how far apart two can be and still connect (`connectionRadius`), set separately per `desktop`/`tablet`/`mobile` breakpoint tier and re-picked automatically on resize.

#### Ambient drift (motion, not gravity)

There is no gravity in this system. The bottom-heavy look could easily read as "things fall and settle", but nothing pulls particles downward frame after frame — every particle's vertical position is chosen once, at creation, from a distribution that happens to favour the bottom (see [Bottom bias](#bottom-bias-and-the-concave-ceiling)). The only ongoing motion is **ambient drift**: each particle's `angle` takes a tiny random turn every frame, and the particle is nudged slightly in that direction. Combined with heavy damping, this produces a slow, aimless wander, never a fall or a bounce.

- **Damping ("friction")** — every particle's velocity is multiplied by `0.94` each frame, after all forces are applied. This is what turns "got pushed" into "settles back to a slow drift" instead of sliding forever or stopping dead.
- **Containment** — a gentle, linear (not eased) push-back activating only within 40px (`margin`) of an edge — left, right, bottom, and the particle's own top ceiling (below). A soft boundary, not a wall.
- **Separation force ("dots dispel each other")** — a standing rule, independent of the pointer, keeping any two particles from ending up closer than `particleMinDistance`. Runs every frame regardless of cursor state; see [Separation force](#separation-force-declustering).
- **Pointer repulsion ("the push")** and **pointer glow ("the spotlight")** — cursor-driven effects, both reaching to `pointerRadius` and both eased with the same curve; see their own sections below.

### Trigger and lifecycle

Nothing initialises at page load: no canvas context, no particles, no animation loop — only the empty markup, an `IntersectionObserver` on the sentinel, and a few cheap event listeners (`resize`, `visibilitychange`, `theme-changed`, and — only on devices with a real mouse — `pointermove`).

```text
sentinel visible (near top)         -> box stays hidden
sentinel's top edge scrolls above 0 -> show(): first time only, canvas + particles created; box fades in; rAF loop starts
scroll back up, sentinel visible    -> hide(): box fades out, rAF loop stops entirely
scroll down again                   -> show() again, SAME particle field resumes, not regenerated
```

Two independent pauses: the rAF loop stops immediately when the tab is backgrounded (`visibilitychange`), and under `prefers-reduced-motion: reduce` the loop never starts at all — the box still fades in/out and still shows the bottom-biased dots and connections, but nothing drifts, nothing responds to the pointer or to scroll velocity, and a single static frame is drawn per state change instead.

### Content boxes and pointer suppression

`Post.astro` (the full article box) and `Preview.astro` (post-preview cards) carry `data-obscures-mesh`, a plain boolean attribute doing two jobs: it documents that their `bg-card` background is deliberately opaque so the mesh cannot show through it (see [Why these two boxes are opaque](#why-these-two-boxes-are-opaque)), and it drives the pointer handler — on every `pointermove`, `document.elementFromPoint()` checks what is actually under the cursor; if that element is inside something carrying `data-obscures-mesh`, the pointer is treated as "not over any visible dots" (no push, no glow), because dots hidden under an opaque card should not be disturbable by something the visitor cannot see. Add the attribute to any future opaque box and both behaviours follow with no change to this component.

### The formulas

#### Bottom bias and the concave ceiling

A particle's vertical position, chosen once at creation:

```ts
const ceiling = columnCeiling(x);
const span = height - ceiling;
const y = ceiling + span * Math.pow(Math.random(), 0.45);
```

`Math.random()` alone is uniform. Raising it to `0.45` (an exponent below `1`) skews results toward `1` — so `y` lands near `ceiling + span` (the bottom of that column's range) far more often than near `ceiling` (the top), tapering smoothly to zero density exactly at the ceiling rather than piling up along a line.

An earlier version of this formula had the sign flipped (`height - height * Math.pow(...)`), which by the same reasoning put the *most* density at the top and tapered it to zero at the bottom — the opposite of the intended effect, and the actual cause of a "line of dots at the top" bug reported partway through this component's development. If this formula ever seems reversed again, trace what `Math.random()` near `0` and near `1` each do to the final `y` and confirm the common case lands where most dots should be.

`columnCeiling(x)` is what makes the top edge a shallow "bowl" — recessed in the middle, full reach at the edges — rather than a flat line:

```ts
function columnCeiling(x) {
  const nx = x / width;                               // 0 (left) .. 1 (right)
  const centerness = Math.cos((nx - 0.5) * Math.PI);   // 1 at centre, 0 at either edge
  return height * CONCAVE_DEPTH * Math.max(0, centerness);
}
```

Recalculated from a particle's *current* `x` every frame (not just at creation) in the containment step too, so the bowl shape survives horizontal drift instead of gradually flattening out.

#### Smoothstep easing (the shared S-curve)

```ts
function smoothstep(t) {
  return t * t * (3 - 2 * t);
}
```

Takes `t` from `0` to `1` and returns an eased value with zero slope at *both* ends — flat start, flat finish, steepest change in the middle — unlike a linear ramp, whose slope is constant throughout. Shared by the pointer repulsion force and the pointer glow multiplier; conceptually related to (but not the same mechanism as) the `linear()` fade curve.

#### Pointer repulsion

```ts
const dx = particle.x - pointerX;
const dy = particle.y - (pointerY - scrollOffset);
const distance = Math.sqrt(dx * dx + dy * dy);

if (distance < pointerRadius) {
  const eased = smoothstep(1 - distance / pointerRadius);
  const force = eased * pointerForce;
  particle.vx += (dx / distance) * force;
  particle.vy += (dy / distance) * force;
}
```

`(dx / distance, dy / distance)` is the direction from the cursor to the particle, shrunk to length `1`. `1 - distance / pointerRadius` is `1` at the cursor and `0` at the radius edge; `smoothstep` of that gives the eased strength. Only velocity is touched here — position changes afterward via `particle.x += particle.vx * dt`, which is why the push feels like a shove that decays, not a teleport.

#### Pointer glow

Same shape, applied to *brightness* rather than *movement*:

```ts
function pointerGlowMultiplier(x, y) {
  const dx = x - pointerX;
  const dy = y - (pointerY - scrollOffset);
  const distance = Math.sqrt(dx * dx + dy * dy);
  if (distance >= pointerRadius) return 1;
  const eased = smoothstep(1 - distance / pointerRadius);
  return 1 + eased * pointerGlowStrength;
}
```

`1` = unchanged, rising to `1 + pointerGlowStrength` at the cursor. A dot's drawn alpha is `Math.min(1, nodeOpacity * glow)` (capped at `1`, though with the currently tuned values — `nodeOpacity = 0.4`, `pointerGlowStrength = 1.2`, max `0.88` — that cap never actually triggers). Connections use the same multiplier evaluated at their midpoint, since Canvas 2D has no cheap way to vary a single stroke's brightness along its length. Off entirely (multiplier `1`) under reduced motion, on coarse/touch pointers, or when `pointerGlowStrength` is `0` — the same conditions that disable the repulsion force.

#### Separation force (declustering)

```ts
if (distance < minDistance) {
  const push = (1 - distance / minDistance) * particleSeparationForce;
  a.vx += (dx / distance) * push;  a.vy += (dy / distance) * push;
  b.vx -= (dx / distance) * push;  b.vy -= (dy / distance) * push;
}
```

Linear, not eased — runs every frame for every close pair, regardless of the pointer. Pushes both particles apart equally. If two particles are (near) exactly overlapping, the normalised direction is undefined, so a random direction is used instead. This is what stops a pointer-pushed cluster from freezing wherever the cursor left it: with nothing else to push against, the only way a crowded pile-up can relax is to spread back out — including off a boundary it got pushed against, since containment resists further outward motion while separation actively disperses the pile-up inward.

#### Scroll response

```ts
// on Lenis scroll:
scrollTargetOffset = clamp(scrollTargetOffset + velocity * scrollInfluence * 1000, -20, 20);
// every frame:
scrollOffset += (scrollTargetOffset - scrollOffset) * scrollDamping;
scrollTargetOffset *= 0.9;
```

A whole-field vertical nudge (via `ctx.translate`, not per-particle), clamped to ±20px regardless of scroll speed, chasing its target with exponential smoothing so it reads as a gentle lag rather than a snap; the target itself decays 10%/frame even without new events, so a scroll burst produces a brief self-fading nudge.

#### The fade curve (a three-phase `linear()` curve)

The box's own opacity fade is plain CSS (`transition: opacity var(--mesh-fade-duration) var(--mesh-fade-easing)`), currently `linear(0, 0.6 12%, 0.92 55%, 1)`. CSS's `linear()` plots arbitrary `value stop%` points and straight-line-interpolates between them — the only way to get a genuinely different rate of change across three distinct phases, which a single `cubic-bezier()` cannot express. Reading the points: `0%→0` (start), `12%→0.6` (fast), `55%→0.92` (a much steadier middle phase — 43% of the duration covers just 32% of the opacity change), `100%→1` (a long, slow settle — the final 45% of the duration covers only the last 8%). Verified live by sampling `getComputedStyle(el).opacity` through an entire transition and confirming three distinct rates (~0.83/s, ~0.12/s, ~0.03/s).

### Guaranteeing full connectivity (Union-Find and bridging)

Because connections are just "any two particles currently within `connectionRadius`", it is possible — rare, but possible — for randomly-placed dots to form two or more clusters with no connecting line between them, even though every dot has plenty of connections within its own cluster. Fixed every frame, inside `draw()`:

1. While drawing ordinary proximity connections, each drawn connection also records its two particles as belonging together in a **disjoint-set / Union-Find** structure (`class UnionFind`).
2. Particles are grouped by root. One group: nothing further happens — the common case, costing nothing beyond the bookkeeping already done in step 1.
3. More than one group: repeatedly find the globally closest pair of points between any two different groups, draw a bridging connection between them, merge the groups, and repeat until one remains.

Step 3's nested search only ever runs when needed, and typically only over a handful of small stray clusters, not the whole field — verified both by reproducing the exact algorithm against a synthetic 4-cluster point set (4 clusters → exactly 3 bridges, the mathematical minimum, genuinely fully connected afterward) and by an 8-second live run confirming no dropped frames. Bridges use the same colour, line width, and flat `connectionOpacity` as ordinary connections (no distance falloff, and — currently — no pointer glow), deliberately indistinguishable, so the mesh always reads as one coherent structure.

## Extending

### Where to change what

| Change | Where | Notes |
| --- | --- | --- |
| Dot count, connection reach, size, opacity, colour | `density`, `particleRadiusMin/Max`, `nodeOpacity`, `connectionOpacity`, `colorVar` props | Single point of config: the `Site.astro` call |
| Box height | `heightMin` / `heightPreferred` / `heightMax` props | `heightPreferred` (a `vh` value) drives it day to day |
| Ambient drift speed | `movementSpeed` prop | |
| Pointer reach / push strength / glow strength | `pointerRadius`, `pointerForce`, `pointerGlowStrength` props | Reach is shared between push and glow |
| Minimum dot spacing / declustering strength | `particleMinDistance`, `particleSeparationForce` props | |
| Fade duration / shape | `fadeDuration`, `fadeEasing` props | Any CSS `<easing-function>`, including `linear(...)` for a multi-phase shape |
| Scroll responsiveness | `scrollInfluence`, `scrollDamping` props | |
| Bowl depth | `CONCAVE_DEPTH` constant | **Not a prop** — edit directly near the top of the `<script>` block |
| Edge push-back strength/margin, damping factor | The `0.0006`/`margin`/`0.94` constants in `updateParticles()` | **Not props** — edit directly |
| Where the fade-in trigger sits | The sentinel `<div>` in `Header.astro` | Move it to change what "past the hero" means |
| Which boxes suppress the pointer | `data-obscures-mesh` attribute | Add/remove on any component |
| Its position/z-index behaviour | `Site.astro` | Read [Why it has to stay first](#why-it-has-to-stay-first-in-siteastro) before moving it |
| Connectivity guarantee | Not configurable | The Union-Find/bridging pass always runs |

### Why it has to stay first in `Site.astro`

`.mesh` deliberately has no `z-index`. A `position: fixed` element with no `z-index` paints in document order, in the same layer as ordinary content — so being the *first* child of `<body>` means it paints right after `<body>`'s own background and before every real piece of content that follows (header, article, footer), which is exactly the "behind content, above the page background" layering it needs. Moving it to the end of the file (grouped with other "extras") was considered and rejected: it would flip that order, putting the mesh visually on top of the whole page. A real structural fix exists (an explicit low `z-index` on the mesh plus a higher one on a wrapper around the actual content) but was judged not worth the complexity for a pure organisational preference.

Also checked and ruled out: page-load performance. The component's script compiles as `<script type="module">`, which defers execution until after parsing regardless of DOM position; a real Chrome performance trace against a production build measured this page's Largest Contentful Paint (LCP — how long the biggest visible piece of content takes to render) at 40ms, with 0ms attributable render-blocking impact from anything related to the mesh.

### Why these two boxes are opaque

`Post.astro` and `Preview.astro` originally used a translucent "glass" background in dark mode (`dark:bg-black/20`, part of a wider frosted-glass pattern shared by several card components on this site). That was fine over a flat page colour; once the mesh existed, 80% of whatever sat behind a card — including moving dots — showed straight through it, reading as broken rather than intentional. Both were switched to the already-present, fully opaque `bg-card` token with no dark-mode override. Deliberately narrow fix: `CardLink.astro` and `Tag.astro` use the identical translucent pattern and were left untouched, since they were not reported as a problem and may sit where the mesh never reaches.

### How this reached its current shape

1. Initial build: Canvas 2D (not a third-party library), `IntersectionObserver`-gated activation, bottom-biased placement, distance-based connection opacity, a spatial grid instead of all-pairs comparison, ambient drift, pointer repulsion, Lenis scroll response, responsive density, reduced-motion handling, full view-transition lifecycle cleanup.
2. Invisible entirely: `z-index: -1` was painting behind `<body>`'s own non-transparent background (negative-`z-index` descendants paint before an ordinary box background in the browser's painting order). Fixed by removing `z-index` and relying on document order — see [Why it has to stay first](#why-it-has-to-stay-first-in-siteastro).
3. While chasing that bug, several checks (DOM presence, computed opacity, a script reading non-zero canvas pixels) all "passed" while a real screen showed nothing. `AGENTS.md` gained an explicit rule: "visible" means confirmed in an actual screenshot or live view, not DOM presence or a script-read pixel count.
4. First tuning pass: opacity, particle radius, and particle counts raised once genuinely visible; `density` and radius promoted from hard-coded internals to props, establishing the single-point-of-config pattern used for every prop since.
5. Removed the CSS `mask-image` that faded the canvas near its own top edge — a `<canvas>` already hard-clips its own drawing on every side, so the mask only softened an edge that didn't need softening.
6. The bottom-bias formula's sign was flipped (see [Bottom bias](#bottom-bias-and-the-concave-ceiling)); fixed, and the concave bowl ceiling added at the same time.
7. Box height made configurable (`heightMin`/`heightPreferred`/`heightMax`); the `vh` preference raised from `45vh` to `66vh`, and the ceiling raised from `650px` to `850px` in the same change, since at the old ceiling the new preference would start getting silently clipped above roughly 985px viewport height.
8. Cards and the footer were showing the mesh through content meant to hide it: `Post.astro`/`Preview.astro`'s translucent dark-mode background was made opaque (see [Why these two boxes are opaque](#why-these-two-boxes-are-opaque)), and the footer wrapper's `bg-olive-50 dark:bg-olive-950` — an exact, redundant duplicate of `<body>`'s own colour — was removed entirely.
9. "Soap in oil" pointer effect: particles pushed by the cursor stayed clustered near an edge and never recovered, because nothing repelled particles from *each other*, only from the cursor. Fixed by adding the always-on [separation force](#separation-force-declustering).
10. Pointer suppression over opaque content, via `document.elementFromPoint()` plus `data-obscures-mesh` (see [Content boxes and pointer suppression](#content-boxes-and-pointer-suppression)).
11. Repulsion force switched from a linear ramp to the [smoothstep](#smoothstep-easing-the-shared-s-curve) curve; `pointerRadius` reduced from `200` to `130`.
12. Fade promoted to props and slowed from `900ms ease` to the `6000ms` three-phase `linear()` curve (see [The fade curve](#the-fade-curve-a-three-phase-linear-curve)).
13. Moving the mesh to the bottom of `Site.astro` (pure code-organisation preference) considered and rejected — see [Why it has to stay first](#why-it-has-to-stay-first-in-siteastro); also confirmed, via a real Lighthouse/Chrome trace, not a loading-performance concern either way.
14. Full connectivity guaranteed via Union-Find plus greedy nearest-component bridging (see [Guaranteeing full connectivity](#guaranteeing-full-connectivity-union-find-and-bridging)) — discussed as a design question first, implemented once approved, explicitly prioritising near-zero added per-frame cost.
15. Pointer "spotlight" glow added for both dots and connections (see [Pointer glow](#pointer-glow)), sharing the repulsion force's distance model and easing curve so the two read as one effect.

### How this was tested

The automated browser used during this component's development reports `window.matchMedia('(pointer: fine)').matches` as `false` (no real pointing device), so the `pointermove` listener is never attached there, by design. Several pointer-behaviour fixes were verified instead by calling the relevant private methods directly on the live controller instance, via a small temporary debug hook added to `ensureStarted()` and removed once each check was done. A real mouse, on a real desktop browser, is the only way to see the pointer effects end to end.

### Current limitations

- `CONCAVE_DEPTH` and the containment margin/strength/damping constants are internal, not props — see [Where to change what](#where-to-change-what) for why.
- Bridges don't receive the pointer glow effect, only ordinary connections and nodes do.
- Pointer glow on a connection is evaluated once, at its midpoint, not as a gradient along its length.
