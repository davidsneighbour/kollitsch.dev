import { execFile } from "node:child_process";
import { createHash } from 'node:crypto';
import { cp, mkdir, readdir, readFile, rm, stat, writeFile } from 'node:fs/promises';
import { promisify } from "node:util";
import type { AstroIntegration } from "astro";
import path, { extname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createIndex, type PagefindServiceConfig } from 'pagefind';
import sirv from 'sirv';
import { generateHeaders } from './build-headers.ts';
import { collectFrontmatterHeaderRules } from './collect-frontmatter-headers.ts';

export interface PagefindOptions {
    /**
     * `PagefindServiceConfig` passed to pagefind's `createIndex`
     */
    indexConfig?: PagefindServiceConfig;
}

const execFileAsync = promisify(execFile);

const prunableImageExtensions = new Set([
    '.avif',
    '.gif',
    '.jpeg',
    '.jpg',
    '.png',
    '.webp',
]);

const searchableOutputExtensions = new Set([
    '.css',
    '.html',
    '.js',
    '.json',
    '.map',
    '.mjs',
    '.svg',
    '.txt',
    '.webmanifest',
    '.xml',
]);

async function listFiles(root: string): Promise<string[]> {
    const entries = await readdir(root, { withFileTypes: true });
    const files = await Promise.all(entries.map(async (entry) => {
        const fullPath = path.join(root, entry.name);
        if (entry.isDirectory()) return listFiles(fullPath);
        if (entry.isFile()) return [fullPath];
        return [];
    }));
    return files.flat();
}

const pagefindCacheDir = path.join(process.cwd(), '.cache', 'pagefind');
const pagefindCacheOutputDir = path.join(pagefindCacheDir, 'output');
const pagefindCacheHashFile = path.join(pagefindCacheDir, 'content-hash.txt');

/**
 * Hashes every rendered HTML file in `outDir` so repeated builds with
 * unchanged output can skip regenerating the Pagefind index. Pagefind's own
 * output is not guaranteed byte-identical across runs even when the indexed
 * content is unchanged (internal term ordering depends on file read order),
 * so comparing indexed page content directly is more reliable than comparing
 * Pagefind's output.
 */
async function hashRenderedOutput(outDir: string): Promise<string> {
    const files = (await listFiles(outDir))
        .filter((file) => extname(file).toLowerCase() === '.html')
        .sort();

    const hash = createHash('sha256');
    for (const file of files) {
        hash.update(path.relative(outDir, file));
        hash.update(await readFile(file));
    }
    return hash.digest('hex');
}

async function readCachedHash(): Promise<string | undefined> {
    try {
        return (await readFile(pagefindCacheHashFile, 'utf8')).trim();
    } catch {
        return undefined;
    }
}

async function restoreCachedPagefindOutput(outputPath: string): Promise<boolean> {
    try {
        await stat(pagefindCacheOutputDir);
    } catch {
        return false;
    }
    await rm(outputPath, { force: true, recursive: true });
    await cp(pagefindCacheOutputDir, outputPath, { recursive: true });
    return true;
}

async function saveCachedPagefindOutput(outputPath: string, hash: string): Promise<void> {
    await mkdir(pagefindCacheDir, { recursive: true });
    await rm(pagefindCacheOutputDir, { force: true, recursive: true });
    await cp(outputPath, pagefindCacheOutputDir, { recursive: true });
    await writeFile(pagefindCacheHashFile, hash);
}

async function pruneUnreferencedImageAssets(outDir: string): Promise<{ count: number; bytes: number }> {
    const assetsDir = path.join(outDir, 'assets');

    try {
        await stat(assetsDir);
    } catch {
        return { bytes: 0, count: 0 };
    }

    const files = await listFiles(outDir);
    const imageAssets = files.filter((file) => {
        return path.dirname(file) === assetsDir && prunableImageExtensions.has(extname(file).toLowerCase());
    });
    const searchableFiles = files.filter((file) => {
        return !imageAssets.includes(file) && searchableOutputExtensions.has(extname(file).toLowerCase());
    });

    const outputText = (
        await Promise.all(searchableFiles.map((file) => readFile(file, 'utf8').catch(() => '')))
    ).join('\n');

    let count = 0;
    let bytes = 0;

    for (const imageAsset of imageAssets) {
        const filename = path.basename(imageAsset);
        if (outputText.includes(filename)) continue;

        const fileStat = await stat(imageAsset);
        await rm(imageAsset);
        count += 1;
        bytes += fileStat.size;
    }

    return { bytes, count };
}

/**
 * Astro build hook that generates followers RSS feeds before the actual Astro 
 * production build starts.
 *
 * @returns {AstroIntegration} Astro integration definition.
 */
