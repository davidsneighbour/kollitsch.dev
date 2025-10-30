#!/usr/bin/env node
/**
 * Create missing GitHub releases for tags without a corresponding release.
 *
 * Usage:
 *   node create-missing-releases.mjs --owner davidsneighbour --repo kollitsch.dev --generate-notes --dry-run
 *
 * Env:
 *   GITHUB_PERSONAL_ACCESS_TOKEN   Personal access token with repo scope
 *
 * Flags:
 *   --owner <string>               GitHub owner or org. Default: davidsneighbour
 *   --repo <string>                GitHub repo name. Default: kollitsch.dev
 *   --dry-run                      Do not mutate, only print actions
 *   --draft                        Create releases as draft
 *   --prerelease                   Mark releases as prerelease
 *   --generate-notes               Let GitHub auto-generate release notes
 *   --target-commitish <string>    Branch or commit to use when creating releases (optional)
 *   --tag-prefix <string>          Only consider tags that start with this prefix (optional)
 *   --include-regex <pattern>      Only consider tags that match this JS RegExp (without slashes)
 *   --exclude-regex <pattern>      Skip tags that match this JS RegExp (without slashes)
 *   --concurrency <number>         Max concurrent create calls. Default: 2
 *   --help                         Show help
 *
 * Exit codes:
 *   0 on success, 1 on usage error, 2 on missing token, 3 on API error
 *
 * Notes:
 * - The script paginates through all tags and releases.
 * - A release is considered existing if any release has tag_name equal to the tag.
 * - If --generate-notes is not used, the release will be created with an empty body.
 * - Safe to re-run. Existing tag releases are skipped.
 *
 * @typedef {object} CliOptions
 * @property {string} owner
 * @property {string} repo
 * @property {boolean} dryRun
 * @property {boolean} draft
 * @property {boolean} prerelease
 * @property {boolean} generateNotes
 * @property {string | undefined} targetCommitish
 * @property {string | undefined} tagPrefix
 * @property {string | undefined} includeRegex
 * @property {string | undefined} excludeRegex
 * @property {number} concurrency
 */

const DEFAULTS = {
  owner: "davidsneighbour",
  repo: "kollitsch.dev",
  concurrency: 2,
};

const HELP = `
Create missing GitHub releases for all tags without an existing release.

Parameters:
  --owner <string>               GitHub owner or org. Default: ${DEFAULTS.owner}
  --repo <string>                GitHub repo name. Default: ${DEFAULTS.repo}
  --dry-run                      Do not mutate, only print actions
  --draft                        Create releases as draft
  --prerelease                   Mark releases as prerelease
  --generate-notes               Let GitHub auto-generate release notes
  --target-commitish <string>    Branch or commit to use when creating releases (optional)
  --tag-prefix <string>          Only consider tags that start with this prefix (optional)
  --include-regex <pattern>      Only consider tags that match this JS RegExp (without slashes)
  --exclude-regex <pattern>      Skip tags that match this JS RegExp (without slashes)
  --concurrency <number>         Max concurrent create calls. Default: ${DEFAULTS.concurrency}
  --help                         Show help

Env:
  GITHUB_PERSONAL_ACCESS_TOKEN   Personal access token with repo scope

Examples:
  node create-missing-releases.mjs
  node create-missing-releases.mjs --dry-run --generate-notes
  node create-missing-releases.mjs --owner foo --repo bar --tag-prefix v
`.trim();

/**
 * Parse CLI args.
 * @returns {CliOptions}
 */
function parseArgs() {
  const argv = process.argv.slice(2);
  if (argv.includes("--help")) {
    console.log(HELP);
    process.exit(0);
  }

  const getVal = (flag) => {
    const i = argv.indexOf(flag);
    if (i === -1 || i === argv.length - 1) return undefined;
    const v = argv[i + 1];
    if (v.startsWith("--")) return undefined;
    return v;
  };

  const opt = {
    owner: getVal("--owner") ?? DEFAULTS.owner,
    repo: getVal("--repo") ?? DEFAULTS.repo,
    dryRun: argv.includes("--dry-run"),
    draft: argv.includes("--draft"),
    prerelease: argv.includes("--prerelease"),
    generateNotes: argv.includes("--generate-notes"),
    targetCommitish: getVal("--target-commitish"),
    tagPrefix: getVal("--tag-prefix"),
    includeRegex: getVal("--include-regex"),
    excludeRegex: getVal("--exclude-regex"),
    concurrency: Number(getVal("--concurrency") ?? DEFAULTS.concurrency),
  };

  if (Number.isNaN(opt.concurrency) || opt.concurrency < 1) {
    console.error("Error: --concurrency must be a positive number");
    process.exit(1);
  }

  return opt;
}

