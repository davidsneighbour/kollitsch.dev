// Script to synchronize dependency versions and audit scripts/wireit
//
// 1) Updates dependency versions in ./src/packages/*/*.jsonc from the root package.json
// 2) Reports unused root dependencies (not present in any src/packages/*.jsonc)
// 3) Reports scripts/wireit that are:
//    - missing (exist in root, not listed in any src/packages/*.jsonc)
//    - changed (same key exists in both root and a jsonc file, but differs)
//    - duplicated (same key appears in multiple src/packages/*.jsonc files)

import fs from 'node:fs';
import path from 'node:path';
import glob from 'fast-glob';
import { parse } from 'jsonc-parser';

type JsonObject = Record<string, unknown>;

type PackageJson = {
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
  scripts?: Record<string, string>;
  wireit?: Record<string, unknown>;
  [key: string]: unknown;
};

const CONFIG = {
  packageJsoncGlob: './src/packages/*/*.jsonc',
  rootPkgPath: './package.json',
} as const;

/**
 * Load JSONC file content
 */
function loadJsonc<T = unknown>(filePath: string): T {
  const content = fs.readFileSync(filePath, 'utf8');
  return parse(content) as T;
}

/**
 * Load JSON file content.
 */
function loadJson<T = unknown>(filePath: string): T {
  const content = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(content) as T;
}

/**
 * Replace matching dependency versions in target based on source.
 * Returns true when any version changed.
 */
function replaceVersions(target: PackageJson, source: PackageJson): boolean {
  let updated = false;
  for (const section of ['dependencies', 'devDependencies'] as const) {
    const t = target[section];
    const s = source[section];
    if (!t || !s) continue;
    for (const dep of Object.keys(t)) {
      const newVersion = s[dep];
      if (newVersion && t[dep] !== newVersion) {
        t[dep] = newVersion;
        updated = true;
      }
    }
  }
  return updated;
}

/**
 * Collect dependency names that are referenced in dependencies/devDependencies
 * across all JSONC files.
 */
function collectUsedDeps(files: string[]): Set<string> {
  const used = new Set<string>();
  for (const file of files) {
    const json = loadJsonc<PackageJson>(file);
    for (const section of ['dependencies', 'devDependencies'] as const) {
      const deps = json[section];
      if (deps && typeof deps === 'object') {
        for (const name of Object.keys(deps)) used.add(name);
      }
    }
  }
  return used;
}

/**
 * Read scripts and wireit maps from all JSONC files.
 */
function collectScriptsAndWireit(files: string[]) {
  const perFileScripts: Array<{ file: string; scripts: Record<string, string> }> = [];
  const perFileWireit: Array<{ file: string; wireit: Record<string, unknown> }> = [];

  for (const file of files) {
    try {
      const json = loadJsonc<PackageJson>(file);
      if (json.scripts && typeof json.scripts === 'object') {
        perFileScripts.push({ file, scripts: json.scripts as Record<string, string> });
      }
      if (json.wireit && typeof json.wireit === 'object') {
        perFileWireit.push({ file, wireit: json.wireit as Record<string, unknown> });
      }
    } catch (e) {
      const err = e as Error;
      console.error(`✖ Failed to read ${file}: ${err.message}`);
    }
  }

  return { perFileScripts, perFileWireit };
}

/**
 * Given a root map and a set of per-file maps, return keys that exist in root
 * but not in any per-file map (missing from packages).
 */
function findMissingFromPackages<T>(
  rootMap: Record<string, T> | undefined,
  perFile: Array<{ file: string; map: Record<string, T> }>,
): string[] {
  if (!rootMap) return [];
  const present = new Set<string>();
  for (const { map } of perFile) {
    for (const k of Object.keys(map)) present.add(k);
  }
  return Object.keys(rootMap).filter((k) => !present.has(k)).sort();
}

/**
 * Find scripts that differ between root and per-file jsonc.
 */
