import { Input } from '@components/forms/input.tsx';
import {
  effectiveMax,
  type PlaygroundControl,
  type PlaygroundRangeControl,
  type PlaygroundState,
  type PlaygroundValue,
} from '@utils/code-playground.pure.ts';
import { cn } from '@utils/shadcn-utils';
import { type ReactElement, useEffect, useState } from 'react';

export interface PlaygroundControlsProps {
  /** Prefix for element ids, unique per playground on the page. */
  idPrefix: string;
  controls: readonly PlaygroundControl[];
  /** Last valid state; controls always display these values. */
  state: PlaygroundState;
  /** Disables every control, for example while the state file is invalid. */
  disabled: boolean;
  onChange: (id: string, value: PlaygroundValue) => void;
}

const HEX_COLOUR = /^#[0-9a-f]{6}$/i;

const labelClass = 'text-sm font-normal text-foreground';
const helpClass = 'text-xs text-gray-600 dark:text-gray-400';

function Help({
  id,
  text,
}: {
  id: string;
  text: string | undefined;
}): ReactElement | null {
  if (!text) return null;
  return (
    <p id={id} className={helpClass}>
      {text}
    </p>
  );
}

/** Number field that keeps an editable draft until the value is valid. */
function NumberField({
  id,
  control,
  value,
  max,
  disabled,
  describedBy,
  onCommit,
}: {
  id: string;
  control: PlaygroundRangeControl;
  value: number;
  max: number;
  disabled: boolean;
  describedBy: string | undefined;
  onCommit: (value: number) => void;
}): ReactElement {
  const [draft, setDraft] = useState(String(value));
  useEffect(() => setDraft(String(value)), [value]);
  const parsed = Number(draft);
  const invalid =
    draft.trim() === '' ||
    !Number.isFinite(parsed) ||
    parsed < control.min ||
    parsed > max;

  return (
    <div className="flex items-center gap-1.5">
      <Input
        id={id}
        type="number"
        inputMode="decimal"
        min={control.min}
        max={max}
        step={control.step}
        value={draft}
        disabled={disabled}
        aria-invalid={invalid || undefined}
        aria-describedby={describedBy}
        className="h-8 w-20 tabular-nums"
        onChange={(event) => {
          const next = event.target.value;
          setDraft(next);
          const number = Number(next);
          if (
            next.trim() !== '' &&
            Number.isFinite(number) &&
            number >= control.min &&
            number <= max
          ) {
            onCommit(number);
          }
        }}
        onBlur={() => {
          if (invalid) {
            const number = Number.isFinite(parsed) ? parsed : value;
            onCommit(Math.min(max, Math.max(control.min, number)));
            setDraft(String(value));
          }
        }}
      />
      <span
        className="text-sm text-gray-600 dark:text-gray-400"
        aria-hidden="true"
      >
        {control.unit}
      </span>
    </div>
  );
}

/** Hex text field paired with a native colour input. */
function ColourField({
  id,
  label,
  value,
  disabled,
  describedBy,
  onCommit,
}: {
  id: string;
  label: string;
  value: string;
  disabled: boolean;
  describedBy: string | undefined;
  onCommit: (value: string) => void;
}): ReactElement {
  const [draft, setDraft] = useState(value);
  useEffect(() => setDraft(value), [value]);
  const invalid = !HEX_COLOUR.test(draft);

  return (
    <div className="flex items-center gap-2">
      <input
        id={id}
        type="color"
        value={value}
        disabled={disabled}
        aria-describedby={describedBy}
        className="h-8 w-10 cursor-pointer rounded-md border border-input bg-transparent p-0.5 disabled:cursor-not-allowed disabled:opacity-50"
        onChange={(event) => onCommit(event.target.value.toLowerCase())}
      />
      <Input
        type="text"
        aria-label={`${label} hex value`}
        spellCheck={false}
        maxLength={7}
        value={draft}
        disabled={disabled}
        aria-invalid={invalid || undefined}
        aria-describedby={describedBy}
        className="h-8 w-24 font-mono"
        onChange={(event) => {
          const next = event.target.value.trim();
          setDraft(next);
          if (HEX_COLOUR.test(next)) onCommit(next.toLowerCase());
        }}
        onBlur={() => setDraft(value)}
      />
    </div>
  );
}

/**
 * Schema-driven controls for a code playground. Every control writes one key
 * of the playground's state file through `onChange`; the controls never read
 * computed CSS or edited source.
 */