/**
 * Robust API call with rate limit handling and pagination helper.
 * @param {string} url
 * @param {RequestInit} init
 */
async function apiRequest(url, init) {
  const res = await fetch(url, init);
  if (res.status === 403) {
    const rlRemaining = res.headers.get("x-ratelimit-remaining");
    const rlReset = res.headers.get("x-ratelimit-reset");
    if (rlRemaining === "0" && rlReset) {
      const resetTs = Number(rlReset) * 1000;
      const waitMs = Math.max(resetTs - Date.now(), 0) + 500;
      console.warn(`Rate limit hit. Waiting ${Math.ceil(waitMs / 1000)}s...`);
      await sleep(waitMs);
      return apiRequest(url, init);
    }
  }
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    const msg = text || res.statusText;
    throw new Error(`GitHub API error ${res.status}: ${msg}`);
  }
  return res;
}

/**
 * Get all pages for a GET endpoint.
 * @template T
 * @param {string} baseUrl
 * @param {string} token
 * @returns {Promise<T[]>}
 */
async function getAllPaginated(baseUrl, token) {
  let url = new URL(baseUrl);
  url.searchParams.set("per_page", "100");
  /** @type {T[]} */
  const all = [];
  // Follow Link headers
  while (true) {
    const res = await apiRequest(url.toString(), {
      headers: authHeaders(token),
    });
    const page = /** @type {T[]} */ (await res.json());
    all.push(...page);
    const link = res.headers.get("link");
    const nextUrl = parseNextLink(link);
    if (!nextUrl) break;
    url = new URL(nextUrl);
  }
  return all;
}

/**
 * @param {string | null} link
 * @returns {string | null}
 */
function parseNextLink(link) {
  if (!link) return null;
  // Format: <url>; rel="next", <url>; rel="last"
  const parts = link.split(",");
  for (const p of parts) {
    const m = p.match(/<([^>]+)>;\s*rel="next"/i);
    if (m) return m[1];
  }
  return null;
}

/**
 * @param {string} token
 */
function authHeaders(token) {
  return {
    Accept: "application/vnd.github+json",
    Authorization: `Bearer ${token}`,
    "User-Agent": "create-missing-releases-script",
  };
}

/** Sleep helper */
function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

/**
 * Fetch all tag names.
 * @param {string} owner
 * @param {string} repo
 * @param {string} token
 * @returns {Promise<string[]>}
 */
async function fetchAllTags(owner, repo, token) {
  const url = `https://api.github.com/repos/${owner}/${repo}/tags`;
  /**
   * @typedef {{ name: string; commit: { sha: string; url: string } }} Tag
   */
  const tags = await getAllPaginated(/* Tag[] */ url, token);
  return tags.map((t) => t.name);
}

/**
 * Fetch all releases mapped by tag_name.
 * @param {string} owner
 * @param {string} repo
 * @param {string} token
 * @returns {Promise<Map<string, object>>}
 */
async function fetchReleasesByTag(owner, repo, token) {
  const url = `https://api.github.com/repos/${owner}/${repo}/releases`;
  /** @typedef {{ id: number; tag_name: string }} Release */
  const releases = await getAllPaginated(/* Release[] */ url, token);
  const map = new Map();
  for (const r of releases) {
    if (typeof r.tag_name === "string") {
      map.set(r.tag_name, r);
    }
  }
  return map;
}

/**
 * Create a release for a tag.
 * @param {object} p
 * @param {string} p.owner
 * @param {string} p.repo
 * @param {string} p.token
 * @param {string} p.tag
 * @param {boolean} p.draft
 * @param {boolean} p.prerelease
 * @param {boolean} p.generateNotes
 * @param {string | undefined} p.targetCommitish
 * @returns {Promise<object>}
 */
