/**
 * Browser-safe helpers for the editable code playground.
 *
 * Everything in this module is pure and dependency free so it can run in the
 * React island, in Astro frontmatter at build time, and in Vitest. Schema
 * validation of authored manifests (which needs zod) lives in
 * `code-playground.schema.ts`; build-time file discovery lives in
 * `code-playground.ts`.
 */

/** A single control declared in an example's `controls.json`. */
export type PlaygroundControl =
  | PlaygroundTextControl
  | PlaygroundRangeControl
  | PlaygroundColourControl
  | PlaygroundSwitchControl
  | PlaygroundToggleControl;

interface PlaygroundControlBase {
  /** State key in `playground-state.json`; also the control's identity. */
  id: string;
  label: string;
  help?: string | undefined;
  /** Show the control only while this boolean state key is `true`. */
  when?: string | undefined;
}

export interface PlaygroundTextControl extends PlaygroundControlBase {
  type: 'text';
  maxLength: number;
}

export interface PlaygroundRangeControl extends PlaygroundControlBase {
  type: 'range';
  min: number;
  max: number;
  step: number;
  unit: string;
  /**
   * Keeps the value strictly below `state[id] * factor`, for example a dot
   * radius that must stay below half of the dot spacing.
   */
  below?: { id: string; factor: number } | undefined;
}

export interface PlaygroundColourControl extends PlaygroundControlBase {
  type: 'colour';
}

export interface PlaygroundSwitchControl extends PlaygroundControlBase {
  type: 'switch';
}

/** A boolean rendered as a toggle button (`aria-pressed`), for example "Pause". */
export interface PlaygroundToggleControl extends PlaygroundControlBase {
  type: 'toggle';
}

export type PlaygroundValue = string | number | boolean;
export type PlaygroundState = Record<string, unknown>;

/** One file of an example, as shipped to the island. */
export interface PlaygroundFile {
  /** Virtual absolute path, for example `/index.html`. */
  path: string;
  code: string;
  readOnly: boolean;
  hidden: boolean;
}

/** Serialisable description of one example, passed from Astro to React. */
export interface PlaygroundDescriptor {
  /** Unique per page: `<leaf>#<example>`. */
  instanceId: string;
  /** Stable DOM id used for the canonical link anchor. */
  anchorId: string;
  title: string;
  description: string;
  entry: string;
  activeFile: string;
  stateFile: string;
  files: PlaygroundFile[];
  controls: PlaygroundControl[];
  /** CSS selectors the preview reports as missing after it loads. */
  hooks: string[];
}

export type ValidationResult<T> =
  | { ok: true; value: T }
  | { ok: false; error: string };

const HEX_COLOUR = /^#[0-9a-f]{6}$/i;

/** Number of decimals in a step, used to avoid floating-point drift. */
function stepDecimals(step: number): number {
  const text = String(step);
  const dot = text.indexOf('.');
  return dot === -1 ? 0 : text.length - dot - 1;
}

function roundTo(value: number, decimals: number): number {
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
}

/**
 * Upper bound of a range control for the given state. With `below`, the bound
 * is the largest value on the step grid that is strictly below
 * `state[below.id] * below.factor`.
 */
export function effectiveMax(
  control: PlaygroundRangeControl,
  state: PlaygroundState,
): number {
  if (!control.below) return control.max;
  const other = state[control.below.id];
  if (typeof other !== 'number' || !Number.isFinite(other)) return control.max;
  const limit = other * control.below.factor;
  const steps = Math.ceil(roundTo((limit - control.min) / control.step, 6)) - 1;
  const bound = roundTo(
    control.min + steps * control.step,
    stepDecimals(control.step),
  );
  return Math.max(control.min, Math.min(control.max, bound));
}

/** Snaps a number to the control's step grid and clamps it to its bounds. */
export function clampRange(
  control: PlaygroundRangeControl,
  value: number,
  state: PlaygroundState,
): number {
  const max = effectiveMax(control, state);
  const snapped =
    control.min +
    Math.round((value - control.min) / control.step) * control.step;
  return roundTo(
    Math.min(max, Math.max(control.min, snapped)),
    stepDecimals(control.step),
  );
}

