// scripts/package/update-versions.ts
import fs from 'node:fs';
import path from 'node:path';
import { parse } from 'jsonc-parser';
import glob from 'fast-glob';
import type { JsonSourceFile } from 'typescript';

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
 * Collect all used dependencies across all JSONC config files
 */
function collectUsedDeps(files: string[]): Set<string> {
  const used = new Set<string>();

  for (const file of files) {
    const json = loadJsonc(file);
    for (const section of ['dependencies', 'devDependencies'] as const) {
      const deps = json[section];
      if (deps && typeof deps === 'object') {
        Object.keys(deps).forEach((dep) => used.add(dep));
      }
    }
  }

  return used;
}

/**
 * Main execution
 */
async function main() {
  const rootPkgPath = path.resolve('./package.json');
  const rootPkg = JSON.parse(fs.readFileSync(rootPkgPath, 'utf8')) as JsonSourceFile;

  const files = await glob('./src/packages/*/*.jsonc');

  // Step 1: Update versions
  for (const file of files) {
    const json = loadJsonc(file);

    if (replaceVersions(json, rootPkg)) {
      fs.writeFileSync(file, JSON.stringify(json, null, 2) + '\n');
      console.log(`✔ Updated: ${file}`);
    } else {
      console.log(`✘ No changes: ${file}`);
    }
  }

  // Step 2: List unused dependencies
  const usedDeps = collectUsedDeps(files);
  const unusedEntries: string[] = [];

  for (const section of ['dependencies', 'devDependencies'] as const) {
    const deps = rootPkg[section];
    if (!deps) continue;
    for (const [dep, version] of Object.entries(deps)) {
      if (!usedDeps.has(dep)) {
        unusedEntries.push(`  "${dep}": "${version}",`);
      }
    }
  }

  if (unusedEntries.length > 0) {
    console.log('\n🔍 Unused dependencies from root package.json:');
    unusedEntries.sort().forEach((line) => console.log(line));
  } else {
    console.log('\n✅ All dependencies are used.');
  }
}

main().catch((err) => {
  console.error('✖ Error:', err.message);
  process.exit(1);
});
