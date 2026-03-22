#!/usr/bin/env node

/**
 * Repository review bundle generator and ToDo linter.
 *
 * Runtime options:
 * 1. `node --experimental-strip-types ai/review/review.ts --write-bundle`
 * 2. `npx tsx ai/review/review.ts --write-bundle`
 */

import { existsSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

type JsonObject = Record<string, unknown>;

type ValidationConfig = {
  always: string[];
  whenChanged: Record<string, string[]>;
};

type RankingConfig = {
  prioritise: string[];
};

type ScanConfig = {
  maxFileBytes: number;
  maxFilesInBundle: number;
  commonInterestingFiles: string[];
  exclude: string[];
};

type ReviewConfig = {
  version: number;
  todoFile: string;
  instructionsFile: string;
  ignoreFile: string;
  doneFile: string;
  templateFile: string;
  bundleOutputFile: string;
  configSchemaFile: string;
  instructionPaths: string[];
  topics: string[];
  validation: ValidationConfig;
  ranking: RankingConfig;
  scan: ScanConfig;
};

type CliOptions = {
  repoRoot: string;
  configPath: string;
  outputPath: string | null;
  writeBundle: boolean;
  inlineContent: boolean;
  lintTodo: boolean;
  verbose: boolean;
  help: boolean;
};

type DiscoveredFile = {
  absolutePath: string;
  relativePath: string;
  size: number;
  kind: 'file' | 'directory';
};

type IncludedFile = {
  relativePath: string;
  size: number;
  content: string;
  truncated: boolean;
};

type TodoItemLint = {
  id: string;
  headingLine: number;
  errors: string[];
  warnings: string[];
};

type TodoLintResult = {
  filePath: string;
  errors: string[];
  warnings: string[];
  items: TodoItemLint[];
};

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const defaultRepoRoot = resolve(__dirname, '..', '..');
const defaultConfigPath = 'ai/review/config.json';
const REQUIRED_TODO_FIELDS = [
  'Status',
  'Origin',
  'Rank',
  'Impact',
  'Effort',
  'Confidence',
  'Authority',
  'Execution mode',
  'References mode',
  'Dependencies'
] as const;
const REQUIRED_TODO_SECTIONS = ['Issue', 'Why it matters', 'References', 'References coverage', 'Action / recommendation'] as const;
const ALLOWED_ORIGINS = new Set(['human', 'ai', 'imported']);
const ALLOWED_STATUSES = new Set(['active', 'in-progress', 'blocked', 'obsolete', 'ignored', 'done']);
const ALLOWED_LEVELS = new Set(['critical', 'high', 'medium', 'low']);
const ALLOWED_EFFORT = new Set(['small', 'medium', 'large']);
const ALLOWED_EXECUTION_MODES = new Set(['autonomous', 'needs-confirmation', 'recommendation-only']);
const ALLOWED_REFERENCES_MODES = new Set(['full', 'sample']);

main();

function main(): void {
  try {
    const options = parseCliArgs(process.argv.slice(2));

    if (options.help) {
      printHelp();
      return;
    }

    const repoRoot = resolve(options.repoRoot);
    const config = loadConfig(resolve(repoRoot, options.configPath));

    if (options.lintTodo) {
      const result = lintTodoFile(resolve(repoRoot, config.todoFile));
      printTodoLintResult(result);
      process.exitCode = result.errors.length > 0 || result.items.some((item) => item.errors.length > 0) ? 1 : 0;
      return;
    }

    const bundle = buildReviewBundle(repoRoot, config, options.inlineContent, options.verbose);

    if (options.writeBundle) {
      const outputPath = resolve(repoRoot, options.outputPath ?? config.bundleOutputFile);
      writeFileSync(outputPath, bundle, 'utf8');
      console.log(`Wrote review bundle to ${outputPath}`);
      return;
    }

    console.log(bundle);
  } catch (error: unknown) {
    reportError(error);
    process.exitCode = 1;
  }
}

function parseCliArgs(args: string[]): CliOptions {
  const options: CliOptions = {
    repoRoot: defaultRepoRoot,
    configPath: defaultConfigPath,
    outputPath: null,
    writeBundle: false,
    inlineContent: false,
    lintTodo: false,
    verbose: false,
    help: false
  };

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];

    switch (arg) {
      case '--help':
        options.help = true;
        break;
      case '--verbose':
        options.verbose = true;
        break;
      case '--inline-content':
        options.inlineContent = true;
        break;
      case '--write-bundle':
        options.writeBundle = true;
        break;
      case '--lint-todo':
        options.lintTodo = true;
        break;
      case '--repo-root':
        options.repoRoot = readRequiredOptionValue(args, index, '--repo-root');
        index += 1;
        break;
      case '--config':
        options.configPath = readRequiredOptionValue(args, index, '--config');
        index += 1;
        break;
      case '--output':
        options.outputPath = readRequiredOptionValue(args, index, '--output');
        index += 1;
        break;
      default:
        throw new Error(`Unknown argument: ${arg}`);
    }
  }

  return options;
}

