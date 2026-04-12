import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'astro/config';
import expressiveCode, { createInlineSvgUrl } from 'astro-expressive-code';
import matter from 'gray-matter';
import icon from 'astro-icon';
import fg from 'fast-glob';
import devtoolsJson from 'vite-plugin-devtools-json';
import pagefind from './src/scripts/integrations/pagefind.ts';
import { createLogger } from './src/utils/logger.ts';
import redirects from './src/data/redirects.json' with { type: 'json' };
import { buildHooks } from "./src/scripts/build-hooks.ts";
import react from '@astrojs/react';

// env variables are not automatically loaded
// import { loadEnv } from "vite";
// const { SECRET_PASSWORD } = loadEnv(process.env.NODE_ENV, process.cwd(), "");

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const crontabTmLanguage = JSON.parse(
  fs.readFileSync('./src/config/tmLanguages/crontab.tmLanguage.json', 'utf-8'),
);

const draftPagePaths = (() => {
  const pagesRoot = path.resolve(__dirname, 'src/pages');
  const draftPaths = new Set<string>();
  const pageFiles = fg.sync('src/pages/**/*.{md,mdx}', {
    absolute: true,
  });

  const addRouteVariants = (route: string) => {
    const normalized = route.startsWith('/') ? route : `/${route}`;
    const trimmed =
      normalized.endsWith('/') && normalized !== '/'
        ? normalized.slice(0, -1)
        : normalized;
    const withSlash = normalized.endsWith('/') ? normalized : `${normalized}/`;
    draftPaths.add(trimmed);
    draftPaths.add(withSlash);
  };

  for (const filePath of pageFiles) {
    const contents = fs.readFileSync(filePath, 'utf-8');
    const { data } = matter(contents);
    if (data?.draft !== true) continue;

    const relative = path.relative(pagesRoot, filePath).replace(/\\/g, '/');
    const withoutExt = relative.replace(/\.(md|mdx)$/, '');
    if (withoutExt === 'index') {
      addRouteVariants('/');
      continue;
    }

    if (withoutExt.endsWith('/index')) {
      addRouteVariants(`/${withoutExt.slice(0, -'/index'.length)}/`);
      continue;
    }

    addRouteVariants(`/${withoutExt}`);
  }

  return draftPaths;
})();

// https://astro.build/config
export default defineConfig({
  // @ts-expect-error - env variable typing not recognized
  compressHTML: import.meta.env.PROD,
  redirects: redirects,
  devToolbar: {
    enabled: true,
    placement: 'bottom-left',
  },
  experimental: {
    chromeDevtoolsWorkspace: true,
    clientPrerender: true,
    contentIntellisense: true,
  },
  image: {
    breakpoints: [640, 750, 828, 1080, 1280],
    layout: 'constrained',
    objectFit: 'cover',
    objectPosition: 'center',
    responsiveStyles: true,
  },
  integrations: [
    // see src/scripts/build-hooks.ts for build hooks
    ...buildHooks(),
    sitemap({
    namespaces: { image: false, news: false, video: false, xhtml: false },
    xslURL: '/feeds/sitemap.xsl',
    filter: (page) =>
      // Exclude any page URL that starts with this string
      !page.startsWith('https://kollitsch.dev/test/') &&
      !page.startsWith('https://kollitsch.dev/blog/1/') &&
      !draftPagePaths.has(new URL(page).pathname),
  }), pagefind({ indexConfig: { keepIndexUrl: true } }), icon({
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
  }), expressiveCode({
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
    react()],
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
    ],
  },
  build: {
    format: 'directory',
    assets: 'assets',
    // @see https://docs.astro.build/en/reference/configuration-reference/#buildinlinestylesheets
    inlineStylesheets: `auto`
  }
});
