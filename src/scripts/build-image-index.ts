// File: scripts/build-image-index.ts
// Node 22+, ESM, strict TypeScript.
// Purpose: Scan images, merge with metadata from both
//   - src/content/image-meta.json (flat map)
//   - .frontmatter/database/mediaDb.json (nested structure)
// then produce src/content/_generated/image-index.json with width, height, and LQIP.
//
// Usage:
//   node scripts/build-image-index.ts \
//     --images src/assets/images \
//     --frontmatter-db .frontmatter/database/mediaDb.json \
//     --out src/content/_generated/image-index.json \
//     --lqip-width 24 \
//     --concurrency 4

import { promises as fs } from 'node:fs';
import { basename, extname, relative, resolve, sep } from 'node:path';
import { glob } from 'glob';
import sharp from 'sharp';

// ---------- Types ----------
interface ImageMeta {
  readonly alt?: string;
  readonly title?: string;
  readonly caption?: string;
  readonly tags?: readonly string[];
  readonly author?: string;
  readonly source?: string;
}

interface ImageRecord extends ImageMeta {
  readonly id: string;
  readonly filename: string;
  readonly relPath: string;
  readonly format: string;
  readonly width: number;
  readonly height: number;
  readonly lqipDataUri: string;
  readonly dir: string;
  readonly derivedTags: readonly string[];
}

interface GeneratedIndex {
  readonly files: Record<string, ImageRecord>;
  readonly createdAt: string;
  readonly source: {
    readonly imagesDir: string;
    readonly metaJsonPath: string | null;
    readonly frontmatterDbPath: string | null;
  };
}

interface CliOptions {
  readonly imagesDir: string;
  readonly metaJsonPath: string | null;
  readonly frontmatterDbPath: string | null;
  readonly outPath: string;
  readonly lqipWidth: number;
  readonly concurrency: number;
}

// ---------- CLI ----------
function parseArgs(argv: readonly string[]): CliOptions {
  const get = (flag: string, def: string | null = null): string | null => {
    const idx = argv.indexOf(flag);
    return idx >= 0 && idx + 1 < argv.length ? argv[idx + 1] : def;
  };

  const imagesDir = get('--images', 'src/assets/images')!;
  const metaJsonPath = get('--meta', null);
  const frontmatterDbPath = get(
    '--frontmatter-db',
    '.frontmatter/database/mediaDb.json',
  );
  const outPath = get('--out', 'src/content/_generated/image-index.json')!;
  const lqipWidth = Number.parseInt(get('--lqip-width', '24')!, 10);
  const concurrency = Number.parseInt(get('--concurrency', '4')!, 10);

  return {
    concurrency,
    frontmatterDbPath,
    imagesDir,
    lqipWidth,
    metaJsonPath,
    outPath,
  };
}

// ---------- Helpers ----------
function asUrlStylePath(p: string): string {
  const n = p.split(sep).join('/');
  return n.startsWith('/') ? n : `/${n}`;
}
function pathUnder(root: string, file: string): string {
  return relative(root, file).split(sep).join('/');
}
function nonEmptySegments(s: string): string[] {
  return s.split('/').filter(Boolean);
}

async function toLqip(fileAbs: string, w: number): Promise<string> {
  const buf = await sharp(fileAbs)
    .resize({ width: w, withoutEnlargement: true })
    .jpeg({ mozjpeg: true, quality: 60 })
    .toBuffer();
  return `data:image/jpeg;base64,${buf.toString('base64')}`;
}
async function statImage(
  fileAbs: string,
): Promise<{ width: number; height: number }> {
  const meta = await sharp(fileAbs).metadata();
  return { height: meta.height ?? 0, width: meta.width ?? 0 };
}