function printHelp(): void {
  const commandName = relative(process.cwd(), __filename) || 'ai/review/review.ts';

  console.log(`
Usage:
  node --experimental-strip-types ${commandName} [options]
  npx tsx ${commandName} [options]

Options:
  --repo-root <path>   Repository root directory
  --config <path>      Config file path
  --output <path>      Output markdown path
  --write-bundle       Write the bundle to disk instead of stdout
  --inline-content     Embed selected file contents in the bundle
  --lint-todo          Lint ToDo.md for missing fields and invalid values
  --verbose            Show extra diagnostics
  --help               Show this help
`.trim());
}

function readRequiredOptionValue(args: string[], index: number, optionName: string): string {
  const value = args[index + 1];

  if (!value) {
    throw new Error(`Missing value for ${optionName}`);
  }

  return value;
}

function loadConfig(configPath: string): ReviewConfig {
  if (!existsSync(configPath)) {
    throw new Error(`Config file not found: ${configPath}`);
  }

  const rawConfig = JSON.parse(readFileSync(configPath, 'utf8')) as JsonObject;

  return {
    version: readNumber(rawConfig, 'version'),
    todoFile: readString(rawConfig, 'todoFile'),
    instructionsFile: readString(rawConfig, 'instructionsFile'),
    ignoreFile: readString(rawConfig, 'ignoreFile'),
    doneFile: readString(rawConfig, 'doneFile'),
    templateFile: readString(rawConfig, 'templateFile'),
    bundleOutputFile: readString(rawConfig, 'bundleOutputFile'),
    configSchemaFile: readString(rawConfig, 'configSchemaFile'),
    instructionPaths: readStringArray(rawConfig, 'instructionPaths'),
    topics: readStringArray(rawConfig, 'topics'),
    validation: readValidationConfig(rawConfig.validation),
    ranking: readRankingConfig(rawConfig.ranking),
    scan: readScanConfig(rawConfig.scan)
  };
}

