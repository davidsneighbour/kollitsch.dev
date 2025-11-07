import { readFile } from 'node:fs/promises';
import { type ZodIssue, z } from 'zod';

const DEFAULT_MAX_NAME_LENGTH = 56;
const DEFAULT_ALLOW_EMPTY = true;

type FeedItemSchema = z.ZodObject<{
  description: z.ZodOptional<z.ZodString>;
  name: z.ZodString;
  rss: z.ZodOptional<z.ZodString>;
  url: z.ZodString;
}>;

type FeedListSchema = z.ZodArray<FeedItemSchema>;

/**
 * Options for schema creation and validation.
 */
export interface ValidateOptions {
  /** Maximum length allowed for a feed "name" entry. */
  readonly maxNameLength?: number;
  /** Whether empty lists are permitted. Defaults to true. */
  readonly allowEmpty?: boolean;
}

/**
 * Canonical union for a safe feed validation attempt.
 */
export type SafeFeedListResult =
  | { readonly ok: true; readonly data: FeedList }
  | { readonly ok: false; readonly errors: readonly string[] };

/**
 * Feed item type inferred from the schema.
 */
export type FeedItem = z.infer<FeedItemSchema>;

/**
 * Feed list type inferred from the schema.
 */
export type FeedList = z.infer<FeedListSchema>;

/**
 * Create a Zod schema for a single feed item.
 *
 * The schema enforces the following rules:
 * - `name` must be a non-empty string shorter than the configured limit.
 * - `url` must be a valid URL.
 * - `rss` is optional but, when present, must also be a valid URL.
 * - `description` is optional markdown text.
 *
 * @param opts - Validation options, defaults to { maxNameLength: 56 }.
 * @returns Strict Zod schema for a single feed item.
 * @example
 * ```ts
 * import { makeFeedItemSchema } from '@utils/blogroll';
 * const schema = makeFeedItemSchema({ maxNameLength: 80 });
 * const item = schema.parse({ name: 'Example', url: 'https://example.com' });
 * ```
 */
export function makeFeedItemSchema(
  opts: Readonly<ValidateOptions> = {},
): FeedItemSchema {
  const { maxNameLength = DEFAULT_MAX_NAME_LENGTH } = opts;

  return z
    .object({
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
 *
 * @param opts - Validation options, defaults to allowing empty lists.
 * @returns Array schema for feed items, optionally marked as non-empty.
 * @example
 * ```ts
 * import { makeFeedListSchema } from '@utils/blogroll';
 * const schema = makeFeedListSchema({ allowEmpty: false });
 * schema.parse([{ name: 'Example', url: 'https://example.com' }]);
 * ```
 */
export function makeFeedListSchema(
  opts: Readonly<ValidateOptions> = {},
): FeedListSchema {
  const baseSchema: FeedListSchema = z.array(makeFeedItemSchema(opts));
  if (opts.allowEmpty === false) {
    return baseSchema.nonempty('list must not be empty');
  }
  return baseSchema;
}

/**
 * Validate a feed list and throw a descriptive error on failure.
 *
 * @param data - Unknown JSON input (for example parsed from disk).
 * @param opts - Validation options forwarded to the schema factory.
 * @returns Validated feed list with strong typing guarantees.
 * @throws Error - When validation fails, with a multi-line message describing issues.
 * @example
 * ```ts
 * import { validateFeedListOrThrow } from '@utils/blogroll';
 * const feeds = validateFeedListOrThrow([{ name: 'Example', url: 'https://example.com' }]);
 * ```
 */
export function validateFeedListOrThrow(
  data: unknown,
  opts: Readonly<ValidateOptions> = {},
): FeedList {
  const result = makeFeedListSchema(opts).safeParse(data);
  if (result.success) {
    return result.data;
  }
  const message = [
    'Validation failed:',
    ...formatZodIssues(result.error.issues),
  ].join('\n');
  throw new Error(message, { cause: result.error });
}

/**
 * Validate a feed list and collect errors instead of throwing.
 *
 * @param data - Unknown JSON input to validate.
 * @param opts - Validation options forwarded to the schema factory.
 * @returns Discriminated union result describing success or a list of errors.
 * @example
 * ```ts
 * import { safeValidateFeedList } from '@utils/blogroll';
 * const result = safeValidateFeedList([{ name: 'Example', url: 'https://example.com' }]);
 * if (!result.ok) {
 *   console.error(result.errors.join('\n'));
 * }
 * ```
 */
export function safeValidateFeedList(
  data: unknown,
  opts: Readonly<ValidateOptions> = {},
): SafeFeedListResult {
  const result = makeFeedListSchema(opts).safeParse(data);
  if (result.success) {
    return { data: result.data, ok: true };
  }
  return { errors: formatZodIssues(result.error.issues), ok: false };
}

/**
 * Pretty-print Zod issues with item indices and property paths.
 *
 * @param issues - Collection of Zod issues produced during validation.
 * @returns Array of human-friendly error lines (without leading dots).
 * @example
 * ```ts
 * import { formatZodIssues, makeFeedListSchema } from '@utils/blogroll';
 * const result = makeFeedListSchema().safeParse([]);
 * if (!result.success) {
 *   console.log(formatZodIssues(result.error.issues));
 * }
 * ```
 */
export function formatZodIssues(issues: ReadonlyArray<ZodIssue>): string[] {
  return issues.map((issue) => {
    const path = formatIssuePath(issue.path);
    return path ? `${path}: ${issue.message}` : issue.message;
  });
}

function formatIssuePath(
  path: ReadonlyArray<ZodIssue['path'][number]>,
): string {
  if (path.length === 0) {
    return '';
  }
  return path
    .map((segment) =>
      typeof segment === 'number' ? `[${segment}]` : `.${segment}`,
    )
    .join('')
    .replace(/^\./u, '');
}

/**
 * Load, validate, and return the blogroll (sorted by name ascending).
 *
 * @param filePath - Path to the JSON file containing the blogroll definition.
 * @param opts - Validation options forwarded to the schema factory.
 * @returns Promise resolving to a sorted feed list.
 * @throws Error - If the file cannot be parsed or validation fails. The original
 * error is available via {@link Error.cause | `cause`} for inspection.
 * @example
 * ```ts
 * import { getBlogroll } from '@utils/blogroll';
 * const blogroll = await getBlogroll('feeds.json');
 * console.log(blogroll.map((feed) => feed.name));
 * ```
 */
export async function getBlogroll(
  filePath: string,
  opts: Readonly<ValidateOptions> = {},
): Promise<FeedList> {
  const raw = await readFile(filePath, 'utf8');

  let json: unknown;
  try {
    json = JSON.parse(raw) as unknown;
  } catch (error) {
    const reason =
      error instanceof Error ? error.message : 'Unknown JSON parse error';
    throw new Error(`Failed to parse blogroll JSON at ${filePath}: ${reason}`, {
      cause: error,
    });
  }

  const feeds = validateFeedListOrThrow(json, opts);
  return [...feeds].sort((a, b) => a.name.localeCompare(b.name));
}
