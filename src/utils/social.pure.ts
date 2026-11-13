/**
 * Pure helpers for the social media setup in `src/data/setup.json`
 * (`social` section). No Astro imports, so Vitest can load this file
 * directly.
 *
 * @see documentation/content/social-setup.md
 */

/** Places on the site where a network can appear. */
export const SOCIAL_PLACEMENTS = [
  'footer',
  'connect',
  'shareBar',
  'shareMeta',
  'socialspec',
] as const;

export type SocialPlacement = (typeof SOCIAL_PLACEMENTS)[number];

/** Placements that link to a share intent, not to the profile. */
const SHARE_PLACEMENTS: readonly SocialPlacement[] = ['shareBar', 'shareMeta'];

/** Placeholders that a share URL template can use. */
export const SHARE_PLACEHOLDERS = ['url', 'title', 'description'] as const;

export type SharePlaceholder = (typeof SHARE_PLACEHOLDERS)[number];

export type ShareValues = Partial<Record<SharePlaceholder, string>>;

export interface SocialProfile {
  /** Profile URL, or a site path for contact channels such as email. */
  url: string;
  /** Account name as shown on the network, or `null` if there is none. */
  handle: string | null;
  /** Short call to action, used as the link title and on the connect page. */
  title: string;
  /** Extra `rel` tokens, merged with `social.defaults.rel`. */
  rel: string[];
}

export interface SocialShare {
  /** Share intent URL template with `{url}`, `{title}`, `{description}`. */
  url: string;
}

export interface SocialClasses {
  /** Tailwind classes for the icon colour on hover. Empty for none. */
  fill: string;
  /** Tailwind classes for the share bar button background. Empty for none. */
  background: string;
}

export interface SocialNetwork<Icon extends string = string> {
  id: string;
  label: string;
  icon: Icon;
  profile: SocialProfile;
  share: SocialShare | null;
  classes: SocialClasses;
  show: Record<SocialPlacement, boolean>;
}

export interface SocialDefaults {
  /** `rel` tokens on every profile link. */
  rel: string[];
  /** `target` on every profile link. */
  target: string;
}

export interface SocialConfig<Icon extends string = string> {
  defaults: SocialDefaults;
  networks: SocialNetwork<Icon>[];
}

/**
 * Check the social configuration and return it unchanged. Throws one error
 * that lists every problem, so a broken config fails the build early.
 */
export function validateSocialConfig<Icon extends string>(
  config: SocialConfig<Icon>,
): SocialConfig<Icon> {
  const problems: string[] = [];
  const seen = new Set<string>();

  for (const network of config.networks) {
    const where = `social.networks["${network.id}"]`;

    if (!/^[a-z0-9-]+$/.test(network.id)) {
      problems.push(`${where}: id must use only a-z, 0-9, and "-"`);
    }
    if (seen.has(network.id)) {
      problems.push(`${where}: duplicate id`);
    }
    seen.add(network.id);

    if (!network.profile.url) {
      problems.push(`${where}: profile.url is empty`);
    }
    if (/^mailto:/i.test(network.profile.url)) {
      problems.push(`${where}: profile.url must not publish an email address`);
    }

    for (const placement of SOCIAL_PLACEMENTS) {
      if (typeof network.show[placement] !== 'boolean') {
        problems.push(`${where}: show.${placement} must be true or false`);
      }
    }

    for (const placement of SHARE_PLACEMENTS) {
      if (network.show[placement] && !network.share) {
        problems.push(`${where}: show.${placement} needs a share URL`);
      }
    }

    if (network.share) {
      const unknown = [...network.share.url.matchAll(/\{([^}]+)\}/g)]
        .map((match) => match[1] ?? '')
        .filter(
          (key) => !(SHARE_PLACEHOLDERS as readonly string[]).includes(key),
        );
      if (unknown.length > 0) {
        problems.push(
          `${where}: unknown share placeholder(s) ${unknown.join(', ')}`,
        );
      }
      if (/^mailto:[^?]/i.test(network.share.url)) {
        problems.push(`${where}: share.url must not publish an email address`);
      }
    }
  }

  if (problems.length > 0) {
    throw new Error(
      `Invalid social setup in src/data/setup.json:\n- ${problems.join('\n- ')}`,
    );
  }

  return config;
}

/** Networks shown at one placement, in config order. */
export function networksFor<Icon extends string>(
  networks: readonly SocialNetwork<Icon>[],
  placement: SocialPlacement,
): SocialNetwork<Icon>[] {
  return networks.filter((network) => network.show[placement]);
}

/**
 * Fill a share URL template. Each value is URL-encoded; missing values
 * become empty strings.
 */
export function buildShareUrl(template: string, values: ShareValues): string {
  return template.replace(/\{([^}]+)\}/g, (_, key: string) =>
    encodeURIComponent(values[key as SharePlaceholder] ?? ''),
  );
}

/** Join the default `rel` tokens with the network's own, without repeats. */
export function mergeRel(
  defaults: readonly string[],
  extra: readonly string[] = [],
): string {
  return [...new Set([...defaults, ...extra].filter(Boolean))].join(' ');
}

/** A network's brand colour for light and dark surfaces. */
export interface NetworkHoverColour {
  light: string;
  dark: string;
}

/**
 * Read the brand colour from a network's `classes.fill`, for example
 * `hover:text-[#0085ff]`, so `setup.json` stays the only place that holds
 * network colours. A black brand colour would vanish on a dark surface, so
 * its dark variant is white. Returns `null` when `fill` has no hex colour.
 */
export function networkHoverColour(fill: string): NetworkHoverColour | null {
  const match = /(?:^|\s)hover:text-\[(#[0-9a-f]{3}(?:[0-9a-f]{3})?)\]/i.exec(
    fill,
  );
  if (!match?.[1]) {
    return null;
  }
  const light = match[1].toLowerCase();
  const isBlack = light === '#000' || light === '#000000';
  return { dark: isBlack ? '#ffffff' : light, light };
}

export interface FediverseAccount {
  username: string;
  host: string;
}

/** Parse a fediverse handle such as `@user@example.social`. */
export function parseFediverseHandle(handle: string): FediverseAccount {
  const match = /^@?([^@\s]+)@([^@\s]+)$/.exec(handle.trim());
  if (!match?.[1] || !match[2]) {
    throw new Error(
      `"${handle}" is not a fediverse handle (expected @user@host)`,
    );
  }
  return { host: match[2], username: match[1] };
}

export interface WebfingerDocument {
  subject: string;
  aliases: string[];
  links: Array<Record<string, string>>;
}

/**
 * Build the WebFinger JRD that points visitors of this domain to the
 * Mastodon account.
 */
export function buildWebfinger(
  handle: string,
  profileUrl: string,
  avatarUrl: string,
): WebfingerDocument {
  const { host, username } = parseFediverseHandle(handle);
  return {
    aliases: [profileUrl],
    links: [
      {
        href: profileUrl,
        rel: 'http://webfinger.net/rel/profile-page',
        type: 'text/html',
      },
      {
        href: `https://${host}/users/${username}`,
        rel: 'self',
        type: 'application/activity+json',
      },
      {
        rel: 'http://ostatus.org/schema/1.0/subscribe',
        template: `https://${host}/authorize_interaction?uri={uri}`,
      },
      {
        href: avatarUrl,
        rel: 'http://webfinger.net/rel/avatar',
        type: 'image/png',
      },
    ],
    subject: `acct:${username}@${host}`,
  };
}
