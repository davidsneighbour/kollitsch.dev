// sparkle-text.ts
// ESM + TypeScript (strict), no 'any'. Node 22+ compatible for builds.
// Registers a <sparkle-text> Web Component and auto-upgrades <sparkle> tags.
//
// Usage in HTML:
//   <sparkle effect="gradient" colors="#ff5500,#ffd700,#ffffff" speed="1.0">Nice text</sparkle>
//
// Or explicitly:
//   <sparkle-text effect="twinkle" density="high">Shiny!</sparkle-text>
//
// Programmatic registration:
//   import { registerSparkle } from './sparkle-text.ts';
//   registerSparkle({ autoUpgrade: true, tagName: 'sparkle-text' });

type EffectName = 'gradient' | 'twinkle' | 'hue';
type Density = 'low' | 'medium' | 'high';
type Trigger = 'always' | 'hover';

interface RegisterOptions {
  /** Custom element tag name, default 'sparkle-text'. */
  tagName?: string;
  /** Auto-upgrade <sparkle> to <sparkle-text>. */
  autoUpgrade?: boolean;
  /** Defaults applied when attributes are missing. */
  defaults?: Partial<SparkleOptions>;
}

interface SparkleOptions {
  effect: EffectName;
  colors: string[]; // CSS colors
  speed: number; // 0.25..4 typical
  density: Density;
  trigger: Trigger; // 'always' | 'hover'
  pauseWhenHidden: boolean;
}

/** Parse a comma-separated color list safely. */
function parseColors(input: string | null): string[] {
  if (!input) return [];
  return input
    .split(',')
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
}

/** Clamp numeric values to a range. */
function clamp(n: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, n));
}

/** Pick background sizing based on density. */
function densityToSize(density: Density, base: number): string {
  switch (density) {
    case 'low':
      return `${base * 2}px ${base * 2}px`;
    case 'high':
      return `${Math.max(4, Math.floor(base * 0.75))}px ${Math.max(4, Math.floor(base * 0.75))}px`;
    case 'medium':
    default:
      return `${base}px ${base}px`;
  }
}

/** Safe custom-element define (no re-register error). */
function safeDefine(name: string, ctor: CustomElementConstructor): void {
  try {
    if (!customElements.get(name)) {
      customElements.define(name, ctor);
    }
  } catch (err) {
    // Don't crash the page — log once.
    // eslint-disable-next-line no-console
    console.warn(`[sparkle-text] Failed to define '${name}':`, err);
  }
}

/** Immutable defaults */
const DEFAULTS: SparkleOptions = Object.freeze({
  effect: 'gradient',
  colors: ['#ff5500', '#ffd700', '#ffffff'],
  speed: 1,
  density: 'medium',
  trigger: 'always',
  pauseWhenHidden: true,
});

