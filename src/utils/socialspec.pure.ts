/**
 * Renderers for the SocialSpec well-known files.
 *
 * @see https://socialspec.org/
 * @see https://followspec.org/ - `/.well-known/following.opml`
 * @see https://aboutspec.org/ - `/.well-known/about.md`
 * @see https://contactspec.org/ - `/.well-known/contact.vcf`
 *
 * The site configuration lives in `src/data/socialspec.ts`. This module has no
 * JSON or Astro imports so that the Worker, the `_headers` data, and unit tests
 * can import it cheaply.
 */

export const SOCIALSPEC_FILES = {
  about: {
    contentType: 'text/markdown; charset=utf-8',
    path: '/.well-known/about.md',
  },
  contact: {
    contentType: 'text/vcard; charset=utf-8',
    path: '/.well-known/contact.vcf',
  },
  following: {
    contentType: 'text/x-opml; charset=utf-8',
    path: '/.well-known/following.opml',
  },
} as const;

/**
 * CORS headers for SocialSpec files. All three specs require that any origin
 * can read the files. `If-None-Match` is allowed because the spec examples
 * use conditional requests, and `ETag` is exposed so that scripts can store it.
 */
export const SOCIALSPEC_CORS_HEADERS = {
  'Access-Control-Allow-Headers': 'Accept, If-Modified-Since, If-None-Match',
  'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Expose-Headers': 'ETag, Last-Modified',
  'Access-Control-Max-Age': '86400',
} as const;

export function isSocialSpecPath(pathname: string): boolean {
  return Object.values(SOCIALSPEC_FILES).some((file) => file.path === pathname);
}

// MARK: FollowSpec

export interface FollowingFeed {
  /** Display name of the followed site. */
  name: string;
  /** Feed URL (RSS, Atom, or JSON Feed). */
  feedUrl: string;
  /** Home page of the followed site. */
  siteUrl?: string;
  description?: string;
}

export interface FollowingConfig {
  title: string;
  ownerName: string;
  ownerUrl: string;
  feeds: FollowingFeed[];
}

function escapeXml(value: string): string {
  return value.replace(/[&<>"']/g, (char) => {
    switch (char) {
      case '&':
        return '&amp;';
      case '<':
        return '&lt;';
      case '>':
        return '&gt;';
      case '"':
        return '&quot;';
      default:
        return '&apos;';
    }
  });
}

/** Renders an OPML 2.0 subscription list. */
export function renderFollowingOpml(config: FollowingConfig): string {
  const outlines = config.feeds.map((feed) => {
    const attributes: [string, string | undefined][] = [
      ['type', 'rss'],
      ['text', feed.name],
      ['title', feed.name],
      ['xmlUrl', feed.feedUrl],
      ['htmlUrl', feed.siteUrl],
      ['description', feed.description],
    ];
    const rendered = attributes
      .filter((entry): entry is [string, string] => Boolean(entry[1]))
      .map(([name, value]) => `${name}="${escapeXml(value)}"`)
      .join(' ');

    return `    <outline ${rendered}/>`;
  });

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<opml version="2.0">',
    '  <head>',
    `    <title>${escapeXml(config.title)}</title>`,
    `    <ownerName>${escapeXml(config.ownerName)}</ownerName>`,
    `    <ownerId>${escapeXml(config.ownerUrl)}</ownerId>`,
    '    <docs>https://opml.org/spec2.opml</docs>',
    '  </head>',
    '  <body>',
    ...outlines,
    '  </body>',
    '</opml>',
    '',
  ].join('\n');
}

// MARK: AboutSpec

export interface ProfileLink {
  label: string;
  url: string;
}

export interface AboutConfig {
  /** Short profile summary for the `summary` frontmatter field. */
  summary: string;
  name: string;
  /** Absolute URL of the profile image. */
  image?: string;
  /** Markdown body of the profile. */
  body: string;
  links: ProfileLink[];
}

