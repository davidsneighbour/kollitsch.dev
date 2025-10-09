import { readFile } from 'node:fs/promises';
import { ZodError, type ZodIssue, z } from 'zod';

/**
 * Options for schema creation and validation.
 */
export interface ValidateOptions {
  /** Maximum length for the "name" field. */
  maxNameLength?: number;
  /** Allow an empty list. Default: true */
  allowEmpty?: boolean;
}

/**
 * Feed item type inferred from the schema.
 */
export type FeedItem = z.infer<ReturnType<typeof makeFeedItemSchema>>;
export type FeedList = z.infer<ReturnType<typeof makeFeedListSchema>>;

/**
 * Create a Zod schema for a single feed item.
 * @param opts - Validation options
 * @returns Zod schema for one item
 */
export function makeFeedItemSchema(opts: ValidateOptions = {}) {
  const { maxNameLength = 56 } = opts;

  return z
    .object({
      // "description" is a markdown string. No limits beyond being a string if present.
      description: z.string().optional(),
      name: z
        .string()
        .min(1, 'name is required')
        .max(maxNameLength, `name must be at most ${maxNameLength} characters`),
      rss: z.string().url({ message: 'rss must be a valid URL' }).optional(),
      url: z.string().url({ message: 'url must be a valid URL' }),
    })
    .strict();
}

/**
 * Create a Zod schema for a list of feed items.
 * @param opts - Validation options
 * @returns Zod schema for a list
 */
export function makeFeedListSchema(opts: ValidateOptions = {}) {
  const base = z.array(makeFeedItemSchema(opts));
  return opts.allowEmpty === false
    ? base.nonempty('list must not be empty')
    : base;
}

/**
 * Validate a feed list and return typed data or throw a detailed error.
 * @param data - Unknown JSON input (e.g., parsed from a file)
 * @param opts - Validation options
 * @returns Validated and typed feed list
 * @throws Error with a readable message if validation fails
 */
export function validateFeedListOrThrow(
  data: unknown,
  opts: ValidateOptions = {},
): FeedList {
  try {
    const parsed = makeFeedListSchema(opts).parse(data);
    return parsed;
  } catch (err) {
    if (err instanceof ZodError) {
      const lines = formatZodIssues(err.issues);
      const message = ['Validation failed:', ...lines].join('\n');
      throw new Error(message);
    }
    throw err;
  }
}

/**
 * Validate a feed list and return a result object (no throw).
 * @param data - Unknown JSON input
 * @param opts - Validation options
 * @returns Result object with success flag and data or errors
 */
export function safeValidateFeedList(
  data: unknown,
  opts: ValidateOptions = {},
): { ok: true; data: FeedList } | { ok: false; errors: string[] } {
  const result = makeFeedListSchema(opts).safeParse(data);
  if (result.success) {
    return { data: result.data, ok: true };
  }
  return { errors: formatZodIssues(result.error.issues), ok: false };
}

/**
 * Pretty-print Zod issues with item indices and paths.
 * @param issues - Zod issues
 * @returns Array of human-friendly error lines
 */
export function formatZodIssues(issues: ZodIssue[]): string[] {
  return issues.map((i) => {
    const path = i.path
      .map((p) => (typeof p === 'number' ? `[${p}]` : `.${p}`))
      .join('')
      .replace(/^\./, '');
    return path ? `${path}: ${i.message}` : i.message;
  });
}

/* ---------------------------------------------
 * Example usage
 * ---------------------------------------------
 * import { readFile } from "node:fs/promises";
 *
 * const raw = await readFile("feeds.json", "utf8");
 * const json = JSON.parse(raw);
 *
 * // Strict throw-on-error:
 * const feeds = validateFeedListOrThrow(json, { maxNameLength: 56, allowEmpty: true });
 *
 * // Or safe mode:
 * const result = safeValidateFeedList(json, { maxNameLength: 56 });
 * if (!result.ok) {
 *   console.error(result.errors.join("\n"));
 *   process.exit(1);
 * }
 * console.log(result.data);
 */

/**
 * Load, validate, and return the blogroll (sorted by name ASC).
 * @param filePath - Path to the JSON file
 * @param opts - Validation options
 * @returns Validated and sorted list of feed items
 *
 * @example
 * ```
 * const blogroll = await getBlogroll("feeds.json", { maxNameLength: 56 });
 * console.log(blogroll);
 * ```
 */
export async function getBlogroll(
  filePath: string,
  opts: ValidateOptions = {},
): Promise<FeedList> {
  const raw = await readFile(filePath, 'utf8');
  const json = JSON.parse(raw);
  const feeds = validateFeedListOrThrow(json, opts);
  return feeds.sort((a, b) => a.name.localeCompare(b.name));
}
