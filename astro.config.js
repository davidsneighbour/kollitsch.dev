import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import partytown from '@astrojs/partytown';
import sitemap from '@astrojs/sitemap';
import toml from '@fbraem/rollup-plugin-toml';
import beep from '@rollup/plugin-beep';
import yaml from '@rollup/plugin-yaml';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'astro/config';
import expressiveCode from 'astro-expressive-code';
import icon from 'astro-icon';
import matomo from 'astro-matomo';
import pagefind from 'astro-pagefind';
import devtoolsJson from 'vite-plugin-devtools-json';

// https://astro.build/config
export default defineConfig({
  compressHTML: import.meta.env.PROD,
  experimental: {
    clientPrerender: true,
    contentIntellisense: true,
    preserveScriptOrder: true,
    // @todo https://docs.astro.build/en/reference/experimental-flags/csp/
    //csp: true,
  },
  image: {
    breakpoints: [640, 750, 828, 1080, 1280],
    layout: 'constrained',
    objectFit: 'cover',
    objectPosition: 'center',
    responsiveStyles: true,
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
      debug: false, // Only load in production
      disableCookies: true,
      enabled: import.meta.env.PROD,
      heartBeatTimer: 5,
      host: 'https://analytics.dnbhub.xyz/',
      partytown: true,
      preconnect: true,
      setCookieDomain: '*.kollitsch.dev',
      siteId: 1,
      viewTransition: {
        contentElement: 'main',
      },
    }),
    partytown(),
    icon(),
    expressiveCode({
      styleOverrides: {
        frames: {
          frameBoxShadowCssValue: '0',
        },
      },
      themes: ['dracula', 'github-light'],
    }),
  ],
  markdown: {
    shikiConfig: {
      themes: {
        dark: 'dark-plus',
        light: 'github-light',
      },
      wrap: true,
    },
  },
  output: 'static',
  prefetch: {
    defaultStrategy: 'viewport',
    prefetchAll: true,
  },
  server: {
    host: true,
  },
  site: 'https://kollitsch.dev/',
  trailingSlash: 'always',
  vite: {
    plugins: [tailwindcss(), beep(), toml(), yaml(), devtoolsJson()],
  },
});