async function createRelease({
  owner,
  repo,
  token,
  tag,
  draft,
  prerelease,
  generateNotes,
  targetCommitish,
}) {
  const url = `https://api.github.com/repos/${owner}/${repo}/releases`;
  /** @type {Record<string, unknown>} */
  const body = {
    tag_name: tag,
    name: tag,
    draft,
    prerelease,
  };
  if (generateNotes) {
    body.generate_release_notes = true;
  } else {
    body.body = "";
  }
  if (targetCommitish) {
    body.target_commitish = targetCommitish;
  }

  const res = await apiRequest(url, {
    method: "POST",
    headers: {
      ...authHeaders(token),
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  return res.json();
}

/**
 * Simple promise pool.
 * @template T
 * @param {Array<() => Promise<T>>} tasks
 * @param {number} limit
 * @returns {Promise<T[]>}
 */
async function runLimited(tasks, limit) {
  const results = /** @type {T[]} */ ([]);
  let next = 0;

  async function worker() {
    while (next < tasks.length) {
      const i = next++;
      try {
        const r = await tasks[i]();
        results[i] = r;
      } catch (e) {
        results[i] = /** @type {unknown} */ (e);
      }
    }
  }

  const workers = Array.from({ length: Math.min(limit, tasks.length) }, () => worker());
  await Promise.all(workers);
  return results;
}

/**
 * Compile a tag filter function from CLI options.
 * @param {CliOptions} opt
 * @returns {(tag: string) => boolean}
 */
function buildTagFilter(opt) {
  /** @type {RegExp | undefined} */
  let includeRe;
  /** @type {RegExp | undefined} */
  let excludeRe;

  try {
    if (opt.includeRegex) includeRe = new RegExp(opt.includeRegex);
  } catch {
    console.error("Error: invalid --include-regex pattern");
    process.exit(1);
  }
  try {
    if (opt.excludeRegex) excludeRe = new RegExp(opt.excludeRegex);
  } catch {
    console.error("Error: invalid --exclude-regex pattern");
    process.exit(1);
  }

  return (tag) => {
    if (opt.tagPrefix && !tag.startsWith(opt.tagPrefix)) return false;
    if (includeRe && !includeRe.test(tag)) return false;
    if (excludeRe && excludeRe.test(tag)) return false;
    return true;
  };
}

(async function main() {
  const token = process.env.GITHUB_PERSONAL_ACCESS_TOKEN;
  if (!token) {
    console.error("Error: GITHUB_PERSONAL_ACCESS_TOKEN is required in env");
    process.exit(2);
  }

  const opt = parseArgs();
  const filter = buildTagFilter(opt);

  console.log(`Repository: ${opt.owner}/${opt.repo}`);
  console.log(`Mode: ${opt.dryRun ? "dry-run" : "apply"}`);
  if (opt.tagPrefix) console.log(`Tag prefix filter: ${opt.tagPrefix}`);
  if (opt.includeRegex) console.log(`Include regex: ${opt.includeRegex}`);
  if (opt.excludeRegex) console.log(`Exclude regex: ${opt.excludeRegex}`);

  try {
    const [tags, relByTag] = await Promise.all([
      fetchAllTags(opt.owner, opt.repo, token),
      fetchReleasesByTag(opt.owner, opt.repo, token),
    ]);

    const considered = tags.filter(filter);
    const missing = considered.filter((t) => !relByTag.has(t));

    console.log(`Total tags: ${tags.length}`);
    console.log(`Considered tags: ${considered.length}`);
    console.log(`Existing releases: ${relByTag.size}`);
    console.log(`Missing releases to create: ${missing.length}`);

    if (missing.length === 0) {
      console.log("Nothing to do.");
      process.exit(0);
    }

    if (opt.dryRun) {
      for (const t of missing) {
        console.log(`[dry-run] Would create release for tag: ${t}`);
      }
      process.exit(0);
    }

    const tasks = missing.map((tag) => async () => {
      console.log(`Creating release for tag: ${tag}`);
      try {
        const res = await createRelease({
          owner: opt.owner,
          repo: opt.repo,
          token,
          tag,
          draft: opt.draft,
          prerelease: opt.prerelease,
          generateNotes: opt.generateNotes,
          targetCommitish: opt.targetCommitish,
        });
        const url = typeof res?.html_url === "string" ? res.html_url : undefined;
        console.log(`Created: ${tag}${url ? ` -> ${url}` : ""}`);
        return res;
      } catch (e) {
        console.error(`Failed to create release for ${tag}: ${String(e)}`);
        throw e;
      }
    });

    const results = await runLimited(tasks, opt.concurrency);
    const failed = results.filter((r) => r instanceof Error);
    if (failed.length > 0) {
      console.error(`Completed with ${failed.length} failures`);
      process.exit(3);
    }

    console.log("All missing releases created successfully.");
    process.exit(0);
  } catch (err) {
    console.error(`Fatal error: ${String(err)}`);
    process.exit(3);
  }
})();
