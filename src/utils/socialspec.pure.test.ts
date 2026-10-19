// @vitest-environment node
import { describe, expect, it } from 'vitest';
import {
  escapeVcardText,
  foldVcardLine,
  isSocialSpecPath,
  renderAboutMarkdown,
  renderContactVcard,
  renderFollowingOpml,
} from './socialspec.pure';

describe('isSocialSpecPath', () => {
  it('matches only the three SocialSpec files', () => {
    expect(isSocialSpecPath('/.well-known/following.opml')).toBe(true);
    expect(isSocialSpecPath('/.well-known/about.md')).toBe(true);
    expect(isSocialSpecPath('/.well-known/contact.vcf')).toBe(true);
    expect(isSocialSpecPath('/.well-known/webfinger')).toBe(false);
  });
});

describe('renderFollowingOpml', () => {
  it('renders an escaped OPML 2.0 subscription list', () => {
    const opml = renderFollowingOpml({
      feeds: [
        {
          feedUrl: 'https://a.example/feed?x=1&y=2',
          name: 'A & "B"',
          siteUrl: 'https://a.example/',
        },
        { feedUrl: 'https://c.example/rss', name: 'C' },
      ],
      ownerName: 'Owner',
      ownerUrl: 'https://owner.example/',
      title: "Owner's feeds",
    });

    expect(opml).toMatch(
      /^<\?xml version="1.0" encoding="UTF-8"\?>\n<opml version="2.0">/,
    );
    expect(opml).toContain('<title>Owner&apos;s feeds</title>');
    expect(opml).toContain(
      '<outline type="rss" text="A &amp; &quot;B&quot;" title="A &amp; &quot;B&quot;" xmlUrl="https://a.example/feed?x=1&amp;y=2" htmlUrl="https://a.example/"/>',
    );
    expect(opml).toContain(
      '<outline type="rss" text="C" title="C" xmlUrl="https://c.example/rss"/>',
    );
  });
});

describe('renderAboutMarkdown', () => {
  it('renders summary frontmatter, heading, image, body, and links', () => {
    const markdown = renderAboutMarkdown({
      body: '\nHello: "world"\n',
      image: 'https://example.com/avatar',
      links: [{ label: 'Site', url: 'https://example.com/' }],
      name: 'Jordan Doe',
      summary: 'Writes: "code"',
    });

    expect(markdown).toBe(
      [
        '---',
        'summary: "Writes: \\"code\\""',
        '---',
        '',
        '# Jordan Doe',
        '',
        '![Jordan Doe](https://example.com/avatar)',
        '',
        'Hello: "world"',
        '',
        '## Links',
        '',
        '- [Site](https://example.com/)',
        '',
      ].join('\n'),
    );
  });
});

describe('vCard helpers', () => {
  it('escapes TEXT values', () => {
    expect(escapeVcardText('a,b;c\\d\ne')).toBe('a\\,b\\;c\\\\d\\ne');
  });

  it('folds lines at 75 octets without splitting characters', () => {
    const folded = foldVcardLine(`NOTE:${'ä'.repeat(80)}`);
    const encoder = new TextEncoder();

    for (const line of folded.split('\r\n')) {
      expect(encoder.encode(line).length).toBeLessThanOrEqual(75);
    }
    expect(folded.replace(/\r\n /g, '')).toBe(`NOTE:${'ä'.repeat(80)}`);
  });
});

describe('renderContactVcard', () => {
  it('renders a vCard 4.0 with CRLF line endings', () => {
    const vcard = renderContactVcard({
      country: 'Thailand',
      email: 'jordan@example.com',
      familyName: 'Doe',
      fullName: 'Jordan Doe',
      givenName: 'Jordan',
      languages: ['en', 'de'],
      locality: 'Koh Samui',
      photo: { mediaType: 'image/png', url: 'https://example.com/avatar' },
      socialProfiles: [{ service: 'Mastodon', url: 'https://mas.to/@jordan' }],
      timezone: 'Asia/Bangkok',
      url: 'https://example.com/',
    });

    expect(vcard.endsWith('END:VCARD\r\n')).toBe(true);
    expect(vcard.replace(/\r\n/g, '')).not.toContain('\n');
    const lines = vcard.split('\r\n');
    expect(lines.slice(0, 5)).toEqual([
      'BEGIN:VCARD',
      'VERSION:4.0',
      'KIND:individual',
      'FN:Jordan Doe',
      'N:Doe;Jordan;;;',
    ]);
    expect(lines).toContain('EMAIL;PREF=1:jordan@example.com');
    expect(lines).toContain(
      'PHOTO;MEDIATYPE=image/png:https://example.com/avatar',
    );
    expect(lines).toContain('TZ;VALUE=TEXT:Asia/Bangkok');
    expect(lines).toContain('ADR;TYPE=home:;;;Koh Samui;;;Thailand');
    expect(lines).toContain('LANG;PREF=2:de');
    expect(lines).toContain(
      'SOCIALPROFILE;SERVICE-TYPE="Mastodon":https://mas.to/@jordan',
    );
  });

  it('omits EMAIL when no address is configured', () => {
    const vcard = renderContactVcard({
      familyName: 'Doe',
      fullName: 'Jordan Doe',
      givenName: 'Jordan',
      socialProfiles: [],
      url: 'https://example.com/',
    });

    expect(vcard).not.toContain('EMAIL');
  });
});
