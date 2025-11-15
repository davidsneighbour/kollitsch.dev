import { z } from 'astro:content';

function preprocessNumber(value: unknown): unknown {
  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (trimmed === '') return Number.NaN;
    const parsed = Number(trimmed);
    return Number.isFinite(parsed) ? parsed : Number.NaN;
  }

  if (typeof value === 'boolean') {
    return value ? 1 : 0;
  }

  return value;
}

function intRange(min: number, max?: number) {
  return z
    .preprocess(
      preprocessNumber,
      z
        .number({ invalid_type_error: 'Expected a numeric value.' })
        .refine(Number.isFinite, { message: 'Value must be finite.' })
        .refine(Number.isInteger, { message: 'Value must be an integer.' })
        .refine((value) => value >= min, {
          message: `Value must be greater than or equal to ${min}.`,
        })
        .refine((value) => (max === undefined ? true : value <= max), {
          message: `Value must be less than or equal to ${max}.`,
        }),
    )
    .transform((value) => String(value));
}

const zeroOrOne = () => intRange(0, 1);
const zeroOneTwo = () => intRange(0, 2);
const positiveInt = () => intRange(0);

const languageCode = () =>
  z
    .string()
    .trim()
    .transform((value) => value.replace('_', '-').toLowerCase())
    .refine((value) => /^[a-z]{2,3}(?:-[a-z]{2,3})?$/.test(value), {
      message: 'Language codes must follow ISO 639-1 or 639-2 format.',
    });

const trimmedString = () => z.string().trim().min(1);

const colorString = () =>
  z
    .string()
    .trim()
    .transform((value) => value.toLowerCase())
    .refine((value) => value === 'red' || value === 'white', {
      message: 'Color must be either "red" or "white".',
    });

const listTypeString = () =>
  z
    .string()
    .trim()
    .transform((value) => value.toLowerCase())
    .refine((value) => value === 'playlist' || value === 'search' || value === 'user_uploads', {
      message: 'listType must be playlist, search, or user_uploads.',
    });

const ivLoadPolicy = () =>
  z
    .preprocess(preprocessNumber, z.number())
    .refine(Number.isFinite, { message: 'iv_load_policy must be numeric.' })
    .refine(Number.isInteger, { message: 'iv_load_policy must be an integer.' })
    .refine((value) => value === 1 || value === 3, {
      message: 'iv_load_policy must be either 1 or 3.',
    })
    .transform((value) => String(value));

const urlString = () => z.string().trim().url();

const qualityString = () =>
  z
    .string()
    .trim()
    .transform((value) => value.toLowerCase())
    .refine(
      (value) =>
        [
          'auto',
          'tiny',
          'small',
          'medium',
          'large',
          'hd720',
          'hd1080',
          'highres',
          'default',
          'hd1440',
          'hd2160',
        ].includes(value),
      {
        message:
          'vq must be one of auto, tiny, small, medium, large, hd720, hd1080, hd1440, hd2160, highres, or default.',
      },
    );

const baseSchema = {
  autoplay: zeroOrOne(),
  cc_lang_pref: languageCode(),
  cc_load_policy: zeroOrOne(),
  color: colorString(),
  controls: zeroOneTwo(),
  disablekb: zeroOrOne(),
  enablecastapi: zeroOrOne(),
  enablejsapi: zeroOrOne(),
  end: positiveInt(),
  fs: zeroOrOne(),
  hl: languageCode(),
  host: urlString(),
  iv_load_policy: ivLoadPolicy(),
  list: trimmedString(),
  listType: listTypeString(),
  loop: zeroOrOne(),
  modestbranding: zeroOrOne(),
  mute: zeroOrOne(),
  origin: urlString(),
  playlist: trimmedString(),
  playsinline: zeroOrOne(),
  rel: zeroOrOne(),
  si: trimmedString(),
  start: positiveInt(),
  use_native_controls: zeroOrOne(),
  vq: qualityString(),
  widget_referrer: urlString(),
  widgetid: trimmedString(),
} satisfies Record<string, z.ZodTypeAny>;

export const youtubePlayerParamsSchema = z
  .object(baseSchema)
  .partial()
  .strict();

export type YouTubePlayerParamKey = keyof typeof baseSchema;
type YouTubePlayerParamInputMap = {
  autoplay: string | number | boolean;
  cc_lang_pref: string;
  cc_load_policy: string | number | boolean;
  color: string;
  controls: string | number | boolean;
  disablekb: string | number | boolean;
  enablecastapi: string | number | boolean;
  enablejsapi: string | number | boolean;
  end: string | number | boolean;
  fs: string | number | boolean;
  hl: string;
  host: string;
  iv_load_policy: string | number | boolean;
  list: string;
  listType: string;
  loop: string | number | boolean;
  modestbranding: string | number | boolean;
  mute: string | number | boolean;
  origin: string;
  playlist: string;
  playsinline: string | number | boolean;
  rel: string | number | boolean;
  si: string;
  start: string | number | boolean;
  use_native_controls: string | number | boolean;
  vq: string;
  widget_referrer: string;
  widgetid: string;
};
type _EnsureKeyCoverage = Exclude<YouTubePlayerParamKey, keyof YouTubePlayerParamInputMap> extends never
  ? true
  : never;
type _EnsureNoExtraKeys = Exclude<keyof YouTubePlayerParamInputMap, YouTubePlayerParamKey> extends never
  ? true
  : never;
export type YouTubePlayerParamsInput = Partial<YouTubePlayerParamInputMap>;
export type YouTubePlayerParams = Partial<Record<YouTubePlayerParamKey, string>>;

export function sanitizeYouTubePlayerParams(raw?: unknown): YouTubePlayerParams {
  if (raw === null || typeof raw !== 'object') {
    return {};
  }

  const entries: Array<[YouTubePlayerParamKey, string]> = [];
  const source = raw as Record<string, unknown>;

  for (const key of Object.keys(baseSchema) as YouTubePlayerParamKey[]) {
    if (!(key in source)) continue;
    const schema = baseSchema[key];
    const parsed = schema.safeParse(source[key]);
    if (parsed.success) {
      entries.push([key, parsed.data]);
    }
  }

  return Object.fromEntries(entries) as YouTubePlayerParams;
}

export function serializeYouTubePlayerParams(params: YouTubePlayerParams): string {
  const search = new URLSearchParams();
  const keys = Object.keys(params) as YouTubePlayerParamKey[];
  keys.sort();
  for (const key of keys) {
    const value = params[key];
    if (value != null) {
      search.set(key, value);
    }
  }
  return search.toString();
}
