// run: npx tsx src/scripts/verify-sitemap.ts --sitemap-index https://kollitsch.dev/sitemap-index.xml --delay-ms 1000
// deps: playwright, fast-xml-parser
// node: 22+ (ESM, strict)

import * as zlib from 'node:zlib';
import { XMLParser } from 'fast-xml-parser';
import { request } from 'playwright';

/** CLI options after parsing */
interface Options {
  sitemapIndexUrl: string;
  delayMs: number;
  timeoutMs: number;
}

/** Minimal XML shapes */
interface SitemapIndexXML {
  sitemapindex?: { sitemap?: Array<{ loc?: string }> | { loc?: string } };
}
interface UrlSetXML {
  urlset?: { url?: Array<{ loc?: string }> | { loc?: string } };
}

/**
 * Parse CLI flags and env with sane defaults.
 * @returns {Options}
 */
function parseArgs(): Options {
  const args = new Map<string, string>();
  for (let i = 2; i < process.argv.length; i++) {
    const a = process.argv[i];
    if (a.startsWith('--')) {
      const key = a.slice(2);
      const val = process.argv[i + 1]?.startsWith('--')
        ? ''
        : (process.argv[i + 1] ?? '');
      if (val !== '') i++;
      args.set(key, val);
    }
  }

  const sitemapIndexUrl =
    args.get('sitemap-index') ??
    process.env.SITEMAP_INDEX_URL ??
    'https://kollitsch.dev/sitemap-index.xml';

  const delayMs = Number(
    args.get('delay-ms') ?? process.env.RATE_LIMIT_DELAY_MS ?? 1000,
  );
  const timeoutMs = Number(args.get('timeout-ms') ?? 20000);

  if (!/^https?:\/\//.test(sitemapIndexUrl)) {
    throw new Error(
      `--sitemap-index must be an absolute http(s) URL: ${sitemapIndexUrl}`,
    );
  }
  if (!Number.isFinite(delayMs) || delayMs < 0) {
    throw new Error(
      `--delay-ms must be a non-negative number (ms). Got: ${args.get('delay-ms')}`,
    );
  }
  if (!Number.isFinite(timeoutMs) || timeoutMs <= 0) {
    throw new Error(
      `--timeout-ms must be a positive number (ms). Got: ${timeoutMs}`,
    );
  }

  return { delayMs, sitemapIndexUrl, timeoutMs };
}

/**
 * Sleep helper.
 * @param {number} ms Milliseconds
 */
async function sleep(ms: number): Promise<void> {
  await new Promise((res) => setTimeout(res, ms));
}

/**
 * Read XML text, transparently gunzipping for *.gz.
 * @param {Response} res
 * @param {string} url
 */
async function readXmlPossiblyGz(res: Response, url: string): Promise<string> {
  const isGz = /\.gz($|\?)/i.test(url);
  if (isGz) {
    const buf = Buffer.from(await res.arrayBuffer());
    const xmlBuf = zlib.gunzipSync(buf);
    return xmlBuf.toString('utf8');
  }
  return await res.text();
}

/**
 * Extract <loc> entries from sitemapindex.
 * @param {string} xml
 */
function extractSitemapLocs(xml: string): string[] {
  const parser = new XMLParser({ ignoreAttributes: false });
  const parsed = parser.parse(xml) as SitemapIndexXML;
  const node = parsed.sitemapindex?.sitemap;
  const list: Array<{ loc?: string }> = Array.isArray(node)
    ? node
    : node
      ? [node]
      : [];
  return list
    .map((s) => s.loc?.trim())
    .filter((v): v is string => typeof v === 'string' && v.length > 0);
}

/**
 * Extract <loc> entries from urlset.
 * @param {string} xml
 */
function extractUrlLocs(xml: string): string[] {
  const parser = new XMLParser({ ignoreAttributes: false });
  const parsed = parser.parse(xml) as UrlSetXML;
  const node = parsed.urlset?.url;
  const list: Array<{ loc?: string }> = Array.isArray(node)
    ? node
    : node
      ? [node]
      : [];
  return list
    .map((u) => u.loc?.trim())
    .filter((v): v is string => typeof v === 'string' && v.length > 0);
}

async function main(): Promise<void> {
  const opts = parseArgs();
  const politeUA =
    'LinkVerifier/1.2 (+https://kollitsch.dev/) playwright-request; purpose=testing; owner=patrick';
  const req = await request.newContext({
    extraHTTPHeaders: {
      Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.8',
      'Cache-Control': 'no-cache',
      Pragma: 'no-cache',
      Purpose: 'prefetch',
      'User-Agent': politeUA,
      'X-Request-Purpose': 'link-verification',
    },
    ignoreHTTPSErrors: false,
    timeout: opts.timeoutMs,
  });

  // 1) Load sitemap index
  console.log(`Loading sitemap index: ${opts.sitemapIndexUrl}`);
  const idxRes = await fetch(opts.sitemapIndexUrl, { redirect: 'follow' });
  if (!idxRes.ok) {
    throw new Error(
      `Failed sitemap index ${opts.sitemapIndexUrl} (HTTP ${idxRes.status})`,
    );
  }
  const idxXml = await readXmlPossiblyGz(idxRes, opts.sitemapIndexUrl);
  const sitemapUrls = extractSitemapLocs(idxXml);
  console.log(`Found ${sitemapUrls.length} sitemap(s).`);

  // 2) Load sitemaps, collect page URLs
  const pageUrlSet = new Set<string>();
  for (const smUrl of sitemapUrls) {
    try {
      const sRes = await fetch(smUrl, { redirect: 'follow' });
      if (!sRes.ok) {
        console.log(`❌ sitemap ${smUrl} (${sRes.status})`);
        continue;
      }
      const sXml = await readXmlPossiblyGz(sRes, smUrl);
      const urls = extractUrlLocs(sXml);
      urls.forEach((u) => pageUrlSet.add(u));
      console.log(`✅ sitemap ${smUrl} (${urls.length} urls)`);
    } catch (e) {
      console.log(`❌ sitemap ${smUrl} (error: ${(e as Error).message})`);
    }
    await sleep(300); // small pause between sitemaps
  }

  const pageUrls = Array.from(pageUrlSet);
  console.log(
    `\nChecking ${pageUrls.length} page(s) with delay ${opts.delayMs} ms...\n`,
  );

  // 3) Sequentially verify each page (NO pending line; print only final result)
  let ok = 0;
  let fail = 0;

  for (const url of pageUrls) {
    try {
      const res = await req.get(url, {
        headers: { Purpose: 'prefetch' },
        maxRedirects: 0, // only 200 = verified
      });
      const status = res.status();
      if (status === 200) {
        ok++;
        console.log(`✅ ${url} (200)`);
      } else {
        fail++;
        console.log(`❌ ${url} (${status})`);
      }
    } catch (e) {
      fail++;
      console.log(`❌ ${url} (error: ${(e as Error).message})`);
    }
    await sleep(opts.delayMs); // rate limiting
  }

  await req.dispose();
  console.log(`\nDone. OK: ${ok}, Failed: ${fail}, Total: ${pageUrls.length}`);
}

main().catch((err) => {
  console.error('\nFATAL:', err instanceof Error ? err.message : err);
  process.exitCode = 1;
});
