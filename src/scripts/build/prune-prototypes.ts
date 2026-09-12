import { rm } from 'node:fs/promises';
import { resolve } from 'node:path';

const includePrototypes = process.env.KOLLITSCH_INCLUDE_PROTOTYPES === '1';
const prototypesOutputPath = resolve('dist/prototypes');

if (includePrototypes) {
  console.log('[prune-prototypes] Keeping dist/prototypes for preview-only prototype build.');
} else {
  await rm(prototypesOutputPath, { force: true, recursive: true });
  console.log('[prune-prototypes] Removed dist/prototypes from production-safe build output.');
}
