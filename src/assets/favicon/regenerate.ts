import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import pngToIco from 'png-to-ico';
import sharp from 'sharp';
import { renderFaviconSvg } from '../../utils/brand-logo.ts';

interface FaviconOptions {
  svgPath: string;
  pngPath: string;
  icoPath: string;
  pngSize: number;
  icoSizes: number[];
  /** SVG markup to rasterise instead of reading `svgPath`. */
  svgSource?: string;
  /** Extra copy of the PNG, for example a stable public URL for feeds. */
  publicPngPath?: string;
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const config: FaviconOptions = {
  icoPath: resolve(__dirname, '../../../public/favicon.ico'),
  icoSizes: [16, 32, 48, 64],
  pngPath: resolve(__dirname, 'favicon.png'),
  pngSize: 512,
  svgPath: resolve(__dirname, 'favicon.svg'),
};

export async function generateFavicon({
  svgPath,
  pngPath,
  icoPath,
  pngSize,
  icoSizes,
  svgSource,
  publicPngPath,
}: FaviconOptions): Promise<void> {
  try {
    await mkdir(dirname(pngPath), { recursive: true });
    await mkdir(dirname(icoPath), { recursive: true });

    const svgBuffer = Buffer.from(svgSource ?? (await readFile(svgPath)));
    const pngBuffer = await sharp(svgBuffer, {
      density: 300,
    })
      .resize(pngSize, pngSize)
      .png()
      .toBuffer();

    await writeFile(pngPath, pngBuffer);
    console.log(`✓ PNG saved: ${pngPath} (${pngSize}x${pngSize})`);

    if (publicPngPath) {
      await mkdir(dirname(publicPngPath), { recursive: true });
      await writeFile(publicPngPath, pngBuffer);
      console.log(`✓ PNG saved: ${publicPngPath} (${pngSize}x${pngSize})`);
    }

    const icoBuffers = await Promise.all(
      icoSizes.map((size) =>
        sharp(svgBuffer, {
          density: 300,
        })
          .resize(size, size)
          .png()
          .toBuffer(),
      ),
    );

    const ico = await pngToIco(icoBuffers);
    await writeFile(icoPath, ico);
    console.log(`✓ ICO saved: ${icoPath} (sizes: ${icoSizes.join(', ')})`);
  } catch (err) {
    console.error('✖ Favicon generation failed:', (err as Error).message);
  }
}

/**
 * Writes the adaptive SVG favicon from the brand master, then rasterises the
 * dark (default) palette. The raster input uses literal colours because
 * librsvg does not reliably resolve CSS custom properties.
 */
export async function regenerateBrandFavicons(): Promise<void> {
  await writeFile(config.svgPath, renderFaviconSvg('adaptive'));
  console.log(`✓ SVG saved: ${config.svgPath}`);
  await generateFavicon({
    ...config,
    publicPngPath: resolve(__dirname, '../../../public/icon-512.png'),
    svgSource: renderFaviconSvg('dark'),
  });
}

const scriptArg = process.argv[1] ?? '';
if (import.meta.url.endsWith(scriptArg) || scriptArg.endsWith('regenerate.ts')) {
  regenerateBrandFavicons();
}
