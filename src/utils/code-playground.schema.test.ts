// @vitest-environment node
import { readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { createDescriptor } from './code-playground.schema.ts';

const manifest = {
  activeFile: 'styles.css',
  controls: 'controls.json',
  description: 'Demo',
  entry: 'index.html',
  files: [
    { path: 'index.html' },
    { path: 'styles.css' },
    { path: 'state.json' },
  ],
  hooks: ['#sample'],
  id: 'demo',
  runtime: 'vanilla',
  state: 'state.json',
  title: 'Demo',
  version: 1,
};

const controls = {
  controls: [
    {
      id: 'size',
      label: 'Size',
      max: 10,
      min: 1,
      step: 1,
      type: 'range',
      unit: 'px',
    },
  ],
  version: 1,
};

const baseFiles = (overrides: Record<string, unknown> = {}) => ({
  'controls.json': JSON.stringify(controls),
  'index.html': '<h1 id="sample">Hi</h1>',
  'playground.json': JSON.stringify({ ...manifest, ...overrides }),
  'state.json': '{ "size": 4 }',
  'styles.css': 'h1 {}',
});

describe('createDescriptor', () => {
  it('builds a serialisable descriptor', () => {
    const descriptor = createDescriptor({
      example: 'demo',
      files: baseFiles(),
      leaf: '2026/my-post',
    });
    expect(descriptor.instanceId).toBe('2026/my-post#demo');
    expect(descriptor.anchorId).toBe('playground-my-post-demo');
    expect(descriptor.entry).toBe('/index.html');
    expect(descriptor.stateFile).toBe('/state.json');
    expect(descriptor.files.map((file) => file.path)).toEqual([
      '/index.html',
      '/styles.css',
      '/state.json',
    ]);
    expect(descriptor.files[0]).toMatchObject({
      hidden: false,
      readOnly: false,
    });
    expect(JSON.parse(JSON.stringify(descriptor))).toEqual(descriptor);
  });

  it('rejects invalid identifiers', () => {
    expect(() =>
      createDescriptor({ example: 'demo', files: baseFiles(), leaf: '../etc' }),
    ).toThrow(/leaf/);
    expect(() =>
      createDescriptor({ example: 'Demo', files: baseFiles(), leaf: '2026/a' }),
    ).toThrow(/example/);
  });

  it('rejects traversal and unsupported file types', () => {
    expect(() =>
      createDescriptor({
        example: 'demo',
        files: baseFiles({ files: [{ path: '../secret.json' }] }),
        leaf: '2026/a',
      }),
    ).toThrow(/playground.json is invalid/);
    expect(() =>
      createDescriptor({
        example: 'demo',
        files: baseFiles({ files: [{ path: '.env.json' }] }),
        leaf: '2026/a',
      }),
    ).toThrow(/playground.json is invalid/);
  });

  it('rejects duplicate and missing files', () => {
    expect(() =>
      createDescriptor({
        example: 'demo',
        files: baseFiles({
          files: [...manifest.files, { path: 'styles.css' }],
        }),
        leaf: '2026/a',
      }),
    ).toThrow(/duplicate file/);
    expect(() =>
      createDescriptor({
        example: 'demo',
        files: baseFiles({ files: [...manifest.files, { path: 'gone.js' }] }),
        leaf: '2026/a',
      }),
    ).toThrow(/"gone.js" is missing/);
  });

  it('rejects a manifest id that does not match the directory', () => {
    expect(() =>
      createDescriptor({
        example: 'other',
        files: baseFiles(),
        leaf: '2026/a',
      }),
    ).toThrow(/must match the directory name/);
  });

  it('rejects a hidden active file and a non-HTML entry', () => {
    expect(() =>
      createDescriptor({
        example: 'demo',
        files: baseFiles({
          files: [
            { path: 'index.html' },
            { hidden: true, path: 'styles.css' },
            { path: 'state.json' },
          ],
        }),
        leaf: '2026/a',
      }),
    ).toThrow(/activeFile/);
    expect(() =>
      createDescriptor({
        example: 'demo',
        files: baseFiles({ entry: 'styles.css' }),
        leaf: '2026/a',
      }),
    ).toThrow(/entry/);
  });

  it('rejects state that does not match the controls', () => {
    expect(() =>
      createDescriptor({
        example: 'demo',
        files: { ...baseFiles(), 'state.json': '{ "size": 40 }' },
        leaf: '2026/a',
      }),
    ).toThrow(/state.json/);
    expect(() =>
      createDescriptor({
        example: 'demo',
        files: { ...baseFiles(), 'state.json': '{' },
        leaf: '2026/a',
      }),
    ).toThrow(/Invalid JSON/);
  });

  it('rejects invalid control references', () => {
    const broken = {
      controls: [
        {
          id: 'size',
          label: 'Size',
          max: 10,
          min: 1,
          step: 1,
          type: 'range',
          unit: 'px',
        },
        { id: 'pause', label: 'Pause', type: 'toggle', when: 'size' },
      ],
      version: 1,
    };
    expect(() =>
      createDescriptor({
        example: 'demo',
        files: {
          ...baseFiles(),
          'controls.json': JSON.stringify(broken),
          'state.json': '{ "size": 4, "pause": false }',
        },
        leaf: '2026/a',
      }),
    ).toThrow(/not a switch control/);
  });

  it('validates every authored example of the test post', () => {
    const leaf = '2026/halftone-typography-with-css';
    const root = path.resolve('src/content/blog', leaf, 'examples');
    for (const example of readdirSync(root)) {
      const directory = path.join(root, example);
      const files = Object.fromEntries(
        readdirSync(directory).map((name) => [
          name,
          readFileSync(path.join(directory, name), 'utf8'),
        ]),
      );
      expect(createDescriptor({ example, files, leaf }).exampleId).toBe(
        example,
      );
    }
  });

  it('validates the authored halftone example', () => {
    const leaf = '2026/halftone-typography-with-css';
    const directory = path.resolve(
      'src/content/blog',
      leaf,
      'examples/halftone',
    );
    const files = Object.fromEntries(
      readdirSync(directory).map((name) => [
        name,
        readFileSync(path.join(directory, name), 'utf8'),
      ]),
    );
    const descriptor = createDescriptor({ example: 'halftone', files, leaf });
    expect(descriptor.controls.map((control) => control.id)).toEqual([
      'text',
      'dotSpacing',
      'dotRadius',
      'typeSize',
      'ink',
      'paper',
      'solid',
      'animate',
      'paused',
    ]);
  });
});
