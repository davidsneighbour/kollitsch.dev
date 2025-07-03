/**
 * Creates a new properties object by merging provided props with defaults.
 *
 * ```
 * import { mergePropsWithDefaults } from '@utils/withDefaults';
 * export interface Props {
 *   tags: Map<string, number>;
 *   minSize?: number;
 *   maxSize?: number;
 * }
 * const props = mergePropsWithDefaults(Astro.props as Props, {
 *   minSize: 0.75, // rem
 *   maxSize: 2.0,  // rem
 * }) as Required<Pick<Props,
 *   'tags' | 'minSize' | 'maxSize'
 * >>;
 * ```
 */
export function mergePropsWithDefaults<T extends object>(
  props: T,
  defaults: Partial<T>,
): T {
  return {
    ...defaults,
    ...props,
  };
}
