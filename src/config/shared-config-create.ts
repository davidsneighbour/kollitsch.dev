import { writeFileSync } from 'node:fs';
import { items } from './shared-config.ts';

writeFileSync(
  './src/config/shared-config.json',
  JSON.stringify(items, null, 2),
);
