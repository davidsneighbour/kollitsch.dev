// scripts/package/update-versions.ts
import fs from 'node:fs';
import path from 'node:path';
import { parse } from 'jsonc-parser';
import glob from 'fast-glob';

/**
 * Load JSONC file (allowing comments)
 */
function loadJsonc(filePath: string): Record<string, any> {
  const content = fs.readFileSync(filePath, 'utf8');
  return parse(content);
}

/**
 * Replace versions of matching dependencies/devDependencies
 */
function replaceVersions(
  target: Record<string, any>,
  source: Record<string, any>,
): boolean {
  let updated = false;

  for (const section of ['dependencies', 'devDependencies'] as const) {
    if (!target[section]) continue;
    for (const dep of Object.keys(target[section])) {
      const newVersion = source[section]?.[dep];
      if (newVersion && target[section][dep] !== newVersion) {
        target[section][dep] = newVersion;
        updated = true;
      }
    }
  }

  return updated;
}

/**
 * Main execution
 */
async function main() {
  const rootPkgPath = path.resolve('./package.json');
  const rootPkg = JSON.parse(fs.readFileSync(rootPkgPath, 'utf8'));

  const files = await glob('./scripts/package/*/*.jsonc');

  for (const file of files) {
    const json = loadJsonc(file);

    if (replaceVersions(json, rootPkg)) {
      fs.writeFileSync(file, JSON.stringify(json, null, 2) + '\n');
      console.log(`✔ Updated: ${file}`);
    } else {
      console.log(`✘ No changes: ${file}`);
    }
  }
}

main().catch((err) => {
  console.error('✖ Error:', err.message);
  process.exit(1);
});
