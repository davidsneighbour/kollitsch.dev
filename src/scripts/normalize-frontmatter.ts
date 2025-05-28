import fs from 'fs/promises';
import matter from 'gray-matter';
import { glob } from 'glob';

const BLOG_PATH = './src/content/blog';

function formatDate(value: any) {
  const date = new Date(value);
  if (isNaN(date.getTime())) return null;
  return date.toISOString().split('T')[0]; // 'YYYY-MM-DD'
}

const files = await glob(`${BLOG_PATH}/**/index.md`, { absolute: true });

for (const file of files) {
  const raw = await fs.readFile(file, 'utf-8');
  const parsed = matter(raw);
  const data = parsed.data;

  const original = data.date || data.publishDate || data.lastmod;
  const formatted = formatDate(original);

  if (!formatted) {
    console.warn(`⚠️  No valid date in ${file}`);
    continue;
  }

  if (data.date !== formatted) {
    data.date = formatted;
    delete data.publishDate;
    delete data.lastmod;

    const updated = matter.stringify(parsed.content, data);
    await fs.writeFile(file, updated);
    console.log(`✅ Updated date in: ${file}`);
  }
}
