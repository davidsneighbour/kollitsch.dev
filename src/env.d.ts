/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

/**
 * Defines the content type for the post property. Use to extend the property
 * evaluation:
 *
 * @example
 * ```ts
 * interface Props extends PostProp<'blog'> {
 * somethingElse: string;
 * }
 * let { post, somethingElse }: Props = Astro.props;
 * ```
 */
type PostProp<TCollection extends string> = {
  post: CollectionEntry<TCollection>;
};

// @todo check why this needs to be ignored
// biome-ignore lint/correctness/noUnusedVariables: this is used for type definitions
interface Window {
  Alpine: import('alpinejs').Alpine;
  theme: {
    setTheme: (theme: 'auto' | 'dark' | 'light') => void;
    getTheme: () => 'auto' | 'dark' | 'light';
    getSystemTheme: () => 'light' | 'dark';
    getDefaultTheme: () => 'auto' | 'dark' | 'light';
  };
}

/**
 * MetaConfig interface defines the structure for meta tags configuration.
 */
type MetaConfig = {
  name: Record<string, string>;
  httpEquiv: Record<string, string>;
  link: Array<{
    rel: string;
    href: string;
  }>;
};
