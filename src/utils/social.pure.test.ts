// @vitest-environment node
import { describe, expect, it } from 'vitest';
import {
  buildShareUrl,
  buildWebfinger,
  mergeRel,
  networkHoverColour,
  networksFor,
  normalizeShareInstance,
  parseFediverseHandle,
  type SocialConfig,
  type SocialNetwork,
  validateSocialConfig,
} from './social.pure.ts';

function network(overrides: Partial<SocialNetwork> = {}): SocialNetwork {
  return {
    classes: { background: '', fill: '' },
    icon: 'simple-icons:example',
    id: 'example',
    label: 'Example',
    profile: {
      handle: '@me',
      rel: [],
      title: 'Follow me',
      url: 'https://example.com/@me',
    },
    share: { url: 'https://example.com/share?u={url}&t={title}' },
    show: {
      connect: true,
      footer: true,
      shareBar: true,
      shareMeta: false,
      socialspec: true,
    },
    ...overrides,
  };
}

function config(networks: SocialNetwork[]): SocialConfig {
  return { defaults: { rel: ['me'], target: '_blank' }, networks };
}

describe('validateSocialConfig', () => {
  it('accepts a valid config', () => {
    const valid = config([network()]);
    expect(validateSocialConfig(valid)).toBe(valid);
  });

  it('rejects duplicate ids', () => {
    expect(() => validateSocialConfig(config([network(), network()]))).toThrow(
      /duplicate id/,
    );
  });

  it('rejects a share placement without a share URL', () => {
    expect(() =>
      validateSocialConfig(config([network({ share: null })])),
    ).toThrow(/show\.shareBar needs a share URL/);
  });

  it('rejects unknown share placeholders', () => {
    expect(() =>
      validateSocialConfig(
        config([network({ share: { url: 'https://x.test/?v={via}' } })]),
      ),
    ).toThrow(/unknown share placeholder\(s\) via/);
  });

  it('rejects published email addresses', () => {
    const profile = {
      handle: null,
      rel: [],
      title: 'Mail',
      url: 'mailto:me@example.com',
    };
    const share = { url: 'mailto:me@example.com?subject={title}' };
    expect(() =>
      validateSocialConfig(config([network({ profile, share })])),
    ).toThrow(
      /profile\.url must not publish an email address[\s\S]*share\.url must not publish/,
    );
  });

  it('accepts an address-less mailto share', () => {
    const share = { url: 'mailto:?subject={title}&body={url}' };
    expect(() =>
      validateSocialConfig(config([network({ share })])),
    ).not.toThrow();
  });
});

describe('networkHoverColour', () => {
  it('reads the hex colour from the hover text class', () => {
    expect(networkHoverColour('hover:text-[#0085ff]')).toEqual({
      dark: '#0085ff',
      light: '#0085ff',
    });
    expect(networkHoverColour('size-5 hover:text-[#0A66C2]')).toEqual({
      dark: '#0a66c2',
      light: '#0a66c2',
    });
  });

  it('shows a black brand colour as white on dark surfaces', () => {
    expect(networkHoverColour('hover:text-[#000000]')).toEqual({
      dark: '#ffffff',
      light: '#000000',
    });
    expect(networkHoverColour('hover:text-[#000]')?.dark).toBe('#ffffff');
  });

  it('returns null without a hex hover colour', () => {
    expect(networkHoverColour('')).toBeNull();
    expect(networkHoverColour('text-[#0085ff]')).toBeNull();
    expect(networkHoverColour('group-hover:text-[#0085ff]')).toBeNull();
    expect(networkHoverColour('hover:text-primary-500')).toBeNull();
  });
});

describe('networksFor', () => {
  it('keeps config order and filters by placement', () => {
    const a = network({ id: 'a' });
    const b = network({
      id: 'b',
      show: {
        connect: false,
        footer: true,
        shareBar: true,
        shareMeta: false,
        socialspec: true,
      },
    });
    expect(networksFor([a, b], 'footer').map((n) => n.id)).toEqual(['a', 'b']);
    expect(networksFor([a, b], 'connect').map((n) => n.id)).toEqual(['a']);
  });
});

