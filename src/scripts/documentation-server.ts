import fs from 'node:fs/promises';
import {
  createServer,
  type IncomingMessage,
  type ServerResponse,
} from 'node:http';
import { networkInterfaces } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import matter from 'gray-matter';
import { toHtml } from 'hast-util-to-html';
import remarkGfm from 'remark-gfm';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import { unified } from 'unified';

const scriptPath = fileURLToPath(import.meta.url);
const projectRoot = path.resolve(path.dirname(scriptPath), '../..');
const defaultDocumentationRoot = path.join(projectRoot, 'documentation');
const defaultHost = '0.0.0.0';
const defaultPort = 4322;

/** Generated API docs live under this folder; treated as a single nav leaf, never expanded. */
const generatedApiDirName = 'api';

const staticFileContentTypes: Record<string, string> = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
};

export interface DocumentationPage {
  filePath: string;
  routePath: string;
  title: string;
}

export interface DocumentationServerOptions {
  documentationRoot?: string;
  host?: string;
  port?: number;
}

interface DocumentationNavGroup {
  pages: DocumentationPage[];
  title: string;
}

interface ParsedOptions {
  documentationRoot: string;
  host: string;
  port: number;
}

const markdownProcessor = unified()
  .use(remarkParse)
  .use(remarkGfm)
  .use(remarkRehype);

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

function isMarkdownFile(filePath: string): boolean {
  return filePath.endsWith('.md');
}

function isWithinDirectory(parent: string, child: string): boolean {
  const relativePath = path.relative(parent, child);
  return (
    relativePath === '' ||
    (!relativePath.startsWith('..') && !path.isAbsolute(relativePath))
  );
}

function routePathFromFile(
  documentationRoot: string,
  filePath: string,
): string {
  const relativePath = path
    .relative(documentationRoot, filePath)
    .replaceAll(path.sep, '/');
  return relativePath === 'index.md' ? '/' : `/${relativePath}`;
}

function stripFrontmatter(markdown: string): string {
  return matter(markdown).content;
}