export function PlaygroundControls({
  idPrefix,
  controls,
  state,
  disabled,
  onChange,
}: PlaygroundControlsProps): ReactElement {
  return (
    <fieldset
      disabled={disabled}
      className="grid min-w-0 gap-x-6 gap-y-4 sm:grid-cols-2"
    >
      <legend className="sr-only">Example controls</legend>
      {controls.map((control) => {
        if (control.when && state[control.when] !== true) return null;
        const id = `${idPrefix}-${control.id}`;
        const helpId = control.help ? `${id}-help` : undefined;
        const value = state[control.id];

        switch (control.type) {
          case 'text':
            return (
              <div key={control.id} className="grid gap-1.5 sm:col-span-2">
                <label htmlFor={id} className={labelClass}>
                  {control.label}
                </label>
                <Input
                  id={id}
                  type="text"
                  maxLength={control.maxLength}
                  value={typeof value === 'string' ? value : ''}
                  aria-describedby={helpId}
                  className="h-8"
                  onChange={(event) => onChange(control.id, event.target.value)}
                />
                <Help id={`${id}-help`} text={control.help} />
              </div>
            );
          case 'range': {
            const max = effectiveMax(control, state);
            const number = typeof value === 'number' ? value : control.min;
            return (
              <div key={control.id} className="grid gap-1.5">
                <label htmlFor={id} className={labelClass}>
                  {control.label}
                  <span className="sr-only"> in {control.unit}</span>
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    aria-label={control.label}
                    aria-valuetext={`${number} ${control.unit}`}
                    min={control.min}
                    max={max}
                    step={control.step}
                    value={number}
                    aria-describedby={helpId}
                    className="min-w-0 flex-1 accent-primary-700 dark:accent-primary-500"
                    onChange={(event) =>
                      onChange(control.id, Number(event.target.value))
                    }
                  />
                  <NumberField
                    id={id}
                    control={control}
                    value={number}
                    max={max}
                    disabled={disabled}
                    describedBy={helpId}
                    onCommit={(next) => onChange(control.id, next)}
                  />
                </div>
                <Help id={`${id}-help`} text={control.help} />
              </div>
            );
          }
          case 'colour':
            return (
              <div key={control.id} className="grid gap-1.5">
                <label htmlFor={id} className={labelClass}>
                  {control.label}
                </label>
                <ColourField
                  id={id}
                  label={control.label}
                  value={typeof value === 'string' ? value : '#000000'}
                  disabled={disabled}
                  describedBy={helpId}
                  onCommit={(next) => onChange(control.id, next)}
                />
                <Help id={`${id}-help`} text={control.help} />
              </div>
            );
          case 'switch': {
            const checked = value === true;
            return (
              <div key={control.id} className="grid content-start gap-1.5">
                <button
                  id={id}
                  type="button"
                  role="switch"
                  aria-checked={checked}
                  aria-describedby={helpId}
                  className="group inline-flex w-fit items-center gap-3 rounded-md py-1 text-sm text-foreground outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:opacity-50"
                  onClick={() => onChange(control.id, !checked)}
                >
                  <span
                    aria-hidden="true"
                    className={cn(
                      'relative inline-flex h-5 w-9 shrink-0 rounded-full border border-input transition-colors duration-150 motion-reduce:transition-none',
                      checked
                        ? 'border-primary-700 bg-primary-700 dark:border-primary-500 dark:bg-primary-500'
                        : 'bg-gray-200 dark:bg-gray-700',
                    )}
                  >
                    <span
                      className={cn(
                        'absolute top-0.5 left-0.5 size-3.5 rounded-full bg-white transition-transform duration-150 motion-reduce:transition-none',
                        checked && 'translate-x-4',
                      )}
                    />
                  </span>
                  {control.label}
                </button>
                <Help id={`${id}-help`} text={control.help} />
              </div>
            );
          }
          case 'toggle': {
            const pressed = value === true;
            return (
              <div key={control.id} className="grid content-start gap-1.5">
                <button
                  id={id}
                  type="button"
                  aria-pressed={pressed}
                  aria-describedby={helpId}
                  className={cn(
                    'inline-flex h-8 w-fit items-center rounded-md border px-3 text-sm outline-none transition-colors duration-150 focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:opacity-50 motion-reduce:transition-none',
                    pressed
                      ? 'border-primary-700 bg-primary-700 text-white dark:border-primary-500 dark:bg-primary-500 dark:text-gray-950'
                      : 'border-input text-foreground hover:bg-black/5 dark:hover:bg-white/5',
                  )}
                  onClick={() => onChange(control.id, !pressed)}
                >
                  {control.label}
                </button>
                <Help id={`${id}-help`} text={control.help} />
              </div>
            );
          }
        }
      })}
    </fieldset>
  );
}
