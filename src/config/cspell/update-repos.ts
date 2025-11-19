#!/usr/bin/env node

import fs from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const GITHUB_USERNAME = 'davidsneighbour';
const OUTPUT_FILENAME = 'dnb-repos.txt';
const PER_PAGE = 100;

interface GitHubRepo {
	name: string;
	private: boolean;
}

/**
 * Print CLI help.
 */
function printHelp(): void {
	console.log(
		[
			'Usage: update-repos [options]',
			'',
			'Options:',
			'  --help        Show this help message',
			'',
			`Writes all public repositories of "${GITHUB_USERNAME}"`,
			`into "${OUTPUT_FILENAME}" in the script directory.`,
		].join('\n'),
	);
}

/**
 * Type guard for GitHubRepo.
 */
function isGitHubRepo(value: unknown): value is GitHubRepo {
	if (typeof value !== 'object' || value === null) {
		return false;
	}

	const candidate = value as { name?: unknown; private?: unknown };

	return (
		typeof candidate.name === 'string' && typeof candidate.private === 'boolean'
	);
}

/**
 * Fetch a single page of repositories from GitHub API.
 */
async function fetchReposPage(page: number): Promise<GitHubRepo[]> {
	const endpoint = `https://api.github.com/users/${GITHUB_USERNAME}/repos?per_page=${PER_PAGE}&type=owner&page=${page}`;
	const headers: Record<string, string> = {
		Accept: 'application/vnd.github+json',
		'User-Agent': 'update-repos-script',
	};

	const token = process.env.GITHUB_TOKEN_FULL_DEV;
	if (token && token.trim() !== '') {
		headers.Authorization = `Bearer ${token}`;
	}

	const response = await fetch(endpoint, { headers });

	if (!response.ok) {
		const body = await response.text().catch(() => '');
		throw new Error(
			`GitHub API error (page ${page}): ${response.status} ${response.statusText}${
				body ? ` - ${body}` : ''
			}`,
		);
	}

	const json: unknown = await response.json();

	if (!Array.isArray(json)) {
		throw new TypeError(`Unexpected GitHub API response shape on page ${page}.`);
	}

	const repos: GitHubRepo[] = [];

	for (const item of json) {
		if (isGitHubRepo(item)) {
			repos.push({
				name: item.name,
				private: item.private,
			});
		}
	}

	return repos;
}

/**
 * Fetch all repositories across all pages.
 */
async function fetchAllRepos(): Promise<GitHubRepo[]> {
	const allRepos: GitHubRepo[] = [];
	let page = 1;

	// Always assume there *can* be more pages, stop only when a page returns less than PER_PAGE
	// or an empty list.
	while (true) {
		const pageRepos = await fetchReposPage(page);

		if (pageRepos.length === 0) {
			break;
		}

		allRepos.push(...pageRepos);

		if (pageRepos.length < PER_PAGE) {
			break;
		}

		page += 1;
	}

	return allRepos;
}

/**
 * Main CLI entry.
 */
async function main(): Promise<void> {
	if (process.argv.includes('--help')) {
		printHelp();
		return;
	}

	try {
		const repos = await fetchAllRepos();

		const publicRepoNames = repos
			.filter((repo) => repo.private === false)
			.map((repo) => repo.name)
			.sort((a, b) => a.localeCompare(b));

		const outputPath = join(__dirname, OUTPUT_FILENAME);

		await fs.writeFile(
			outputPath,
			`${publicRepoNames.join('\n')}\n`,
			'utf8',
		);

		console.log(
			`Wrote ${publicRepoNames.length} public repositories to ${outputPath}`,
		);
	} catch (error: unknown) {
		console.error('Something went wrong while fetching repositories.');
		if (error instanceof Error) {
			console.error(error.message);
		} else {
			console.error(error);
		}
		process.exitCode = 1;
	}
}

void main();
