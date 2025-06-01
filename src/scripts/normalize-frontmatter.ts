import fs from 'fs/promises';
import matter from 'gray-matter';
import { glob } from 'glob';

const BLOG_PATH = './src/content/blog';

// (Add your BLOG_PATH configuration above)

//
// Configuration: adjust the target timezone offset (in hours) here.
// For ICT (UTC+7), set to 7.
// For UTC, set to 0. For PST (UTC–8), set to -8, etc.
//
const TARGET_TIMEZONE_OFFSET_HOURS = 7;

/**
 * Formats a date value into ISO 8601 with time and the configured timezone offset.
 *
 * @param value - The original date value from frontmatter.
 * @returns A string like "YYYY-MM-DDTHH:mm:ss±HH:MM", or null if invalid.
 */
// biome-ignore lint/suspicious/noExplicitAny: this function is used to go from `any` to a date formatted string
function formatDate(value: any): string | null {
  const date = new Date(value);
  if (isNaN(date.getTime())) return null;

  // Convert the absolute timestamp into the configured timezone
  const offsetMs = TARGET_TIMEZONE_OFFSET_HOURS * 60 * 60 * 1000;
  const tzDate = new Date(date.getTime() + offsetMs);

  const YYYY = tzDate.getUTCFullYear();
  const MM = String(tzDate.getUTCMonth() + 1).padStart(2, '0');
  const DD = String(tzDate.getUTCDate()).padStart(2, '0');
  const hh = String(tzDate.getUTCHours()).padStart(2, '0');
  const mm = String(tzDate.getUTCMinutes()).padStart(2, '0');
  const ss = String(tzDate.getUTCSeconds()).padStart(2, '0');

  // Format offset as "+HH:MM" or "-HH:MM"
  const sign = TARGET_TIMEZONE_OFFSET_HOURS >= 0 ? '+' : '-';
  const absHours = Math.abs(TARGET_TIMEZONE_OFFSET_HOURS);
  const offsetHH = String(Math.trunc(absHours)).padStart(2, '0');
  const offsetMM = String((absHours % 1) * 60).padStart(2, '0');

  return `${YYYY}-${MM}-${DD}T${hh}:${mm}:${ss}${sign}${offsetHH}:${offsetMM}`;
}

/**
 * Scans all `index.md` files under the blog directory, parses frontmatter,
 * updates the `date` field to ISO 8601 with the configured timezone, and
 * extracts a cover image from `resources` if present.
 *
 * @returns A Promise that resolves when processing is complete.
 */
async function cleanFrontmatter(): Promise<void> {
  try {
    const files = await glob(`${BLOG_PATH}/**/index.md`, { absolute: true });
    for (const file of files) {
      try {
        const raw = await fs.readFile(file, 'utf-8');
        const parsed = matter(raw);
        const data = parsed.data;

        // Handle date normalization
        const original = data.date || data.publishDate || data.lastmod;
        const formatted = formatDate(original);
        if (!formatted) {
          console.warn(`⚠️  No valid date in ${file}`);
          continue;
        }
        if (data.date !== formatted) {
          data.date = formatted;
          delete data.publishDate;
          delete data.lastmod;
        }

        // Extract cover image from resources, if available
        const cover = getCoverFromResources(data.resources);
        if (cover) data.cover = cover;

        const updated = matter.stringify(parsed.content, data);
        await fs.writeFile(file, updated, 'utf-8');
        console.log(`✅ Updated frontmatter in: ${file}`);
      } catch (err) {
        console.error(`❌ Failed to process ${file}:`, err);
      }
    }
  } catch (err) {
    console.error('❌ Failed to glob files:', err);
    process.exit(1);
  }
}

interface Resource {
  src: string;
  title?: string;
  name?: string;
}

function getCoverFromResources(
  resources: unknown
): string | undefined {
  if (
    Array.isArray(resources) &&
    resources.length > 0 &&
    typeof (resources[0] as Resource).src === 'string'
  ) {
    return (resources[0] as Resource).src;
  }
  return undefined;
}

cleanFrontmatter();
