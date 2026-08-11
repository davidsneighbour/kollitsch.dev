#!/usr/bin/env node
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

type ValeSeverity = 'error' | 'warning' | 'suggestion';

type ValeIssue = {
  Check: string;
  Line: number;
  Match: string;
  Message: string;
  Severity: ValeSeverity;
  Span?: [number, number];
};

type ValeJson = Record<string, ValeIssue[]>;

type NormalizedIssue = {
  absolutePath: string;
  check: string;
  column: number;
  file: string;
  line: number;
  match: string;
  message: string;
  severity: ValeSeverity;
};

type Options = {
  config: string;
  html: string;
  input?: string;
  json: string;
  target: string;
};

const DEFAULT_OPTIONS: Options = {
  config: 'src/config/.vale.ini',
  html: 'scratch/vale/vale-blog.html',
  json: 'scratch/vale/vale-blog.json',
  target: 'src/content/blog',
};

const SEVERITY_ORDER: Record<ValeSeverity, number> = {
  error: 0,
  warning: 1,
  suggestion: 2,
};

function parseArgs(argv: string[]): Options {
  const options = { ...DEFAULT_OPTIONS };

  for (const arg of argv) {
    const [name, value] = arg.split('=', 2);

    if (name === '--config' && value) {
      options.config = value;
      continue;
    }

    if (name === '--html' && value) {
      options.html = value;
      continue;
    }

    if (name === '--input' && value) {
      options.input = value;
      continue;
    }

    if (name === '--json' && value) {
      options.json = value;
      continue;
    }

    if (name === '--target' && value) {
      options.target = value;
      continue;
    }

    if (name === '--help') {
      printHelp();
      process.exit(0);
    }

    throw new Error(`Unknown argument: ${arg}`);
  }

  return options;
}

function printHelp(): void {
  console.log(`
Usage:
  node src/scripts/linting/vale-report.ts [options]

Options:
  --target=PATH   Content path to scan with Vale.
                  Default: ${DEFAULT_OPTIONS.target}
  --config=PATH   Vale config path.
                  Default: ${DEFAULT_OPTIONS.config}
  --json=PATH     Raw Vale JSON output path.
                  Default: ${DEFAULT_OPTIONS.json}
  --html=PATH     HTML report output path.
                  Default: ${DEFAULT_OPTIONS.html}
  --input=PATH    Parse an existing Vale JSON file instead of running Vale.
  --help          Show this help.
`.trim());
}

function ensureParentDirectory(filePath: string): void {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
}

function runVale(options: Options): string {
  const result = spawnSync(
    'vale',
    [
      '--config',
      options.config,
      '--no-exit',
      '--output=JSON',
      options.target,
    ],
    {
      encoding: 'utf8',
      maxBuffer: 1024 * 1024 * 80,
    }
  );

  if (result.error) {
    throw result.error;
  }

  if (result.status !== 0) {
    throw new Error(result.stderr.trim() || `Vale exited with ${result.status}`);
  }

  if (result.stderr.trim()) {
    console.warn(result.stderr.trim());
  }

  return result.stdout.trim() || '{}';
}

function readValeJson(options: Options): string {
  if (options.input) {
    return fs.readFileSync(options.input, 'utf8');
  }

  const output = runVale(options);
  ensureParentDirectory(options.json);
  fs.writeFileSync(options.json, `${output}\n`);
  return output;
}

function normalizeIssues(data: ValeJson): NormalizedIssue[] {
  return Object.entries(data)
    .flatMap(([file, issues]) =>
      issues.map((issue) => ({
        absolutePath: path.resolve(file),
        check: issue.Check,
        column: issue.Span?.[0] ?? 1,
        file,
        line: issue.Line,
        match: issue.Match,
        message: issue.Message,
        severity: issue.Severity,
      }))
    )
    .sort((left, right) => {
      const severityDifference =
        SEVERITY_ORDER[left.severity] - SEVERITY_ORDER[right.severity];

      if (severityDifference !== 0) {
        return severityDifference;
      }

      if (left.file !== right.file) {
        return left.file.localeCompare(right.file);
      }

      if (left.line !== right.line) {
        return left.line - right.line;
      }

      return left.column - right.column;
    });
}

