// File: src/utils/imageIndex.ts
// Astro 5+, ESM, strict TypeScript.
// Provides querying and access to generated image index.
// Supports tags, directory searches, placeholders, LQIP.

import { z } from 'zod';

// ---------- Schema ----------
const ImageRecordSchema = z.object({
	id: z.string(),
	filename: z.string(),
	relPath: z.string(),
	format: z.string(),
	width: z.number().nonnegative(),
	height: z.number().nonnegative(),
	lqipDataUri: z.string().startsWith('data:'),
	dir: z.string(),
	derivedTags: z.array(z.string()),
	alt: z.string().optional(),
	title: z.string().optional(),
	caption: z.string().optional(),
	tags: z.array(z.string()).optional(),
	author: z.string().optional(),
	source: z.string().optional(),
}).strict();

const GeneratedIndexSchema = z.object({
	files: z.record(ImageRecordSchema),
	createdAt: z.string(),
	source: z.object({
		imagesDir: z.string(),
		metaJsonPath: z.string().nullable(),
		frontmatterDbPath: z.string().nullable(),
	}).strict(),
}).strict();

export type ImageRecord = z.infer<typeof ImageRecordSchema>;

// ---------- Cache ----------
let cache:
	| { files: ReadonlyMap<string, ImageRecord>; urlMap: ReadonlyMap<string, string> }
	| null = null;

// ---------- Helpers ----------
function buildUrlMap(): ReadonlyMap<string, string> {
	const mods = import.meta.glob('/src/assets/images/**/*.{jpg,jpeg,png,webp,avif,svg,gif}', {
		eager: true,
		import: 'default',
	}) as Record<string, string>;
	return new Map(Object.entries(mods));
}

function resolveUrl(rel: string, map: ReadonlyMap<string, string>): string {
	return map.get(rel) ?? map.get(rel.replace(/^\/+/, '/')) ?? rel;
}

// ---------- Loader ----------
async function loadIndex(): Promise<{ files: ReadonlyMap<string, ImageRecord>; urlMap: ReadonlyMap<string, string> }> {
	try {
		// @ts-ignore - Vite JSON import
		const raw = (await import('/src/content/_generated/image-index.json')).default as unknown;
		const parsed = GeneratedIndexSchema.parse(raw);
		const files = new Map<string, ImageRecord>(Object.entries(parsed.files));
		const urlMap = buildUrlMap();
		cache = { files, urlMap };
		return { files, urlMap };
	} catch {
		const mods = import.meta.glob('/src/assets/images/**/*.{jpg,jpeg,png,webp,avif,svg,gif}', {
			eager: true,
			import: 'default',
		}) as Record<string, string>;
		const files = new Map<string, ImageRecord>();
		for (const [rel, url] of Object.entries(mods)) {
			const fn = rel.split('/').pop() ?? '';
			console.log(url);
			if (!fn) continue;
			files.set(fn, {
				id: fn.replace(/\.[^.]+$/, ''),
				filename: fn,
				relPath: rel,
				format: (fn.split('.').pop() ?? '').toLowerCase(),
				width: 0,
				height: 0,
				lqipDataUri:
					'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==',
				dir: '',
				derivedTags: [],
			});
		}
		const urlMap = new Map(Object.entries(mods));
		cache = { files, urlMap };
		return { files, urlMap };
	}
}

// ---------- API ----------
export async function getImageIndex(): Promise<readonly ImageRecord[]> {
	const { files } = cache ?? (await loadIndex());
	return [...files.values()].sort((a, b) => a.filename.localeCompare(b.filename));
}

export async function getImageByName(needle: string): Promise<ImageRecord | undefined> {
	const { files } = cache ?? (await loadIndex());
	if (needle.includes('.')) return files.get(needle);
	for (const rec of files.values()) if (rec.id === needle) return rec;
	return undefined;
}

export async function requireImage(needle: string): Promise<ImageRecord> {
	const rec = await getImageByName(needle);
	if (!rec) throw new Error(`Image not found: ${needle}`);
	return rec;
}

export async function getUrlFor(rec: ImageRecord): Promise<string> {
	const ctx = cache ?? (await loadIndex());
	return resolveUrl(rec.relPath, ctx.urlMap);
}

export async function findImagesByTag(tag: string): Promise<readonly ImageRecord[]> {
	const term = tag.toLowerCase();
	const list = await getImageIndex();
	return list.filter((r) => {
		const exp = (r.tags ?? []).some((t) => t.toLowerCase() === term);
		const der = r.derivedTags.some((t) => t.toLowerCase() === term);
		return exp || der;
	});
}

export async function findImagesInDir(dir: string, recursive = true): Promise<readonly ImageRecord[]> {
	const norm = dir.replace(/^\/+|\/+$/g, '');
	const list = await getImageIndex();
	return list.filter((r) => {
		if (!norm) return r.dir === '';
		return recursive ? r.dir === norm || r.dir.startsWith(`${norm}/`) : r.dir === norm;
	});
}

export function getPlaceholder(rec: ImageRecord): { readonly lqipDataUri: string } {
	return { lqipDataUri: rec.lqipDataUri };
}
