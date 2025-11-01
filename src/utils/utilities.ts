import type { ContentObject, ContentSource } from './content-object.ts';
import { createContentObject } from './content-object.ts';

export function getEffectiveFrontmatter(
  props: Record<string, unknown>,
): Record<string, unknown> {
  // content collection post.data
  if (
    'post' in props &&
    typeof props.post === 'object' &&
    props.post &&
    'data' in props.post &&
    typeof props.post.data === 'object'
  ) {
    return props.post.data as Record<string, unknown>;
  }

  // astro frontmatter
  if (
    'frontmatter' in props &&
    typeof props.frontmatter === 'object' &&
    props.frontmatter !== null
  ) {
    return props.frontmatter as Record<string, unknown>;
  }

  return {};
}

export function getContentObject(
  props: Record<string, unknown>,
  ...overrides: Array<ContentSource | null | undefined>
): ContentObject {
  const sources: Array<ContentSource | null | undefined> = [];

  if (
    'post' in props &&
    typeof props.post === 'object' &&
    props.post !== null
  ) {
    sources.push(props.post as ContentSource);
  }

  if (
    'frontmatter' in props &&
    typeof props.frontmatter === 'object' &&
    props.frontmatter !== null
  ) {
    sources.push(props.frontmatter as Record<string, unknown>);
  }

  sources.push(props);
  sources.push(...overrides);

  return createContentObject(...sources);
}
