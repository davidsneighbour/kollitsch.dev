import {
  isContributionData,
  type ContributionData,
} from './components/gimmicks/github-contributions.ts';

export interface ContributionsEnv {
  GITHUB_TOKEN?: string;
  GITHUB_USERNAME?: string;
}
const query = `query($username: String!, $from: DateTime!, $to: DateTime!) {
  user(login: $username) { contributionsCollection(from: $from, to: $to) {
    contributionCalendar { totalContributions weeks { firstDay contributionDays {
      contributionCount contributionLevel date weekday
    } } }
  } }
}`;
export async function githubContributions(
  request: Request,
  env: ContributionsEnv,
): Promise<Response> {
  const json = (body: unknown, status: number): Response =>
    Response.json(body, {
      status,
      headers: {
        'Cache-Control':
          status === 200 ? 'public, max-age=86400, s-maxage=86400' : 'no-store',
      },
    });
  if (request.method !== 'GET')
    return new Response(null, {
      status: 405,
      headers: { Allow: 'GET', 'Cache-Control': 'no-store' },
    });
  if (!env.GITHUB_TOKEN || !env.GITHUB_USERNAME)
    return json({ error: 'GitHub activity is unavailable.' }, 503);
  try {
    const to = new Date();
    const from = new Date(to.getTime() - 365 * 86_400_000);
    const response = await fetch('https://api.github.com/graphql', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.GITHUB_TOKEN}`,
        'Content-Type': 'application/json',
        Accept: 'application/vnd.github+json',
        'User-Agent': 'kollitsch-dev',
      },
      body: JSON.stringify({
        query,
        variables: {
          username: env.GITHUB_USERNAME,
          from: from.toISOString(),
          to: to.toISOString(),
        },
      }),
      signal: AbortSignal.timeout(10_000),
    });
    if (!response.ok)
      return json({ error: 'GitHub activity is unavailable.' }, 502);
    const result = (await response.json()) as {
      errors?: unknown;
      data?: {
        user?: {
          contributionsCollection?: {
            contributionCalendar?: Pick<
              ContributionData,
              'totalContributions' | 'weeks'
            >;
          };
        };
      };
    };
    const calendar =
      result.data?.user?.contributionsCollection?.contributionCalendar;
    if (result.errors || !calendar)
      return json({ error: 'GitHub activity is unavailable.' }, 502);
    // Explicit projection keeps unexpected upstream fields out of the public response.
    const data = {
      username: env.GITHUB_USERNAME,
      generatedAt: to.toISOString(),
      totalContributions: calendar.totalContributions,
      weeks: calendar.weeks.map((week) => ({
        firstDay: week.firstDay,
        contributionDays: week.contributionDays.map(
          ({ contributionCount, contributionLevel, date, weekday }) => ({
            contributionCount,
            contributionLevel,
            date,
            weekday,
          }),
        ),
      })),
    };
    if (!isContributionData(data))
      return json({ error: 'GitHub activity is unavailable.' }, 502);
    return json(data, 200);
  } catch {
    return json({ error: 'GitHub activity is unavailable.' }, 502);
  }
}
