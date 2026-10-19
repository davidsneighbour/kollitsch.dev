// @vitest-environment node
import { describe, expect, it } from 'vitest';
import {
  renderAboutMarkdown,
  renderContactVcard,
  renderFollowingOpml,
} from '../utils/socialspec.pure.ts';
import { about, contact, following } from './socialspec.ts';

describe('SocialSpec site configuration', () => {
  it('publishes only blogroll entries that have a feed URL', () => {
    expect(following.feeds.length).toBeGreaterThan(0);
    for (const feed of following.feeds) {
      expect(feed.feedUrl).toMatch(/^https:\/\//);
    }
    expect(renderFollowingOpml(following)).toContain('xmlUrl="https://xkcd.com/rss.xml"');
  });

  it('removes the greeting placeholder from the about body', () => {
    const markdown = renderAboutMarkdown(about);

    expect(markdown).not.toContain('{$greeting}');
    expect(markdown).toMatch(/^---\nsummary: ".+"\n---\n/);
    expect(markdown).toContain('- [Mastodon](https://mas.to/@davidsneighbour)');
  });

  it('renders a vCard whose lines fit 75 octets', () => {
    const vcard = renderContactVcard(contact);
    const encoder = new TextEncoder();

    expect(vcard).toContain('FN:Patrick Kollitsch');
    expect(vcard).toContain('PHOTO;MEDIATYPE=image/png:https://kollitsch.dev/.well-known/avatar');
    for (const line of vcard.split('\r\n')) {
      expect(encoder.encode(line).length).toBeLessThanOrEqual(75);
    }
  });
});
