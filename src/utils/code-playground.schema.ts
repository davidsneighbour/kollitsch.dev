/**
 * Build-time validation of code playground examples.
 *
 * An example lives in `src/content/blog/<leaf>/examples/<example>/` and is
 * described by `playground.json` (manifest) and `controls.json`. This module
 * validates both against the authored files and produces the serialisable
 * `PlaygroundDescriptor` handed to the React island. It has no filesystem or
 * Astro runtime access; `code-playground.ts` supplies the raw files.
 */
import { z } from 'astro/zod';

import {
  type PlaygroundControl,
  type PlaygroundDescriptor,
  type PlaygroundFile,
  parseStateText,
} from './code-playground.pure.ts';

/** Largest accepted size of a single example file, in characters. */
export const MAX_FILE_LENGTH = 64 * 1024;

export const LEAF_PATTERN = /^\d{4}\/[a-z0-9]+(?:-[a-z0-9]+)*$/;
export const EXAMPLE_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/** Relative file names: lowercase segments, no dotfiles, no traversal. */
const FILE_PATH_PATTERN =
  /^[a-z0-9][a-z0-9_-]*(?:\/[a-z0-9][a-z0-9_-]*)*\.(?:html|css|js|json)$/;

const filePath = z
  .string()
  .regex(
    FILE_PATH_PATTERN,
    'File paths must be relative, lowercase, and end in .html, .css, .js, or .json.',
  );

export const manifestSchema = z.strictObject({
  activeFile: filePath,
  controls: filePath,
  description: z.string().min(1),
  entry: filePath,
  files: z
    .array(
      z.strictObject({
        hidden: z.boolean().default(false),
        path: filePath,
        readOnly: z.boolean().default(false),
      }),
    )
    .min(1),
  hooks: z.array(z.string().min(1)).default([]),
  id: z.string().regex(EXAMPLE_PATTERN),
  runtime: z.literal('vanilla'),
  state: filePath,
  title: z.string().min(1),
  version: z.literal(1),
});

export type PlaygroundManifest = z.infer<typeof manifestSchema>;

const controlBase = {
  help: z.string().optional(),
  id: z.string().regex(/^[a-zA-Z][a-zA-Z0-9]*$/),
  label: z.string().min(1),
  when: z.string().optional(),
};

const controlSchema = z.discriminatedUnion('type', [
  z.strictObject({
    ...controlBase,
    maxLength: z.number().int().positive(),
    type: z.literal('text'),
  }),
  z
    .strictObject({
      ...controlBase,
      below: z
        .strictObject({ factor: z.number().positive(), id: z.string() })
        .optional(),
      max: z.number(),
      min: z.number(),
      step: z.number().positive(),
      type: z.literal('range'),
      unit: z.string(),
    })
    .refine((control) => control.min < control.max, {
      message: 'Range controls need min < max.',
    }),
  z.strictObject({ ...controlBase, type: z.literal('colour') }),
  z.strictObject({ ...controlBase, type: z.literal('switch') }),
  z.strictObject({ ...controlBase, type: z.literal('toggle') }),
]);

export const controlsSchema = z.strictObject({
  controls: z.array(controlSchema),
  version: z.literal(1),
});

function formatZodError(error: z.ZodError): string {
  return error.issues
    .map((issue) => `${issue.path.join('.') || '(root)'}: ${issue.message}`)
    .join('; ');
}

function parseJson(text: string, label: string): unknown {
  try {
    return JSON.parse(text);
  } catch (error) {
    const reason = error instanceof Error ? error.message : String(error);
    throw new Error(`${label} is not valid JSON: ${reason}`);
  }
}

/** Checks cross-references between controls. Returns an error or `null`. */
export function checkControlReferences(
  controls: readonly PlaygroundControl[],
): string | null {
  const byId = new Map<string, PlaygroundControl>();
  for (const control of controls) {
    if (byId.has(control.id)) return `Duplicate control id "${control.id}".`;
    byId.set(control.id, control);
  }
  for (const control of controls) {
    if (control.when) {
      const target = byId.get(control.when);
      if (!target || target.type !== 'switch') {
        return `Control "${control.id}" has "when" pointing to "${control.when}", which is not a switch control.`;
      }
    }
    if (control.type === 'range' && control.below) {
      const target = byId.get(control.below.id);
      if (!target || target.type !== 'range' || target.id === control.id) {
        return `Control "${control.id}" has "below" pointing to "${control.below.id}", which is not another range control.`;
      }
    }
  }
  return null;
}