function findChangedScripts(
  rootScripts: Record<string, string> | undefined,
  perFileScripts: Array<{ file: string; scripts: Record<string, string> }>,
): Array<{ file: string; name: string; root: string; found: string }> {
  const out: Array<{ file: string; name: string; root: string; found: string }> = [];
  const rs = rootScripts ?? {};
  for (const { file, scripts } of perFileScripts) {
    for (const [name, cmd] of Object.entries(scripts)) {
      if (name in rs && String(rs[name]) !== String(cmd)) {
        out.push({ file, name, root: String(rs[name]), found: String(cmd) });
      }
    }
  }
  return out.sort((a, b) => a.name.localeCompare(b.name));
}

/**
 * Stable stringify for quick structural comparison of wireit configs.
 */
function stableStringify(value: unknown): string {
  const keys: string[] = [];
  (function collect(v: unknown) {
    if (Array.isArray(v)) v.forEach(collect);
    else if (v && typeof v === 'object') {
      for (const k of Object.keys(v as JsonObject)) {
        keys.push(k);
        collect((v as JsonObject)[k]);
      }
    }
  })(value);
  const uniq = Array.from(new Set(keys)).sort();
  return JSON.stringify(value, uniq, 2);
}

/**
 * Find wireit entries that differ between root and per-file jsonc.
 */
function findChangedWireit(
  rootWireit: Record<string, unknown> | undefined,
  perFileWireit: Array<{ file: string; wireit: Record<string, unknown> }>,
): Array<{ file: string; name: string }> {
  const out: Array<{ file: string; name: string }> = [];
  const rw = rootWireit ?? {};
  for (const { file, wireit } of perFileWireit) {
    for (const [name, cfg] of Object.entries(wireit)) {
      if (name in rw) {
        if (stableStringify(rw[name]) !== stableStringify(cfg)) {
          out.push({ file, name });
        }
      }
    }
  }
  return out.sort((a, b) => a.name.localeCompare(b.name));
}

/**
 * Detect duplicate keys across multiple per-file maps.
 */
function findDuplicateKeys<T>(
  entries: Array<{ file: string; map: Record<string, T> }>,
): Array<{ name: string; files: string[] }> {
  const seen: Record<string, string[]> = {};
  for (const { file, map } of entries) {
    for (const key of Object.keys(map)) {
      if (!seen[key]) seen[key] = [];
      seen[key].push(file);
    }
  }
  return Object.entries(seen)
    .filter(([, files]) => files.length > 1)
    .map(([name, files]) => ({ name, files }));
}

function header(text: string): void {
  console.log(`\n${text}`);
}

function jsonOut(v: unknown): string {
  return JSON.stringify(v, null, 2);
}

