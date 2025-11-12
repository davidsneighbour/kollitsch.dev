import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import pngToIco from 'png-to-ico';
import sharp from 'sharp';

interface FaviconOptions {
  svgPath: string;
  pngPath: string;
  icoPath: string;
  pngSize: number;
  icoSizes: number[];
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
}: FaviconOptions): Promise<void> {
  try {
    await mkdir(dirname(pngPath), { recursive: true });
    await mkdir(dirname(icoPath), { recursive: true });

    const svgSource = await readFile(svgPath);
    const svgBuffer = Buffer.from(svgSource);
    const pngBuffer = await sharp(svgBuffer, {
      density: 300,
    })
      .resize(pngSize, pngSize)
      .png()
      .toBuffer();

    await writeFile(pngPath, pngBuffer);
    console.log(`✓ PNG saved: ${pngPath} (${pngSize}x${pngSize})`);

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

const scriptArg = process.argv[1] ?? '';
if (import.meta.url.endsWith(scriptArg) || scriptArg.endsWith('regenerate.ts')) {
  generateFavicon(config);
}
