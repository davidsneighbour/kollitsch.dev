import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'astro/config';
import expressiveCode, { createInlineSvgUrl } from 'astro-expressive-code';
import icon from 'astro-icon';
import devtoolsJson from 'vite-plugin-devtools-json';
import pagefind from './src/scripts/integrations/pagefind.ts';
import { createLogger } from './src/utils/logger.ts';
import redirects from './src/data/redirects.json' assert { type: 'json' };

// env variables are not automatically loaded
// import { loadEnv } from "vite";
// const { SECRET_PASSWORD } = loadEnv(process.env.NODE_ENV, process.cwd(), "");

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const crontabTmLanguage = JSON.parse(
  fs.readFileSync('./src/config/tmLanguages/crontab.tmLanguage.json', 'utf-8'),
);

// watching a couple of locations where images and blog posts might appear.
const watchExtraFiles = () => ({
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
        return (
          relative && !relative.startsWith('..') && !path.isAbsolute(relative)
        );
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
  name: 'watch-extra-files',
});

// https://astro.build/config
export default defineConfig({
  // @ts-expect-error - env variable typing not recognized
  compressHTML: import.meta.env.PROD,
  redirects: redirects,
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
    sitemap({
      namespaces: { image: false, news: false, video: false, xhtml: false },
      xslURL: '/feeds/sitemap.xsl',
    }),
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
      shiki: {
        langs: [
          crontabTmLanguage
        ],
        // bundledLangs: ['astro', 'sass'],
      },
      styleOverrides: {
        codeFontFamily: "'jetbrainsmono', monospace",
        codeFontWeight: '300',
        uiFontFamily: "'jetbrainsmono', monospace",
        uiFontWeight: '300',
        frames: {
          frameBoxShadowCssValue: '0',
          copyIcon: createInlineSvgUrl('<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-code-slash" viewBox="0 0 16 16"> <path d = "M10.478 1.647a.5.5 0 1 0-.956-.294l-4 13a.5.5 0 0 0 .956.294zM4.854 4.146a.5.5 0 0 1 0 .708L1.707 8l3.147 3.146a.5.5 0 0 1-.708.708l-3.5-3.5a.5.5 0 0 1 0-.708l3.5-3.5a.5.5 0 0 1 .708 0m6.292 0a.5.5 0 0 0 0 .708L14.293 8l-3.147 3.146a.5.5 0 0 0 .708.708l3.5-3.5a.5.5 0 0 0 0-.708l-3.5-3.5a.5.5 0 0 0-.708 0" /></svg>'),
        }
      },
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
  //trailingSlash: 'always',
  vite: {
    plugins: [
      tailwindcss(),
      devtoolsJson(),
      watchExtraFiles(),
    ],
  },
  build: {
    format: 'directory',
    assets: 'assets',
    // @see https://docs.astro.build/en/reference/configuration-reference/#buildinlinestylesheets
    inlineStylesheets: `auto`
  }
});