function buildReviewBundle(repoRoot: string, config: ReviewConfig, inlineContent: boolean, verbose: boolean): string {
  const todoFile = readOptionalTextFile(resolve(repoRoot, config.todoFile));
  const instructionsFile = readOptionalTextFile(resolve(repoRoot, config.instructionsFile));
  const ignoreFile = readOptionalTextFile(resolve(repoRoot, config.ignoreFile));
  const doneFile = readOptionalTextFile(resolve(repoRoot, config.doneFile));
  const templateFile = readOptionalTextFile(resolve(repoRoot, config.templateFile));
  const schemaFile = readOptionalTextFile(resolve(repoRoot, config.configSchemaFile));
  const todoLintResult = lintTodoFile(resolve(repoRoot, config.todoFile));

  const instructionFiles = discoverInstructionFiles(repoRoot, config.instructionPaths, config.scan.exclude);
  const allFiles = walkRepository(repoRoot, config.scan.exclude);
  const includedFiles = collectInterestingFiles(repoRoot, allFiles, config);

  if (verbose) {
    console.error(`Instruction files found: ${instructionFiles.length}`);
    console.error(`Repository files discovered: ${allFiles.length}`);
    console.error(`Files included in bundle: ${includedFiles.length}`);
  }

  const treeText = formatRepositoryTree(allFiles);
  const instructionFileSections = inlineContent
    ? instructionFiles.map((filePath) => renderFileSection(repoRoot, filePath, config.scan.maxFileBytes)).join('\n\n')
    : renderPathList(repoRoot, instructionFiles);
  const includedFileSections = inlineContent
    ? includedFiles.map((entry) => renderIncludedFileSection(entry)).join('\n\n')
    : renderSelectedFileIndex(includedFiles);

  const bundleParts = [
    '# Repository review bundle',
    '',
    'This file is generated by `ai/review/review.ts`.',
    inlineContent
      ? 'This bundle embeds selected repository content because `--inline-content` was used.'
      : 'This bundle is a compact review manifest. It assumes the reviewing agent already has direct repository access and therefore does not embed file contents.',
    'Give this bundle to the reviewing AI agent together with permission to update `ToDo.md` in the repository.',
    '',
    '## Review task',
    '',
    'Update `ToDo.md` according to `ai/review/instructions.md`, the repository instructions, the current todo state, the ignore and done registries, and the repository context in this bundle.',
    '',
    '## Repository root',
    '',
    `* \`${repoRoot}\``,
    '',
    '## Config summary',
    '',
    ...renderConfigSummary(config),
    '',
    '## Structured config',
    '',
    'The JSON below is the authoritative structured configuration.',
    '',
    '```json',
    JSON.stringify(config, null, 2),
    '```',
    '',
    '## Config schema',
    '',
    inlineContent ? fenceBlock('json', schemaFile ?? '{}') : renderFileReference(config.configSchemaFile, schemaFile),
    '',
    '## ToDo lint status',
    '',
    ...renderTodoLintSummary(todoLintResult),
    '',
    '## Current todo file',
    '',
    inlineContent ? fenceBlock('md', todoFile ?? '_Missing file_') : renderFileReference(config.todoFile, todoFile),
    '',
    '## Review instructions',
    '',
    inlineContent ? fenceBlock('md', instructionsFile ?? '_Missing file_') : renderFileReference(config.instructionsFile, instructionsFile),
    '',
    '## Ignore registry',
    '',
    inlineContent ? fenceBlock('md', ignoreFile ?? '_Missing file_') : renderFileReference(config.ignoreFile, ignoreFile),
    '',
    '## Done registry',
    '',
    inlineContent ? fenceBlock('md', doneFile ?? '_Missing file_') : renderFileReference(config.doneFile, doneFile),
    '',
    '## Todo item template',
    '',
    inlineContent ? fenceBlock('md', templateFile ?? '_Missing file_') : renderFileReference(config.templateFile, templateFile),
    '',
    inlineContent ? '## Discovered instruction files' : '## Discovered instruction files to read',
    '',
    instructionFileSections || '_No additional instruction files found._',
    '',
    '## Repository tree',
    '',
    '```text',
    treeText,
    '```',
    '',
    inlineContent ? '## Selected repository files' : '## Selected repository files to inspect',
    '',
    includedFileSections || '_No selected files found._',
    '',
    '## Output requirements reminder',
    '',
    '* Update `ToDo.md` in place.',
    '* Preserve stable IDs where scope still matches.',
    '* Preserve `Origin` on existing items.',
    '* Use `Origin: ai` on newly created AI items.',
    '* Do not re-add ignored items unless the ignore rule no longer applies.',
    '* Do not invent references or line numbers.',
    '* Include validation requirements derived from config in the output.',
    '* If the ToDo linter reports errors, fix the document structure before adding or updating substantive items.'
  ];

  return `${bundleParts.join('\n')}\n`;
}

function renderConfigSummary(config: ReviewConfig): string[] {
  const whenChangedLines = Object.entries(config.validation.whenChanged)
    .map(([pattern, commands]) => `* \`${pattern}\` -> ${commands.map((command) => `\`${command}\``).join(', ')}`);

  return [
    `* ToDo file: \`${config.todoFile}\``,
    `* Instructions: \`${config.instructionsFile}\``,
    `* Ignore registry: \`${config.ignoreFile}\``,
    `* Done registry: \`${config.doneFile}\``,
    `* Template file: \`${config.templateFile}\``,
    `* Config schema: \`${config.configSchemaFile}\``,
    `* Bundle output: \`${config.bundleOutputFile}\``,
    `* Topics: ${config.topics.map((topic) => `\`${topic}\``).join(', ')}`,
    '* Validation always:',
    ...config.validation.always.map((command) => `  * \`${command}\``),
    '* Validation by changed files:',
    ...(whenChangedLines.length > 0 ? whenChangedLines : ['  * none'])
  ];
}

