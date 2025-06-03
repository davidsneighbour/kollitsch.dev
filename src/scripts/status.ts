import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.resolve(fileURLToPath(import.meta.url), '../../');

process.removeAllListeners('warning');
process.on('warning', (warning) => {
  if (warning.name === 'ExperimentalWarning' && warning.message.includes('Type Stripping')) {
    // Do nothing — explicitly ignored
  } else {
    console.warn(warning);
  }
});

// Utility: Recursively get files under a directory
async function getFiles(dir, base = dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = await Promise.all(entries.map((entry) => {
    const res = path.resolve(dir, entry.name);
    return entry.isDirectory() ? getFiles(res, base) : path.relative(base, res);
  }));
  return files.flat();
}

async function summarizeDirectory(name, relPath, extensions = ['.astro', '.md', '.mjs']) {
  const fullPath = path.join(root, relPath);
  try {
    const all = await getFiles(fullPath);
    const filtered = all.filter((f) => extensions.includes(path.extname(f)));
    console.log(`\n🔹 ${name} (${filtered.length} file${filtered.length !== 1 ? 's' : ''})`);
    filtered.sort().forEach((f) => console.log(`  - ${f}`));
  } catch {
    console.log(`\n⚠️  ${name} directory not found: ${relPath}`);
  }
}

console.log('📦 kollitsch.dev-astro project status\n');

await summarizeDirectory('Pages', './src/pages');
await summarizeDirectory('Content', './src/content', ['.md']);
await summarizeDirectory('Layouts', './src/layouts');
await summarizeDirectory('Components', './src/components');
await summarizeDirectory('Scripts', './src/scripts', ['.mjs', '.sh', '.ts']);

console.log('\n✅ Done.\n');
