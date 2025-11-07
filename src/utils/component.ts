const allowedComponents = ['lite-youtube', 'color-grid', 'date-diff'] as const;

/**
 * Union of supported frontend component identifiers.
 */
export type ComponentName = (typeof allowedComponents)[number];

const allowedComponentsSet = new Set<ComponentName>(allowedComponents);

type PathSegment = string & { readonly __brand: unique symbol };

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

const sanitizePath = (path: string): readonly PathSegment[] => {
  const trimmed = path.trim();
  if (trimmed.length === 0) {
    return [];
  }

  return trimmed
    .split('.')
    .map((segment) => segment.trim())
    .filter((segment): segment is string => segment.length > 0)
    .map((segment) => segment as PathSegment);
};

const isComponentList = (value: unknown): value is readonly ComponentName[] =>
  Array.isArray(value) &&
  value.every(
    (item): item is ComponentName =>
      typeof item === 'string' &&
      allowedComponentsSet.has(item as ComponentName),
  );

const traversePath = (
  source: Record<string, unknown>,
  segments: readonly PathSegment[],
): unknown => {
  let current: unknown = source;

  for (const segment of segments) {
    if (!isRecord(current) || !(segment in current)) {
      return undefined;
    }

    current = (current as Record<string, unknown>)[segment];
  }

  return current;
};

/**
 * Determine whether a known frontend component is enabled for a given data object.
 *
 * The function walks a dot-separated path (defaulting to `options.head.components`)
 * inside the provided data record and verifies that the resolved value is an array
 * of allowed component identifiers that contains the requested name.
 *
 * @param data - A possibly undefined frontmatter-like record (e.g. `Astro.props.post?.data`).
 * @param name - The component identifier to look up. Must be one of the allowed literals.
 * @param path - Optional dot-separated path leading to the components array (trimmed and validated).
 * @returns `true` when the path resolves to a known components array that includes `name`; otherwise `false`.
 *
 * @example
 * ```ts
 * import { hasComponent } from "@utils/component";
 *
 * const hasLiteYoutube = hasComponent(
 *   {
 *     options: { head: { components: ['lite-youtube'] } },
 *   },
 *   'lite-youtube',
 * );
 * // hasLiteYoutube === true
 * ```
 *
 * @example
 * ```ts
 * import { hasComponent } from "@utils/component";
 *
 * const isInMeta = hasComponent(
 *   {
 *     meta: { head: { components: ['color-grid'] } },
 *   },
 *   'color-grid',
 *   'meta.head.components',
 * );
 * // isInMeta === true
 * ```
 */
export function hasComponent(
  data: Record<string, unknown> | undefined,
  name: ComponentName,
  path: string = 'options.head.components',
): boolean {
  if (!data) {
    return false;
  }

  const segments = sanitizePath(path);
  if (segments.length === 0) {
    return false;
  }

  const value = traversePath(data, segments);
  return isComponentList(value) && value.includes(name);
}
