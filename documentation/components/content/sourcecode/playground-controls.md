---
title: PlaygroundControls
tags: []
created: 2026-11-06T10:00:00+07:00
updated: 2026-11-06T10:00:00+07:00
---

Renders the typed controls of a code playground from its `controls.json`, so readers can change an example without editing code.

## File locations

| Field | Value |
| --- | --- |
| Component | `src/components/content/sourcecode/PlaygroundControls.tsx` |
| Data | `controls.json` of the example, via `PlaygroundDescriptor.controls` |
| Tests | [`code-playground.pure.test.ts`](../../../../src/utils/code-playground.pure.test.ts) (value rules) |

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `idPrefix` | `string` | required | Prefix for element ids, unique per playground |
| `controls` | `readonly PlaygroundControl[]` | required | Control declarations |
| `state` | `PlaygroundState` | required | Last valid state; the controls always show these values |
| `disabled` | `boolean` | required | Disables the whole `<fieldset>` |
| `onChange` | `(id: string, value: PlaygroundValue) => void` | required | Called with the control id and its new value |

## Usage

```astro
---
import { PlaygroundControls } from './PlaygroundControls.tsx';
---

<PlaygroundControls
  idPrefix="playground-demo"
  controls={descriptor.controls}
  state={state}
  disabled={false}
  onChange={(id, value) => dispatch({ id, type: 'control', value })}
/>
```

## Behaviour

- `text`: a labelled text field with `maxLength`.
- `range`: a slider (named after the control label, with `aria-valuetext` including the unit) plus a number field labelled with the unit, for example "Dot spacing in px". The number field keeps an editable draft and commits only valid values; on blur it clamps the draft. With `below`, the maximum follows the related control.
- `colour`: a native colour input plus a labelled hex text field that commits only six-digit hex values.
- `switch`: a `button` with `role="switch"` and `aria-checked`.
- `toggle`: a `button` with `aria-pressed`.
- A control with `when` is shown only while that switch is on. Help texts are linked with `aria-describedby`.
- Field styling copies the canonical `Input` recipe from `src/components/forms/input.tsx`; selected states use `primary-700` (light) and `primary-500` (dark).
