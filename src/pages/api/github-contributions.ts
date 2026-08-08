import { getSecret } from 'astro:env/server';
import type { APIRoute } from 'astro';

export const prerender = false;

const GITHUB_GRAPHQL_URL = 'https://api.github.com/graphql';
const RANGE_DAYS = 365;

type GitHubContributionDay = {
  contributionCount: number;
  contributionLevel:
    | 'NONE'
    | 'FIRST_QUARTILE'
    | 'SECOND_QUARTILE'
    | 'THIRD_QUARTILE'
    | 'FOURTH_QUARTILE';
  date: string;
  weekday: number;
};

type GitHubContributionWeek = {
  firstDay: string;
  contributionDays: GitHubContributionDay[];
};

type GitHubContributionResponse = {
  data?: {
    user?: {
      contributionsCollection: {
        contributionCalendar: {
          totalContributions: number;
          weeks: GitHubContributionWeek[];
        };
      };
    } | null;
  };
  errors?: Array<{
    message: string;
  }>;
};

const query = `
  query ContributionCalendar(
    $username: String!
    $from: DateTime!
    $to: DateTime!
  ) {
    user(login: $username) {
      contributionsCollection(from: $from, to: $to) {
        contributionCalendar {
          totalContributions
          weeks {
            firstDay
            contributionDays {
              contributionCount
              contributionLevel
              date
              weekday
            }
          }
        }
      }
    }
  }
`;

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    headers: {
      'Cache-Control':
        status === 200
          ? 'public, max-age=300, s-maxage=3600, stale-while-revalidate=86400'
          : 'no-store',
      'Content-Type': 'application/json; charset=utf-8',
    },
    status,
  });
}

export const GET: APIRoute = async () => {
  try {
    const token = getSecret('GITHUB_TOKEN');
    const username = getSecret('GITHUB_USERNAME');

    if (!token) {
      console.error(
        'GitHub contributions API: GITHUB_TOKEN is not configured.',
      );
      return json({ error: 'GitHub contributions are not configured.' }, 500);
    }

    if (!username) {
      console.error(
        'GitHub contributions API: GITHUB_USERNAME is not configured.',
      );
      return json({ error: 'GitHub contributions are not configured.' }, 500);
    }

    const to = new Date();
    const from = new Date(to);
    from.setUTCDate(from.getUTCDate() - RANGE_DAYS);

    const response = await fetch(GITHUB_GRAPHQL_URL, {
      body: JSON.stringify({
        query,
        variables: {
          from: from.toISOString(),
          to: to.toISOString(),
          username,
        },
      }),
      headers: {
        Accept: 'application/vnd.github+json',
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        'User-Agent': 'github-contributions-component',
      },
      method: 'POST',
    });

    if (!response.ok) {
      const responseText = await response.text();
      console.error(
        `GitHub contributions API: GitHub returned ${response.status}.`,
        responseText,
      );

      return json({ error: 'Unable to retrieve GitHub contributions.' }, 502);
    }

    const result = (await response.json()) as GitHubContributionResponse;

    if (result.errors?.length) {
      console.error('GitHub contributions API: GraphQL errors.', result.errors);
      return json({ error: 'Unable to retrieve GitHub contributions.' }, 502);
    }

    const calendar =
      result.data?.user?.contributionsCollection.contributionCalendar;

    if (!calendar) {
      console.error(
        `GitHub contributions API: user "${username}" was not found or returned no calendar.`,
      );

      return json({ error: 'GitHub contribution data is unavailable.' }, 404);
    }

    return json({
      generatedAt: new Date().toISOString(),
      totalContributions: calendar.totalContributions,
      username,
      weeks: calendar.weeks,
    });
  } catch (error) {
    console.error('GitHub contributions API: unexpected error.', error);
    return json({ error: 'Unable to retrieve GitHub contributions.' }, 500);
  }
};
