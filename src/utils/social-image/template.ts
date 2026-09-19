/**
 * Satori markup and font loading for social-image rendering.
 *
 * Shared by OpenGraphImage.astro today and by the standalone
 * build-og-images.ts CLI script (see PLAN.md phases 2+). Node-safe: no Vite
 * or Astro runtime dependency.
 */

import fs from 'node:fs';
import type { SatoriOptions } from 'satori';
import satori from 'satori';
import { html } from 'satori-html';
import { createLogger } from '../logger.ts';
import { siteAuthorName, siteTitle } from './site-info.ts';

type ReactNode = Parameters<typeof satori>[0];

const log = createLogger({ slug: 'social-image:template' });

/** Bump to invalidate every generated social image after a visual change. */
export const TEMPLATE_VERSION = 1;

const ChangaPath =
  './node_modules/@fontsource/changa-one/files/changa-one-latin-400-normal.woff';
const Exo2Path =
  './node_modules/@fontsource/exo-2/files/exo-2-latin-300-normal.woff';
/**
 * @todo once Satori supports variable fonts via woff2 switch to variable Exo 2 for better performance
 */
// const Exo2Path = "./node_modules/@fontsource-variable/exo-2/files/exo-2-latin-wght-normal.woff2";

function safeReadFile(filePath: string): Buffer | null {
  try {
    return fs.readFileSync(filePath);
  } catch (e) {
    log.error({ err: e, filePath }, 'safeReadFile failed');
    return null;
  }
}

let ChangaData: Buffer | null = null;
let Exo2Data: Buffer | null = null;
let fontsLoaded = false;
let fontLoadError = false;

/** Load fonts once (memoized) and report whether loading succeeded. */
export function loadFonts(): boolean {
  if (fontsLoaded) return !fontLoadError;
  fontsLoaded = true;

  ChangaData = safeReadFile(ChangaPath);
  Exo2Data = safeReadFile(Exo2Path);
  if (!ChangaData || !Exo2Data) {
    fontLoadError = true;
    log.error('Failed to load one or more fonts. OG image rendering may fail.');
  }
  return !fontLoadError;
}

const ogOptionsCache = new Map<string, SatoriOptions>();

/** Build and memoize Satori options for a given output size. */
export function buildOgOptions(width: number, height: number): SatoriOptions {
  const key = `${width}x${height}`;
  const cached = ogOptionsCache.get(key);
  if (cached) return cached;

  if (!loadFonts()) {
    throw new Error('Font load failed earlier; aborting OG generation.');
  }

  const opts: SatoriOptions = {
    fonts: [
      { data: ChangaData!, name: 'Changa', style: 'normal', weight: 400 },
      { data: Exo2Data!, name: 'Exo 2', style: 'normal', weight: 300 },
    ],
    height,
    width,
  };
  ogOptionsCache.set(key, opts);
  return opts;
}

/**
 * Satori markup — background via CSS on the outer container (no absolute positioning).
 * Tailwind notes: whenever using leading-*, also set text-* on the same node or inline line-height.
 */
export function markup(
  title: string,
  postDateDisplay: string,
  width: number,
  height: number,
  backgroundSrc: string,
): ReactNode {
  const hasDate = postDateDisplay.trim().length > 0;
  const dateHtml = hasDate ? postDateDisplay : '';

  function cssUrl(u: string): string {
    // Escape single quote, backslash, and line breaks
    return `url('${u.replace(/['\\\n\r]/g, (m) => (m === "'" ? "\\'" : '\\' + m))}')`;
  }

  const bgDecl = backgroundSrc
    ? `background-image:${cssUrl(backgroundSrc)};`
    : '';
  const containerStyle = `width:${width}px;height:${height}px;${bgDecl}background-size:cover;background-position:center;background-repeat:no-repeat;`;

  return html`
    <div style="${containerStyle}" tw="flex flex-col">
      <div style="font-family:'Exo 2',sans-serif;" tw="flex flex-col w-full h-full bg-[#09090b]/40 text-white text-xl">
        <div tw="flex flex-col flex-1 w-full p-10 text-xl">
          <h1 style="font-family:'Changa';line-height:1" tw="text-6xl text-white p-0 m-0">${title}</h1>
          <p tw="p-0 m-0 text-xl">by ${siteAuthorName}</p>
        </div>
        <div tw="flex items-center justify-between w-full p-10 text-xl">
          <p style="font-family:'Changa';line-height:1" tw="text-4xl">${siteTitle}</p>
          <p tw="text-right text-xl" style="line-height:1">${dateHtml}</p>
        </div>
      </div>
    </div>
  ` as unknown as ReactNode;
}
