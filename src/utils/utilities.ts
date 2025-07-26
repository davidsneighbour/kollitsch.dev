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
