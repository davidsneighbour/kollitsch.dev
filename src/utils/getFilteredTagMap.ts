import type { CollectionEntry } from 'astro:content';
import site from '@data/setup.json';
import { log } from '@utils/helpers';

export function getFilteredTagMap(posts: CollectionEntry<'blog'>[]) {
  const ignoreTags = new Set(site.ignoreTags || []);
  log.debug('[ignoredTags] ' + site.ignoreTags);
  const tagThreshold = site.tagThreshold ?? 1;
  const tagMap = new Map<string, number>();

  for (const post of posts) {
    (post.data.tags || []).forEach((tag) => {
      if (!ignoreTags.has(tag)) {
        tagMap.set(tag, (tagMap.get(tag) || 0) + 1);
      }
    });
  }

  for (const [tag, count] of tagMap) {
    if (count < tagThreshold) {
      log.debug(`[filter] Dropping "${tag}" with count ${count}`);
      tagMap.delete(tag);
    }
  }
  return tagMap;
}
