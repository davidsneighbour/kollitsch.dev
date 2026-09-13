#!/usr/bin/env -S node

import { execFile } from 'node:child_process';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import readline from 'node:readline/promises';
import { promisify } from 'node:util';

import {
  fetchStatusById,
  listEligibleStatuses,
  loadMergedEnv,
  type MastodonAccount,
  type MastodonStatus,
  normaliseStreamStatus,
  resolveMastodonAccount,
  resolveStreamConfigFromEnv,
  statusToSuggestedPost,
} from '../../utils/mastodon-stream.ts';

const execFileAsync = promisify(execFile);

const config = {
  contentDirectory: 'src/content/blog',
} as const;

interface CliOptions {
  id?: string;
  help: boolean;
  dryRun: boolean;
  force: boolean;
  offline: boolean;
  noOpen: boolean;
  keepRemoteMedia: boolean;
  title?: string;
  description?: string;
  tags?: string;
  slug?: string;
}

/** Print CLI usage information. */
function printHelp(): void {
  console.log(`Usage:
  npm run promote:stream -- [id] [options]

Options:
  --help                Show this help message.
  --dry-run             Print the generated post without writing it.
  --force               Overwrite an existing post file / promote an ineligible status.
  --offline             Only use cached Mastodon data, never hit the network.
  --no-open             Do not open the created file in VS Code.
  --keep-remote-media   Keep media as remote links instead of downloading it.
  --title <text>        Post title (skips the prompt).
  --description <text>  Post description (skips the prompt).
  --tags <a,b,c>        Comma-separated tags (skips the prompt).
  --slug <slug>         Post slug (skips the prompt).

Behaviour:
  - With an id: fetches that status (or reads it from cache) and drafts a post from it.
  - Without an id: lists recent eligible stream posts and asks you to choose one.
  - Media attachments are downloaded into the post bundle unless --keep-remote-media is passed.
  - Writes src/content/blog/YYYY/slug/index.md with Mastodon provenance in \`origin\` frontmatter.
`);
}

/** Parses CLI flags and an optional positional Mastodon status id. */
function parseArgs(args: string[]): CliOptions {
  const options: CliOptions = {
    dryRun: args.includes('--dry-run'),
    force: args.includes('--force'),
    help: args.includes('--help'),
    keepRemoteMedia: args.includes('--keep-remote-media'),
    noOpen: args.includes('--no-open'),
    offline: args.includes('--offline'),
  };

  const valueFlags: Record<string, keyof CliOptions> = {
    '--description': 'description',
    '--slug': 'slug',
    '--tags': 'tags',
    '--title': 'title',
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (!arg) continue;
    const key = valueFlags[arg];
    if (key) {
      const value = args[i + 1];
      if (value) (options as Record<string, string>)[key] = value;
      i++;
      continue;
    }
    if (!arg.startsWith('-') && !options.id) {
      options.id = arg;
    }
  }

  return options;
}

/** Converts free text into a filesystem-safe slug (mirrors create-blog-post.ts). */
function slugifyTitle(title: string): string {
  const replacements = new Map<string, string>([
    ['ä', 'ae'],
    ['ö', 'oe'],
    ['ü', 'ue'],
    ['Ä', 'ae'],
    ['Ö', 'oe'],
    ['Ü', 'ue'],
    ['ß', 'ss'],
  ]);

  const replaced = [...title].map((character) => replacements.get(character) ?? character).join('');

  return replaced
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

function parseTags(input: string): string[] {
  return input
    .split(',')
    .map((tag) => tag.trim().toLowerCase())
    .filter((tag) => tag.length > 0);
}

function escapeYamlString(value: string): string {
  return value.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}

function defaultTitleFromBody(bodyMarkdown: string): string {
  const firstLine = bodyMarkdown.split('\n').find((line) => line.trim().length > 0) ?? '';
  return firstLine.length > 80 ? `${firstLine.slice(0, 77)}...` : firstLine || 'Untitled stream post';
}

interface PostFields {
  title: string;
  description: string;
  tags: string[];
  slug: string;
}

/** Downloads a Mastodon media attachment next to the post, returning its relative filename. */
async function downloadMediaAttachment(
  url: string,
  destinationDir: string,
  statusId: string,
  index: number,
): Promise<string> {
  const extension = path.extname(new URL(url).pathname) || '.jpg';
  const filename = `mastodon-${statusId}-${index + 1}${extension}`;
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Failed to download media: ${url} (${response.status})`);
  const buffer = Buffer.from(await response.arrayBuffer());
  await writeFile(path.join(destinationDir, filename), buffer);
  return filename;
}

/** Builds the Markdown document (frontmatter + body) for a promoted post. */
function createPostContent(
  fields: PostFields,
  bodyMarkdown: string,
  origin: ReturnType<typeof statusToSuggestedPost>['origin'],
  mediaLines: string[],
): string {
  const tagBlock = fields.tags.length > 0 ? fields.tags.map((tag) => `  - ${tag}`).join('\n') : '[]';

  const body = [bodyMarkdown, ...mediaLines, `Source: [Mastodon](${origin.url})`]
    .filter((part) => part.trim().length > 0)
    .join('\n\n');

  return `---
title: "${escapeYamlString(fields.title)}"
description: "${escapeYamlString(fields.description)}"
summary: ""
tags:
${tagBlock}
fmContentType: article
date: ${origin.published}
origin:
  type: ${origin.type}
  id: "${origin.id}"
  uri: "${origin.uri}"
  url: "${origin.url}"
  account: "${origin.account}"
  published: ${origin.published}
  imported: ${origin.imported}
---

${body}
`;
}

async function openInVSCode(filePath: string): Promise<void> {
  try {
    await execFileAsync('code', [filePath]);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Could not open VS Code with "code ${filePath}". ${message}`);
  }
}

