export function withDefaults<T extends object>(
  props: T,
  defaults: Partial<T>,
): T {
  return {
    ...defaults,
    ...props,
  };
}
