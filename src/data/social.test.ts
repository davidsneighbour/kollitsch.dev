// @vitest-environment node
import { describe, expect, it } from 'vitest';
import { iconNames } from '../utils/icon-names.ts';
import { getSocialNetwork, socialNetworks, socialNetworksFor } from './social.ts';

describe('social setup in src/data/setup.json', () => {
  it('gives every network the same set of keys', () => {
    const shape = (value: object): string[] => Object.keys(value).sort();
    const [first, ...rest] = socialNetworks;
    expect(first).toBeDefined();
    for (const network of rest) {
      expect(shape(network), network.id).toEqual(shape(first ?? {}));
      expect(shape(network.profile), network.id).toEqual(shape(first?.profile ?? {}));
      expect(shape(network.classes), network.id).toEqual(shape(first?.classes ?? {}));
      expect(shape(network.show), network.id).toEqual(shape(first?.show ?? {}));
    }
  });

  it('uses only registered icons', () => {
    for (const network of socialNetworks) {
      expect(iconNames, network.id).toContain(network.icon);
    }
  });

  it('never publishes an email address', () => {
    const json = JSON.stringify(socialNetworks);
    // The lookbehind skips fediverse handles such as @user@host.
    expect(json).not.toMatch(/(?<![@\w])[\w.+-]+@[\w-]+\.[a-z]{2,}/i);
  });

  it('links the email channel to the connect page', () => {
    expect(getSocialNetwork('email').profile.url).toBe('/connect/');
  });

  it('has a fediverse handle for Mastodon', () => {
    expect(getSocialNetwork('mastodon').profile.handle).toMatch(/^@[^@]+@[^@]+$/);
  });

  it('keeps the share rows to networks with a share URL', () => {
    for (const network of [...socialNetworksFor('shareBar'), ...socialNetworksFor('shareMeta')]) {
      expect(network.share?.url, network.id).toBeTruthy();
    }
  });
});