/**
 * Validates a value for one control. Values are never coerced from other
 * types; a range value outside its bounds is rejected, not clamped, so that
 * hand-edited state JSON reports the problem instead of hiding it.
 */
export function validateControlValue(
  control: PlaygroundControl,
  value: unknown,
  state: PlaygroundState,
): ValidationResult<PlaygroundValue> {
  switch (control.type) {
    case 'text':
      if (typeof value !== 'string') {
        return { error: `"${control.id}" must be a string.`, ok: false };
      }
      if (value.length > control.maxLength) {
        return {
          error: `"${control.id}" must be at most ${control.maxLength} characters.`,
          ok: false,
        };
      }
      return { ok: true, value };
    case 'range': {
      if (typeof value !== 'number' || !Number.isFinite(value)) {
        return { error: `"${control.id}" must be a number.`, ok: false };
      }
      const max = effectiveMax(control, state);
      if (value < control.min || value > max) {
        return {
          error: `"${control.id}" must be between ${control.min} and ${max}${control.unit}.`,
          ok: false,
        };
      }
      return { ok: true, value };
    }
    case 'colour':
      if (typeof value !== 'string' || !HEX_COLOUR.test(value)) {
        return {
          error: `"${control.id}" must be a six-digit hex colour such as #202020.`,
          ok: false,
        };
      }
      return { ok: true, value: value.toLowerCase() };
    case 'switch':
    case 'toggle':
      if (typeof value !== 'boolean') {
        return { error: `"${control.id}" must be true or false.`, ok: false };
      }
      return { ok: true, value };
  }
}

/** Validates a parsed state object against all controls. */
export function validateState(
  controls: readonly PlaygroundControl[],
  value: unknown,
): ValidationResult<PlaygroundState> {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    return { error: 'The state file must contain a JSON object.', ok: false };
  }
  const state = value as PlaygroundState;
  for (const control of controls) {
    if (!(control.id in state)) {
      return { error: `"${control.id}" is missing.`, ok: false };
    }
    const result = validateControlValue(control, state[control.id], state);
    if (!result.ok) return result;
  }
  return { ok: true, value: state };
}

/** Parses and validates the text of the state file. */
export function parseStateText(
  controls: readonly PlaygroundControl[],
  text: string,
): ValidationResult<PlaygroundState> {
  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch (error) {
    const reason = error instanceof Error ? error.message : String(error);
    return { error: `Invalid JSON: ${reason}`, ok: false };
  }
  return validateState(controls, parsed);
}

/** Serialises state the way authored state files are formatted. */
export function serialiseState(state: PlaygroundState): string {
  return `${JSON.stringify(state, null, 2)}\n`;
}

/**
 * Applies a control change to a valid state. Range values are clamped to the
 * step grid and bounds; dependent `below` controls are clamped down when the
 * value they depend on shrinks. Key order of the state object is preserved.
 */
export function applyControlChange(
  controls: readonly PlaygroundControl[],
  state: PlaygroundState,
  id: string,
  value: PlaygroundValue,
): ValidationResult<PlaygroundState> {
  const control = controls.find((candidate) => candidate.id === id);
  if (!control) return { error: `Unknown control "${id}".`, ok: false };

  let next: PlaygroundState = { ...state };
  if (control.type === 'range' && typeof value === 'number') {
    next[id] = clampRange(control, value, next);
  } else if (control.type === 'text' && typeof value === 'string') {
    next[id] = value.slice(0, control.maxLength);
  } else {
    next[id] = value;
  }

  for (const dependent of controls) {
    if (dependent.type !== 'range' || dependent.below?.id !== id) continue;
    const current = next[dependent.id];
    if (typeof current === 'number') {
      next = { ...next, [dependent.id]: clampRange(dependent, current, next) };
    }
  }

  return validateState(controls, next);
}

// MARK: Preview document

/** Origin used as the preview's base URL so relative URLs never reach the site. */
export const PREVIEW_BASE_URL = 'https://playground.invalid/';

