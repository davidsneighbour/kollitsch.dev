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

/**
 * Navigation item type definition.
 * Represents a single navigation item with properties for label, link, icon,
 * and optional matching criteria.
 */
type NavItem = {
  label: string;
  link: string;
  icon: string;
  match?: 'full' | 'prefix';
  matchPaths?: string[];
  children?: NavItem[];
};

/**
 * Navigation type definition.
 * Represents an array of navigation items.
 */
type Navigation = NavItem[];

/**
 * ImagePath type definition.
 */
type ImagePath = string;

/**
 * CoverObject interface defines the structure for cover elements in posts.
 * Currently just image source, alternative text, and an optional title.
 */
interface CoverObject {
  src: string;
  alt: string;
  title?: string | undefined;
  type?: 'image' | 'video' | undefined;
}

/**
 * ThemeMode type definition.
 * Represents the possible theme modes for the site.
 */
type ThemeMode = 'dark' | 'light';
