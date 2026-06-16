#!/usr/bin/env node

import { lstat, readlink, rm, symlink } from 'node:fs/promises';
import path from 'node:path';

const config = {
  linkPath: 'ai',
  targetPath: '../ai/ai',
};

async function pathExists(filePath) {
  try {
    return await lstat(filePath);
  } catch (error) {
    if (error && error.code === 'ENOENT') {
      return null;
    }

    throw error;
  }
}

async function main() {
  const linkPath = path.resolve(config.linkPath);
  const targetPath = config.targetPath;

  const stat = await pathExists(linkPath);

  if (!stat) {
    await symlink(targetPath, linkPath, 'dir');
    console.log(`Created symlink: ${config.linkPath} -> ${config.targetPath}`);
    return;
  }

  if (!stat.isSymbolicLink()) {
    throw new Error(
      `Refusing to replace "${config.linkPath}" because it exists and is not a symlink.`,
    );
  }

  const currentTarget = await readlink(linkPath);

  if (currentTarget === targetPath) {
    console.log(`Symlink already exists: ${config.linkPath} -> ${config.targetPath}`);
    return;
  }

  await rm(linkPath);
  await symlink(targetPath, linkPath, 'dir');

  console.log(
    `Updated symlink: ${config.linkPath} was "${currentTarget}", now "${config.targetPath}"`,
  );
}

main().catch((error) => {
  console.error('Failed to prepare AI config symlink.');
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