/** Renders a Markdown profile with YAML frontmatter. */
export function renderAboutMarkdown(config: AboutConfig): string {
  const lines = [
    '---',
    // A JSON string is a valid YAML double-quoted scalar.
    `summary: ${JSON.stringify(config.summary)}`,
    '---',
    '',
    `# ${config.name}`,
    '',
  ];

  if (config.image) {
    lines.push(`![${config.name}](${config.image})`, '');
  }

  lines.push(config.body.trim(), '');

  if (config.links.length > 0) {
    lines.push('## Links', '');
    for (const link of config.links) {
      lines.push(`- [${link.label}](${link.url})`);
    }
    lines.push('');
  }

  return lines.join('\n');
}

// MARK: ContactSpec

export interface SocialProfile {
  /** Service name for the `SERVICE-TYPE` parameter (RFC 9554). */
  service: string;
  url: string;
}

export interface ContactConfig {
  fullName: string;
  givenName: string;
  familyName: string;
  nickname?: string;
  /** Preferred email address. Omitted from the card when empty or missing. */
  email?: string;
  url: string;
  /** Absolute URL of the profile image. */
  photo?: { url: string; mediaType: string };
  note?: string;
  /** IANA time zone name, for example `Asia/Bangkok`. */
  timezone?: string;
  locality?: string;
  country?: string;
  /** Language tags in order of preference. */
  languages?: string[];
  socialProfiles: SocialProfile[];
}

/** Escapes a vCard TEXT value (RFC 6350, section 3.4). */
export function escapeVcardText(value: string): string {
  return value
    .replace(/\\/g, '\\\\')
    .replace(/\r\n|\n|\r/g, '\\n')
    .replace(/,/g, '\\,')
    .replace(/;/g, '\\;');
}

/**
 * Folds a content line at 75 octets (RFC 6350, section 3.2). Continuation
 * lines start with one space. Multi-byte characters are never split.
 */
export function foldVcardLine(line: string): string {
  const encoder = new TextEncoder();
  const parts: string[] = [];
  let current = '';
  let currentBytes = 0;
  let limit = 75;

  for (const char of line) {
    const size = encoder.encode(char).length;
    if (currentBytes + size > limit) {
      parts.push(current);
      current = '';
      currentBytes = 0;
      // The leading space of a continuation line counts towards its 75 octets.
      limit = 74;
    }
    current += char;
    currentBytes += size;
  }
  parts.push(current);

  return parts.join('\r\n ');
}

/** Renders a vCard 4.0 (RFC 6350) with CRLF line endings. */
export function renderContactVcard(config: ContactConfig): string {
  const lines = [
    'BEGIN:VCARD',
    'VERSION:4.0',
    'KIND:individual',
    `FN:${escapeVcardText(config.fullName)}`,
    `N:${escapeVcardText(config.familyName)};${escapeVcardText(config.givenName)};;;`,
  ];

  if (config.nickname) {
    lines.push(`NICKNAME:${escapeVcardText(config.nickname)}`);
  }
  if (config.email) {
    lines.push(`EMAIL;PREF=1:${escapeVcardText(config.email)}`);
  }
  lines.push(`URL;PREF=1:${config.url}`);
  if (config.photo) {
    lines.push(`PHOTO;MEDIATYPE=${config.photo.mediaType}:${config.photo.url}`);
  }
  if (config.note) {
    lines.push(`NOTE:${escapeVcardText(config.note)}`);
  }
  if (config.timezone) {
    lines.push(`TZ;VALUE=TEXT:${escapeVcardText(config.timezone)}`);
  }
  if (config.locality || config.country) {
    const locality = escapeVcardText(config.locality ?? '');
    const country = escapeVcardText(config.country ?? '');
    lines.push(`ADR;TYPE=home:;;;${locality};;;${country}`);
  }
  config.languages?.forEach((language, index) => {
    lines.push(`LANG;PREF=${index + 1}:${language}`);
  });
  for (const profile of config.socialProfiles) {
    // Parameter values use quoting, not backslash escapes (RFC 6350, section 5).
    const service = profile.service.replace(/"/g, '');
    lines.push(`SOCIALPROFILE;SERVICE-TYPE="${service}":${profile.url}`);
  }
  lines.push('END:VCARD');

  return `${lines.map(foldVcardLine).join('\r\n')}\r\n`;
}
