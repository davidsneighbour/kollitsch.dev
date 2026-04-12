import { execFile } from "node:child_process";
import { promisify } from "node:util";
import type { AstroIntegration } from "astro";

const execFileAsync = promisify(execFile);

/**
 * Astro build hook that generates followers RSS feeds before the actual Astro
 * production build starts.
 *
 * @returns {AstroIntegration} Astro integration definition.
 */
function generateFeedsIntegration(): AstroIntegration {
    return {
        name: "generate-feeds-before-build",
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

export function buildHooks() {
    return [
        generateFeedsIntegration(),
        // future hooks can be added here
    ];
}