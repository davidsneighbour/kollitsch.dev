# KOLLITSCH.dev — logo assets

Design approved 26 November 2026. Dark-first; variant A iconmark, variant D wordmark, Changa One Regular, uppercase KOLLITSCH and lowercase .dev at exactly 2/3 font size on a shared baseline.

## Ready to use

All three marks are complete in `dist/{dark,light,monochrome-dark,monochrome-light}/`. The master `logo.master.svg` contains actual outlined Changa One Regular glyphs. `dist/favicon/` contains opaque SVG, ICO and PNG variants. `preview-dark.png` shows the combination mark on its designated background. `palette.json` and `contrast-report.txt` record the validated colours. Font files are not distributed; see FONT-LICENSE.txt for the supplied font attribution.

## Regenerate assets

```bash
python3 -m venv .venv
source .venv/bin/activate
python -m pip install fonttools brotli cairosvg pillow
python generate.py
```

Normal generation extracts geometry from the master SVG, with `viewBox` values stored in `mark-bounds.json`. To explicitly reconstruct the master from the original font (not needed for normal palette changes), run `python generate.py --font /path/to/ChangaOne-Regular.ttf`. The generator uses advance widths and legacy kern pairs rather than full OpenType shaping. Tracking is `-1.1` units for the surname and two-thirds of that for the extension, with a 2.5-unit visible H-to-dot gap. These optical choices have been visually reviewed in the dark combination mark; final user approval is pending.

## Construction and governance

Icon canvas 120 square; frame centreline inset 14, stroke 5.5 round caps; opening 48; asterisk centre (72,65), axes 48 long at 0/60/120 degrees from vertical, stroke 9 butt caps; dot (33,85), radius 5.5. Wordmark visible surname height 51, centred vertically at 60, visible left edge x=124; extension scaled to 2/3 on shared baseline. Do not centre the wildcard, stretch, rotate, add effects or use primary colour outside the dot and asterisk. The initial wordmark clear-space allowance is 11.25 units; review before adoption.

The outlined master is the geometry source of truth; normal generation extracts its named groups. Do not manually edit derived assets. If geometry is intentionally revised, update the stored `viewBox` values as needed.

## Accessibility

Minimum contrast against the designated background: foreground (frame and surname) 4.5:1, muted (.dev) 4.5:1, primary (dot and asterisk) 3:1. Preferred: 7:1 for foreground and muted, 4.5:1 for primary. WCAG relative luminance: linearise sRGB channels at 0.04045, then `L=0.2126R+0.7152G+0.0722B`; ratio=(Llighter+0.05)/(Ldarker+0.05). Unrounded ratios determine pass/fail. Both palettes must be revalidated after changes. These are voluntary brand standards even where logotypes are exempt. Use opaque favicon backgrounds; transparent marks only on validated backgrounds. Accessible name: KOLLITSCH.dev; hide decorative duplicates from assistive technology.

Remaining release checks: final user approval of optical spacing, visual regression, minimum reproduction size, clear space, actual browser/feed reader testing, small-size pixel alignment if needed. No compact stroke adjustments applied to these assets.