async function promptFields(
  rl: readline.Interface,
  defaults: PostFields,
  options: CliOptions,
): Promise<PostFields> {
  const titleAnswer = options.title ?? (await rl.question(`Title [${defaults.title}]: `)).trim();
  const title = titleAnswer || defaults.title;
  const descriptionAnswer = options.description ?? (await rl.question('Description: ')).trim();
  const description = descriptionAnswer || defaults.description;
  const tagsInput = options.tags ?? (await rl.question('Tags, comma-separated: ')).trim();
  const tags = tagsInput ? parseTags(tagsInput) : defaults.tags;
  const slugAnswer = options.slug ?? slugifyTitle(title);
  const slug = slugAnswer || defaults.slug;

  return { description, slug, tags, title };
}

/** Prints a numbered list of eligible statuses and returns the chosen one. */
async function chooseStatus(
  rl: readline.Interface,
  statuses: MastodonStatus[],
): Promise<MastodonStatus> {
  statuses.forEach((status, index) => {
    const normalised = normaliseStreamStatus(status);
    const preview = stripHtml(normalised.contentHtml).slice(0, 60);
    const date = new Date(status.created_at).toISOString().slice(0, 10);
    console.log(
      `${index + 1}. [${status.id}] ${date} - ${preview} ` +
        `(media: ${normalised.media.length}, replies: ${normalised.counts.replies}, ` +
        `favourites: ${normalised.counts.favourites}, boosts: ${normalised.counts.boosts})`,
    );
  });

  const answer = (await rl.question('Choose a post to promote (number): ')).trim();
  const chosen = statuses[Number.parseInt(answer, 10) - 1];
  if (!chosen) throw new Error(`"${answer}" is not a valid choice.`);
  return chosen;
}

async function promoteStatus(
  status: MastodonStatus,
  account: MastodonAccount,
  options: CliOptions,
  rl: readline.Interface,
): Promise<void> {
  const accountHandle = `@${account.username}@${new URL(account.url).hostname}`;
  const suggested = statusToSuggestedPost(status, accountHandle);

  const defaults: PostFields = {
    description: stripHtml(status.content).slice(0, 160),
    slug: slugifyTitle(defaultTitleFromBody(suggested.bodyMarkdown)),
    tags: ['mastodon'],
    title: defaultTitleFromBody(suggested.bodyMarkdown),
  };

  const fields = await promptFields(rl, defaults, options);
  const year = String(new Date(suggested.origin.published).getFullYear());
  const postDirectory = path.join(config.contentDirectory, year, fields.slug);
  const postFile = path.join(postDirectory, 'index.md');

  const mediaLines: string[] = [];
  if (!options.dryRun) {
    await mkdir(postDirectory, { recursive: true });
  }

  for (const [index, media] of suggested.media.entries()) {
    if (!media.url) continue;
    const alt = media.description ?? '';
    if (options.keepRemoteMedia || options.offline || options.dryRun) {
      mediaLines.push(`![${alt}](${media.url})`);
      continue;
    }
    try {
      const filename = await downloadMediaAttachment(media.url, postDirectory, status.id, index);
      mediaLines.push(`![${alt}](./${filename})`);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      console.warn(`Warning: ${message}. Keeping remote link instead.`);
      mediaLines.push(`![${alt}](${media.url})`);
    }
  }

  const content = createPostContent(fields, suggested.bodyMarkdown, suggested.origin, mediaLines);

  console.log(`Target file: ${postFile}`);

  if (options.dryRun) {
    console.log('\nGenerated content:\n');
    console.log(content);
    return;
  }

  await writeFile(postFile, content, {
    encoding: 'utf8',
    flag: options.force ? 'w' : 'wx',
  });

  console.log(`Created ${postFile}`);

  if (!options.noOpen) {
    await openInVSCode(postFile);
  }
}

async function main(): Promise<void> {
  const options = parseArgs(process.argv.slice(2));

  if (options.help) {
    printHelp();
    return;
  }

  await loadMergedEnv();
  const streamConfig = resolveStreamConfigFromEnv();
  const fetchImpl = options.offline
    ? (async () => {
        throw new Error('Offline mode: network access is disabled.');
      })
    : undefined;
  const fetchOptions = fetchImpl ? { fetchImpl: fetchImpl as unknown as typeof fetch } : {};

  const account = await resolveMastodonAccount(streamConfig, fetchOptions);

  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  try {
    let status: MastodonStatus;

    if (options.id) {
      status = await fetchStatusById(streamConfig, options.id, fetchOptions);
      if (!status.reblog && (status.in_reply_to_id == null || status.in_reply_to_account_id === account.id)) {
        // eligible - continue
      } else if (!options.force) {
        throw new Error(
          `Status ${options.id} is not eligible for the stream (boost or reply to another account). Pass --force to promote it anyway.`,
        );
      }
    } else {
      const statuses = await listEligibleStatuses(streamConfig, account, fetchOptions);
      if (statuses.length === 0) throw new Error('No eligible stream posts found.');
      status = await chooseStatus(rl, statuses);
    }

    await promoteStatus(status, account, options, rl);
  } finally {
    rl.close();
  }
}

try {
  await main();
} catch (error: unknown) {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`Error: ${message}`);
  console.error('Run with --help to see available options.');
  process.exitCode = 1;
}
