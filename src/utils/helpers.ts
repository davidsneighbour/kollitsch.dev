import { randomBytes } from 'node:crypto';
import { z } from 'zod';

/**
 * Generates a unique ID string for HTML elements.
 *
 * That ID should be ugly and unique. Nobody cares.
 * It's used for dynamic replacement inside components or layouts.
 * The ID is only used within a self-contained context.
 *
 * @param prefix - Optional prefix for the ID (e.g., 'section', 'input'). Defaults to 'dnbuid'.
 * @param length - Length of the random hexadecimal part (must be even). Defaults to 16.
 * @returns A unique, prefix-based ID like 'prefix-a1b2c3d4'
 *
 * @throws Will throw if length is not a positive even number.
 *
 * @example
 * generateUniqueHtmlId('block', 8); // block-8e4a32f1
 */
export function generateUniqueHtmlId(prefix = 'dnbuid', length = 16): string {
  const isEven = length % 2 === 0;
  if (!isEven || length <= 0) {
    throw new Error(
      'generateUniqueHtmlId: Length must be a positive even number.',
    );
  }

  const randomHex = Array.from(
    // browser-safe crypto.getRandomValues, which is available in Astro
    // components, because it supports Web Crypto via polyfill
    crypto.getRandomValues(new Uint8Array(length / 2)),
  )
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
  return `${prefix}-${randomHex}`;
}

/**
 * Create a random string of the specified length
 */
export function generateRandomString(len: number): string {
  const chars: string[] = [];
  const charsetLen = 36;
  const maxMultiple = Math.floor(256 / charsetLen) * charsetLen; // 252

  while (chars.length < len) {
    const arr = new Uint8Array(1);
    crypto.getRandomValues(arr);
    const n = arr[0]!;
    if (n < maxMultiple) {
      chars.push((n % charsetLen).toString(36));
    }
  }

  return chars.join('');
}

/**
 * Schema for createIdentifier options.
 *
 * Enforces:
 * - prefix: optional string
 * - length: positive integer (> 0)
 *
 * Defaults:
 * - prefix: "identifier"
 * - length: 24
 */
export const CreateIdentifierSchema = z
  .object({
    length: z.number().int().positive().default(24),
    prefix: z.string().default('identifier'),
  })
  .strict();

/**
 * Type inferred from schema.
 */
export type CreateIdentifierOptions = z.infer<typeof CreateIdentifierSchema>;

/**
 * Generate a random, DOM-safe identifier string.
 *
 * Validation and defaults are handled via Zod.
 *
 * @example
 * createIdentifier(); // => "identifier-k3j9a2l0p1"
 *
 * @example
 * createIdentifier({ prefix: "header" }); // => "header-x9k2m4n8q1"
 *
 * @example
 * createIdentifier({ length: 6 }); // => "identifier-a1b2c3"
 *
 * @param input Optional configuration object (validated via Zod)
 * @returns A unique identifier string
 */
export function createIdentifier(input?: unknown): string {
  const { prefix, length } = CreateIdentifierSchema.parse(input ?? {});

  const alphabet = 'abcdefghijklmnopqrstuvwxyz0123456789';
  const bytes = randomBytes(length);

  const suffix = Array.from(bytes, (byte) => {
    return alphabet[byte % alphabet.length];
  }).join('');

  return `${prefix}-${suffix}`;
}
