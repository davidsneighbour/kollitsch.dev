
import { writeFile } from 'node:fs/promises';
import { blogSchema } from "../content.config.ts";
import * as z from "zod";

async function run() {
  const jsonSchema = z.toJSONSchema(blogSchema, {
    target: 'draft-7',
    reused: 'ref',
  });
  await writeFile('./schemas/blog.schema.json', JSON.stringify(jsonSchema, null, 2));
  console.log('✅ Exported ./schemas/blog.schema.json');
}

run().catch(err => {
  console.error('❌ Error exporting schema:', err);
  process.exit(1);
});
