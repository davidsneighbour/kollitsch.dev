// @vitest-environment node
import { describe, expect, it } from 'vitest';
import {
  applyControlChange,
  buildPreviewDocument,
  clampRange,
  effectiveMax,
  escapeRawText,
  HOST_MESSAGE_SOURCE,
  type PlaygroundControl,
  type PlaygroundRangeControl,
  PREVIEW_BASE_URL,
  PREVIEW_MESSAGE_SOURCE,
  parseStateText,
  readPreviewMessage,
  resolveFileReference,
  serialiseState,
  validateState,
} from './code-playground.pure.ts';

const spacing: PlaygroundRangeControl = {
  id: 'dotSpacing',
  label: 'Dot spacing',
  max: 24,
  min: 4,
  step: 1,
  type: 'range',
  unit: 'px',
};

const radius: PlaygroundRangeControl = {
  below: { factor: 0.5, id: 'dotSpacing' },
  id: 'dotRadius',
  label: 'Dot radius',
  max: 5,
  min: 0.5,
  step: 0.5,
  type: 'range',
  unit: 'px',
};

const controls: PlaygroundControl[] = [
  { id: 'text', label: 'Sample text', maxLength: 10, type: 'text' },
  spacing,
  radius,
  { id: 'ink', label: 'Ink', type: 'colour' },
  { id: 'solid', label: 'Solid text', type: 'switch' },
];

const validState = {
  dotRadius: 2,
  dotSpacing: 8,
  ink: '#202020',
  solid: false,
  text: 'HALFTONE',
};

describe('effectiveMax and clampRange', () => {
  it('keeps a dependent value strictly below the related limit', () => {
    expect(effectiveMax(radius, { dotSpacing: 8 })).toBe(3.5);
    expect(effectiveMax(radius, { dotSpacing: 4 })).toBe(1.5);
    expect(effectiveMax(radius, { dotSpacing: 24 })).toBe(5);
  });

  it('never drops below the minimum', () => {
    expect(effectiveMax(radius, { dotSpacing: 1 })).toBe(0.5);
  });

  it('uses the static maximum without a dependency', () => {
    expect(effectiveMax(spacing, {})).toBe(24);
  });

  it('snaps to the step grid and clamps to bounds', () => {
    expect(clampRange(radius, 1.3, { dotSpacing: 8 })).toBe(1.5);
    expect(clampRange(radius, 9, { dotSpacing: 8 })).toBe(3.5);
    expect(clampRange(spacing, 2, {})).toBe(4);
  });
});

describe('validateState and parseStateText', () => {
  it('accepts a valid state', () => {
    expect(validateState(controls, validState).ok).toBe(true);
  });

  it('rejects missing keys and wrong types', () => {
    const missing = validateState(controls, { ...validState, ink: undefined });
    expect(missing.ok).toBe(false);
    const wrongType = validateState(controls, { ...validState, solid: 'no' });
    expect(wrongType).toEqual({
      error: '"solid" must be true or false.',
      ok: false,
    });
  });

  it('rejects out-of-range values instead of clamping them', () => {
    const result = validateState(controls, { ...validState, dotRadius: 4 });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toContain('dotRadius');
  });

  it('rejects malformed colours and long text', () => {
    expect(validateState(controls, { ...validState, ink: 'red' }).ok).toBe(
      false,
    );
    expect(
      validateState(controls, { ...validState, text: 'x'.repeat(11) }).ok,
    ).toBe(false);
  });

  it('reports invalid JSON without throwing', () => {
    const result = parseStateText(controls, '{ "text": ');
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toMatch(/^Invalid JSON:/);
  });

  it('rejects non-object JSON', () => {
    expect(parseStateText(controls, '[]').ok).toBe(false);
  });
});

describe('applyControlChange', () => {
  it('clamps a dependent radius when spacing shrinks', () => {
    const result = applyControlChange(
      controls,
      { ...validState, dotRadius: 3.5 },
      'dotSpacing',
      4,
    );
    expect(result).toEqual({
      ok: true,
      value: { ...validState, dotRadius: 1.5, dotSpacing: 4 },
    });
  });

  it('keeps text literal and preserves key order', () => {
    const result = applyControlChange(controls, validState, 'text', '<script>');
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value['text']).toBe('<script>');
      expect(Object.keys(result.value)).toEqual(Object.keys(validState));
    }
  });

  it('truncates text to the maximum length', () => {
    const result = applyControlChange(
      controls,
      validState,
      'text',
      'x'.repeat(20),
    );
    if (result.ok) expect(result.value['text']).toBe('x'.repeat(10));
  });

  it('rejects unknown controls', () => {
    expect(applyControlChange(controls, validState, 'nope', 1).ok).toBe(false);
  });

  it('serialises with two-space indentation and a final newline', () => {
    expect(serialiseState({ a: 1 })).toBe('{\n  "a": 1\n}\n');
  });
});