async function main(): Promise<void> {
  // Root package.json
  const rootPkgAbs = path.resolve(CONFIG.rootPkgPath);
  if (!fs.existsSync(rootPkgAbs)) {
    throw new Error(`Root package.json not found at ${rootPkgAbs}`);
  }
  const rootPkg = loadJson<PackageJson>(rootPkgAbs);

  // All JSONC files in src/packages
  const jsoncFiles = await glob(CONFIG.packageJsoncGlob, { dot: false });

  // 1) Update dependency versions
  for (const file of jsoncFiles) {
    try {
      const json = loadJsonc<PackageJson>(file);
      if (replaceVersions(json, rootPkg)) {
        fs.writeFileSync(file, `${jsonOut(json)}\n`, 'utf8');
        console.log(`✔ Updated: ${file}`);
      } else {
        console.log(`✘ No changes: ${file}`);
      }
    } catch (e) {
      const err = e as Error;
      console.error(`✖ Failed to process ${file}: ${err.message}`);
    }
  }

  // 2) Unused root deps (not present in any src/packages/*.jsonc)
  const usedDeps = collectUsedDeps(jsoncFiles);
  const unusedDependencies: Array<{ name: string; version: string }> = [];
  for (const section of ['dependencies', 'devDependencies'] as const) {
    const deps = rootPkg[section];
    if (!deps) continue;
    for (const [name, version] of Object.entries(deps)) {
      if (!usedDeps.has(name)) unusedDependencies.push({ name, version });
    }
  }

  if (unusedDependencies.length > 0) {
    header('🔍 Unused dependencies (in root, not in src/packages/*.jsonc):');
    for (const { name, version } of unusedDependencies.sort((a, b) => a.name.localeCompare(b.name))) {
      console.log(`  "${name}": "${version}",`);
    }
  } else {
    header('✅ All dependencies are referenced in src/packages/*.jsonc.');
  }

  // 3) Scripts & Wireit audits (NO WRITES)
  const { perFileScripts, perFileWireit } = collectScriptsAndWireit(jsoncFiles);

  // 3a) Missing (exist in root but not in any src/packages file)
  const scriptsMissing = findMissingFromPackages(
    rootPkg.scripts,
    perFileScripts.map(({ file, scripts }) => ({ file, map: scripts })),
  );
  const wireitMissing = findMissingFromPackages(
    (rootPkg.wireit as Record<string, unknown> | undefined) ?? undefined,
    perFileWireit.map(({ file, wireit }) => ({ file, map: wireit })),
  );

  // 3b) Changed (same key exists in both root and jsonc, but differs)
  const scriptsChanged = findChangedScripts(rootPkg.scripts, perFileScripts);
  const wireitChanged = findChangedWireit(rootPkg.wireit as Record<string, unknown> | undefined, perFileWireit);

  // 3c) Duplicates (same key appears in multiple src/packages files)
  const scriptDupes = findDuplicateKeys(perFileScripts.map(({ file, scripts }) => ({ file, map: scripts })));
  const wireitDupes = findDuplicateKeys(perFileWireit.map(({ file, wireit }) => ({ file, map: wireit })));

  // Reporting
  header('🧪 Scripts audit (root vs src/packages/*.jsonc)');
  if (scriptsMissing.length) {
    console.log('• Missing (in root, not listed in any src/packages/*.jsonc):');
    scriptsMissing.forEach((n) => console.log(`  - ${n}`));
  } else {
    console.log('• No missing script entries.');
  }
  if (scriptsChanged.length) {
    console.log('• Changed (defined in both, but command differs):');
    for (const c of scriptsChanged) {
      console.log(`  - ${c.name} in ${c.file}\n      root: ${c.root}\n      file: ${c.found}`);
    }
  } else {
    console.log('• No changed script entries.');
  }
  if (scriptDupes.length) {
    console.log('• Duplicates (same script key in multiple files):');
    for (const d of scriptDupes) {
      console.log(`  - ${d.name}`);
      d.files.forEach((f) => console.log(`      ${f}`));
    }
  } else {
    console.log('• No duplicate script entries.');
  }

  header('🧩 Wireit audit (root vs src/packages/*.jsonc)');
  if (wireitMissing.length) {
    console.log('• Missing (in root, not listed in any src-packages/*.jsonc):');
    wireitMissing.forEach((n) => console.log(`  - ${n}`));
  } else {
    console.log('• No missing wireit entries.');
  }
  if (wireitChanged.length) {
    console.log('• Changed (defined in both, but config differs):');
    for (const c of wireitChanged) {
      console.log(`  - ${c.name} in ${c.file}`);
    }
  } else {
    console.log('• No changed wireit entries.');
  }
  if (wireitDupes.length) {
    console.log('• Duplicates (same wireit key in multiple files):');
    for (const d of wireitDupes) {
      console.log(`  - ${d.name}`);
      d.files.forEach((f) => console.log(`      ${f}`));
    }
  } else {
    console.log('• No duplicate wireit entries.');
  }
}

main().catch((err: unknown) => {
  if (err instanceof Error) {
    console.error('✖ Error:', err.message);
  } else {
    console.error('✖ Unknown error:', err);
  }
  process.exit(1);
});
