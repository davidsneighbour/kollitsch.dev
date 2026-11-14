/**
 * Browser-safe helpers for the editable code playground.
 *
 * Everything in this module is pure and browser safe so it can run in the
 * React island, in Astro frontmatter at build time, and in Vitest. Schema
 * validation of authored manifests (which needs zod) lives in
 * `code-playground.schema.ts`; build-time file discovery lives in
 * `code-playground.ts`.
 */

import { type DefaultTreeAdapterTypes, parse } from 'parse5';

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
  /** Example directory name; prefixes this example's keys in the URL hash. */
  exampleId: string;
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

// MARK: URL settings

/**
 * Control settings are kept in the URL hash as URL search parameters named
 * `<exampleId>.<controlId>`, for example `#halftone.dotSpacing=14&stripes.angle=30`.
 * Only values that differ from the authored state are written, so the hash
 * records exactly the settings a reader applied. The hash never reaches the
 * server or analytics, and several playgrounds can share one page.
 */

/** Returns the hash as parameters, or `null` when it is a plain anchor. */
export function readHashParams(hash: string): URLSearchParams | null {
  const raw = hash.startsWith('#') ? hash.slice(1) : hash;
  if (!raw.includes('=')) return null;
  return new URLSearchParams(raw);
}

/** Text form of one control value in the URL. */
export function encodeControlValue(
  control: PlaygroundControl,
  value: unknown,
): string | null {
  switch (control.type) {
    case 'text':
      return typeof value === 'string' ? value : null;
    case 'range':
      return typeof value === 'number' && Number.isFinite(value)
        ? String(value)
        : null;
    case 'colour':
      return typeof value === 'string' && HEX_COLOUR.test(value)
        ? value.slice(1).toLowerCase()
        : null;
    case 'switch':
    case 'toggle':
      return typeof value === 'boolean' ? (value ? '1' : '0') : null;
  }
}

/** Parses one URL value for a control. Returns `undefined` when invalid. */
export function decodeControlValue(
  control: PlaygroundControl,
  text: string,
): PlaygroundValue | undefined {
  switch (control.type) {
    case 'text':
      return text.slice(0, control.maxLength);
    case 'range': {
      if (text.trim() === '') return undefined;
      const number = Number(text);
      return Number.isFinite(number) ? number : undefined;
    }
    case 'colour':
      return /^#?[0-9a-f]{6}$/i.test(text)
        ? `#${text.replace(/^#/, '').toLowerCase()}`
        : undefined;
    case 'switch':
    case 'toggle':
      if (text === '1' || text === 'true') return true;
      if (text === '0' || text === 'false') return false;
      return undefined;
  }
}

/**
 * URL entries for every control whose value differs from the defaults, in
 * control order. Keys are prefixed with the example id.
 */
export function encodeSettings(
  exampleId: string,
  controls: readonly PlaygroundControl[],
  defaults: PlaygroundState,
  state: PlaygroundState,
): Array<[string, string]> {
  const entries: Array<[string, string]> = [];
  for (const control of controls) {
    if (state[control.id] === defaults[control.id]) continue;
    const text = encodeControlValue(control, state[control.id]);
    if (text !== null) entries.push([`${exampleId}.${control.id}`, text]);
  }
  return entries;
}

/**
 * Applies this example's URL settings to the defaults. Values are decoded,
 * then applied in control order through `applyControlChange`, so ranges are
 * clamped and dependent bounds hold. Unknown keys and invalid values are
 * ignored. Returns `null` when the URL holds no settings for the example.
 */
export function decodeSettings(
  exampleId: string,
  controls: readonly PlaygroundControl[],
  defaults: PlaygroundState,
  params: URLSearchParams,
): PlaygroundState | null {
  let state = defaults;
  let found = false;
  for (const control of controls) {
    const text = params.get(`${exampleId}.${control.id}`);
    if (text === null) continue;
    found = true;
    const value = decodeControlValue(control, text);
    if (value === undefined) continue;
    const next = applyControlChange(controls, state, control.id, value);
    if (next.ok) state = next.value;
  }
  return found ? state : null;
}

/**
 * Returns the new hash after replacing this example's entries. Other
 * examples' entries are kept; a plain anchor is replaced. Returns `''` when
 * nothing is left.
 */
export function updateHash(
  hash: string,
  exampleId: string,
  entries: ReadonlyArray<[string, string]>,
): string {
  const params = readHashParams(hash) ?? new URLSearchParams();
  for (const key of [...params.keys()]) {
    if (key.startsWith(`${exampleId}.`)) params.delete(key);
  }
  for (const [key, value] of entries) params.append(key, value);
  const text = params.toString();
  return text === '' ? '' : `#${text}`;
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

  // Match the browser's HTML parser, including malformed end tags, quoted
  // attributes, comments, and raw-text elements. Keep unrelated source intact.
  const document = parse(entryHtml, { sourceCodeLocationInfo: true });
  const edits: { start: number; end: number; text: string }[] = [];
  let headEnd: number | undefined;
  const attribute = (
    node: DefaultTreeAdapterTypes.Element,
    name: string,
  ): string | undefined => node.attrs.find((item) => item.name === name)?.value;
  const escapeAttribute = (value: string): string =>
    value.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

  const visit = (node: DefaultTreeAdapterTypes.Node): void => {
    if ('tagName' in node) {
      const location = node.sourceCodeLocation;
      if (node.tagName === 'head') headEnd = location?.startTag?.endOffset;
      let replacement: string | undefined;
      if (node.tagName === 'link' && location) {
        const rel = attribute(node, 'rel');
        const href = attribute(node, 'href');
        const path =
          href && rel?.toLowerCase().split(/\s+/).includes('stylesheet')
            ? resolveFileReference(href, files)
            : null;
        if (path)
          replacement = `<style data-playground-file="${escapeAttribute(path)}">\n${escapeRawText(files[path] ?? '', 'style')}\n</style>`;
      } else if (
        node.tagName === 'script' &&
        location?.endTag &&
        node.childNodes.every(
          (child) => 'value' in child && child.value.trim() === '',
        )
      ) {
        const src = attribute(node, 'src');
        const path = src ? resolveFileReference(src, files) : null;
        if (path) {
          const type = attribute(node, 'type');
          const typeAttribute = type ? ` type="${escapeAttribute(type)}"` : '';
          replacement = `<script${typeAttribute} data-playground-file="${escapeAttribute(path)}">\n${escapeRawText(files[path] ?? '', 'script')}\n</script>`;
        }
      }
      if (replacement !== undefined && location) {
        edits.push({
          end: location.endOffset,
          start: location.startOffset,
          text: replacement,
        });
        return;
      }
    }
    if ('childNodes' in node) for (const child of node.childNodes) visit(child);
  };
  visit(document);

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

  const insertion = headEnd ?? 0;
  edits.push({
    end: insertion,
    start: insertion,
    text: headEnd === undefined ? injected + '\n' : '\n' + injected,
  });
  let html = entryHtml;
  for (const edit of edits.sort((a, b) => b.start - a.start)) {
    html = html.slice(0, edit.start) + edit.text + html.slice(edit.end);
  }
  return html;
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
