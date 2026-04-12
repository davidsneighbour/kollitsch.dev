#!/usr/bin/env -S node

/**
 * FreshRSS stream -> RSS file exporter
 *
 * Usage:
 *   node freshrss-stream-rss.ts
 *   node freshrss-stream-rss.ts --label=dnb-webdev
 *   node freshrss-stream-rss.ts --label=dnb-entertainment --output=/tmp/entertainment.xml
 *
 * Environment variables:
 *   FRESHRSS_BASE_URL
 *   FRESHRSS_USERNAME
 *   FRESHRSS_API_PASSWORD
 */

import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

type StreamMode =
  | {
    kind: "starred";
    streamId: string;
    channelTitle: string;
    channelDescription: string;
  }
  | {
    kind: "label";
    label: string;
    streamId: string;
    channelTitle: string;
    channelDescription: string;
  };

type CliOptions = {
  help: boolean;
  maxItems: number;
  timeoutMs: number;
  label: string | null;
  output: string | null;
};

type Config = {
  baseUrl: string;
  username: string;
  apiPassword: string;
  maxItems: number;
  timeoutMs: number;
  output: string | null;
  stream: StreamMode;
};

type ClientLoginResult = {
  sid: string;
  auth: string;
};

type GoogleReaderStreamResponse = {
  continuation?: string;
  items?: GoogleReaderItem[];
};

type GoogleReaderItem = {
  id?: string;
  title?: string;
  canonical?: Array<{ href?: string }>;
  alternate?: Array<{ href?: string }>;
  origin?: { title?: string; htmlUrl?: string };
  author?: string;
  published?: number;
  updated?: number;
  summary?: { content?: string };
  content?: { content?: string };
};

type RssItem = {
  guid: string;
  title: string;
  link: string;
  pubDate: string;
  description: string;
  contentEncoded: string;
  author?: string;
  sourceTitle?: string;
};

const DEFAULTS = {
  maxItems: 250,
  timeoutMs: 20_000,
  starredStreamId: "user/-/state/com.google/starred",
} as const;

/**
 * Parse CLI options.
 */
function parseArgs(argv: string[]): CliOptions {
  const options: CliOptions = {
    help: false,
    maxItems: DEFAULTS.maxItems,
    timeoutMs: DEFAULTS.timeoutMs,
    label: null,
    output: null,
  };

  for (const arg of argv) {
    if (arg === "--help") options.help = true;
    else if (arg.startsWith("--label=")) options.label = arg.slice(8).trim();
    else if (arg.startsWith("--output=")) options.output = arg.slice(9).trim();
    else if (arg.startsWith("--max-items=")) options.maxItems = Number(arg.slice(12));
    else if (arg.startsWith("--timeout-ms=")) options.timeoutMs = Number(arg.slice(13));
    else throw new Error(`Unknown argument: ${arg}`);
  }

  return options;
}

function printHelp(): void {
  const script = process.argv[1]?.split("/").pop() ?? "script";

  console.log(`
${script}

Export FreshRSS starred or labelled items as RSS.

Usage:
  node ${script}
  node ${script} --label=dnb-webdev
  node ${script} --label=dnb-entertainment --output=/tmp/feed.xml

Options:
  --label=NAME
  --output=PATH
  --max-items=NUMBER
  --timeout-ms=NUMBER
`.trim());
}

function resolveStreamMode(label: string | null, username: string): StreamMode {
  if (!label) {
    return {
      kind: "starred",
      streamId: DEFAULTS.starredStreamId,
      channelTitle: "FreshRSS Starred Items",
      channelDescription: `Starred items for ${username}`,
    };
  }

  return {
    kind: "label",
    label,
    streamId: `user/-/label/${label}`,
    channelTitle: `FreshRSS Label: ${label}`,
    channelDescription: `Items for label ${label}`,
  };
}

