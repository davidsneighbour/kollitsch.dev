import type { CollectionEntry } from 'astro:content';
import fs from 'node:fs';
import path from 'node:path';
import {
  getBlogSocialImagePath,
  getDefaultSocialImagePath,
} from '@utils/social-image/paths.ts';

function existsInPublic(webPath: string): boolean {
  return fs.existsSync(path.join(process.cwd(), 'public', webPath));
}

/**
 * Resolve the social/OG image URL for a feed entry, using the same
 * pre-generated static files (and default-image fallback) as
 * OpenGraphImage.astro. See scratch/og-image-generation.plan.md.
 */
export function getFeedOgImage(
  post: CollectionEntry<'blog'>,
  site: URL,
): string {
  const candidatePath = getBlogSocialImagePath(post.id);
  const resolvedPath =
    candidatePath && existsInPublic(candidatePath)
      ? candidatePath
      : getDefaultSocialImagePath();

  return new URL(resolvedPath, site).toString();
}
