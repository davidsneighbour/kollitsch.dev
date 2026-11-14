export const levels = [
  'NONE',
  'FIRST_QUARTILE',
  'SECOND_QUARTILE',
  'THIRD_QUARTILE',
  'FOURTH_QUARTILE',
] as const;
export interface ContributionDay {
  contributionCount: number;
  contributionLevel: (typeof levels)[number];
  date: string;
  weekday: number;
}
export interface ContributionData {
  username: string;
  generatedAt: string;
  totalContributions: number;
  weeks: { firstDay: string; contributionDays: ContributionDay[] }[];
}
const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;
const isDate = (value: unknown): value is string =>
  typeof value === 'string' &&
  /^\d{4}-\d{2}-\d{2}$/.test(value) &&
  new Date(`${value}T00:00:00Z`).toISOString().slice(0, 10) === value;
const isCount = (value: unknown): value is number =>
  Number.isSafeInteger(value) && Number(value) >= 0;
export function isContributionData(value: unknown): value is ContributionData {
  try {
    return (
      isRecord(value) &&
      typeof value['username'] === 'string' &&
      value['username'].length > 0 &&
      typeof value['generatedAt'] === 'string' &&
      Number.isFinite(Date.parse(value['generatedAt'])) &&
      isCount(value['totalContributions']) &&
      Array.isArray(value['weeks']) &&
      value['weeks'].length > 0 &&
      value['weeks'].length <= 54 &&
      value['weeks'].every(
        (week: unknown) =>
          isRecord(week) &&
          isDate(week['firstDay']) &&
          Array.isArray(week['contributionDays']) &&
          week['contributionDays'].length > 0 &&
          week['contributionDays'].length <= 7 &&
          week['contributionDays'].every(
            (day: unknown) =>
              isRecord(day) &&
              isDate(day['date']) &&
              isCount(day['contributionCount']) &&
              levels.includes(
                day[
                  'contributionLevel'
                ] as ContributionDay['contributionLevel'],
              ) &&
              Number.isInteger(day['weekday']) &&
              Number(day['weekday']) >= 0 &&
              Number(day['weekday']) <= 6 &&
              new Date(`${day['date']}T00:00:00Z`).getUTCDay() ===
                day['weekday'],
          ),
      )
    );
  } catch {
    return false;
  }
}
/**
 * Maps a day's contribution count to an activity level from 0 to 4 on a
 * logarithmic scale relative to the busiest day shown. GitHub's own
 * `contributionLevel` splits the range linearly, so one very busy day puts
 * almost every other day into the first level. Level 1 starts at one
 * contribution; levels 2, 3, and 4 start above maxCount^(1/4), ^(2/4), and
 * ^(3/4).
 */
export function activityLevel(count: number, maxCount: number): number {
  if (count <= 0) return 0;
  if (maxCount <= 1) return 1;
  const position = Math.log(count) / Math.log(maxCount);
  return 1 + Math.min(3, Math.floor(position * 4));
}
export function cacheLifetime(hours: number): number {
  return Math.max(24, Number.isFinite(hours) ? hours : 24) * 3_600_000;
}
export async function loadContributions(
  endpoint: string,
  hours: number,
  storage?: Storage,
  now = Date.now(),
): Promise<ContributionData> {
  const url = new URL(endpoint, window.location.href);
  if (url.origin !== window.location.origin)
    throw new Error('A local endpoint is required.');
  const key = `github-contributions:v1:${url.href}`;
  try {
    const raw = storage?.getItem(key);
    if (raw) {
      const cached: unknown = JSON.parse(raw);
      if (
        isRecord(cached) &&
        typeof cached['savedAt'] === 'number' &&
        cached['savedAt'] <= now &&
        now - cached['savedAt'] < cacheLifetime(hours) &&
        isContributionData(cached['data'])
      )
        return cached['data'];
      storage?.removeItem(key);
    }
  } catch {
    try {
      storage?.removeItem(key);
    } catch {
      /* Storage is optional. */
    }
  }
  const response = await fetch(url, { signal: AbortSignal.timeout(15_000) });
  if (!response.ok) throw new Error('Calendar unavailable.');
  const data: unknown = await response.json();
  if (!isContributionData(data)) throw new Error('Invalid calendar.');
  try {
    storage?.setItem(key, JSON.stringify({ data, savedAt: now }));
  } catch {
    /* Quota and privacy settings must not prevent rendering. */
  }
  return data;
}