/**
 * Content security policy injected into every preview. Reader code may run
 * inline scripts and styles and load `data:` modules, fonts, and images, but
 * cannot make network requests.
 */
export const PREVIEW_CSP = [
  "default-src 'none'",
  "script-src 'unsafe-inline' data:",
  "style-src 'unsafe-inline'",
  'img-src data: blob:',
  'font-src data:',
  'connect-src data:',
  "form-action 'none'",
  "base-uri 'self' https://playground.invalid",
].join('; ');

/** Message `source` values used between the host page and the preview. */
export const PREVIEW_MESSAGE_SOURCE = 'code-playground-preview';
export const HOST_MESSAGE_SOURCE = 'code-playground-host';

/** Upper bound for a single reported error message. */
export const MAX_PREVIEW_MESSAGE_LENGTH = 500;

export interface PreviewDocumentOptions {
  files: Readonly<Record<string, string>>;
  entry: string;
  instanceId: string;
  revision: number;
  /** Origin of the host page. `null` disables the bridge (server rendering). */
  parentOrigin: string | null;
  hooks: readonly string[];
}

export type PreviewMessage =
  | { kind: 'ready'; missing: string[] }
  | { kind: 'error'; message: string };

/** Escapes text so it cannot close the surrounding raw-text element. */
export function escapeRawText(code: string, tag: 'script' | 'style'): string {
  return code.replace(new RegExp(`</(${tag})`, 'gi'), '<\\/$1');
}

/** JSON for embedding in an inline script without breaking out of it. */
function inlineJson(value: unknown): string {
  return JSON.stringify(value).replace(/</g, '\\u003c');
}

/** Resolves a reference such as `styles.css` or `./styles.css` to a file path. */
export function resolveFileReference(
  reference: string,
  files: Readonly<Record<string, string>>,
): string | null {
  const trimmed = reference.trim();
  if (/^[a-z][a-z0-9+.-]*:/i.test(trimmed) || trimmed.startsWith('//')) {
    return null;
  }
  const path = `/${trimmed.replace(/^\.?\//, '')}`;
  return Object.hasOwn(files, path) ? path : null;
}

function readAttribute(tag: string, name: string): string | null {
  const match = new RegExp(
    `\\s${name}\\s*=\\s*(?:"([^"]*)"|'([^']*)'|([^\\s>]+))`,
    'i',
  ).exec(tag);
  if (!match) return null;
  return match[1] ?? match[2] ?? match[3] ?? null;
}

function dataUrl(mime: string, code: string): string {
  return `data:${mime};charset=utf-8,${encodeURIComponent(code)}`;
}

function bridgeScript(options: PreviewDocumentOptions): string {
  const config = {
    hooks: options.hooks,
    host: HOST_MESSAGE_SOURCE,
    instance: options.instanceId,
    max: MAX_PREVIEW_MESSAGE_LENGTH,
    origin: options.parentOrigin,
    revision: options.revision,
    source: PREVIEW_MESSAGE_SOURCE,
  };
  return `(() => {
  const c = ${inlineJson(config)};
  const send = (detail) => {
    if (!c.origin) return;
    try {
      parent.postMessage({ source: c.source, instance: c.instance, revision: c.revision, ...detail }, c.origin);
    } catch {}
  };
  const text = (value) => String(value).slice(0, c.max);
  addEventListener('error', (event) => {
    if (event instanceof ErrorEvent) {
      send({ kind: 'error', message: text(event.message || 'Unknown error') });
    } else if (event.target && event.target !== window) {
      const target = event.target;
      send({ kind: 'error', message: text('Failed to load <' + String(target.tagName || 'resource').toLowerCase() + '>') });
    }
  }, true);
  addEventListener('unhandledrejection', (event) => {
    const reason = event.reason instanceof Error ? event.reason.message : event.reason;
    send({ kind: 'error', message: text('Unhandled rejection: ' + reason) });
  });
  addEventListener('load', () => {
    send({ kind: 'ready', missing: c.hooks.filter((selector) => !document.querySelector(selector)) });
  });
  addEventListener('message', (event) => {
    const data = event.data;
    if (event.source !== parent || !data || data.source !== c.host || data.instance !== c.instance) return;
    if (data.kind === 'visibility') {
      document.documentElement.toggleAttribute('data-playground-hidden', data.visible !== true);
    }
  });
})();`;
}

