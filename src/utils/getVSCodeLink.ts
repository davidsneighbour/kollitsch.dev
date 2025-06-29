import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

/**
 * Returns a `vscode://file/` link to a given file path inside your project.
 * @param relativePath - Path relative to the project root, e.g. 'src/components/meta/PublishData.astro'
 * @returns VS Code deep link to open the file.
 */
export function getVSCodeLink(relativePath: string): string {
  const currentFile = fileURLToPath(import.meta.url);
  const currentDir = dirname(currentFile);
  const projectRoot = resolve(currentDir, '../../'); // Adjust this if file moves
  const fullPath = projectRoot + relativePath;
  return `vscode://file/${fullPath}`;
}

/**
 * Returns a `vscode://file/` URL to a given file path inside your project.
 *
 * @param relativePath - Path relative to the project root, e.g. 'src/components/meta/PublishData.astro'
 * @returns VS Code deep link to open the file.
 */
export function getVSCodeURL(relativePath: string): string {
  const currentFile = fileURLToPath(import.meta.url);
  const currentDir = dirname(currentFile);
  const projectRoot = resolve(currentDir, '../../'); // Adjust this if file moves
  const fullPath = projectRoot + relativePath;
  return `vscode://file/${fullPath}`;
}

export function getVSCodeUrlById(id: string, type: 'blog' = 'blog'): string {
  const vscodeURL = getVSCodeURL(
    '/src/content/' + type + '/' + id + '/index.md',
  );
  return vscodeURL;
}
