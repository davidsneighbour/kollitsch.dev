// scripts/generate-version-config.ts

import { writeFileSync } from 'node:fs';
import { items } from './shared-config.js';

writeFileSync(
  './src/config/shared-config.json',
  JSON.stringify(items, null, 2),
);
