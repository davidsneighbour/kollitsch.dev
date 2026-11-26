# KOLLITSCH.dev — brand identity guidelines

**Version:** 1.0  
**Status:** Design approved; production implementation pending  
**Date:** 26 November 2026  
**Scope:** Visual identity, logo construction, accessibility, asset generation and usage

## 1. Brand philosophy

KOLLITSCH.dev is a personal publication about technology, experimentation, development, problem-solving and curiosity.

Its visual identity should represent an individual who explores, builds, dismantles and understands things, rather than presenting itself as a conventional technology company.

### The wildcard

The central element of the identity is the regular expression `.*`.

It represents the freedom to explore anything worth exploring, without predetermined subject boundaries. It acknowledges that technology is a central subject of the publication, but not necessarily its only subject.

The original asterisk used in the website's identity represented "and everything else". The new identity preserves this meaning and extends it into a more deliberate visual system.

The guiding philosophy is:

**Technology, curiosity and everything else.**

This statement is a conceptual design principle, not a mandatory public-facing tagline.

### The frame

Four independent corner brackets surround the wildcard, suggesting a viewport, workbench or space for experimentation.

The frame is deliberately incomplete. It provides structure without creating a closed container.

### Design principles

The identity must be:

- Personal rather than institutional.
- Technical without relying on generic technology imagery.
- Recognisable independently of its primary colour.
- Geometrically reproducible.
- Visually understated but distinctive.
- Accessible across light and dark environments.
- Suitable for applications ranging from favicons to large-format branding.
- Independent of browser-specific typography and external resources.

## 2. Brand name

The official visual brand name is **KOLLITSCH.dev**.

The surname is uppercase. The domain extension is lowercase.