/**
 * Builds the `srcdoc` document for a preview iframe from an example's files.
 *
 * Stylesheet links and script tags that reference declared files are inlined,
 * JSON and JavaScript files are exposed to module imports through an import
 * map of `data:` URLs, and a policy, base URL, and error bridge are injected at
 * the start of `<head>`. The result runs in an opaque origin
 * (`sandbox="allow-scripts"`), so reader code can neither reach the article
 * nor make network requests.
 */
export function buildPreviewDocument(options: PreviewDocumentOptions): string {
  const { files } = options;
  const entryHtml = files[options.entry] ?? '';

  let html = entryHtml.replace(/<link\b[^>]*>/gi, (tag) => {
    const rel = readAttribute(tag, 'rel');
    const href = readAttribute(tag, 'href');
    if (!rel || !href || !/\bstylesheet\b/i.test(rel)) return tag;
    const path = resolveFileReference(href, files);
    if (!path) return tag;
    return `<style data-playground-file="${path}">\n${escapeRawText(files[path] ?? '', 'style')}\n</style>`;
  });

  html = html.replace(/<script\b[^>]*>\s*<\/script\s*>/gi, (tag) => {
    const src = readAttribute(tag, 'src');
    if (!src) return tag;
    const path = resolveFileReference(src, files);
    if (!path) return tag;
    const type = readAttribute(tag, 'type');
    const typeAttribute = type ? ` type="${type}"` : '';
    return `<script${typeAttribute} data-playground-file="${path}">\n${escapeRawText(files[path] ?? '', 'script')}\n</script>`;
  });

  const imports: Record<string, string> = {};
  for (const [path, code] of Object.entries(files)) {
    if (path.endsWith('.json')) {
      imports[`.${path}`] = dataUrl('application/json', code);
    } else if (path.endsWith('.js') || path.endsWith('.mjs')) {
      imports[`.${path}`] = dataUrl('text/javascript', code);
    }
  }

  const injected = [
    `<meta http-equiv="Content-Security-Policy" content="${PREVIEW_CSP}">`,
    `<base href="${PREVIEW_BASE_URL}">`,
    `<script>${escapeRawText(bridgeScript(options), 'script')}</script>`,
    `<script type="importmap">${escapeRawText(inlineJson({ imports }), 'script')}</script>`,
  ].join('\n');

  if (/<head\b[^>]*>/i.test(html)) {
    return html.replace(/<head\b[^>]*>/i, (tag) => `${tag}\n${injected}`);
  }
  return `${injected}\n${html}`;
}

/**
 * Validates a message received from a preview iframe. Returns `null` for
 * anything that is not a well-formed message for this instance and revision.
 */
export function readPreviewMessage(
  data: unknown,
  instanceId: string,
  revision: number,
): PreviewMessage | null {
  if (typeof data !== 'object' || data === null) return null;
  const message = data as {
    source?: unknown;
    instance?: unknown;
    revision?: unknown;
    kind?: unknown;
    message?: unknown;
    missing?: unknown;
  };
  if (
    message.source !== PREVIEW_MESSAGE_SOURCE ||
    message.instance !== instanceId ||
    message.revision !== revision
  ) {
    return null;
  }
  if (message.kind === 'error' && typeof message.message === 'string') {
    return {
      kind: 'error',
      message: message.message.slice(0, MAX_PREVIEW_MESSAGE_LENGTH),
    };
  }
  if (
    message.kind === 'ready' &&
    Array.isArray(message.missing) &&
    message.missing.every((item) => typeof item === 'string')
  ) {
    return {
      kind: 'ready',
      missing: (message.missing as string[]).slice(0, 20),
    };
  }
  return null;
}