// ---------- Metadata readers ----------
async function readMetaMap(
  metaPath: string | null,
): Promise<Record<string, ImageMeta>> {
  if (!metaPath) return {};
  try {
    const raw = JSON.parse(await fs.readFile(resolve(metaPath), 'utf8'));
    if (typeof raw !== 'object' || !raw) return {};
    return raw as Record<string, ImageMeta>;
  } catch {
    return {};
  }
}
async function readFrontmatterDbMap(
  pathStr: string | null,
): Promise<Record<string, ImageMeta>> {
  if (!pathStr) return {};
  try {
    const raw = JSON.parse(await fs.readFile(resolve(pathStr), 'utf8'));
    const imgMap = raw?.src?.assets?.images ?? {};
    const out: Record<string, ImageMeta> = {};
    for (const [k, v] of Object.entries(imgMap)) {
      if (!k || typeof v !== 'object') continue;
      out[k] = {
        alt: typeof (v as any).alt === 'string' ? (v as any).alt : undefined,
        author:
          typeof (v as any).author === 'string' ? (v as any).author : undefined,
        source:
          typeof (v as any).source === 'string' ? (v as any).source : undefined,
        title:
          typeof (v as any).title === 'string' ? (v as any).title : undefined,
      };
    }
    return out;
  } catch {
    return {};
  }
}
async function mergeMeta(
  metaPath: string | null,
  dbPath: string | null,
): Promise<Record<string, ImageMeta>> {
  const [flat, nested] = await Promise.all([
    readMetaMap(metaPath),
    readFrontmatterDbMap(dbPath),
  ]);
  return { ...flat, ...nested };
}

// ---------- Build ----------
async function buildIndex(opts: CliOptions): Promise<GeneratedIndex> {
  const root = resolve(opts.imagesDir);
  const files = await glob('**/*.{jpg,jpeg,png,webp,avif,svg,gif}', {
    absolute: true,
    cwd: root,
  });
  const metaMap = await mergeMeta(opts.metaJsonPath, opts.frontmatterDbPath);

  const out: Record<string, ImageRecord> = {};
  const queue = [...files];
  const workers: Promise<void>[] = [];

  const worker = async (): Promise<void> => {
    while (queue.length) {
      const file = queue.shift();
      if (!file) break;
      const rel = pathUnder(root, file);
      const filename = basename(file);
      const id = filename.replace(/\.[^.]+$/, '');
      const ext = extname(filename).slice(1).toLowerCase();

      const { width, height } =
        ext === 'svg' ? { height: 0, width: 0 } : await statImage(file);
      const lqipDataUri =
        ext === 'svg'
          ? 'data:image/svg+xml;base64,' +
            Buffer.from(
              '<svg xmlns="http://www.w3.org/2000/svg"></svg>',
            ).toString('base64')
          : await toLqip(file, opts.lqipWidth);

      const dirRel = rel.includes('/')
        ? rel.slice(0, rel.lastIndexOf('/'))
        : '';
      const derivedTags = nonEmptySegments(dirRel);
      const meta = metaMap[filename] ?? {};

      out[filename] = {
        derivedTags,
        dir: dirRel,
        filename,
        format: ext,
        height,
        id,
        lqipDataUri,
        relPath: asUrlStylePath(resolve(opts.imagesDir, rel)),
        width,
        ...meta,
      };
    }
  };

  for (let i = 0; i < opts.concurrency; i++) workers.push(worker());
  await Promise.all(workers);

  return {
    createdAt: new Date().toISOString(),
    files: out,
    source: {
      frontmatterDbPath: opts.frontmatterDbPath,
      imagesDir: opts.imagesDir,
      metaJsonPath: opts.metaJsonPath,
    },
  };
}

// ---------- Main ----------
async function main(): Promise<void> {
  const opts = parseArgs(process.argv.slice(2));
  const index = await buildIndex(opts);
  await fs.mkdir(resolve(opts.outPath, '..'), { recursive: true });
  await fs.writeFile(
    resolve(opts.outPath),
    JSON.stringify(index, null, 2),
    'utf8',
  );
  console.log(
    `Indexed ${Object.keys(index.files).length} images → ${opts.outPath}`,
  );
}

if (import.meta.url === `file://${process.argv[1]}`) await main();
