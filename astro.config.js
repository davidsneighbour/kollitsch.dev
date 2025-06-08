import { defineConfig } from 'astro/config';

import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import partytown from '@astrojs/partytown';
import sitemap from '@astrojs/sitemap';
import toml from '@fbraem/rollup-plugin-toml';
import beep from '@rollup/plugin-beep';
import yaml from '@rollup/plugin-yaml';
import tailwindcss from '@tailwindcss/vite';
import icon from 'astro-icon';
import matomo from 'astro-matomo';
import pagefind from 'astro-pagefind';
import devtoolsJson from 'vite-plugin-devtools-json';

import expressiveCode from 'astro-expressive-code';

// https://astro.build/config
export default defineConfig({
  site: 'https://kollitsch.dev/',
  trailingSlash: 'always',
  output: 'static',
  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'viewport',
  },
  integrations: [
    // https://github.com/felix-berlin/astro-matomo
    sitemap(),
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
    icon(),
    expressiveCode({
      themes: ['dracula', 'github-light'],
      styleOverrides: {
        frames: {
          shadowColor: '#124',
        },
      },
    }),
  ],
  vite: {
    plugins: [tailwindcss(), beep(), toml(), yaml(), devtoolsJson()],
  },
  server: {
    host: true,
  },
  experimental: {
    responsiveImages: true,
    contentIntellisense: true,
    preserveScriptOrder: true,
    clientPrerender: true,
    // @todo https://docs.astro.build/en/reference/experimental-flags/csp/
    //csp: true,
  },
  image: {
    experimentalLayout: 'constrained',
    experimentalObjectFit: 'cover',
    experimentalObjectPosition: 'center',
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
