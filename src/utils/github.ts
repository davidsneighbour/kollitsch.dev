import { execSync } from 'node:child_process';
import path from 'node:path';
import setup from '@data/setup.json' with { type: 'json' };
import { createLogger } from './logger.ts';

const log = createLogger({ slug: 'github' });

/**
 * Author information for a GitHub-tracked file.
 */
export type GitHubAuthor = {
  /**
   * Author display name as recorded in the commit.
   * May be `undefined` if Git output was malformed.
   */
  name?: string | undefined;
  /**
   * URL to the author's GitHub profile when it can be inferred.
   * `null` means no profile URL could be determined.
   */
  profileUrl: string | null;
};

/**
 * Structured GitHub info for a file path.
 *
 * This type describes the object returned by `getGithubInfo`.
 * All fields are optional except `author.profileUrl` which is explicitly nullable.
 */
export type GitHubInfo = {
  hash?: string;
  commitUrl?: string;
  fileUrl?: string;
  historyUrl?: string;
  blameUrl?: string;
  editUrl?: string;
  date?: string;
  author: GitHubAuthor;
};

/**
 * Get GitHub-related metadata for a file path.
 *
 * This runs a lightweight `git` query (single `git log -n 1`) and builds
 * repository URLs (commit, blob, blame, edit, history) using the `repository.url`
 * value from the project's `@data/setup.json`.
 *
 * Notes:
 * - This function is synchronous and intentionally small to be usable during build-time.
 * - If Git information cannot be read (e.g. not a git repo, git not available,
 *   or the file is unknown to git), the function returns `null`.
 *
 * @param filePath - Absolute or relative path to the file to inspect.
 * @returns A `GitHubInfo` object or `null` if info could not be determined.
 *
 * @example
 * ```ts
 * import { getGithubInfo } from "@utils/github";
 *
 * const info = getGithubInfo("src/content/blog/my-post.md");
 * if (info) {
 *   console.log(info.commitUrl);
 * }
 * ```
 */
export function getGithubInfo(filePath: string): GitHubInfo | null {
  try {
    const fullPath = path.resolve(filePath);
    // Normalize to posix-style path for GitHub URL building
    const relPath = path.relative(process.cwd(), fullPath).replace(/\\/g, '/');

    const output = execSync(
      `git log -n 1 --pretty=format:"%h|%an|%ae|%aI" -- "${fullPath}"`,
      { encoding: 'utf8' },
    ).trim();

    const [hash, authorName, authorEmail, date] = output.split('|');

    const repo = String(setup.repository?.url ?? '')
      .replace(/\/$/, '')
      .replace(/\.git$/, '');
    const branch = 'main';

    const profileUrl =
      typeof authorEmail === 'string' &&
      authorEmail.endsWith('@users.noreply.github.com')
        ? `https://github.com/${authorEmail.split('+')[1]?.split('@')[0] ?? ''}`
        : null;

    return {
      author: {
        name: authorName,
        profileUrl,
      },
      blameUrl: repo ? `${repo}/blame/${branch}/${relPath}` : undefined,
      commitUrl: repo ? `${repo}/commit/${hash}` : undefined,
      date,
      editUrl: repo ? `${repo}/edit/${branch}/${relPath}` : undefined,
      fileUrl: repo ? `${repo}/blob/${branch}/${relPath}` : undefined,
      hash,
      historyUrl: repo ? `${repo}/commits/${branch}/${relPath}` : undefined,
    };
  } catch (err: unknown) {
    // Use the project's logger instead of console.warn
    log.warn(
      `[GitInfo] Failed to get info for ${filePath}: ${
        err instanceof Error ? err.message : String(err)
      }`,
    );
    return null;
  }
}
