# Live Site Testing Ideas

The Playwright smoke tests cover the most critical live checks (robots.txt, homepage stability, and Matomo initialisation). When expanding coverage, consider the following candidates:

- **Critical page uptime**: verify that key marketing and contact pages (e.g., `/about/`, `/contact/`, `/uses/`) return successful status codes and render expected hero content.
- **Search functionality**: ensure the site search overlay loads, accepts queries, and surfaces relevant results powered by Pagefind.
- **Navigation health**: crawl primary navigation and footer links to confirm there are no broken internal links or unexpected redirects.
- **Structured data validation**: load pages with JSON-LD snippets (like blog posts) and assert that schema blocks render without console warnings.
- **Accessibility smoke checks**: run `@axe-core/playwright` against live critical pages to detect high-priority accessibility regressions.
- **Performance metrics**: capture Web Vitals (LCP, CLS, FID) or synthetic timing metrics to detect regressions introduced by third-party scripts.
- **Cookie consent and Matomo opt-out**: validate that privacy controls appear for new visitors and that opting out prevents Matomo from queueing further tracking calls.
- **Contact form submission**: submit the contact form against the production backend (using a throwaway email) and confirm success messaging and email delivery.
- **Service worker availability**: ensure the PWA/service worker script registers successfully in production environments.
- **Sitemap integrity**: fetch and parse `sitemap-index.xml` and nested sitemaps to confirm they include the expected canonical URLs and respond with 200 status codes.
