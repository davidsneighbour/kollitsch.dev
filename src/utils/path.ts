/**
 * Options to control how `formatUrl` returns the string.
 */
interface FormatUrlOptions {
  trailingSlash?: boolean;
  leadingSlash?: boolean;
}

const DEFAULT_FORMAT_OPTIONS: FormatUrlOptions = {
  leadingSlash: true,
  trailingSlash: true,
};

/**
 * Remove leading and trailing slashes from a path.
 * Returns an empty string for falsy input.
 */
function stripSlashes(path?: string | null): string {
  if (!path) return "";
  return path.replace(/^\/+|\/+$/g, "");
}

/**
 * Format an input path into a normalized URL fragment.
 *
 * - If `path` is `null` or `undefined` the function returns an empty string.
 * - If `path` is empty or only slashes the function returns `/`.
 * - Default behavior adds a leading and trailing slash.
 *
 * Examples:
 * - `formatUrl("blog/post")` -> `/blog/post/`
 * - `formatUrl("about", { trailingSlash: false })` -> `/about`
 */
export function formatUrl(path?: string | null, options: FormatUrlOptions = {}): string {
  // If the path is completely missing, return an empty string as caller requested.
  if (path == null) return "";

  const { trailingSlash, leadingSlash } = { ...DEFAULT_FORMAT_OPTIONS, ...options };
  const cleanPath = stripSlashes(path);

  if (!cleanPath) {
    return "/";
  }

  let url = cleanPath;
  if (leadingSlash) url = `/${url}`;
  if (trailingSlash) url = `${url}/`;

  return url;
}
