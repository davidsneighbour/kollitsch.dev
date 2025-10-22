import { execSync } from 'node:child_process';
import path from 'node:path';
import setup from '@data/setup.json' with { type: 'json' };

export function getGithubInfo(filePath: string): {
  hash: string | undefined;
  commitUrl: string | undefined;
  fileUrl: string | undefined;
  historyUrl: string | undefined;
  blameUrl: string | undefined;
  editUrl: string | undefined;
  date: string | undefined;
  author: {
    name: string | undefined;
    profileUrl: string | null;
  };
} | null {
  try {
    const fullPath = path.resolve(filePath);
    const relPath = path.relative(process.cwd(), fullPath).replace(/\\/g, '/');

    const output = execSync(
      `git log -n 1 --pretty=format:"%h|%an|%ae|%aI" -- "${fullPath}"`,
      { encoding: 'utf8' },
    ).trim();

    const [hash, authorName, authorEmail, date] = output.split('|');

    const repo = setup.repository.url.replace(/\/$/, '').replace(/\.git$/, '');
    const branch = 'main';

    return {
      author: {
        name: authorName,
        profileUrl:
          authorEmail && authorEmail.endsWith('@users.noreply.github.com')
            ? `https://github.com/${authorEmail.split('+')[1]?.split('@')[0] ?? ''}`
            : null,
      },
      blameUrl: `${repo}/blame/${branch}/${relPath}`,
      commitUrl: `${repo}/commit/${hash}`,
      date,
      editUrl: `${repo}/edit/${branch}/${relPath}`,
      fileUrl: `${repo}/blob/${branch}/${relPath}`,
      hash,
      historyUrl: `${repo}/commits/${branch}/${relPath}`,
    };
  } catch (err) {
    console.warn(`[GitInfo] Failed to get info for ${filePath}`, err);
    return null;
  }
}
