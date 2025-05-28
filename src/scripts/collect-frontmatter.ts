/**
 * list-frontmatter-keys.ts
 *
 * Recursively parses all `.md` files in a directory,
 * extracts YAML frontmatter keys (including nested keys),
 * and prints a sorted, structured list.
 *
 * Usage:
 *   npx ts-node list-frontmatter-keys.ts --dir ./content --verbose
 *
 * Options:
 *   --dir <path>       Directory to scan (default: current working directory)
 *   --verbose          Log each file as it's processed
 *   --help             Show this help message
 */

import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { pathToFileURL } from 'node:url'
import { glob } from 'glob'
import matter from 'gray-matter'
import minimist from 'minimist'

interface Options {
  dir: string
  verbose: boolean
  help: boolean
}

interface Config {
  baseDir: string
}

/**
 * Print usage/help text to stdout.
 */
function printHelp(): void {
  console.log(`
Usage: list-frontmatter-keys [options]

Options:
  --dir <path>       Directory to scan (default: cwd)
  --verbose          Show each file as it's processed
  --help             Show this help message
`)
}

/**
 * Parse CLI arguments into Options.
 * @returns Parsed Options
 */
function parseArgs(): Options {
  const argv = minimist(process.argv.slice(2), {
    string: ['dir'],
    boolean: ['verbose', 'help'],
    alias: { d: 'dir', v: 'verbose', h: 'help' },
    default: { dir: process.cwd(), verbose: false, help: false },
  })

  return {
    dir: argv.dir,
    verbose: argv.verbose,
    help: argv.help,
  }
}

/**
 * Scan markdown files under `baseDir`, extract frontmatter keys (and nested keys),
 * and return a Map of top-level keys to a set of sub-keys (or an empty set).
 *
 * @param config Configuration options
 * @returns Map where each key is a frontmatter field, and its value is a Set of nested keys
 */
async function collectFrontmatterKeys(config: Config): Promise<Map<string, Set<string>>> {
  const pattern = '**/*.md'
  const cwd = config.baseDir
  const files = await glob(pattern, { cwd })

  const keyMap = new Map<string, Set<string>>()

  for (const relPath of files) {
    const fullPath = resolve(cwd, relPath)
    try {
      const content = await readFile(fullPath, 'utf-8')
      const parsed = matter(content)
      const data = parsed.data

      for (const [key, value] of Object.entries(data)) {
        if (!keyMap.has(key)) {
          keyMap.set(key, new Set())
        }
        // if the value is a plain object, collect its keys
        if (value && typeof value === 'object' && !Array.isArray(value)) {
          for (const subKey of Object.keys(value)) {
            keyMap.get(key)?.add(subKey)
          }
        }
      }

      if (options.verbose) {
        console.log(`Processed: ${relPath}`)
      }
    } catch (err: unknown) {
      console.error(`Error reading ${relPath}:`, (err as Error).message)
    }
  }

  return keyMap
}

let options: Options

/**
 * Entry point when script is executed directly.
 */
async function main(): Promise<void> {
  options = parseArgs()

  if (options.help) {
    printHelp()
    process.exit(0)
  }

  const baseDir = resolve(process.cwd(), options.dir)
  const config: Config = { baseDir }

  try {
    const keyMap = await collectFrontmatterKeys(config)
    if (keyMap.size === 0) {
      console.log('No frontmatter keys found.')
      return
    }

    console.log('Frontmatter keys:')
    for (const key of Array.from(keyMap.keys()).sort()) {
      const subs = keyMap.get(key)
      if (subs && subs.size > 0) {
        console.log(`- ${key}:`)
        for (const sub of Array.from(subs).sort()) {
          console.log(`  - ${sub}`)
        }
      } else {
        console.log(`- ${key}`)
      }
    }
  } catch (err: unknown) {
    console.error('Failed to collect frontmatter keys:', (err as Error).message)
    process.exit(1)
  }
}

// Only run main() when invoked directly
const scriptPath = process.argv[1] ?? ''
if (import.meta.url === pathToFileURL(scriptPath).href) {
  main().catch(err => {
    console.error('Unexpected error:', (err as Error).message)
    process.exit(1)
  })
}
