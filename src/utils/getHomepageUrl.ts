import siteinfo from '@data/siteinfo.json';

/**
 * Options for getHomepageUrl.
 * In development, site is optional.
 * In production, site should be provided, but this is enforced at runtime.
 */
interface GetHomepageUrlOptions {
  site?: URL | string; // Accepts URL or string, optional for flexibility
}

/**
 * Returns the homepage URL depending on the current environment.
 * - Returns "/" in development
 * - Returns Astro.site when passed as context
 * - Falls back to siteinfo.base or siteinfo.url in production
 */
export function getHomepageUrl(options?: GetHomepageUrlOptions): string {
  if (import.meta.env.DEV) return '/';

  const site = options?.site ?? siteinfo.url;
  if (!site) {
    throw new Error(
      'getHomepageUrl: Missing site context. Pass { site: Astro.site } or define siteinfo.url.',
    );
  }

  return (site instanceof URL ? site : new URL(site)).toString();
}