describe('buildShareUrl', () => {
  it('encodes values and leaves missing values empty', () => {
    expect(
      buildShareUrl('mailto:?subject={title}&body={description}%0A{url}', {
        title: 'A & B',
        url: 'https://kollitsch.dev/x/',
      }),
    ).toBe(
      'mailto:?subject=A%20%26%20B&body=%0Ahttps%3A%2F%2Fkollitsch.dev%2Fx%2F',
    );
  });
});

describe('mergeRel', () => {
  it('merges without duplicates', () => {
    expect(mergeRel(['noopener', 'me'], ['me', 'atproto'])).toBe(
      'noopener me atproto',
    );
  });
});

describe('parseFediverseHandle', () => {
  it('parses @user@host', () => {
    expect(parseFediverseHandle('@davidsneighbour@mas.to')).toEqual({
      host: 'mas.to',
      username: 'davidsneighbour',
    });
  });

  it('rejects a handle without a host', () => {
    expect(() => parseFediverseHandle('@davidsneighbour')).toThrow(
      /not a fediverse handle/,
    );
  });
});

describe('buildWebfinger', () => {
  it('builds the JRD for the account', () => {
    const doc = buildWebfinger(
      '@davidsneighbour@mas.to',
      'https://mas.to/@davidsneighbour',
      'https://kollitsch.dev/.well-known/avatar',
    );
    expect(doc.subject).toBe('acct:davidsneighbour@mas.to');
    expect(doc.aliases).toEqual(['https://mas.to/@davidsneighbour']);
    expect(doc.links).toContainEqual({
      href: 'https://mas.to/users/davidsneighbour',
      rel: 'self',
      type: 'application/activity+json',
    });
    expect(doc.links).toContainEqual({
      rel: 'http://ostatus.org/schema/1.0/subscribe',
      template: 'https://mas.to/authorize_interaction?uri={uri}',
    });
  });
});

describe('instance-aware shares', () => {
  const instance = {
    default: 'mas.to',
    prompt: 'Choose a server',
    storageKey: 'mastodon_instance_url',
  };
  it('requires instance settings and the placeholder together', () => {
    expect(() =>
      validateSocialConfig(
        config([
          network({ share: { url: 'https://{instance}/share?text={title}' } }),
        ]),
      ),
    ).toThrow(/configured together/);
    expect(() =>
      validateSocialConfig(
        config([network({ share: { instance, url: 'https://mas.to/share' } })]),
      ),
    ).toThrow(/configured together/);
    expect(() =>
      validateSocialConfig(
        config([
          network({
            share: { instance, url: 'https://{instance}/share?text={title}' },
          }),
        ]),
      ),
    ).not.toThrow();
  });
  it('rejects invalid defaults and unsafe instance template positions', () => {
    expect(() =>
      validateSocialConfig(
        config([
          network({
            share: {
              instance: { ...instance, default: 'javascript:alert(1)' },
              url: 'https://{instance}/share',
            },
          }),
        ]),
      ),
    ).toThrow(/invalid default/);
    expect(() =>
      validateSocialConfig(
        config([
          network({
            share: { instance, url: 'https://other.test/{instance}' },
          }),
        ]),
      ),
    ).toThrow(/must start with/);
  });
  it.each(['mas.to', ' https://MAS.TO/@someone '])('normalises %s', (input) => {
    expect(normalizeShareInstance(input)).toBe('mas.to');
  });
  it.each([
    '',
    'not a server',
    'http://mas.to',
    'javascript:alert(1)',
    Object.assign(new URL('https://mas.to'), {
      password: 'fixture',
      username: 'fixture',
    }).href,
    'https://mas.to:8080',
    'https://bad..test',
  ])('rejects %s', (input) => {
    expect(() => normalizeShareInstance(input)).toThrow();
  });
  it('uses the common placeholders and preserves the shared URL', () => {
    const result = new URL(
      buildShareUrl('https://{instance}/share?text={title}%20{url}', {
        instance: 'mastodon.social',
        title: 'A & B',
        url: 'https://kollitsch.dev/example/?a=1&b=2',
      }),
    );
    expect(result.host).toBe('mastodon.social');
    expect(result.searchParams.get('text')).toBe(
      'A & B https://kollitsch.dev/example/?a=1&b=2',
    );
  });
});
