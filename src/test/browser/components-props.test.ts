// @vitest-environment node

import { readFile } from "node:fs/promises";
import path from "node:path";
import fg from "fast-glob";
import { describe, expect, it } from "vitest";

/**
 * Matches:
 * - export interface Props
 * - export type Props =
 * - export interface HeaderProps
 * - export type HeaderProps =
 */
const PROPS_EXPORT_REGEX = /export\s+(?:interface|type)\s+[A-Za-z0-9_]*Props\b/;

/**
 * Component files to validate.
 *
 * Adjust the ignore list to match your project layout.
 */
const COMPONENT_GLOB_PATTERNS = [
    "src/components/**/*.astro",
    "!src/components/**/*.test.astro",
    "!src/components/**/__tests__/**",
];

/**
 * Return all Astro component files that should follow the props contract.
 */
async function getComponentFiles(): Promise<string[]> {
    const files = await fg(COMPONENT_GLOB_PATTERNS, {
        absolute: true,
        onlyFiles: true,
    });

    return files.sort((left, right) => left.localeCompare(right));
}

describe("Astro components props contract", async () => {
    const files = await getComponentFiles();

    it("finds at least one Astro component", () => {
        expect(files.length).toBeGreaterThan(0);
    });

    for (const filePath of files) {
        const relativePath = path.relative(process.cwd(), filePath);

        // heuristic: match `export interface XProps` or `export type XProps =`
        it(`${relativePath} exports a Props interface/type`, async () => {
            const source = await readFile(filePath, "utf8");
            expect(PROPS_EXPORT_REGEX.test(source)).toBe(true);
        });
    }
});