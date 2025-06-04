import path from 'node:path';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import partytown from '@astrojs/partytown';
import sitemap from '@astrojs/sitemap';
import toml from '@fbraem/rollup-plugin-toml';
import beep from '@rollup/plugin-beep';
import yaml from '@rollup/plugin-yaml';
import sentry from '@sentry/astro';
import spotlightjs from '@spotlightjs/astro';
import tailwindcss from '@tailwindcss/vite';
import icon from 'astro-icon';
import matomo from 'astro-matomo';
import pagefind from 'astro-pagefind';
import { defineConfig } from 'astro/config';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// https://astro.build/config
export default defineConfig({
  site: 'https://kollitsch.dev/',
  trailingSlash: 'always',
  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'viewport',
  },
  // // redirects that will be added to the public/_redirects file
  redirects: {
    '/old': '/new',
    '/news': {
      status: 302,
      destination: 'https://example.com/news',
    },
  },
  integrations: [
    sitemap(), // https://github.com/felix-berlin/astro-matomo
    pagefind({
      // https://github.com/shishkin/astro-pagefind
      indexConfig: {
        keepIndexUrl: true,
      },
    }),
    matomo({
      enabled: import.meta.env.PROD, // Only load in production
      host: 'https://analytics.dnbhub.xyz/',
      siteId: 1,
      setCookieDomain: '*.kollitsch.dev',
      heartBeatTimer: 5,
      disableCookies: true,
      debug: false,
      partytown: true,
      preconnect: true,
      viewTransition: {
        contentElement: 'main',
      },
    }),
    partytown(),
    sentry(),
    spotlightjs(),
    icon(),
  ],
  vite: {
    plugins: [tailwindcss(), beep(), toml(), yaml()],
  },
  server: { host: true },
  experimental: {
    responsiveImages: true,
    contentIntellisense: true,
    preserveScriptOrder: true,
    clientPrerender: true,
  },
  image: {
    experimentalLayout: 'constrained',
    // https://github.com/withastro/astro/releases/tag/astro%405.8.1
    experimentalDefaultStyles: false,
  },
  markdown: {
    shikiConfig: {
      themes: {
        light: 'github-light',
        dark: 'dark-plus',
      },
      wrap: true,
    },
  },
  compressHTML: import.meta.env.PROD,
});