| Context | Representation |
| --- | --- |
| Official brand name | KOLLITSCH.dev |
| Logo lettering | KOLLITSCH.dev |
| Domain name | kollitsch.dev |
| Website URL | [https://kollitsch.dev](https://kollitsch.dev) |

The distinction between uppercase surname and lowercase domain extension is an intentional component of the visual identity.

## 3. Official logo variants

The identity consists of three official marks.

### 3.1. Combination mark

The combination mark consists of the iconmark followed by the wordmark.

It is the preferred complete representation of the identity and should be used for website mastheads, presentations, banners and other applications where sufficient horizontal space is available.

### 3.2. Wordmark

The wordmark consists exclusively of the typographic representation of KOLLITSCH.dev.

It must retain the approved typeface, casing, proportions, spacing and semantic colour assignments.

It may be used independently of the iconmark.

### 3.3. Iconmark

The iconmark consists of the four corner brackets surrounding the regular expression wildcard.

It is suitable for:

- Website favicons.
- RSS and Atom feed identities.
- Social media avatars.
- Application icons.
- Compact navigation elements.
- Watermarks.
- Other square or space-constrained applications.

The iconmark must remain recognisable without the wordmark.

## 4. Iconmark construction

The approved iconmark is based on geometry variant A from the design exploration process.

### 4.1. Coordinate system

Use a square SVG coordinate system of 120 × 120 units.

All measurements in this specification are relative to this coordinate system. The artwork may be scaled proportionally to any required dimensions.

### 4.2. Frame

The frame consists of four identical, independently rotated corner elements.

| Property | Measurement |
| --- | ---: |
| Canvas width | 120 units |
| Canvas height | 120 units |
| Frame inset | 14 units |
| Frame centreline extent | 92 units |
| Corner arm extent | 22 units |
| Corner curve extent | 8 units |
| Stroke width | 5.5 units |
| Stroke caps | Round |
| Vertical opening, centreline to centreline | 48 units |
| Horizontal opening, centreline to centreline | 48 units |

The reference SVG path is:

```text
M14 36 V22 Q14 14 22 14 H36
M84 14 H98 Q106 14 106 22 V36
M106 84 V98 Q106 106 98 106 H84
M36 106 H22 Q14 106 14 98 V84
```

The frame must remain perfectly square. Its horizontal and vertical proportions must not be altered independently.

### 4.3. Asterisk

The asterisk consists of three intersecting straight axes, producing six arms.

| Property | Measurement |
| --- | ---: |
| Centre X | 72 units |
| Centre Y | 65 units |
| Axis length | 48 units |
| Axis angles | 0°, 60°, 120° from vertical |
| Stroke width | 9 units |
| Stroke caps | Butt |

The reference axis path is:

```text
M0 -24 V24
```

Render this path three times, rotating the second and third instances by 60° and 120° respectively.

Translate the resulting group to `(72, 65)`.

The asterisk must retain its six-arm geometry. Do not replace it with a typeface glyph, a five-pointed star or another decorative symbol.

### 4.4. Wildcard dot

| Property | Measurement |
| --- | ---: |
| Centre X | 33 units |
| Centre Y | 85 units |
| Radius | 5.5 units |

The dot is a solid circle.

Together, the dot and asterisk form the regular expression `.*`.

### 4.5. Composition

The asymmetric positioning of the wildcard is intentional.

The asterisk is positioned to the right of the geometric centre to accommodate the dot. This creates a visually balanced composition without excessive negative space on the right.

Do not independently centre the asterisk within the frame. Do not move the dot further towards the lower-left corner.

Both alternatives were explored and rejected during the design process.

## 5. Wordmark construction

The approved wordmark follows geometry variant D, incorporating optical oversizing of the surname and a reduced domain extension.

### 5.1. Typeface

| Property | Specification |
| --- | --- |
| Typeface | Changa One |
| Style | Regular |
| Weight | 400 |
| Surname | KOLLITSCH |
| Domain extension | .dev |

Changa One preserves continuity with the existing website identity.

Do not substitute another typeface, synthesise a heavier weight or apply artificial italic styling.

Production artwork must contain outlined vector glyphs rather than live SVG text.

### 5.2. Surname dimensions

The surname's height is derived from the vertical opening of the iconmark's brackets.

The bracket opening measures 48 units. The approved optical adjustment increases the target visible surname height to 51 units.

| Property | Measurement |
| --- | ---: |
| Bracket opening | 48 units |
| Target visible surname height | 51 units |
| Optical enlargement | 6.25% |
| Target vertical centre | 60 units |
| Reference baseline | 85.5 units |

Measure the actual visible glyph outlines rather than assuming that CSS font size corresponds to visible capital height.

The optical enlargement is intentional and must not be automatically corrected back to 48 units.

### 5.3. Domain extension

The domain extension uses the same typeface as the surname but at exactly two-thirds of its font size.

Construction rule:

```text
extensionFontSize = surnameFontSize × 2 / 3
extensionBaseline = surnameBaseline
```

The resulting relative size is 66⅔%.

The extension shares the surname's baseline. It must not be vertically centred, raised, rotated or stacked.

Its smaller size creates visual hierarchy, identifying the surname as the primary identity and the domain extension as secondary contextual information.

The ratio applies to the font size before outlining, not to the visible height of the lowercase glyphs.

### 5.4. Horizontal spacing

The reference visible left edge of the surname is positioned at X = 124 in the combination mark coordinate system.

The frame's rightmost centreline is at X = 106. This produces a nominal centreline-to-letter gap of 18 units.

The actual visible gap is smaller because of the frame stroke.

Final spacing must account for the visible glyph outlines, font side bearings and optical balance.

The transition between the final H and the domain extension's dot must receive particular attention.

Use the original design studies as the visual reference. Final optical corrections must be documented in the master artwork and must not be left to individual renderers.

### 5.5. Typography implementation

The production process must:

1. Load the authentic Changa One Regular font.
2. Measure its actual glyph outlines.
3. Scale the surname to the approved target height.
4. Scale the extension to exactly two-thirds of the surname's font size.
5. Establish the shared baseline.
6. Apply final optical spacing and kerning.
7. Convert all glyphs to vector paths.
8. Store the resulting geometry in the master SVG.

The production SVG must not rely on installed fonts, external font services or browser-dependent text layout.

## 6. Colour architecture

The identity is dark-first and colour-independent.

Its geometry establishes recognition. Its primary colour is a configurable attribute, not a permanent component of the brand's shape.

### 6.1. Semantic colour roles

| Token | Application |
| --- | --- |
| `--logo-background` | Designated background |
| `--logo-foreground` | Frame and surname |
| `--logo-muted` | Domain extension |
| `--logo-primary` | Wildcard dot and asterisk |

The dot and asterisk are the only elements that use the primary colour.

The wordmark and frame remain neutral.

The background role may be omitted in transparent assets intended for use on a known, validated background.

### 6.2. Default dark palette

Dark mode is the primary presentation of the identity.

| Role | Reference colour |
| --- | --- |
| Background | `#171717` |
| Foreground | `#FFFFFF` |
| Muted | `#A3A3A3` |
| Primary | `#28B840` |

### 6.3. Default light palette

| Role | Reference colour |
| --- | --- |
| Background | `#FFFFFF` |
| Foreground | `#171717` |
| Muted | `#737373` |
| Primary | `#16812E` |

The light-mode green is intentionally darker than the dark-mode green to maintain sufficient contrast against white.

### 6.4. Changing the primary colour

The primary colour may change without constituting a redesign.

A change must:

1. Establish appropriate primary colours for both light and dark environments.
2. Validate both colours against their respective backgrounds.
3. Update the central palette configuration.
4. Regenerate all affected assets.
5. Run accessibility and visual regression tests.

Do not assume that the same hexadecimal colour is suitable for both environments.

The light and dark colours should retain a recognisable relationship in hue, whilst allowing differences in lightness and chroma.

### 6.5. Monochrome variants

Approved monochrome assets may replace all visible colour roles with a single foreground colour.

These are exceptions to the ordinary semantic colour assignments and are intended for environments where colour reproduction is unavailable or inappropriate.

Monochrome variants must maintain the complete geometry of the original artwork.

## 7. Accessibility requirements

Accessibility is a mandatory internal brand quality standard.

Although WCAG exempts logotypes from certain mandatory contrast requirements, KOLLITSCH.dev voluntarily adopts explicit contrast requirements for its identity.

### 7.1. Contrast thresholds

| Element | Minimum contrast | Preferred contrast |
| --- | ---: | ---: |
| Surname | 4.5:1 | 7:1 |
| Domain extension | 4.5:1 | 7:1 |
| Corner brackets | 4.5:1 | 7:1 |
| Asterisk | 3:1 | 4.5:1 |
| Wildcard dot | 3:1 | 4.5:1 |

Preferred thresholds are design targets. Minimum thresholds are release-blocking requirements.

### 7.2. Contrast calculation

Use the WCAG relative luminance formula.

For each normalised sRGB colour channel:

```text
linearChannel =
  channel / 12.92                         if channel <= 0.04045
  ((channel + 0.055) / 1.055) ^ 2.4        otherwise
```

Relative luminance:

```text
L = 0.2126 × Rlinear
  + 0.7152 × Glinear
  + 0.0722 × Blinear
```

Contrast ratio:

```text
contrast = (Llighter + 0.05) / (Ldarker + 0.05)
```

Compare the unrounded calculated result against the required threshold. Rounding is permitted only for displaying results.

### 7.3. Validation requirements

Every supported palette must be tested against its actual designated background.

The validation system must:

- Validate foreground, muted and primary colours independently.
- Support independent light and dark palettes.
- Report the calculated contrast ratio for every colour role.
- Distinguish minimum requirements from preferred targets.
- Reject invalid colour configurations.
- Reject palettes that fail minimum contrast requirements.
- Return a non-zero exit status when mandatory validation fails.
- Run automatically during asset generation and continuous integration.

Transparent assets must only be used against backgrounds for which their colour roles have been validated.

### 7.4. Accessible naming

SVG artwork must support accessible identification.

For a standalone informative logo, use the accessible name "KOLLITSCH.dev".

For an iconmark requiring a description, an appropriate description is "A regular expression dot and asterisk framed by four corner brackets."

Decorative logo instances should be hidden from assistive technology when an adjacent accessible name already communicates the same information.

Do not expose the individual letter paths or geometric components as separately meaningful accessibility objects.

## 8. Master artwork

The master SVG is the absolute source of truth for the identity.

There must not be multiple independently maintained versions of the logo geometry.

### 8.1. Logical structure

The master SVG should use identifiable groups with stable identifiers:

```text
logo.master.svg
├── title
├── desc
├── style
├── iconmark
│   ├── frame
│   └── wildcard
│       ├── dot
│       └── asterisk
└── wordmark
    ├── surname
    └── domain-extension
```

These groups must allow the generation process to extract the individual marks without recreating their geometry.

### 8.2. Requirements

The master artwork must:

- Contain the approved vector geometry.
- Use the semantic colour roles.
- Contain outlined Changa One lettering.
- Preserve the approved proportions.
- Have a correctly calculated SVG `viewBox`.
- Support independent extraction of the wordmark and iconmark.
- Remain editable using standard vector graphics tools.
- Require no external resources for rendering.

The master SVG controls geometry. A central palette configuration controls colour values.

### 8.3. Derived assets

All derived assets must be generated from the master SVG.

Derived assets must not be manually edited.

The generation process may change colour assignments, backgrounds, output dimensions, `viewBox` boundaries and file formats without changing the approved underlying geometry.

## 9. Asset organisation

The following directory structure is recommended:

```text
brand/
├── README.md
├── guidelines.md
├── src/
│   ├── logo.master.svg
│   └── palette.json
├── scripts/
│   ├── generate.ts
│   └── validate.ts
├── tests/
│   ├── contrast.test.ts
│   └── visual/
└── dist/
    ├── dark/
    │   ├── combination-mark.svg
    │   ├── wordmark.svg
    │   └── iconmark.svg
    ├── light/
    │   ├── combination-mark.svg
    │   ├── wordmark.svg
    │   └── iconmark.svg
    ├── monochrome/
    ├── favicon/
    └── social/
```

This directory structure is a recommendation and may be adapted to the repository's existing conventions.

### 9.1. Naming

Use consistent lowercase, kebab-case filenames.

The canonical mark names are:

- `combination-mark`
- `wordmark`
- `iconmark`

Avoid ambiguous filenames such as `logo-new.svg`, `logo-final.svg` or `logo-final-v2.svg`.

### 9.2. Required formats

SVG is the preferred format for vector artwork.

Generate PNG, ICO and other raster formats only for consumers that require them.

Raster artwork must be exported directly from the canonical vector artwork, not from previously generated raster images.

## 10. Favicon and compact applications

The iconmark is the official favicon and compact identity.

### 10.1. Background

Favicons must have an opaque background.

This requirement addresses the original issue of the existing favicon appearing as a black square in a feed reader.

The default favicon uses the dark palette and an opaque dark background.

A light variant may also be generated.

### 10.2. Sizes

Test the iconmark at the following actual rendered sizes:

- 16 × 16 pixels.
- 24 × 24 pixels.
- 32 × 32 pixels.
- 48 × 48 pixels.
- 64 × 64 pixels.
- 96 × 96 pixels.
- 180 × 180 pixels.
- 192 × 192 pixels.
- 512 × 512 pixels.

The generation process should additionally support platform-specific dimensions where required.

### 10.3. Small-size optimisation

At the smallest sizes, rasterisation may affect the appearance of the frame, asterisk and dot.

Pixel alignment and limited stroke corrections may be introduced where testing demonstrates a genuine need.

Any such corrections must be:

- Restricted to documented compact variants.
- Reproducible by the generation process.
- Visually consistent with the master artwork.
- Tested independently.

Do not silently remove the wildcard dot or otherwise discard the `.*` concept.

The iconmark must retain its recognisable character at the smallest supported reproduction size.

### 10.4. Consumer testing

Verify the generated icon in representative environments:

- Browser tabs.
- Browser bookmarks.
- RSS and Atom feed readers.
- Light and dark application interfaces.
- Social media avatars.
- Mobile home-screen icons.

Test actual rasterised output rather than relying exclusively on enlarged previews.

## 11. Clear space and minimum size

The logo must have sufficient surrounding space to remain visually independent of adjacent content.

Clear-space requirements and minimum sizes must be established during production testing.

Use the iconmark's internal measurements as the basis for deriving a consistent clear-space unit.

Do not introduce unrelated arbitrary pixel measurements.

The minimum usable size of the combination mark must consider the legibility of the reduced `.dev` extension.

Where the combination mark becomes too small, use the iconmark or wordmark as appropriate instead of enlarging individual components.

Final clear-space measurements and minimum reproduction sizes must be recorded in a subsequent implementation revision of these guidelines.

## 12. Usage rules

### 12.1. Permitted

- Proportional scaling.
- Validated primary colour changes.
- Approved light and dark variants.
- Monochrome reproduction.
- Independent use of the iconmark.
- Independent use of the wordmark.
- Use of the combination mark.
- Transparent artwork on validated backgrounds.
- Opaque artwork for favicons and other self-contained applications.

### 12.2. Prohibited

- Stretching or compressing the artwork.
- Rotating the logo.
- Changing the square proportions of the frame.
- Independently centring the asterisk.
- Repositioning the wildcard dot.
- Replacing the asterisk with a font glyph.
- Changing the typeface.
- Changing the approved casing.
- Changing the extension's relative font size.
- Raising, rotating or stacking the domain extension.
- Applying the primary colour to the surname, extension or brackets.
- Introducing arbitrary gradients, shadows, outlines or three-dimensional effects.
- Using insufficiently contrasting colour combinations.
- Manually modifying generated assets.

## 13. Asset generation and testing

The identity should be implemented as a reproducible asset generation pipeline.

Use the repository's supported tooling. TypeScript is recommended for generation and validation scripts.

Configuration must remain separate from procedural implementation.

### 13.1. Generation

The generator must:

1. Read the master SVG.
2. Read and validate the palette configuration.
3. Generate the three official marks.
4. Apply the designated colour variants.
5. Calculate appropriate output boundaries.
6. Generate required raster assets.
7. Validate the generated results.
8. Report successful outputs and actionable errors.

The process must be deterministic and idempotent.

### 13.2. Automated tests

The test suite should cover:

- Valid SVG syntax.
- Required semantic group identifiers.
- Correct extraction of the individual marks.
- Square iconmark dimensions.
- Preservation of approved geometry.
- Valid colour configuration.
- Mandatory contrast thresholds.
- Absence of external font dependencies.
- Absence of external resource dependencies.
- Opaque favicon backgrounds.
- Correct output dimensions.
- Visual regression of canonical variants.

### 13.3. Visual regression

Maintain reference renders of approved assets.

Geometry changes should trigger visual regression failures. Intentional palette changes may require updated colour-specific reference images after successful accessibility validation.

Reference images must not replace the master SVG as the source of truth.

## 14. Governance

The approved artistic decisions are frozen.

Technical implementation may resolve optical spacing, glyph outlines, `viewBox` boundaries and small-size rendering requirements, provided the resulting artwork remains faithful to the approved design.

Any substantive change to the underlying identity requires an explicit revision of these guidelines.

Routine primary colour changes do not require a new identity version, provided the colour architecture and accessibility requirements remain unchanged.

## 15. Implementation acceptance checklist

### Master artwork

- [ ] Construct the master SVG using the approved variant A iconmark.
- [ ] Obtain and verify authentic Changa One Regular glyph outlines.
- [ ] Implement variant D wordmark proportions.
- [ ] Set the extension size to exactly two-thirds.
- [ ] Establish the shared baseline.
- [ ] Finalise optical spacing and kerning.
- [ ] Convert lettering to vector paths.
- [ ] Verify the master SVG's rendering and boundaries.

### Derived artwork

- [ ] Generate the combination mark.
- [ ] Generate the wordmark.
- [ ] Generate the iconmark.
- [ ] Generate dark variants.
- [ ] Generate light variants.
- [ ] Generate monochrome variants.
- [ ] Generate opaque favicon assets.
- [ ] Generate required social media assets.

### Accessibility and quality assurance

- [ ] Implement WCAG relative luminance calculations.
- [ ] Validate both default palettes.
- [ ] Implement release-blocking minimum contrast thresholds.
- [ ] Report preferred contrast targets.
- [ ] Test favicon rendering at actual output dimensions.
- [ ] Test browser and feed reader behaviour.
- [ ] Establish minimum reproduction sizes.
- [ ] Establish clear-space requirements.
- [ ] Verify accessible naming.
- [ ] Establish visual regression tests.

### Integration and documentation

- [ ] Implement the reproducible generation pipeline.
- [ ] Document palette configuration.
- [ ] Document generation and validation commands.
- [ ] Integrate the combination mark into the website masthead.
- [ ] Integrate the iconmark into website metadata and feeds.
- [ ] Verify light and dark website presentations.
- [ ] Record final implementation measurements.
- [ ] Commit the master artwork and guidelines to the repository.

## 16. Approved design decisions

| Decision | Approved value |
| --- | --- |
| Official brand name | KOLLITSCH.dev |
| Logo philosophy | Curiosity without predetermined boundaries |
| Core symbol | Regular expression `.*` |
| Iconmark geometry | Variant A |
| Frame | Four rounded corners forming a square |
| Asterisk | Geometric, six arms |
| Wordmark geometry | Variant D |
| Typeface | Changa One Regular |
| Surname casing | Uppercase |
| Extension casing | Lowercase |
| Extension relative font size | Exactly two-thirds |
| Extension alignment | Shared baseline |
| Default presentation | Dark |
| Primary colour | Interchangeable |
| Primary colour application | Dot and asterisk exclusively |
| Official marks | Combination mark, wordmark, iconmark |
| Master artwork format | Self-contained SVG |
| Production lettering | Outlined vector glyphs |
| Favicon background | Opaque |
| Accessibility validation | Mandatory |
| Asset generation | Reproducible from one master |

## 17. Outstanding implementation details

The design is approved, but the following matters require technical verification before the first production release:

- Actual Changa One glyph measurements and outlines.
- Final optical spacing between frame and surname.
- Final optical spacing between surname and extension.
- Exact production SVG boundaries.
- Minimum reproduction sizes.
- Clear-space measurements.
- Potential compact-icon rasterisation corrections.
- Automated validation of the reference palettes.
- Rendering across browser and feed reader environments.

These outstanding items are implementation requirements, not invitations to reopen the artistic design process.

---

**KOLLITSCH.dev — Technology, curiosity and everything else.**
