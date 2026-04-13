import { execFile } from "node:child_process";
import { promisify } from "node:util";
import type { AstroIntegration } from "astro";
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createIndex, type PagefindServiceConfig } from 'pagefind';
import sirv from 'sirv';

export interface PagefindOptions {
    /**
     * `PagefindServiceConfig` passed to pagefind's `createIndex`
     */
    indexConfig?: PagefindServiceConfig;
}

const execFileAsync = promisify(execFile);

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

                try {
                    logger.info("Generating feeds...");

                    for (const feed of feeds) {
                        await execFileAsync("node", [
                            "./src/scripts/starred-feed.ts",
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
                const { outputPath, errors: writeErrors } = await index.writeFiles({
                    outputPath: path.join(outDir, 'pagefind'),
                });
                if (writeErrors.length) {
                    logger.error('Pagefind failed to write index');
                    writeErrors.forEach((e) => logger.error(e));
                    return;
                } else {
                    logger.info(`Pagefind wrote index to ${outputPath}`);
                }
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

export function buildHooks() {
    return [
        generateFeedsIntegration(),
        pagefindIntegration({ indexConfig: { keepIndexUrl: true } }),
    ];
}