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

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const crontabTmLanguage = JSON.parse(
  fs.readFileSync('./src/config/tmLanguages/crontab.tmLanguage.json', 'utf-8'),
);

// watching a couple of location where images and blog posts might appear.
const watchExtraFiles = () => ({
  configureServer(server) {
    console.log('[watch-extra-files] Plugin loaded');

    const watchPaths = [
      path.resolve(__dirname, 'src/assets/images'),
      path.resolve(__dirname, 'src/content/blog'),
    ];

    let isReady = false;

    const isWithinWatchedPath = (file) =>
      watchPaths.some((watchPath) => {
        const relative = path.relative(watchPath, file);
        return (
          relative && !relative.startsWith('..') && !path.isAbsolute(relative)
        );
      });

    const reload = (file) => {
      if (!isWithinWatchedPath(file)) {
        return;
      }

      console.log(`[watch-extra-files] Reload triggered due to: ${file}`);
      server.ws.send({ type: 'full-reload' });
    };

    server.watcher.add(watchPaths);
    console.log('[watch-extra-files] Watching paths:', watchPaths);

    server.watcher.on('ready', () => {
      isReady = true;
      console.log('[watch-extra-files] Initial scan complete');
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
  name: 'watch-extra-files',
});

// https://astro.build/config
export default defineConfig({
  compressHTML: import.meta.env.PROD,

  experimental: {
    // @see https://docs.astro.build/en/reference/experimental-flags/chrome-devtools-workspace/
    chromeDevtoolsWorkspace: true,
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
    sitemap(),
    pagefind({
      // https://github.com/shishkin/astro-pagefind
      indexConfig: {
        keepIndexUrl: true,
      },
    }), // https://www.astroicon.dev/guides/customization/
    icon({
      iconDir: 'src/assets/icons',
      svgoOptions: {
        multipass: true,
        plugins: [
          // https://svgo.dev/docs/preset-default/
          {
            name: 'preset-default',
            params: {
              overrides: {
                removeComments: {
                  preservePatterns: false,
                },
                removeDoctype: true,
              },
            },
          },
        ],
      },
    }),
    expressiveCode({
      shiki: {
        langs: [crontabTmLanguage],
      },
      styleOverrides: {
        frames: {
          frameBoxShadowCssValue: '0',
        },
      },
      themeCssSelector: (theme) => `[data-code-theme='${theme.name}']`,
      themes: ['dracula', 'light-plus'],
      useDarkModeMediaQuery: false,
    }),
    mdx(),
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
    plugins: [
      tailwindcss(),
      beep(),
      toml(),
      yaml(),
      devtoolsJson(),
      watchExtraFiles(),
    ],
  },
});
