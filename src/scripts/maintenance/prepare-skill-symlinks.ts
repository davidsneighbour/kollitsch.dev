#!/usr/bin/env node

import { lstat, mkdir, readlink, rm, symlink } from 'node:fs/promises';
import path from 'node:path';

interface SymlinkConfig {
  linkPath: string;
  targetPath: string;
}

const configs: SymlinkConfig[] = [
  {
    linkPath: '.codex/skills',
    targetPath: '../.agents/skills',
  },
  {
    linkPath: '.claude/skills',
    targetPath: '../.agents/skills',
  },
];

async function pathExists(filePath: string) {
  try {
    return await lstat(filePath);
  } catch (error) {
    if (error && typeof error === 'object' && 'code' in error && error.code === 'ENOENT') {
      return null;
    }

    throw error;
  }
}

async function ensureSymlink(config: SymlinkConfig) {
  const linkPath = path.resolve(config.linkPath);
  const stat = await pathExists(linkPath);

  if (!stat) {
    await mkdir(path.dirname(linkPath), { recursive: true });
    await symlink(config.targetPath, linkPath, 'dir');
    console.log(`Created symlink: ${config.linkPath} -> ${config.targetPath}`);
    return;
  }

  if (!stat.isSymbolicLink()) {
    throw new Error(
      `Refusing to replace "${config.linkPath}" because it exists and is not a symlink.`,
    );
  }

  const currentTarget = await readlink(linkPath);

  if (currentTarget === config.targetPath) {
    console.log(`Symlink already exists: ${config.linkPath} -> ${config.targetPath}`);
    return;
  }

  await rm(linkPath);
  await symlink(config.targetPath, linkPath, 'dir');

  console.log(
    `Updated symlink: ${config.linkPath} was "${currentTarget}", now "${config.targetPath}"`,
  );
}

async function main() {
  for (const config of configs) {
    await ensureSymlink(config);
  }
}

main().catch((error) => {
  console.error('Failed to prepare skill symlinks.');
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
