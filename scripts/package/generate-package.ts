import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import glob from 'glob';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(scriptDir, '../..');

/**
 * keys to preserve from the original package.json
 * can be overridden with `--keys` parameter
 * e.g. --keys name,description,version
 */
let keysToPreserve: string[] = [
  'name',
  'description',
  'version',
  'author',
  'bugs',
  'engines',
  'homepage',
  'license',
  'private',
  'repository',
  'publishConfig',
  'type',
];

/**
 * @typedef {Object} Options
 * @property {string}  pkgPath  Absolute path to package.json
 * @property {boolean} verbose  Whether to log each change
 * @property {boolean} dryRun   If true, do not write file
 *
 * @returns {Options}
 */
function parseArgs(): Options {
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
      case '--keys':
        if (!args[i + 1]) {
          console.error('✖ Missing value for --keys');
          process.exit(1);
        }
        keysToPreserve = args[++i].split(',').map((key) => key.trim());
        break;
      default:
        console.error(`✖ Unknown argument: ${a}`);
        process.exit(1);
    }
  }
  return opts;
}

/**
 * deep-merge source into target. Objects merge recursively;
 * arrays and primitives are overwritten.
 * @template T
 * @param {T} target
 * @param {Partial<T>} source
 * @returns {T}
 */
function mergeDeep<T>(target: T, source: Partial<T>): T {
  for (const key of Object.keys(source)) {
    const sv = source[key];
    const tv = target[key];
    if (
      sv !== null &&
      typeof sv === 'object' &&
      !Array.isArray(sv) &&
      tv !== null &&
      typeof tv === 'object' &&
      !Array.isArray(tv)
    ) {
      mergeDeep(tv, sv);
    } else {
      target[key] = sv;
    }
  }
  return target;
}

/**
 * filters package.json to include only specified keys
 * @param {Record<string, any>} pkg
 * @param {string[]} keys
 * @returns {Record<string, any>}
 */
function filterPackageJson(
  pkg: Record<string, any>,
  keys: string[],
): Record<string, any> {
  const filtered = {};
  for (const key of keys) {
    if (pkg[key]) {
      filtered[key] = pkg[key];
    }
  }
  return filtered;
}

async function main() {
  const { pkgPath, verbose, dryRun } = parseArgs();

  // discover all JSON files
  const configPaths = glob.sync('scripts/package/**/*.json', {
    cwd: projectRoot,
    absolute: true,
  });

  if (verbose) {
    console.error(`> Using keys: ${keysToPreserve.join(', ')}`);
    console.error(`> Reading package.json from ${pkgPath}`);
  }

  // load package.json
  let pkg;
  try {
    pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
    if (verbose) {
      console.error(`> Project Name: ${pkg.name}`);
      console.error(`> Description: ${pkg.description}`);
      console.error(`> Version: ${pkg.version}`);
    }
  } catch (err) {
    console.error(`✖ Failed to read/parse ${pkgPath}: ${err.message}`);
    process.exit(1);
  }

  // filter the original package.json
  const filteredPkg = filterPackageJson(pkg, keysToPreserve);

  // merge each JSON config file into the new object
  for (const cfgPath of configPaths) {
    if (verbose) console.error(`> Merging values from ${cfgPath}`);
    let cfg;
    try {
      cfg = JSON.parse(fs.readFileSync(cfgPath, 'utf8'));
      mergeDeep(filteredPkg, cfg);
    } catch (err) {
      console.error(`✖ Failed to parse ${cfgPath}: ${err.message}`);
      process.exit(1);
    }
  }

  // remove the "notes" key if it exists
  if (filteredPkg.notes) {
    delete filteredPkg.notes;
    if (verbose)
      console.error('> Removed "notes" from package.json structure.');
  }

  // write back (or dry-run)
  const outputPath = path.resolve(projectRoot, 'package.json');
  if (dryRun) {
    console.log('✔ Dry run complete, no file written.');
    console.log(JSON.stringify(filteredPkg, null, 2));
    return;
  }

  try {
    fs.writeFileSync(
      outputPath,
      JSON.stringify(filteredPkg, null, 2) + '\n',
      'utf8',
    );
    console.log(`✔ Merged values written to ${outputPath}`);
  } catch (err) {
    console.error(`✖ Failed to write ${outputPath}: ${err.message}`);
    process.exit(1);
  }
}

main();