function generateFeedsIntegration(): AstroIntegration {
    return {
        name: "dnb-followerfeeds",
        hooks: {
            "astro:build:start": async ({ logger }) => {
                const feeds: Array<{ label: string; output: string }> = [
                    {
                        label: "dnb-entertainment",
                        output: "./public/dnb-entertainment.rss.xml",
                    },
                    {
                        label: "dnb-webdev",
                        output: "./public/dnb-webdev.rss.xml",
                    },
                ];

                const hasFreshRssConfig = Boolean(
                    process.env['FRESHRSS_BASE_URL']
                    && process.env['FRESHRSS_USERNAME']
                    && process.env['FRESHRSS_API_PASSWORD'],
                );

                if (!hasFreshRssConfig) {
                    logger.warn("Skipping feed generation: FreshRSS environment variables are not configured.");
                    return;
                }

                try {
                    logger.info("Generating feeds...");

                    for (const feed of feeds) {
                        await execFileAsync("node", [
                            "./src/scripts/build/starred-feed.ts",
                            `--label=${feed.label}`,
                            `--output=${feed.output}`,
                        ]);
                    }

                    logger.info("Feeds generated successfully.");
                } catch (error: unknown) {
                    logger.error("Feed generation failed.");
                    throw error;
                }
            },
        },
    };
}

/**
 * Astro build hook that runs Pagefind after the Astro build is done.
 * 
 * @param indexConfig Optional configuration for the Pagefind index, passed to `createIndex`.
 *
 * @returns {AstroIntegration} Astro integration definition.
 */
function pagefindIntegration({
    indexConfig,
}: PagefindOptions = {}): AstroIntegration {
    let clientDir: string | undefined;
    return {
        hooks: {
            'astro:build:done': async ({ dir, logger }) => {
                const outDir = fileURLToPath(dir);
                const outputPath = path.join(outDir, 'pagefind');

                const contentHash = await hashRenderedOutput(outDir);
                const cachedHash = await readCachedHash();
                if (cachedHash === contentHash && await restoreCachedPagefindOutput(outputPath)) {
                    logger.info('Pagefind output unchanged since last build, reused cached index');
                    return;
                }

                const { index, errors: createErrors } = await createIndex(indexConfig);
                if (!index) {
                    logger.error('Pagefind failed to create index');
                    createErrors.forEach((e) => logger.error(e));
                    return;
                }
                const { page_count, errors: addErrors } = await index.addDirectory({
                    path: outDir,
                });
                if (addErrors.length) {
                    logger.error('Pagefind failed to index files');
                    addErrors.forEach((e) => logger.error(e));
                    return;
                } else {
                    logger.info(`Pagefind indexed ${page_count} pages`);
                }
                const { errors: writeErrors } = await index.writeFiles({
                    outputPath,
                });
                if (writeErrors.length) {
                    logger.error('Pagefind failed to write index');
                    writeErrors.forEach((e) => logger.error(e));
                    return;
                } else {
                    logger.info(`Pagefind wrote index to ${outputPath}`);
                }

                await saveCachedPagefindOutput(outputPath, contentHash);
            },
            'astro:config:setup': ({ config, logger }) => {
                if (config.output === 'server') {
                    logger.warn(
                        'Output type `server` does not produce static *.html pages in its output and thus will not work with astro-pagefind integration.',
                    );
                }
                if (config.adapter) {
                    clientDir = fileURLToPath(config.build.client);
                }
            },
            'astro:server:setup': ({ server, logger }) => {
                const outDir =
                    clientDir ??
                    path.join(server.config.root, server.config.build.outDir);
                logger.debug(`Serving pagefind from ${outDir}`);
                const serve = sirv(outDir, {
                    dev: true,
                    etag: true,
                });
                server.middlewares.use((req, res, next) => {
                    if (req.url?.startsWith('/pagefind/')) {
                        serve(req, res, next);
                    } else {
                        next();
                    }
                });
            },
        },
        name: 'dnb-pagefind',
    };
}

/**
 * Astro build hook that generates `dist/_headers` after the Astro build
 * completes. Writing after the build (rather than copying from `public/`)
 * allows the Expires header to reflect the actual deploy timestamp and lets
 * it merge in rules collected from blog post frontmatter (see
 * `collect-frontmatter-headers.ts` and `src/data/headers.ts`).
 */
function generateHeadersIntegration(): AstroIntegration {
    return {
        name: 'dnb-headers',
        hooks: {
            'astro:build:done': async ({ dir, logger }) => {
                const outDir = fileURLToPath(dir);
                const extraRules = await collectFrontmatterHeaderRules();
                generateHeaders(outDir, extraRules);
                logger.info(`Generated _headers (${extraRules.length} rule(s) from frontmatter)`);
            },
        },
    };
}

function pruneImageAssetsIntegration(): AstroIntegration {
    return {
        name: 'dnb-prune-image-assets',
        hooks: {
            'astro:build:done': async ({ dir, logger }) => {
                const outDir = fileURLToPath(dir);
                const { bytes, count } = await pruneUnreferencedImageAssets(outDir);
                logger.info(`Pruned ${count} unreferenced image asset(s), saving ${(bytes / 1024 / 1024).toFixed(2)} MiB`);
            },
        },
    };
}

export function buildHooks() {
    return [
        generateFeedsIntegration(),
        pruneImageAssetsIntegration(),
        generateHeadersIntegration(),
        pagefindIntegration({ indexConfig: { keepIndexUrl: true } }),
    ];
}