describe('resolveFileReference', () => {
  const files = { '/index.js': '', '/styles.css': '' };

  it('resolves relative and root-relative references', () => {
    expect(resolveFileReference('styles.css', files)).toBe('/styles.css');
    expect(resolveFileReference('./styles.css', files)).toBe('/styles.css');
    expect(resolveFileReference('/index.js', files)).toBe('/index.js');
  });

  it('ignores undeclared files and absolute URLs', () => {
    expect(resolveFileReference('other.css', files)).toBeNull();
    expect(resolveFileReference('https://example.com/a.css', files)).toBeNull();
    expect(resolveFileReference('//example.com/a.css', files)).toBeNull();
  });
});

describe('buildPreviewDocument', () => {
  const files = {
    '/index.html':
      '<!doctype html><html><head><link rel="stylesheet" href="styles.css"><script type="module" src="index.js"></script></head><body></body></html>',
    '/index.js': "import s from './state.json' with { type: 'json' };",
    '/state.json': '{"a":1}',
    '/styles.css': 'body { color: red; }',
  };

  const build = (parentOrigin: string | null = 'https://kollitsch.dev') =>
    buildPreviewDocument({
      entry: '/index.html',
      files,
      hooks: ['#sample'],
      instanceId: '2026/post#demo',
      parentOrigin,
      revision: 3,
    });

  it('inlines declared stylesheets and scripts', () => {
    const html = build();
    expect(html).toContain(
      '<style data-playground-file="/styles.css">\nbody { color: red; }\n</style>',
    );
    expect(html).toContain(
      '<script type="module" data-playground-file="/index.js">',
    );
    expect(html).not.toContain('href="styles.css"');
  });

  it('injects policy, base URL, bridge, and import map at the start of head', () => {
    const html = build();
    const head = html.indexOf('<head>');
    expect(html.indexOf('Content-Security-Policy')).toBeGreaterThan(head);
    expect(html).toContain(`<base href="${PREVIEW_BASE_URL}">`);
    expect(html).toContain('"origin":"https://kollitsch.dev"');
    expect(html.indexOf('type="importmap"')).toBeLessThan(
      html.indexOf('type="module"'),
    );
    expect(html).toContain(
      `"./state.json":"data:application/json;charset=utf-8,${encodeURIComponent('{"a":1}')}"`,
    );
  });

  it('disables the bridge without a parent origin', () => {
    expect(build(null)).toContain('"origin":null');
  });

  it('escapes closing tags in inlined code', () => {
    const html = buildPreviewDocument({
      entry: '/index.html',
      files: {
        '/a.js': 'const s = "</script><img onerror=alert(1)>";',
        '/index.html': '<head><script src="a.js"></script></head>',
      },
      hooks: [],
      instanceId: 'x#y',
      parentOrigin: null,
      revision: 0,
    });
    expect(html).not.toContain('"</script><img');
    expect(html).toContain('<\\/script><img');
  });

  it('prepends the injected head when the entry has no head element', () => {
    const html = buildPreviewDocument({
      entry: '/index.html',
      files: { '/index.html': '<p>hi</p>' },
      hooks: [],
      instanceId: 'x#y',
      parentOrigin: null,
      revision: 0,
    });
    expect(html.startsWith('<meta http-equiv="Content-Security-Policy"')).toBe(
      true,
    );
  });

  it('escapes raw text for style elements', () => {
    expect(escapeRawText('a</style>b', 'style')).toBe('a<\\/style>b');
  });
});

describe('readPreviewMessage', () => {
  const base = {
    instance: '2026/post#demo',
    revision: 2,
    source: PREVIEW_MESSAGE_SOURCE,
  };

  it('accepts ready and error messages for the current revision', () => {
    expect(
      readPreviewMessage(
        { ...base, kind: 'ready', missing: [] },
        base.instance,
        2,
      ),
    ).toEqual({ kind: 'ready', missing: [] });
    expect(
      readPreviewMessage(
        { ...base, kind: 'error', message: 'Boom' },
        base.instance,
        2,
      ),
    ).toEqual({ kind: 'error', message: 'Boom' });
  });

  it('rejects stale revisions, other instances, and foreign sources', () => {
    const message = { ...base, kind: 'ready', missing: [] };
    expect(readPreviewMessage(message, base.instance, 3)).toBeNull();
    expect(readPreviewMessage(message, 'other#demo', 2)).toBeNull();
    expect(
      readPreviewMessage(
        { ...message, source: HOST_MESSAGE_SOURCE },
        base.instance,
        2,
      ),
    ).toBeNull();
    expect(readPreviewMessage('ready', base.instance, 2)).toBeNull();
  });

  it('bounds error text length', () => {
    const result = readPreviewMessage(
      { ...base, kind: 'error', message: 'x'.repeat(2000) },
      base.instance,
      2,
    );
    expect(result?.kind === 'error' && result.message.length).toBe(500);
  });
});