function getConfig(options: CliOptions): Config {
  const baseUrl = process.env.FRESHRSS_BASE_URL ?? "";
  const username = process.env.FRESHRSS_USERNAME ?? "";
  const apiPassword = process.env.FRESHRSS_API_PASSWORD ?? "";

  if (!baseUrl || !username || !apiPassword) {
    throw new Error("Missing required FreshRSS environment variables");
  }

  return {
    baseUrl: baseUrl.replace(/\/+$/, ""),
    username,
    apiPassword,
    maxItems: options.maxItems,
    timeoutMs: options.timeoutMs,
    output: options.output,
    stream: resolveStreamMode(options.label, username),
  };
}

async function fetchWithTimeout(url: URL, timeoutMs: number, init: RequestInit): Promise<Response> {
  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await fetch(url, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(t);
  }
}

async function login(config: Config): Promise<ClientLoginResult> {
  const url = new URL(`${config.baseUrl}/api/greader.php/accounts/ClientLogin`);
  url.searchParams.set("Email", config.username);
  url.searchParams.set("Passwd", config.apiPassword);

  const res = await fetchWithTimeout(url, config.timeoutMs, { method: "GET" });
  const text = await res.text();

  const sid = text.match(/^SID=(.*)$/m)?.[1];
  const auth = text.match(/^Auth=(.*)$/m)?.[1];

  if (!sid || !auth) throw new Error("Login failed");

  return { sid, auth };
}

async function fetchItems(config: Config, auth: string): Promise<GoogleReaderItem[]> {
  const items: GoogleReaderItem[] = [];
  let continuation: string | undefined;

  while (items.length < config.maxItems) {
    const url = new URL(
      `${config.baseUrl}/api/greader.php/reader/api/0/stream/contents/${config.stream.streamId}`,
    );
    url.searchParams.set("n", String(config.maxItems));
    if (continuation) url.searchParams.set("c", continuation);

    const res = await fetchWithTimeout(url, config.timeoutMs, {
      headers: { Authorization: `GoogleLogin auth=${auth}` },
    });

    const json = (await res.json()) as GoogleReaderStreamResponse;

    items.push(...(json.items ?? []));

    if (!json.continuation) break;
    continuation = json.continuation;
  }

  return items.slice(0, config.maxItems);
}

function getLink(item: GoogleReaderItem): string {
  return (
    item.canonical?.[0]?.href ||
    item.alternate?.[0]?.href ||
    item.origin?.htmlUrl ||
    ""
  );
}

function toRssItem(item: GoogleReaderItem): RssItem {
  const link = getLink(item);
  const html = item.content?.content ?? item.summary?.content ?? "";
  const date = new Date((item.published ?? Date.now() / 1000) * 1000);

  return {
    guid: item.id ?? link,
    title: item.title ?? "Untitled",
    link,
    pubDate: date.toUTCString(),
    description: html,
    contentEncoded: html,
    author: item.author,
    sourceTitle: item.origin?.title,
  };
}

function buildXml(config: Config, items: GoogleReaderItem[]): string {
  const rssItems = items.map(toRssItem);

  const itemsXml = rssItems
    .map(
      (i) => `
<item>
<title>${i.title}</title>
<link>${i.link}</link>
<guid>${i.guid}</guid>
<pubDate>${i.pubDate}</pubDate>
<description><![CDATA[${i.description}]]></description>
</item>`,
    )
    .join("");

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
<channel>
<title>${config.stream.channelTitle}</title>
<description>${config.stream.channelDescription}</description>
${itemsXml}
</channel>
</rss>`;
}

async function writeOutput(file: string, xml: string): Promise<void> {
  const full = path.resolve(file);
  await mkdir(path.dirname(full), { recursive: true });
  await writeFile(full, xml, "utf8");
  console.error(`Wrote ${full}`);
}

async function main(): Promise<void> {
  const opts = parseArgs(process.argv.slice(2));

  if (opts.help) {
    printHelp();
    return;
  }

  const config = getConfig(opts);

  const session = await login(config);
  const items = await fetchItems(config, session.auth);
  const xml = buildXml(config, items);

  if (config.output) {
    await writeOutput(config.output, xml);
  } else {
    process.stdout.write(xml + "\n");
  }
}

main().catch((e) => {
  console.error(e instanceof Error ? e.message : e);
  process.exit(1);
});