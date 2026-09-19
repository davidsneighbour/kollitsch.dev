/**
 * On-disk manifest tracking each generated social image's fingerprint, so
 * build-og-images.ts can detect staleness under the deterministic filename
 * scheme without re-rendering unchanged images. Not tracked in Git.
 */

import fs from 'node:fs';
import path from 'node:path';

export interface ManifestEntry {
  fingerprint: string;
  generatedAt: string;
}

export type Manifest = Record<string, ManifestEntry>;

const MANIFEST_DIR = path.join(process.cwd(), '.cache', 'social-images');
const MANIFEST_PATH = path.join(MANIFEST_DIR, 'manifest.json');

export function readManifest(): Manifest {
  try {
    const raw = fs.readFileSync(MANIFEST_PATH, 'utf8');
    return JSON.parse(raw) as Manifest;
  } catch {
    return {};
  }
}

export function writeManifest(manifest: Manifest): void {
  fs.mkdirSync(MANIFEST_DIR, { recursive: true });
  fs.writeFileSync(MANIFEST_PATH, `${JSON.stringify(manifest, null, 2)}\n`);
}