function titleFromMarkdown(markdown: string, fallback: string): string {
  const heading = markdown.match(/^#\s+(.+?)\s*$/m)?.[1];
  return (
    heading ??
    fallback
      .replace(
        /(?:^|-)([a-z])/g,
        (_, letter: string) => ` ${letter.toUpperCase()}`,
      )
      .trim()
  );
}

function titleCase(value: string): string {
  return value.replace(
    /(?:^|-)([a-z])/g,
    (_, letter: string) => ` ${letter.toUpperCase()}`,
  ).trim();
}

function categoryFromRoutePath(routePath: string): string {
  const firstSegment = routePath.split('/').filter(Boolean)[0];
  if (!firstSegment || routePath.split('/').filter(Boolean).length <= 1) {
    return 'General';
  }
  return firstSegment === generatedApiDirName
    ? 'API'
    : titleCase(firstSegment);
}

function groupDocumentationPages(
  pages: DocumentationPage[],
): DocumentationNavGroup[] {
  const groupedPages = new Map<string, DocumentationPage[]>();

  for (const page of pages) {
    const category = categoryFromRoutePath(page.routePath);
    groupedPages.set(category, [...(groupedPages.get(category) ?? []), page]);
  }

  const groupPriority = (title: string): number => {
    if (title === 'API') return 0;
    if (title === 'General') return 1;
    return 2;
  };

  return [...groupedPages.entries()]
    .sort(([a], [b]) => {
      const priorityDiff = groupPriority(a) - groupPriority(b);
      if (priorityDiff !== 0) return priorityDiff;
      return a.localeCompare(b);
    })
    .map(([title, groupPages]) => ({ pages: groupPages, title }));
}

async function fileExists(filePath: string): Promise<boolean> {
  try {
    const stats = await fs.stat(filePath);
    return stats.isFile();
  } catch {
    return false;
  }
}

async function directoryExists(directoryPath: string): Promise<boolean> {
  try {
    const stats = await fs.stat(directoryPath);
    return stats.isDirectory();
  } catch {
    return false;
  }
}

async function collectMarkdownFiles(directory: string): Promise<string[]> {
  const entries = await fs.readdir(directory, { withFileTypes: true });
  const files = await Promise.all(
    entries.map(async (entry) => {
      if (entry.isDirectory()) {
        if (entry.name === generatedApiDirName) return [];
        return collectMarkdownFiles(path.join(directory, entry.name));
      }
      const entryPath = path.join(directory, entry.name);
      return isMarkdownFile(entryPath) ? [entryPath] : [];
    }),
  );
  return files.flat().sort((a, b) => a.localeCompare(b));
}

export async function listDocumentationPages(
  documentationRoot = defaultDocumentationRoot,
): Promise<DocumentationPage[]> {
  const root = path.resolve(documentationRoot);
  const files = await collectMarkdownFiles(root);

  const pages = await Promise.all(
    files.map(async (filePath) => {
      const markdown = stripFrontmatter(await fs.readFile(filePath, 'utf8'));
      const fallbackTitle = path.basename(filePath, '.md');
      return {
        filePath,
        routePath: routePathFromFile(root, filePath),
        title: titleFromMarkdown(markdown, fallbackTitle),
      };
    }),
  );

  if (await directoryExists(path.join(root, generatedApiDirName))) {
    pages.push({
      filePath: path.join(root, generatedApiDirName, 'index.html'),
      routePath: `/${generatedApiDirName}/index.html`,
      title: 'API reference',
    });
  }

  return pages;
}

export async function resolveDocumentationFile(
  documentationRoot: string,
  requestPath: string,
): Promise<string | undefined> {
  const root = path.resolve(documentationRoot);
  const decodedPath = decodeURIComponent(requestPath.split('?')[0] ?? '/');

  if (decodedPath.startsWith(`/${generatedApiDirName}/`)) {
    const absolutePath = path.resolve(root, `.${decodedPath}`);
    if (
      isWithinDirectory(root, absolutePath) &&
      (await fileExists(absolutePath))
    ) {
      return absolutePath;
    }
    return undefined;
  }

  const normalizedPath = decodedPath === '/' ? '/index.md' : decodedPath;
  const candidates = normalizedPath.endsWith('.md')
    ? [normalizedPath]
    : [
        `${normalizedPath.replace(/\/$/, '')}.md`,
        `${normalizedPath.replace(/\/$/, '')}/index.md`,
      ];

  for (const candidate of candidates) {
    const absolutePath = path.resolve(root, `.${candidate}`);
    if (!isWithinDirectory(root, absolutePath)) {
      return undefined;
    }
    if (await fileExists(absolutePath)) {
      return absolutePath;
    }
  }

  return undefined;
}

export function renderDocumentationPage(
  markdown: string,
  currentPage: DocumentationPage,
  pages: DocumentationPage[],
): string {
  const html = toHtml(
    markdownProcessor.runSync(markdownProcessor.parse(markdown)),
  );
  const nav = groupDocumentationPages(pages)
    .map((group) => {
      const links = group.pages
        .map((page) => {
          const active = page.routePath === currentPage.routePath;
          const ariaCurrent = active ? ' aria-current="page"' : '';
          const target = page.routePath.startsWith(`/${generatedApiDirName}/`)
            ? ' target="_blank" rel="noopener"'
            : '';
          return `<li><a href="${escapeHtml(page.routePath)}"${ariaCurrent}${target}>${escapeHtml(page.title)}</a></li>`;
        })
        .join('\n');
      return `<li class="nav-group"><h2>${escapeHtml(group.title)}</h2><ul>${links}</ul></li>`;
    })
    .join('\n');

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHtml(currentPage.title)} | Documentation</title>
  <style>
    :root {
      color-scheme: light dark;
      --bg: #f8f5ef;
      --surface: #fffaf2;
      --text: #27231e;
      --muted: #6b6258;
      --border: #dfd4c5;
      --accent: #9f2f24;
      --code: #efe6d8;
    }

    @media (prefers-color-scheme: dark) {
      :root {
        --bg: #171512;
        --surface: #211e19;
        --text: #f4eadc;
        --muted: #b8aa99;
        --border: #3f382f;
        --accent: #e98b7f;
        --code: #302a22;
      }
    }

    * {
      box-sizing: border-box;
    }

    body {
      margin: 0;
      background: var(--bg);
      color: var(--text);
      font: 16px/1.65 system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    }

    .layout {
      display: grid;
      grid-template-columns: minmax(14rem, 20rem) minmax(0, 1fr);
      min-height: 100vh;
    }

    nav {
      border-right: 1px solid var(--border);
      background: var(--surface);
      padding: 1.5rem;
    }

    nav h1 {
      margin: 0 0 1rem;
      font-size: 1rem;
    }

    nav ul {
      list-style: none;
      margin: 0;
      padding: 0;
    }

    .nav-group + .nav-group {
      margin-top: 1rem;
    }

    .nav-group h2 {
      color: var(--text);
      font-size: 0.72rem;
      font-weight: 700;
      letter-spacing: 0;
      margin: 0 0 0.3rem;
      text-transform: uppercase;
    }

    nav a {
      display: block;
      border-radius: 0.35rem;
      color: var(--muted);
      padding: 0.25rem 0.4rem;
      text-decoration: none;
    }

    nav a:hover,
    nav a[aria-current="page"] {
      background: var(--code);
      color: var(--text);
    }

    main {
      max-width: 56rem;
      padding: 2.5rem clamp(1.25rem, 5vw, 4rem);
    }

    a {
      color: var(--accent);
    }

    pre,
    code {
      background: var(--code);
      border-radius: 0.3rem;
    }

    code {
      padding: 0.1rem 0.25rem;
    }

    pre {
      overflow-x: auto;
      padding: 1rem;
    }

    pre code {
      padding: 0;
    }

    blockquote {
      border-left: 0.25rem solid var(--border);
      color: var(--muted);
      margin-left: 0;
      padding-left: 1rem;
    }

    table {
      border-collapse: collapse;
      width: 100%;
    }

    th,
    td {
      border: 1px solid var(--border);
      padding: 0.35rem 0.5rem;
      text-align: left;
      vertical-align: top;
    }

    img {
      max-width: 100%;
    }

    @media (max-width: 48rem) {
      .layout {
        display: block;
      }

      nav {
        border-bottom: 1px solid var(--border);
        border-right: 0;
      }
    }
  </style>
</head>
<body>
  <div class="layout">
    <nav aria-label="Documentation">
      <h1><a href="/">Documentation</a></h1>
      <ul>
        ${nav}
      </ul>
    </nav>
    <main>
      ${html}
    </main>
  </div>
</body>
</html>`;
}

function send(
  response: ServerResponse,
  statusCode: number,
  body: string | Buffer,
  contentType = 'text/html; charset=utf-8',
): void {
  response.writeHead(statusCode, {
    'Content-Length': Buffer.byteLength(body),
    'Content-Type': contentType,
  });
  response.end(body);
}

async function handleRequest(
  documentationRoot: string,
  request: IncomingMessage,
  response: ServerResponse,
): Promise<void> {
  const requestUrl = new URL(request.url ?? '/', 'http://documentation.local');
  const filePath = await resolveDocumentationFile(
    documentationRoot,
    requestUrl.pathname,
  );

  if (!filePath) {
    send(
      response,
      404,
      '<!doctype html><title>Not found</title><h1>Not found</h1>',
    );
    return;
  }

  if (!isMarkdownFile(filePath)) {
    const contentType =
      staticFileContentTypes[path.extname(filePath)] ??
      'application/octet-stream';
    const body = await fs.readFile(filePath);
    send(response, 200, body, contentType);
    return;
  }

  const pages = await listDocumentationPages(documentationRoot);
  const routePath = routePathFromFile(
    path.resolve(documentationRoot),
    filePath,
  );
  const markdown = stripFrontmatter(await fs.readFile(filePath, 'utf8'));
  const currentPage = pages.find((page) => page.routePath === routePath) ?? {
    filePath,
    routePath,
    title: titleFromMarkdown(markdown, path.basename(filePath, '.md')),
  };

  send(response, 200, renderDocumentationPage(markdown, currentPage, pages));
}

function parseOptions(args: string[], env: NodeJS.ProcessEnv): ParsedOptions {
  const options: ParsedOptions = {
    documentationRoot: defaultDocumentationRoot,
    host: env['DOCS_HOST'] ?? defaultHost,
    port: Number.parseInt(env['DOCS_PORT'] ?? `${defaultPort}`, 10),
  };

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    const next = args[index + 1];

    if (arg === '--host' && next) {
      options.host = next;
      index += 1;
    } else if (arg === '--port' && next) {
      options.port = Number.parseInt(next, 10);
      index += 1;
    } else if (arg === '--root' && next) {
      options.documentationRoot = path.resolve(next);
      index += 1;
    } else {
      throw new Error(`Unknown or incomplete option: ${arg}`);
    }
  }

  if (!Number.isInteger(options.port) || options.port <= 0) {
    throw new Error(`Invalid documentation server port: ${options.port}`);
  }

  return options;
}

function listedHosts(host: string): string[] {
  if (host !== '0.0.0.0' && host !== '::') {
    return [host];
  }
  const addresses: string[] = ['127.0.0.1'];
  for (const interfaces of Object.values(networkInterfaces())) {
    for (const iface of interfaces ?? []) {
      if (iface.family === 'IPv4' && !iface.internal) {
        addresses.push(iface.address);
      }
    }
  }
  return addresses;
}

export function startDocumentationServer({
  documentationRoot = defaultDocumentationRoot,
  host = defaultHost,
  port = defaultPort,
}: DocumentationServerOptions = {}) {
  const server = createServer((request, response) => {
    handleRequest(documentationRoot, request, response).catch(
      (error: unknown) => {
        console.error(error);
        send(
          response,
          500,
          '<!doctype html><title>Error</title><h1>Server error</h1>',
        );
      },
    );
  });

  server.listen(port, host, () => {
    const urls = listedHosts(host)
      .map((address) => `http://${address}:${port}/`)
      .join('\n  ');
    console.log(`Documentation server running at:\n  ${urls}`);
  });

  server.on('error', (error: NodeJS.ErrnoException) => {
    if (error.code === 'EADDRINUSE') {
      console.error(`Documentation server port ${port} is already in use.`);
      return;
    }

    if (error.code === 'EPERM') {
      console.error(
        `Documentation server cannot listen on ${host}:${port}: permission denied.`,
      );
      return;
    }

    console.error(error);
  });

  return server;
}

if (process.argv[1] && path.resolve(process.argv[1]) === scriptPath) {
  try {
    startDocumentationServer(parseOptions(process.argv.slice(2), process.env));
  } catch (error) {
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
  }
}