function lintTodoFile(todoPath: string): TodoLintResult {
  const result: TodoLintResult = {
    filePath: todoPath,
    errors: [],
    warnings: [],
    items: []
  };

  if (!existsSync(todoPath)) {
    result.errors.push(`Missing todo file: ${todoPath}`);
    return result;
  }

  const content = readFileSync(todoPath, 'utf8');
  const lines = content.split(/\r?\n/);
  const idMatches = Array.from(content.matchAll(/^####\s+`([^`]+)`/gm));
  const seenIds = new Set<string>();

  if (!content.includes('## Scope')) {
    result.errors.push('Missing top-level `## Scope` section.');
  }

  if (!content.includes('## Validation requirements')) {
    result.errors.push('Missing top-level `## Validation requirements` section.');
  }

  for (let index = 0; index < idMatches.length; index += 1) {
    const match = idMatches[index];
    const id = match[1];
    const start = match.index ?? 0;
    const end = index + 1 < idMatches.length ? (idMatches[index + 1].index ?? content.length) : content.length;
    const block = content.slice(start, end);
    const headingLine = content.slice(0, start).split(/\r?\n/).length;
    const item: TodoItemLint = {
      id,
      headingLine,
      errors: [],
      warnings: []
    };

    if (seenIds.has(id)) {
      item.errors.push('Duplicate ID.');
    }
    seenIds.add(id);

    if (!/^[a-z0-9]+(?:-[a-z0-9]+)+$/.test(id)) {
      item.warnings.push('ID should be a stable lowercase slug such as `topic-suggestion-slug`.');
    }

    for (const field of REQUIRED_TODO_FIELDS) {
      if (!new RegExp(`^\\* ${escapeRegExp(field)}: `, 'm').test(block)) {
        item.errors.push(`Missing field: ${field}`);
      }
    }

    for (const section of REQUIRED_TODO_SECTIONS) {
      if (!new RegExp(`^\\* ${escapeRegExp(section)}\\s{2,}$`, 'm').test(block)) {
        item.errors.push(`Missing section heading: ${section}`);
      }
    }

    const origin = readTodoField(block, 'Origin');
    const status = readTodoField(block, 'Status');
    const rank = readTodoField(block, 'Rank');
    const impact = readTodoField(block, 'Impact');
    const effort = readTodoField(block, 'Effort');
    const executionMode = readTodoField(block, 'Execution mode');
    const referencesMode = readTodoField(block, 'References mode');

    if (origin !== null && !ALLOWED_ORIGINS.has(origin)) {
      item.errors.push(`Invalid Origin value: ${origin}`);
    }

    if (status !== null && !ALLOWED_STATUSES.has(status)) {
      item.errors.push(`Invalid Status value: ${status}`);
    }

    if (rank !== null && !ALLOWED_LEVELS.has(rank)) {
      item.errors.push(`Invalid Rank value: ${rank}`);
    }

    if (impact !== null && !ALLOWED_LEVELS.has(impact)) {
      item.errors.push(`Invalid Impact value: ${impact}`);
    }

    if (effort !== null && !ALLOWED_EFFORT.has(effort)) {
      item.errors.push(`Invalid Effort value: ${effort}`);
    }

    if (executionMode !== null && !ALLOWED_EXECUTION_MODES.has(executionMode)) {
      item.errors.push(`Invalid Execution mode value: ${executionMode}`);
    }

    if (referencesMode !== null && !ALLOWED_REFERENCES_MODES.has(referencesMode)) {
      item.errors.push(`Invalid References mode value: ${referencesMode}`);
    }

    const previousText = content.slice(0, start);
    const topicHeadingMatches = Array.from(previousText.matchAll(/^###\s+.+$/gm));

    if (topicHeadingMatches.length === 0) {
      item.warnings.push('Item should appear under a topic heading such as `### CI`.');
    }

    result.items.push(item);
  }

  if (idMatches.length === 0) {
    result.warnings.push('No todo items found.');
  }

  return result;
}

function readTodoField(block: string, fieldName: string): string | null {
  const match = block.match(new RegExp(`^\\* ${escapeRegExp(fieldName)}: (.+)$`, 'm'));
  return match ? match[1].trim() : null;
}

function printTodoLintResult(result: TodoLintResult): void {
  console.log(`# ToDo lint result`);
  console.log('');
  console.log(`* File: \`${result.filePath}\``);
  console.log(`* Global errors: ${result.errors.length}`);
  console.log(`* Global warnings: ${result.warnings.length}`);
  console.log(`* Items checked: ${result.items.length}`);
  console.log('');

  if (result.errors.length === 0 && result.warnings.length === 0 && result.items.every((item) => item.errors.length === 0 && item.warnings.length === 0)) {
    console.log('No lint issues found.');
    return;
  }

  for (const error of result.errors) {
    console.log(`ERROR: ${error}`);
  }

  for (const warning of result.warnings) {
    console.log(`WARNING: ${warning}`);
  }

  for (const item of result.items) {
    if (item.errors.length === 0 && item.warnings.length === 0) {
      continue;
    }

    console.log('');
    console.log(`## ${item.id} (line ${item.headingLine})`);

    for (const error of item.errors) {
      console.log(`ERROR: ${error}`);
    }

    for (const warning of item.warnings) {
      console.log(`WARNING: ${warning}`);
    }
  }
}

function renderTodoLintSummary(result: TodoLintResult): string[] {
  const itemErrors = result.items.flatMap((item) => item.errors.map((error) => `* ERROR [${item.id}]: ${error}`));
  const itemWarnings = result.items.flatMap((item) => item.warnings.map((warning) => `* WARNING [${item.id}]: ${warning}`));
  const globalErrors = result.errors.map((error) => `* ERROR: ${error}`);
  const globalWarnings = result.warnings.map((warning) => `* WARNING: ${warning}`);
  const summary = [
    `* Global errors: ${result.errors.length}`,
    `* Global warnings: ${result.warnings.length}`,
    `* Item errors: ${result.items.reduce((count, item) => count + item.errors.length, 0)}`,
    `* Item warnings: ${result.items.reduce((count, item) => count + item.warnings.length, 0)}`
  ];

  const details = [...globalErrors, ...globalWarnings, ...itemErrors, ...itemWarnings];
  return details.length > 0 ? [...summary, '', ...details] : [...summary, '', '* No ToDo lint issues found.'];
}

function discoverInstructionFiles(repoRoot: string, configuredPaths: string[], exclude: string[]): string[] {
  const found = new Set<string>();
  const excludedNames = new Set(exclude);

  for (const configuredPath of configuredPaths) {
    const absolutePath = resolve(repoRoot, configuredPath);

    if (!existsSync(absolutePath)) {
      continue;
    }

    const stats = statSync(absolutePath);

    if (stats.isDirectory()) {
      const nestedEntries = walkRepository(absolutePath, Array.from(excludedNames));

      for (const nestedEntry of nestedEntries) {
        if (nestedEntry.kind !== 'file') {
          continue;
        }

        const nestedFile = nestedEntry.absolutePath;

        if (looksLikeInstructionFile(nestedFile)) {
          found.add(nestedFile);
        }
      }

      continue;
    }

    if (looksLikeInstructionFile(absolutePath)) {
      found.add(absolutePath);
    }
  }

  return Array.from(found).sort((left, right) => left.localeCompare(right));
}

function looksLikeInstructionFile(filePath: string): boolean {
  const lower = filePath.toLowerCase();
  return lower.endsWith('.md') || lower.endsWith('.txt') || lower.endsWith('.json') || lower.endsWith('.yaml') || lower.endsWith('.yml');
}

function walkRepository(rootPath: string, exclude: string[]): DiscoveredFile[] {
  const entries: DiscoveredFile[] = [];
  const excludedNames = new Set(exclude);

  visit(rootPath);

  return entries.sort((left, right) => left.relativePath.localeCompare(right.relativePath));

  function visit(currentPath: string): void {
    const stats = statSync(currentPath);
    const relativePath = relative(rootPath, currentPath) || '.';
    const basename = currentPath.split('/').pop() ?? currentPath;

    if (excludedNames.has(basename)) {
      return;
    }

    if (stats.isDirectory()) {
      entries.push({ absolutePath: currentPath, relativePath, size: stats.size, kind: 'directory' });
      const children = readdirSync(currentPath);
      for (const child of children) {
        visit(join(currentPath, child));
      }
      return;
    }

    entries.push({ absolutePath: currentPath, relativePath, size: stats.size, kind: 'file' });
  }
}

function formatRepositoryTree(entries: DiscoveredFile[]): string {
  return entries.map((entry) => `${entry.kind === 'directory' ? '[dir] ' : '[file]'} ${entry.relativePath}`).join('\n');
}

function collectInterestingFiles(repoRoot: string, entries: DiscoveredFile[], config: ReviewConfig): IncludedFile[] {
  const candidates = entries.filter((entry) => entry.kind === 'file');
  const interesting = new Set<string>();

  for (const hint of config.scan.commonInterestingFiles) {
    const absoluteHintPath = resolve(repoRoot, hint);

    for (const entry of candidates) {
      if (entry.absolutePath === absoluteHintPath || entry.absolutePath.startsWith(`${absoluteHintPath}/`)) {
        interesting.add(entry.absolutePath);
      }
    }
  }

  const selected = Array.from(interesting)
    .map((absolutePath) => candidates.find((entry) => entry.absolutePath === absolutePath))
    .filter((entry): entry is DiscoveredFile => entry !== undefined)
    .slice(0, config.scan.maxFilesInBundle);

  return selected.map((entry) => {
    const raw = readOptionalTextFile(entry.absolutePath) ?? '';
    const truncated = Buffer.byteLength(raw, 'utf8') > config.scan.maxFileBytes;
    const content = truncated ? raw.slice(0, config.scan.maxFileBytes) : raw;

    return {
      relativePath: entry.relativePath,
      size: entry.size,
      content,
      truncated
    };
  });
}

function renderFileReference(relativePath: string, content: string | null): string {
  if (content === null) {
    return `_Missing file: \`${relativePath}\`_`;
  }

  const lineCount = content === '' ? 0 : content.split(/\r?\n/).length;

  return [
    `* Path: \`${relativePath}\``,
    '* Status: present',
    `* Approx. lines: ${lineCount}`,
    '* Action: read this file directly from the repository context before updating `ToDo.md`.'
  ].join('\n');
}

function renderPathList(repoRoot: string, absolutePaths: string[]): string {
  if (absolutePaths.length === 0) {
    return '_No additional instruction files found._';
  }

  return absolutePaths.map((absolutePath) => `* \`${relative(repoRoot, absolutePath)}\``).join('\n');
}

function renderSelectedFileIndex(files: IncludedFile[]): string {
  if (files.length === 0) {
    return '_No selected files found._';
  }

  return files
    .map((file) => {
      const flags = [
        `${file.size} bytes`,
        file.truncated ? 'selected because interesting; read directly from repo; previous inline view would have been truncated' : 'selected because interesting; read directly from repo'
      ];

      return `* \`${file.relativePath}\` - ${flags.join('; ')}`;
    })
    .join('\n');
}

function renderFileSection(repoRoot: string, absolutePath: string, maxFileBytes: number): string {
  const relativePath = relative(repoRoot, absolutePath);
  const raw = readOptionalTextFile(absolutePath) ?? '';
  const truncated = Buffer.byteLength(raw, 'utf8') > maxFileBytes;
  const content = truncated ? raw.slice(0, maxFileBytes) : raw;

  return [`### \`${relativePath}\``, '', truncated ? '_Content truncated due to size limit._' : '', fenceBlock('md', content || '_Empty file_')]
    .filter(Boolean)
    .join('\n');
}

function renderIncludedFileSection(file: IncludedFile): string {
  return [`### \`${file.relativePath}\``, '', `* Size: ${file.size} bytes`, file.truncated ? '* Content: truncated' : '* Content: full', '', fenceBlock('md', file.content || '_Empty file_')].join('\n');
}

function fenceBlock(language: string, content: string): string {
  return [`\`\`\`${language}`, content, '\`\`\`'].join('\n');
}

function readOptionalTextFile(filePath: string): string | null {
  if (!existsSync(filePath)) {
    return null;
  }
  return readFileSync(filePath, 'utf8');
}

function reportError(error: unknown): void {
  if (error instanceof Error) {
    console.error(`[ai-review] ${error.message}`);
    if (error.stack) {
      console.error(error.stack);
    }
    return;
  }

  console.error('[ai-review] Unknown error');
  console.error(error);
}

function readString(object: JsonObject, key: string): string {
  const value = object[key];
  if (typeof value !== 'string') {
    throw new Error(`Expected string for config key "${key}"`);
  }
  return value;
}

function readNumber(object: JsonObject, key: string): number {
  const value = object[key];
  if (typeof value !== 'number') {
    throw new Error(`Expected number for config key "${key}"`);
  }
  return value;
}

function readStringArray(object: JsonObject, key: string): string[] {
  const value = object[key];
  if (!Array.isArray(value) || value.some((entry) => typeof entry !== 'string')) {
    throw new Error(`Expected string array for config key "${key}"`);
  }
  return value;
}

function readValidationConfig(value: unknown): ValidationConfig {
  if (!isJsonObject(value)) {
    throw new Error('Expected object for config key "validation"');
  }

  const always = value.always;
  const whenChanged = value.whenChanged;

  if (!Array.isArray(always) || always.some((entry) => typeof entry !== 'string')) {
    throw new Error('Expected string array for config key "validation.always"');
  }

  if (!isJsonObject(whenChanged)) {
    throw new Error('Expected object for config key "validation.whenChanged"');
  }

  const parsedWhenChanged: Record<string, string[]> = {};

  for (const [pattern, commands] of Object.entries(whenChanged)) {
    if (!Array.isArray(commands) || commands.some((entry) => typeof entry !== 'string')) {
      throw new Error(`Expected string array for config key "validation.whenChanged.${pattern}"`);
    }
    parsedWhenChanged[pattern] = [...commands];
  }

  return { always: [...always], whenChanged: parsedWhenChanged };
}

function readRankingConfig(value: unknown): RankingConfig {
  if (!isJsonObject(value)) {
    throw new Error('Expected object for config key "ranking"');
  }

  const prioritise = value.prioritise;
  if (!Array.isArray(prioritise) || prioritise.some((entry) => typeof entry !== 'string')) {
    throw new Error('Expected string array for config key "ranking.prioritise"');
  }

  return { prioritise: [...prioritise] };
}

function readScanConfig(value: unknown): ScanConfig {
  if (!isJsonObject(value)) {
    throw new Error('Expected object for config key "scan"');
  }

  const maxFileBytes = value.maxFileBytes;
  const maxFilesInBundle = value.maxFilesInBundle;
  const commonInterestingFiles = value.commonInterestingFiles;
  const exclude = value.exclude;

  if (typeof maxFileBytes !== 'number') {
    throw new Error('Expected number for config key "scan.maxFileBytes"');
  }

  if (typeof maxFilesInBundle !== 'number') {
    throw new Error('Expected number for config key "scan.maxFilesInBundle"');
  }

  if (!Array.isArray(commonInterestingFiles) || commonInterestingFiles.some((entry) => typeof entry !== 'string')) {
    throw new Error('Expected string array for config key "scan.commonInterestingFiles"');
  }

  if (!Array.isArray(exclude) || exclude.some((entry) => typeof entry !== 'string')) {
    throw new Error('Expected string array for config key "scan.exclude"');
  }

  return {
    maxFileBytes,
    maxFilesInBundle,
    commonInterestingFiles: [...commonInterestingFiles],
    exclude: [...exclude]
  };
}

function isJsonObject(value: unknown): value is JsonObject {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
