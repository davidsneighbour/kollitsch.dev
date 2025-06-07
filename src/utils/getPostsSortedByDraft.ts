import type { CollectionEntry } from 'astro:content';
import setup from '@data/site.json';

export const getPostsSortedByDraft = (allPosts: CollectionEntry<'blog'>[]) => {
  return allPosts
    .filter((post) => {
      if (import.meta.env.PROD) {
        return !post.data.draft;
      }
      return setup.overrides.showDraftsInDev ? true : !post.data.draft;
    })
    .sort((post1, post2) => {
      if (isDateBefore(post1.data.date, post2.data.date)) {
        return 1;
      } else {
        return -1;
      }
    });
};

// sorting by date in descending order
export const isDateBefore = (date1: Date, date2: Date) =>
  date1.getTime() < date2.getTime();

// sorting by date in ascending order
export const isDateAfter = (date1: Date, date2: Date) =>
  date1.getTime() > date2.getTime();
