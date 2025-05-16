#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

/**
 * Project layout:
 *   projectRoot/
 *     package.json
 *     scripts/package/... (your config JSONs)
 */

// === compute project root ===
const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(scriptDir, '../..');

/**
 * @typedef {Object} Options
 * @property {string}  pkgPath  Absolute path to package.json
 * @property {boolean} verbose  Whether to log each change
 * @property {boolean} dryRun   If true, do not write file
 */

/** @returns {Options} */
function parseArgs() {
  const args = process.argv.slice(2);
  const opts = {
    pkgPath: path.resolve(projectRoot, 'package.json'),
    verbose: false,
    dryRun: false,
  };

  for (let i = 0; i < args.length; i++) {
    const a = args[i];
    switch (a) {
      case '--package':
        if (!args[i + 1]) {
          console.error('✖ Missing value for --package');
          process.exit(1);
        }
        opts.pkgPath = path.resolve(projectRoot, args[++i]);
        break;
      case '--verbose':
        opts.verbose = true;
        break;
      case '--dry-run':
        opts.dryRun = true;
        break;
      default:
        console.error(`✖ Unknown argument: ${a}`);
        process.exit(1);
    }
  }
  return opts;
}

/**
 * Deep-merge source into target. Objects merge recursively;
 * arrays and primitives are overwritten.
 * @template T
 * @param {T} target
 * @param {Partial<T>} source
 * @returns {T}
 */
function mergeDeep(target, source) {
  for (const key of Object.keys(source)) {
    const sv = source[key];
    const tv = target[key];
    if (
      sv !== null && typeof sv === 'object' && !Array.isArray(sv) &&
      tv !== null && typeof tv === 'object' && !Array.isArray(tv)
    ) {
      mergeDeep(tv, sv);
    } else {
      target[key] = sv;
    }
  }
  return target;
}

/**
 * Reads each config file in order and updates
 * pkg.dependencies and pkg.devDependencies to match.
 * @param {Record<string, any>} pkg
 * @param {string[]} configPaths
 * @param {boolean} verbose
 */
function updateVersions(pkg, configPaths, verbose) {
  pkg.dependencies = pkg.dependencies || {};
  pkg.devDependencies = pkg.devDependencies || {};

  for (const cfgPath of configPaths) {
    if (verbose) console.error(`> Loading versions from ${cfgPath}`);
    let cfg;
    try {
      cfg = JSON.parse(fs.readFileSync(cfgPath, 'utf8'));
    } catch (err) {
      console.error(`✖ Failed to parse ${cfgPath}: ${err.message}`);
      process.exit(1);
    }

    // dependencies
    if (cfg.dependencies && typeof cfg.dependencies === 'object') {
      for (const [name, ver] of Object.entries(cfg.dependencies)) {
        if (pkg.dependencies[name] !== ver) {
          if (verbose) {
            console.error(`  ↳ dep  ${name}: ${pkg.dependencies[name] || '<missing>'} → ${ver}`);
          }
          pkg.dependencies[name] = ver;
        }
      }
    }

    // devDependencies
    if (cfg.devDependencies && typeof cfg.devDependencies === 'object') {
      for (const [name, ver] of Object.entries(cfg.devDependencies)) {
        if (pkg.devDependencies[name] !== ver) {
          if (verbose) {
            console.error(`  ↳ dev  ${name}: ${pkg.devDependencies[name] || '<missing>'} → ${ver}`);
          }
          pkg.devDependencies[name] = ver;
        }
      }
    }
  }
}

/** Main */
async function main() {
  const { pkgPath, verbose, dryRun } = parseArgs();

  // your ordered config JSON files
  const rels = [
    'scripts/package/tools/browserslist.json',
    'scripts/package/tools/simple-git-hooks.json',
    'scripts/package/build/package.json',
    'scripts/package/build/hugo.json',
    'scripts/package/build/kollitsch-dev.json',
    'scripts/package/server/server.json',
    'scripts/package/tools/setup.json',
    'scripts/package/linting/linting.json',
    'scripts/package/linting/biome.json',
    'scripts/package/linting/eslint.json',
    'scripts/package/linting/prettier.json',
    'scripts/package/linting/secretlint.json',
    'scripts/package/test/test.json',
    'scripts/package/build/clean.json',
    'scripts/package/build/deploy.json',
    'scripts/package/build/pwa.json',
    'scripts/package/build/release.json',
  ];
  const configPaths = rels.map(r => path.resolve(projectRoot, r));

  // load package.json
  if (verbose) console.error(`> Reading package.json from ${pkgPath}`);
  let pkg;
  try {
    pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
  } catch (err) {
    console.error(`✖ Failed to read/parse ${pkgPath}: ${err.message}`);
    process.exit(1);
  }

  // update versions
  updateVersions(pkg, configPaths, verbose);

  // write back (or dry-run)
  if (dryRun) {
    console.log('✔ Dry run complete, no file written.');
    return;
  }

  try {
    fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n', 'utf8');
    console.log(`✔ Updated versions in ${pkgPath}`);
  } catch (err) {
    console.error(`✖ Failed to write ${pkgPath}: ${err.message}`);
    process.exit(1);
  }
}

main();
