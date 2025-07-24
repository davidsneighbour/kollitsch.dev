import { z } from 'astro:content';

/**
 * Helper to recursively create a schema with default string values,
 * and explicit overrides applied for known option paths.
 */
export function buildOptionsSchema(overrides: Record<string, z.ZodTypeAny>) {
  const topLevelSections = new Set(
    Object.keys(overrides).map((key) => key.split('.')[0]),
  );

  const result: Record<string, z.ZodTypeAny> = {};

  for (const section of Array.from(topLevelSections)) {
    const entries: Record<string, z.ZodTypeAny> = {};
    for (const key in overrides) {
      const [sec, opt] = key.split('.');
      if (sec === section && opt && overrides[key]) {
        entries[opt] = overrides[key]!;
      }
    }

    result[section as string] = z.object(entries).catchall(z.string());
  }

  return z.object(result).catchall(z.object({}).catchall(z.string()));
}
