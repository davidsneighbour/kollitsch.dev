/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

/**
 * Adding global types to the Window object.
 */
interface Window {
  theme: {
    setTheme: (theme: 'auto' | 'dark' | 'light') => void;
    getTheme: () => 'auto' | 'dark' | 'light';
    getSystemTheme: () => 'light' | 'dark';
    getDefaultTheme: () => 'auto' | 'dark' | 'light';
  };
}

/**
 * Defines the content type for the post property. Use to extend the property
 * evaluation:
 *
 * @example
 * ```ts
 * interface Props extends PostProp<'blog'> {
 *   anotherProperty: string;
 * }
 * const { post, anotherProperty }: Props = Astro.props;
 * ```
 */
type PostProp<TCollection extends string> = {
  post: CollectionEntry<TCollection>;
};

/**
 * MetaConfig interface defines the structure for meta tags configuration.
 * @see data/meta.json
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
  icon: IconName;
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
 * ThemeMode type definition.
 * Represents the possible theme modes for the site.
 */
type ThemeMode = 'dark' | 'light';

// Minimal types for @pagefind/default-ui
declare module '@pagefind/default-ui' {
  export interface PagefindUIOptions {
    element: string | HTMLElement;
    bundlePath?: string;
    baseUrl?: string;
    showImages?: boolean;
    showSubResults?: boolean;
    splitElement?: string;
    showEmptyFilters?: boolean;
    pageSize?: number;
    debounceTimeoutMs?: number;
    highlightParam?: string;
    translations?: Record<string, string>;
    mergeIndex?: Array<{ url: string; bundlePath: string }>;
    [key: string]: unknown;
  }

  export class PagefindUI {
    constructor(options: PagefindUIOptions);
    destroy(): void;
  }
}