export interface CreateDescriptorInput {
  leaf: string;
  example: string;
  /** Raw file contents keyed by path relative to the example directory. */
  files: Readonly<Record<string, string>>;
}

/**
 * Validates an example and returns its descriptor. Throws an `Error` naming
 * the example and the problem, so a broken example fails the build.
 */
export function createDescriptor(
  input: CreateDescriptorInput,
): PlaygroundDescriptor {
  const label = `Code playground "${input.leaf}#${input.example}"`;
  const fail = (message: string): never => {
    throw new Error(`${label}: ${message}`);
  };

  if (!LEAF_PATTERN.test(input.leaf)) {
    fail('`leaf` must look like "2026/post-slug".');
  }
  if (!EXAMPLE_PATTERN.test(input.example)) {
    fail('`example` must be a lowercase kebab-case directory name.');
  }

  const manifestText = input.files['playground.json'];
  if (manifestText === undefined) fail('playground.json is missing.');

  const manifestResult = manifestSchema.safeParse(
    parseJson(manifestText as string, `${label}: playground.json`),
  );
  if (!manifestResult.success) {
    fail(`playground.json is invalid: ${formatZodError(manifestResult.error)}`);
  }
  const manifest = manifestResult.data as PlaygroundManifest;

  if (manifest.id !== input.example) {
    fail(`manifest id "${manifest.id}" must match the directory name.`);
  }

  const seen = new Set<string>();
  const files: PlaygroundFile[] = manifest.files.map((entry) => {
    if (seen.has(entry.path)) fail(`duplicate file "${entry.path}".`);
    seen.add(entry.path);
    const code = input.files[entry.path];
    if (code === undefined) fail(`declared file "${entry.path}" is missing.`);
    if ((code as string).length > MAX_FILE_LENGTH) {
      fail(`file "${entry.path}" exceeds ${MAX_FILE_LENGTH} characters.`);
    }
    return {
      code: code as string,
      hidden: entry.hidden,
      path: `/${entry.path}`,
      readOnly: entry.readOnly,
    };
  });

  const findFile = (path: string): PlaygroundFile | undefined =>
    files.find((file) => file.path === `/${path}`);

  const entryFile = findFile(manifest.entry);
  if (!entryFile || !manifest.entry.endsWith('.html')) {
    fail(`entry "${manifest.entry}" must be a declared .html file.`);
  }
  const activeFile = findFile(manifest.activeFile);
  if (!activeFile || activeFile.hidden) {
    fail(
      `activeFile "${manifest.activeFile}" must be a declared, visible file.`,
    );
  }
  const stateFile = findFile(manifest.state);
  if (!stateFile || !manifest.state.endsWith('.json')) {
    fail(`state "${manifest.state}" must be a declared .json file.`);
  }

  const controlsText = input.files[manifest.controls];
  if (controlsText === undefined) {
    fail(`controls file "${manifest.controls}" is missing.`);
  }
  const controlsResult = controlsSchema.safeParse(
    parseJson(controlsText as string, `${label}: ${manifest.controls}`),
  );
  if (!controlsResult.success) {
    fail(
      `${manifest.controls} is invalid: ${formatZodError(controlsResult.error)}`,
    );
  }
  const controls = (controlsResult.data as z.infer<typeof controlsSchema>)
    .controls as PlaygroundControl[];

  const referenceError = checkControlReferences(controls);
  if (referenceError) fail(referenceError);

  const stateResult = parseStateText(
    controls,
    (stateFile as PlaygroundFile).code,
  );
  if (!stateResult.ok) fail(`${manifest.state}: ${stateResult.error}`);

  const slug = input.leaf.split('/')[1] ?? input.leaf;

  return {
    activeFile: `/${manifest.activeFile}`,
    anchorId: `playground-${slug}-${input.example}`,
    controls,
    description: manifest.description,
    entry: `/${manifest.entry}`,
    exampleId: input.example,
    files,
    hooks: manifest.hooks,
    instanceId: `${input.leaf}#${input.example}`,
    stateFile: `/${manifest.state}`,
    title: manifest.title,
  };
}