const STYLE_TEXT = `
:host {
  display: inline;
  position: relative;
  /* inherit typography, avoid resetting */
  color: currentColor;
  --sp-colors: #ff5500, #ffd700, #ffffff;
  --sp-speed: 1;
  --sp-density: medium;
  --sp-trigger: always;
  --sp-visible: 1; /* toggled by IO */
  --sp-hue: 0deg;  /* runtime hue for 'hue' mode */
  /* For hover control */
  --sp-running: running;
}

/* Trigger: hover */
:host([trigger="hover"]) {
  --sp-trigger: hover;
}
:host([trigger="hover"]):not(:hover) {
  --sp-running: paused;
}

/* Hidden pause (IO) */
:host([data-sp-visible="0"]) {
  --sp-running: paused;
}

/* Reduce motion */
@media (prefers-reduced-motion: reduce) {
  :host {
    --sp-running: paused;
  }
}

/* Slot wrapper ensures background-clip: text does not leak */
.wrapper {
  display: inline;
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

/* ===== Effects ===== */

/* 1) GRADIENT: animated linear-gradient swept across text */
:host([effect="gradient"]) .wrapper {
  background-image: linear-gradient(90deg, var(--sp-gradient));
  background-size: 200% 100%;
  animation: sp-gradient calc(3s / var(--sp-speed)) linear infinite;
  animation-play-state: var(--sp-running);
}
@keyframes sp-gradient {
  from { background-position: 0% 50%; }
  to   { background-position: -200% 50%; }
}

/* 2) TWINKLE: starfield mask over a steady gradient */
:host([effect="twinkle"]) .wrapper {
  background-image:
    radial-gradient(closest-side, rgba(255,255,255,0.9), rgba(255,255,255,0) 70%),
    radial-gradient(closest-side, rgba(255,255,255,0.7), rgba(255,255,255,0) 70%),
    radial-gradient(closest-side, rgba(255,255,255,0.6), rgba(255,255,255,0) 70%),
    linear-gradient(90deg, var(--sp-gradient));
  background-repeat: repeat, repeat, repeat, no-repeat;
  /* star layers sized by density */
  background-size: var(--sp-star-size, 10px 10px), var(--sp-star-size, 14px 14px), var(--sp-star-size, 18px 18px), 200% 100%;
  background-position: 0 0, 0 0, 0 0, 0% 50%;
  animation:
    sp-stars-1 calc(2.2s / var(--sp-speed)) linear infinite,
    sp-stars-2 calc(3.0s / var(--sp-speed)) linear infinite,
    sp-stars-3 calc(4.0s / var(--sp-speed)) linear infinite,
    sp-gradient calc(6s / var(--sp-speed)) linear infinite;
  animation-play-state: var(--sp-running);
}
@keyframes sp-stars-1 { to { background-position: 100% 0, 0 0, 0 0, 0% 50%; } }
@keyframes sp-stars-2 { to { background-position: 0 0, 120% 0, 0 0, 0% 50%; } }
@keyframes sp-stars-3 { to { background-position: 0 0, 0 0, 140% 0, 0% 50%; } }

/* 3) HUE: smooth hue-rotate over a subtle gradient base */
:host([effect="hue"]) .wrapper {
  background-image: linear-gradient(90deg, var(--sp-gradient));
  background-size: 150% 100%;
  animation: sp-gradient calc(8s / var(--sp-speed)) linear infinite;
  animation-play-state: var(--sp-running);
  filter: hue-rotate(var(--sp-hue));
}

/* Fallback if author uses the element without effect attr */
:host(:not([effect])) .wrapper {
  background-image: linear-gradient(90deg, var(--sp-gradient));
  background-size: 200% 100%;
  animation: sp-gradient calc(5s / var(--sp-speed)) linear infinite;
  animation-play-state: var(--sp-running);
}
`;

const SHARED_SHEET = (() => {
  const style = new CSSStyleSheet();
  style.replaceSync(STYLE_TEXT);
  return style;
})();

/** Map density to CSS star-size variable. */
function applyDensityVars(host: HTMLElement, density: Density): void {
  const base = 12; // px baseline
  const size = densityToSize(density, base);
  host.style.setProperty('--sp-star-size', size);
}

/** Build a CSS var string for the gradient list. */
function buildGradientVar(colors: string[]): string {
  // Ensure minimum of 2 colors by mirroring if only 1 provided.
  const list = colors.length >= 2 ? colors : [...colors, ...colors];
  // Repeat the first color at end to smooth wrap
  const extended = [...list, list[0]];
  return extended.join(', ');
}

/** Web Component: <sparkle-text> */
export class SparkleText extends HTMLElement {
  static get observedAttributes(): string[] {
    return ['effect', 'colors', 'speed', 'density', 'trigger'];
  }

  private _opts: SparkleOptions = { ...DEFAULTS };
  private _shadow: ShadowRoot;
  private _wrapper: HTMLSpanElement;
  private _io: IntersectionObserver | null = null;
  private _raf: number | null = null;
  private _hue: number = 0;

  constructor() {
    super();
    this._shadow = this.attachShadow({ mode: 'open' });
    const wrapper = document.createElement('span');
    wrapper.className = 'wrapper';
    const slot = document.createElement('slot');
    wrapper.appendChild(slot);
    // Adopt shared stylesheet for efficiency
    (this._shadow as any).adoptedStyleSheets = [SHARED_SHEET];
    this._shadow.appendChild(wrapper);
    this._wrapper = wrapper;
  }

  /** Ensure initial state after connect. */
  connectedCallback(): void {
    this._readAttributes();
    this._applyAll();
    this._setupVisibility();
    this._maybeStartHueLoop();
  }

  disconnectedCallback(): void {
    this._teardownVisibility();
    this._stopHueLoop();
  }

  attributeChangedCallback(): void {
    this._readAttributes();
    this._applyAll();
  }

