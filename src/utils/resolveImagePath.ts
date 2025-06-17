import fs from 'node:fs';
import path from 'node:path';

/**
 * Resolve the correct image path for a given entry.
 *
 * @param imageName - The image filename from frontmatter
 * @param entryId - The _id of the entry (e.g., my-post/index.md)
 * @param collection - The name of the content collection (defaults to 'blog')
 * @returns A relative path string to the image if found, or null
 */
export function resolveImagePath(
  imageName: string,
  entryId: string,
  collection = 'blog',
): string | null {
  if (!imageName || typeof imageName !== 'string') return null;

  const localDir = path.join('src/content', collection, entryId);
  const localImagePath = path.join(localDir, imageName);
  const globalImagePath = path.join('src/assets/images', imageName);

  console.log(localImagePath);
  console.log(globalImagePath);

  if (fs.existsSync(localImagePath)) {
    return `/${localImagePath.replace(/\\/g, '/')}`;
  }

  if (fs.existsSync(globalImagePath)) {
    return `/src/assets/images/${imageName}`;
  }

  return null;
}
