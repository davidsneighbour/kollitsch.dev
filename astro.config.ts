// astro.config.ts
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import toml from '@fbraem/rollup-plugin-toml';
import beep from '@rollup/plugin-beep';
import yaml from '@rollup/plugin-yaml';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'astro/config';
import expressiveCode from 'astro-expressive-code';
import icon from 'astro-icon';
import devtoolsJson from 'vite-plugin-devtools-json';
import pagefind from './src/scripts/integrations/pagefind.ts';
import { createLogger } from './src/utils/logger.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const crontabTmLanguage = JSON.parse(
  fs.readFileSync('./src/config/tmLanguages/crontab.tmLanguage.json', 'utf-8'),
);

// watching a couple of locations where images and blog posts might appear.
const watchExtraFiles = () => ({
  name: 'watch-extra-files',
  configureServer(server: import('vite').ViteDevServer) {
    const logger = createLogger({ slug: 'watch-extra-files' });
    logger.info('Plugin loaded');

    const watchPaths = [
      path.resolve(__dirname, 'src/assets/images'),
      path.resolve(__dirname, 'src/content/blog'),
    ];

    let isReady = false;

    const isWithinWatchedPath = (file: string) =>
      watchPaths.some((watchPath) => {
        const relative = path.relative(watchPath, file);
        return relative && !relative.startsWith('..') && !path.isAbsolute(relative);
      });

    const reload = (file: string) => {
      if (!isWithinWatchedPath(file)) return;
      logger.info(`Reload triggered due to: ${file}`);
      server.ws.send({ type: 'full-reload' });
    };

    server.watcher.add(watchPaths);
    logger.info('Watching paths:', watchPaths);

    server.watcher.on('ready', () => {
      isReady = true;
      logger.info('Initial scan complete');
    });

    server.watcher.on('add', (file) => {
      if (!isReady) return;
      reload(file);
    });

    server.watcher.on('unlink', (file) => {
      if (!isReady) return;
      reload(file);
    });
  },
});

// https://astro.build/config
export default defineConfig({
  compressHTML: import.meta.env.PROD,
  experimental: {
    chromeDevtoolsWorkspace: true,
    clientPrerender: true,
    contentIntellisense: true,
    preserveScriptOrder: true,
  },
  image: {
    breakpoints: [640, 750, 828, 1080, 1280],
    layout: 'constrained',
    objectFit: 'cover',
    objectPosition: 'center',
    responsiveStyles: true,
  },
  integrations: [
    sitemap(),
    pagefind({ indexConfig: { keepIndexUrl: true } }),
    icon({
      iconDir: 'src/assets/icons',
      svgoOptions: {
        multipass: true,
        plugins: [
          {
            name: 'preset-default',
            params: {
              overrides: {
                removeComments: { preservePatterns: false },
                removeDoctype: true,
              },
            },
          },
        ],
      },
    }),
    expressiveCode({
      shiki: { langs: [crontabTmLanguage] },
      styleOverrides: { frames: { frameBoxShadowCssValue: '0' } },
      themeCssSelector: (theme) => `[data-code-theme='${theme.name}']`,
      themes: ['dracula', 'light-plus'],
      useDarkModeMediaQuery: false,
    }),
    mdx(),
  ],
  markdown: {
    shikiConfig: {
      themes: { dark: 'dark-plus', light: 'github-light' },
      wrap: true,
    },
  },
  output: 'static',
  prefetch: { defaultStrategy: 'viewport', prefetchAll: true },
  server: { host: true },
  site: 'https://kollitsch.dev/',
  trailingSlash: 'always',
  vite: {
    plugins: [tailwindcss(), beep(), toml(), yaml(), devtoolsJson(), watchExtraFiles()],
  },
});