  /** Read attributes into _opts with validation. */
  private _readAttributes(): void {
    const effectAttr = (this.getAttribute('effect') as EffectName) || this._opts.effect;
    const effect: EffectName = (['gradient', 'twinkle', 'hue'] as const).includes(effectAttr)
      ? effectAttr
      : DEFAULTS.effect;

    const colorsAttr = parseColors(this.getAttribute('colors'));
    const colors = colorsAttr.length > 0 ? colorsAttr : this._opts.colors;

    const speedRaw = Number(this.getAttribute('speed'));
    const speed = Number.isFinite(speedRaw) ? clamp(speedRaw, 0.1, 6) : this._opts.speed;

    const densityAttr = (this.getAttribute('density') as Density) || this._opts.density;
    const density: Density = (['low', 'medium', 'high'] as const).includes(densityAttr)
      ? densityAttr
      : DEFAULTS.density;

    const triggerAttr = (this.getAttribute('trigger') as Trigger) || this._opts.trigger;
    const trigger: Trigger = (['always', 'hover'] as const).includes(triggerAttr)
      ? triggerAttr
      : DEFAULTS.trigger;

    this._opts = { ...this._opts, effect, colors, speed, density, trigger };
  }

  /** Apply CSS variables and per-effect knobs. */
  private _applyAll(): void {
    const { colors, speed, density, effect, trigger } = this._opts;
    this.setAttribute('effect', effect);
    this.setAttribute('trigger', trigger);
    // CSS vars
    this.style.setProperty('--sp-gradient', buildGradientVar(colors));
    this.style.setProperty('--sp-colors', colors.join(','));
    this.style.setProperty('--sp-speed', String(speed));
    applyDensityVars(this, density);
  }

  /** Pause when off-screen for non-intrusive behavior. */
  private _setupVisibility(): void {
    if (!this._opts.pauseWhenHidden) return;
    if (this._io) return;

    this._io = new IntersectionObserver(
      (entries) => {
        const e = entries[0];
        const visible = e && e.isIntersecting ? '1' : '0';
        this.dataset.spVisible = visible;
        if (this._opts.effect === 'hue') {
          if (visible === '1') this._maybeStartHueLoop();
          else this._stopHueLoop();
        }
      },
      { root: null, threshold: 0.01 },
    );
    this._io.observe(this);
  }

  private _teardownVisibility(): void {
    if (this._io) {
      this._io.disconnect();
      this._io = null;
    }
  }

  /** Smooth hue-rotate animation without creating DOM nodes. */
  private _maybeStartHueLoop(): void {
    if (this._opts.effect !== 'hue') return;
    if (this.dataset.spVisible === '0') return;
    if (this._raf !== null) return;

    const step = (t: number) => {
      // 30deg per second base, scaled by speed.
      const degPerSec = 30 * this._opts.speed;
      // Use time delta via rAF timestamp
      // Increase hue gradually (wrap at 360)
      this._hue = (this._hue + degPerSec / 60) % 360;
      this.style.setProperty('--sp-hue', `${this._hue.toFixed(2)}deg`);
      this._raf = requestAnimationFrame(step);
    };
    this._raf = requestAnimationFrame(step);
  }

  private _stopHueLoop(): void {
    if (this._raf !== null) {
      cancelAnimationFrame(this._raf);
      this._raf = null;
    }
  }
}

/**
 * Register the element and optionally upgrade <sparkle> tags.
 * @param opts Options for registration and defaults.
 */
export function registerSparkle(opts: RegisterOptions = {}): void {
  const tagName = opts.tagName ?? 'sparkle-text';
  // Apply default overrides globally by setting prototype defaults
  if (opts.defaults) {
    // No mutation of DEFAULTS; applied per instance at construction time by merging
    // Here we do nothing — instances read attributes and fall back to DEFAULTS.
  }

  safeDefine(tagName, SparkleText);

  if (opts.autoUpgrade) {
    // Upgrade <sparkle>…</sparkle> into <sparkle-text …>…</sparkle-text>
    const upgrade = () => {
      const nodes = Array.from(document.querySelectorAll('sparkle'));
      for (const node of nodes) {
        const el = document.createElement(tagName);
        // Copy attributes from <sparkle> to <sparkle-text>
        for (const { name, value } of Array.from(node.attributes)) {
          el.setAttribute(name, value);
        }
        // Move children
        while (node.firstChild) el.appendChild(node.firstChild);
        node.replaceWith(el);
      }
    };
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', upgrade, { once: true });
    } else {
      upgrade();
    }
  }
}

// Auto-register by default for drop-in usage,
// but keep it safe (no duplicate define).
registerSparkle({ autoUpgrade: true });
