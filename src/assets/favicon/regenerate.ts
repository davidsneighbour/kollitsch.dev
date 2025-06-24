import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import sharp from 'sharp';
import pngToIco from 'png-to-ico';

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
  svgPath: resolve(__dirname, 'favicon.svg'),
  pngPath: resolve(__dirname, 'favicon.png'),
  icoPath: resolve(__dirname, '../../../public/favicon.ico'),
  pngSize: 512,
  icoSizes: [16, 32, 48, 64],
};

async function generateFavicon({
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

    // PNG (single size)
    const pngBuffer = await sharp(svgBuffer, {
      density: 300,
    })
      .resize(pngSize, pngSize)
      .png()
      .toBuffer();

    await writeFile(pngPath, pngBuffer);
    console.log(`✓ PNG saved: ${pngPath} (${pngSize}x${pngSize})`);

    // ICO (multi-size)
    const icoBuffers = await Promise.all(
      icoSizes.map(size =>
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

// Safe script execution
const scriptArg = process.argv[1] ?? '';
if (
  import.meta.url.endsWith(scriptArg) ||
  scriptArg.endsWith('regenerate.ts')
) {
  generateFavicon(config);
}
