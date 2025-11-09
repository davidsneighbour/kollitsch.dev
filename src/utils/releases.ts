import type { CollectionEntry } from "astro:content";
import { getCollection } from "astro:content";

export interface RawRelease {
  name: string;
  tagName?: string;
  publishedAt?: string;
  descriptionHTML: string;
}

export interface Release {
  tag: string;
  name: string;
  year: number;
  publishedAt: string;
  descriptionHTML: string;
}

export interface MinorGroup {
  major: number;
  minor: number;
  tag: string;
}

export interface PageSlice<T> {
  items: T[];
  page: number;
  perPage: number;
  totalItems: number;
  totalPages: number;
}

export const isSemverTag = (s: string): boolean => /^v\d+\.\d+\.\d+$/.test(s);

const minorGroupMatcher = /^v(\d+)\.(\d+)$/;

const semverMatcher = /^v(\d+)\.(\d+)\.(\d+)$/;

function parseSemver(tag: string): [number, number, number] | null {
  const match = tag.match(semverMatcher);
  if (!match) return null;
  const [, major, minor, patch] = match;
  return [Number.parseInt(major, 10), Number.parseInt(minor, 10), Number.parseInt(patch, 10)];
}

export const isMinorGroupTag = (s: string): boolean => minorGroupMatcher.test(s);

export function getMinorGroup(tag: string): MinorGroup | null {
  const match = parseSemver(tag);
  if (!match) return null;
  const [major, minor] = match;
  return {
    major,
    minor,
    tag: `v${major}.${minor}`,
  };
}

export function getMinorGroupTag(tag: string): string | null {
  return getMinorGroup(tag)?.tag ?? null;
}

export const downlevelH2 = (html: string): string =>
  html.replace(/<h2\b/gi, "<h3").replace(/<\/h2>/gi, "</h3>");

export function normalizeRelease(raw: RawRelease): Release | null {
  const tag = (raw.tagName ?? raw.name ?? "").trim();
  if (!isSemverTag(tag)) return null;

  const publishedDate = new Date(raw.publishedAt ?? "");
  if (Number.isNaN(publishedDate.getTime())) return null;

  return {
    tag,
    name: raw.name?.trim() || tag,
    year: publishedDate.getUTCFullYear(),
    publishedAt: publishedDate.toISOString(),
    descriptionHTML: downlevelH2(raw.descriptionHTML ?? ""),
  };
}

export async function loadAllReleases(): Promise<Release[]> {
  const repos: CollectionEntry<"githubReleases">[] = await getCollection("githubReleases");
  const raw: RawRelease[] =
    repos[0]?.data && Array.isArray((repos[0].data as { releases?: unknown }).releases)
      ? (repos[0].data as { releases: RawRelease[] }).releases
      : [];

  const list = raw.map(normalizeRelease).filter(Boolean) as Release[];
  list.sort((a, b) => {
    const timeDiff = new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
    if (Number.isFinite(timeDiff) && timeDiff !== 0) {
      return timeDiff;
    }

    const semverA = parseSemver(a.tag);
    const semverB = parseSemver(b.tag);
    if (semverA && semverB) {
      const [majorA, minorA, patchA] = semverA;
      const [majorB, minorB, patchB] = semverB;
      const deltaMajor = majorB - majorA;
      if (deltaMajor !== 0) return deltaMajor;

      const deltaMinor = minorB - minorA;
      if (deltaMinor !== 0) return deltaMinor;

      const deltaPatch = patchB - patchA;
      if (deltaPatch !== 0) return deltaPatch;
    }

    return b.tag.localeCompare(a.tag, undefined, { numeric: true, sensitivity: "base" });
  });
  return list;
}

export function getYears(releases: Release[]): number[] {
  return [...new Set(releases.map((r) => r.year))].sort((a, b) => b - a);
}

export function filterByYear(releases: Release[], year: number): Release[] {
  return releases.filter((r) => r.year === year);
}

export function findByTag(releases: Release[], tag: string): Release | null {
  return releases.find((r) => r.tag === tag) ?? null;
}

export function getMinorGroups(releases: Release[]): string[] {
  const seen = new Set<string>();
  const groups: string[] = [];
  for (const release of releases) {
    const tag = getMinorGroupTag(release.tag);
    if (!tag || seen.has(tag)) continue;
    seen.add(tag);
    groups.push(tag);
  }
  return groups;
}

export function filterByMinorGroup(releases: Release[], group: string): Release[] {
  if (!isMinorGroupTag(group)) return [];
  return releases.filter((r) => getMinorGroupTag(r.tag) === group);
}

export function paginate<T>(items: T[], page: number, perPage: number): PageSlice<T> {
  const totalItems = items.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / perPage));
  const currentPage = Math.min(Math.max(1, page), totalPages);
  const start = (currentPage - 1) * perPage;
  const end = start + perPage;

  return {
    items: items.slice(start, end),
    page: currentPage,
    perPage,
    totalItems,
    totalPages,
  };
}

import setup from "@data/setup.json" with { type: "json" };

/**
 * Safe site-wide pagination read.
 * Floors to >= 1 and falls back to defaultValue if invalid.
 */
export function getReleasesPerPage(defaultValue = 10): number {
  const n = Number(setup.releasesPerPage);
  if (!Number.isFinite(n) || n < 1) return defaultValue;
  return Math.floor(n);
}