function countBy<T extends string>(
  items: NormalizedIssue[],
  getKey: (item: NormalizedIssue) => T
): Map<T, number> {
  const counts = new Map<T, number>();

  for (const item of items) {
    const key = getKey(item);
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }

  return counts;
}

function topEntries(counts: Map<string, number>, limit: number): [string, number][] {
  return [...counts.entries()]
    .sort((left, right) => right[1] - left[1] || left[0].localeCompare(right[0]))
    .slice(0, limit);
}

function escapeHtml(value: string | number): string {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function escapeAttribute(value: string | number): string {
  return escapeHtml(value);
}

function toVsCodeUri(issue: NormalizedIssue): string {
  return `vscode://file/${encodeURI(issue.absolutePath)}:${issue.line}:${issue.column}`;
}

function renderStat(label: string, value: number, modifier = ''): string {
  return `
    <article class="stat ${modifier}">
      <strong>${value.toLocaleString('en-GB')}</strong>
      <span>${escapeHtml(label)}</span>
    </article>
  `;
}

function renderRuleList(counts: Map<string, number>): string {
  return topEntries(counts, 18)
    .map(
      ([rule, count]) => `
        <button class="rule-filter" type="button" data-rule="${escapeAttribute(rule)}">
          <span>${escapeHtml(rule)}</span>
          <strong>${count.toLocaleString('en-GB')}</strong>
        </button>
      `
    )
    .join('');
}

function renderRows(issues: NormalizedIssue[]): string {
  return issues
    .map(
      (issue) => `
        <tr
          data-severity="${escapeAttribute(issue.severity)}"
          data-rule="${escapeAttribute(issue.check)}"
          data-file="${escapeAttribute(issue.file)}"
        >
          <td>
            <span class="severity severity-${escapeAttribute(issue.severity)}">
              ${escapeHtml(issue.severity)}
            </span>
          </td>
          <td>
            <a href="${escapeAttribute(toVsCodeUri(issue))}">
              ${escapeHtml(issue.file)}:${issue.line}:${issue.column}
            </a>
          </td>
          <td><code>${escapeHtml(issue.check)}</code></td>
          <td>
            <p>${escapeHtml(issue.message)}</p>
            ${
              issue.match
                ? `<small>Match: <code>${escapeHtml(issue.match)}</code></small>`
                : ''
            }
          </td>
        </tr>
      `
    )
    .join('');
}

function renderHtml(issues: NormalizedIssue[], options: Options): string {
  const severityCounts = countBy(issues, (issue) => issue.severity);
  const ruleCounts = countBy(issues, (issue) => issue.check);
  const fileCounts = countBy(issues, (issue) => issue.file);
  const generatedAt = new Date().toISOString();

  return `<!doctype html>
<html lang="en-GB">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Vale Report</title>
  <style>
    :root {
      color-scheme: light dark;
      --surface: oklch(98.8% 0.003 106.5deg);
      --surface-raised: #ffffff;
      --surface-dark: oklch(15.3% 0.006 107.1deg);
      --surface-raised-dark: oklch(26.8% 0.011 36.5deg);
      --text: oklch(43.8% 0.017 39.3deg);
      --text-dark: oklch(92.2% 0.005 34.3deg);
      --muted: oklch(54.7% 0.021 43.1deg);
      --border: oklch(92.2% 0.005 34.3deg);
      --border-dark: oklch(36.7% 0.016 35.7deg);
      --accent: oklch(64.6% 0.222 41.116deg);
      --accent-link: oklch(50.5% 0.213 27.518deg);
      --error: oklch(57.7% 0.245 27.325deg);
      --warning: oklch(72% 0.17 75deg);
      --suggestion: oklch(62% 0.12 230deg);
      --radius: 8px;
      --space-sm: 8px;
      --space-md: 16px;
      --space-lg: 24px;
      --space-xl: 32px;
    }

    * {
      box-sizing: border-box;
    }

    body {
      background: var(--surface);
      color: var(--text);
      font-family: "Exo 2 Variable", "Segoe UI", system-ui, sans-serif;
      font-size: 16px;
      line-height: 1.6;
      margin: 0;
    }

    a {
      color: var(--accent-link);
    }

    header {
      border-bottom: 1px solid var(--border);
      padding: var(--space-xl);
    }

    main {
      margin: 0 auto;
      max-width: 1440px;
      padding: var(--space-lg);
    }

    h1,
    h2 {
      line-height: 1.2;
      margin: 0;
    }

    h1 {
      font-size: 2.25rem;
      font-weight: 700;
    }

    h2 {
      font-size: 1.25rem;
      margin-block-end: var(--space-md);
    }

    .meta {
      color: var(--muted);
      margin: var(--space-sm) 0 0;
    }

    .stats,
    .toolbar,
    .layout {
      display: grid;
      gap: var(--space-md);
    }

    .stats {
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      margin-block: var(--space-lg);
    }

    .stat,
    .panel {
      background: var(--surface-raised);
      border: 1px solid var(--border);
      border-radius: var(--radius);
    }

    .stat {
      padding: var(--space-md);
    }

    .stat strong {
      display: block;
      font-size: 1.75rem;
      line-height: 1;
    }

    .stat span {
      color: var(--muted);
      display: block;
      margin-block-start: var(--space-sm);
    }

    .toolbar {
      align-items: end;
      grid-template-columns: minmax(220px, 1fr) repeat(3, auto);
      margin-block-end: var(--space-md);
    }

    label {
      display: grid;
      font-size: 0.875rem;
      gap: var(--space-sm);
    }

    input,
    select,
    button {
      background: var(--surface-raised);
      border: 1px solid var(--border);
      border-radius: 6px;
      color: inherit;
      font: inherit;
      min-height: 40px;
      padding: 8px 12px;
    }

    button {
      cursor: pointer;
    }

    button:hover {
      border-color: var(--accent);
    }

    .layout {
      grid-template-columns: minmax(0, 1fr) 320px;
    }

    .panel {
      overflow: clip;
    }

    .panel-body {
      padding: var(--space-md);
    }

    .rules {
      display: grid;
      gap: var(--space-sm);
    }

    .rule-filter {
      align-items: center;
      display: flex;
      gap: var(--space-sm);
      justify-content: space-between;
      text-align: left;
    }

    .rule-filter span {
      overflow-wrap: anywhere;
    }

    table {
      border-collapse: collapse;
      width: 100%;
    }

    thead {
      background: var(--surface-raised);
      position: sticky;
      top: 0;
      z-index: 1;
    }

    th,
    td {
      border-bottom: 1px solid var(--border);
      padding: 10px 12px;
      text-align: left;
      vertical-align: top;
    }

    th {
      color: var(--muted);
      font-size: 0.875rem;
      font-weight: 700;
    }

    td:nth-child(2) {
      overflow-wrap: anywhere;
      width: 34%;
    }

    code {
      font-family: "JetBrains Mono Variable", "SFMono-Regular", Consolas, monospace;
      font-size: 0.875rem;
    }

    td p {
      margin: 0;
    }

    td small {
      color: var(--muted);
      display: block;
      margin-block-start: 4px;
    }

    .severity {
      border-radius: 9999px;
      color: #111111;
      display: inline-block;
      font-size: 0.75rem;
      font-weight: 700;
      line-height: 1;
      min-width: 78px;
      padding: 6px 8px;
      text-align: center;
    }

    .severity-error {
      background: var(--error);
      color: #ffffff;
    }

    .severity-warning {
      background: var(--warning);
    }

    .severity-suggestion {
      background: var(--suggestion);
      color: #ffffff;
    }

    .empty {
      color: var(--muted);
      display: none;
      padding: var(--space-xl);
      text-align: center;
    }

    @media (width <= 900px) {
      header,
      main {
        padding: var(--space-md);
      }

      .toolbar,
      .layout {
        grid-template-columns: 1fr;
      }

      thead {
        position: static;
      }
    }

    @media (prefers-color-scheme: dark) {
      body {
        background: var(--surface-dark);
        color: var(--text-dark);
      }

      a {
        color: oklch(75% 0.183 55.934deg);
      }

      header,
      th,
      td,
      .stat,
      .panel,
      input,
      select,
      button {
        border-color: var(--border-dark);
      }

      .stat,
      .panel,
      input,
      select,
      button,
      thead {
        background: var(--surface-raised-dark);
      }
    }
  </style>
</head>
<body>
  <header>
    <h1>Vale Report</h1>
    <p class="meta">
      Target: <code>${escapeHtml(options.target)}</code>.
      Generated: <time datetime="${escapeAttribute(generatedAt)}">${escapeHtml(generatedAt)}</time>.
      Links use <code>vscode://file</code>.
    </p>
  </header>
  <main>
    <section class="stats" aria-label="Summary">
      ${renderStat('total issues', issues.length)}
      ${renderStat('errors', severityCounts.get('error') ?? 0, 'stat-error')}
      ${renderStat('warnings', severityCounts.get('warning') ?? 0, 'stat-warning')}
      ${renderStat('suggestions', severityCounts.get('suggestion') ?? 0, 'stat-suggestion')}
      ${renderStat('files', fileCounts.size)}
      ${renderStat('rules', ruleCounts.size)}
    </section>

    <section class="toolbar" aria-label="Filters">
      <label>
        Search
        <input id="search" type="search" placeholder="file, rule, message, match">
      </label>
      <label>
        Severity
        <select id="severity">
          <option value="">All</option>
          <option value="error">Errors</option>
          <option value="warning">Warnings</option>
          <option value="suggestion">Suggestions</option>
        </select>
      </label>
      <button id="clear-rule" type="button">Clear Rule</button>
      <button id="reset" type="button">Reset</button>
    </section>

    <section class="layout">
      <section class="panel" aria-label="Issues">
        <table>
          <thead>
            <tr>
              <th>Severity</th>
              <th>Location</th>
              <th>Rule</th>
              <th>Message</th>
            </tr>
          </thead>
          <tbody id="issues">
            ${renderRows(issues)}
          </tbody>
        </table>
        <p id="empty" class="empty">No issues match the current filters.</p>
      </section>

      <aside class="panel" aria-label="Top rules">
        <div class="panel-body">
          <h2>Top Rules</h2>
          <div class="rules">
            ${renderRuleList(ruleCounts)}
          </div>
        </div>
      </aside>
    </section>
  </main>

  <script>
    const rows = Array.from(document.querySelectorAll('#issues tr'));
    const search = document.querySelector('#search');
    const severity = document.querySelector('#severity');
    const reset = document.querySelector('#reset');
    const clearRule = document.querySelector('#clear-rule');
    const empty = document.querySelector('#empty');
    let selectedRule = '';

    function applyFilters() {
      const query = search.value.trim().toLowerCase();
      const selectedSeverity = severity.value;
      let visible = 0;

      for (const row of rows) {
        const matchesQuery = query === '' || row.textContent.toLowerCase().includes(query);
        const matchesSeverity = selectedSeverity === '' || row.dataset.severity === selectedSeverity;
        const matchesRule = selectedRule === '' || row.dataset.rule === selectedRule;
        const isVisible = matchesQuery && matchesSeverity && matchesRule;
        row.hidden = !isVisible;

        if (isVisible) {
          visible += 1;
        }
      }

      empty.style.display = visible === 0 ? 'block' : 'none';
    }

    search.addEventListener('input', applyFilters);
    severity.addEventListener('change', applyFilters);
    reset.addEventListener('click', () => {
      search.value = '';
      severity.value = '';
      selectedRule = '';
      applyFilters();
    });
    clearRule.addEventListener('click', () => {
      selectedRule = '';
      applyFilters();
    });

    for (const button of document.querySelectorAll('.rule-filter')) {
      button.addEventListener('click', () => {
        selectedRule = button.dataset.rule;
        applyFilters();
      });
    }
  </script>
</body>
</html>
`;
}

function main(): void {
  const options = parseArgs(process.argv.slice(2));
  const rawJson = readValeJson(options);
  const data = JSON.parse(rawJson) as ValeJson;
  const issues = normalizeIssues(data);
  const html = renderHtml(issues, options);

  ensureParentDirectory(options.html);
  fs.writeFileSync(options.html, html);

  const counts = countBy(issues, (issue) => issue.severity);
  console.log(`Vale report written to ${options.html}`);
  console.log(`Raw Vale JSON written to ${options.input ?? options.json}`);
  console.log(
    [
      `${issues.length} total`,
      `${counts.get('error') ?? 0} errors`,
      `${counts.get('warning') ?? 0} warnings`,
      `${counts.get('suggestion') ?? 0} suggestions`,
    ].join(', ')
  );
}

main();
