
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
