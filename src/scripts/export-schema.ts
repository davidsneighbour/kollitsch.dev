import { writeFile } from 'node:fs/promises';
import * as z from 'zod';
import { blogSchema } from '../content.config.ts';

async function run() {
  const jsonSchema = z.toJSONSchema(blogSchema, {
    reused: 'ref',
    target: 'draft-7',
  });
  await writeFile(
    './schemas/blog.schema.json',
    JSON.stringify(jsonSchema, null, 2),
  );
  console.log('✅ Exported ./schemas/blog.schema.json');
}

run().catch((err) => {
  console.error('❌ Error exporting schema:', err);
  process.exit(1);
});
