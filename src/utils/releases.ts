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

export interface PageSlice<T> {
  items: T[];
  page: number;
  perPage: number;
  totalItems: number;
  totalPages: number;
}

export const isSemverTag = (s: string): boolean => /^v\d+\.\d+\.\d+$/.test(s);

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
  list.sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
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
