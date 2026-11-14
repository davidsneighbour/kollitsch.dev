// @vitest-environment node

import { networkHoverColour } from '@utils/social.pure.ts';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { describe, expect, it } from 'vitest';

describe('Footer component (props contract)', () => {
  it('exports a Props interface/type', async () => {
    // resolve the .astro component path relative to this test file
    const testDir = path.dirname(fileURLToPath(import.meta.url));
    const componentPath = path.join(testDir, 'Footer.astro');

    const src = await fs.readFile(componentPath, 'utf8');

    // heuristic: match `export interface XProps` or `export type XProps =`
    const regex = /export\s+(?:interface|type)\s+[A-Za-z0-9_]*Props\b/;
    expect(regex.test(src)).toBe(true);
  });
});

describe('Footer component (Static.Quest web ring)', () => {
  it('links to the previous/members/next/random web ring endpoints', async () => {
    const testDir = path.dirname(fileURLToPath(import.meta.url));
    const src = await fs.readFile(path.join(testDir, 'Footer.astro'), 'utf8');

    expect(src).toContain('https://static.quest/previous/?host=kollitsch.dev');
    expect(src).toContain('https://static.quest/members');
    expect(src).toContain('https://static.quest/next/?host=kollitsch.dev');
    expect(src).toContain('https://static.quest/random');
  });

  it('uses IconLink instead of hand-composed Icon + a for the ring nav icons', async () => {
    const testDir = path.dirname(fileURLToPath(import.meta.url));
    const src = await fs.readFile(path.join(testDir, 'Footer.astro'), 'utf8');

    expect(src).toMatch(
      /<IconLink[^>]+href="https:\/\/static\.quest\/previous/,
    );
    expect(src).toMatch(/<IconLink[^>]+href="https:\/\/static\.quest\/next/);
  });
});

describe("Footer component (People's Pledge badge)", () => {
  it('links the badge to people.pledge.party', async () => {
    const testDir = path.dirname(fileURLToPath(import.meta.url));
    const src = await fs.readFile(path.join(testDir, 'Footer.astro'), 'utf8');

    expect(src).toContain('https://people.pledge.party/');
    expect(src).toContain('<PeoplePledgeBadge');
  });
});

describe('Footer component (terminal layout)', () => {
  it('ranks social networks by show.connect into featured and icon-only lists', async () => {
    const testDir = path.dirname(fileURLToPath(import.meta.url));
    const src = await fs.readFile(path.join(testDir, 'Footer.astro'), 'utf8');

    expect(src).toContain("socialNetworksFor('footer')");
    expect(src).toMatch(
      /featuredNetworks = footerNetworks\.filter\(\(n\) => n\.show\.connect\)/,
    );
    expect(src).toMatch(
      /moreNetworks = footerNetworks\.filter\(\(n\) => !n\.show\.connect\)/,
    );
  });

  it('renders the introduction on the server and fills only the greeting on the client', async () => {
    const testDir = path.dirname(fileURLToPath(import.meta.url));
    const src = await fs.readFile(path.join(testDir, 'Footer.astro'), 'utf8');

    expect(src).toContain('renderIntroductionHtml(setup.introduction)');
    expect(src).toContain("addEventListener('astro:page-load'");
    expect(src).not.toMatch(/<script>[\s\S]*markdown-it[\s\S]*<\/script>/);
  });

  it('only animates the cursor when motion is allowed', async () => {
    const testDir = path.dirname(fileURLToPath(import.meta.url));
    const src = await fs.readFile(path.join(testDir, 'Footer.astro'), 'utf8');

    expect(src).toMatch(
      /@media \(prefers-reduced-motion: no-preference\) \{\s*\.footer-cursor \{\s*animation:/,
    );
  });
});

describe('Footer component (uptime counter)', () => {
  it('counts from the first post and keeps a static text for screen readers', async () => {
    const testDir = path.dirname(fileURLToPath(import.meta.url));
    const src = await fs.readFile(path.join(testDir, 'Footer.astro'), 'utf8');

    expect(src).toContain('data-uptime-since');
    expect(src).toMatch(/data-footer-uptime[\s\S]*?aria-hidden="true"/);
    expect(src).toContain('uptimeParts(start, now)');
  });

  it('only rolls digits when the counter is visible and motion is allowed', async () => {
    const testDir = path.dirname(fileURLToPath(import.meta.url));
    const src = await fs.readFile(path.join(testDir, 'Footer.astro'), 'utf8');

    expect(src).toContain(
      "matchMedia(\n        '(prefers-reduced-motion: reduce)'",
    );
    expect(src).toContain('tick(nearby, animate && !reduceMotion.matches)');
    expect(src).toContain('motion && visible.has(uptime)');
    expect(src).toContain('motion && visible.has(ageCounter)');
  });
});

describe("Footer component (author's uptime)", () => {
  it('shows the age as kernel version, boot time, and day count from setup.author.born', async () => {
    const testDir = path.dirname(fileURLToPath(import.meta.url));
    const src = await fs.readFile(path.join(testDir, 'Footer.astro'), 'utf8');

    expect(src).toContain('uname -r &amp;&amp; uptime');
    expect(src).toContain('new Date(setup.author.born)');
    expect(src).toMatch(
      /<dt>kernel<\/dt>[\s\S]*<dt>boot<\/dt>[\s\S]*<dt>uptime<\/dt>/,
    );
    expect(src).toContain('<dt>online</dt>');
  });

  it('hides the rolling day counter from screen readers and keeps a plain day count', async () => {
    const testDir = path.dirname(fileURLToPath(import.meta.url));
    const src = await fs.readFile(path.join(testDir, 'Footer.astro'), 'utf8');

    expect(src).toMatch(/data-age-counter[\s\S]*?aria-hidden="true"/);
    expect(src).toContain('<span data-age-days>');
    expect(src).toContain("days.classList.add('sr-only')");
  });

  it('renders the first credit line on the server and picks a random one on the client', async () => {
    const testDir = path.dirname(fileURLToPath(import.meta.url));
    const src = await fs.readFile(path.join(testDir, 'Footer.astro'), 'utf8');

    expect(src).toContain('pickCredit(setup.credits, () => 0)');
    expect(src).toContain('data-credits={JSON.stringify(setup.credits)}');
    expect(src).toMatch(
      /<script>[\s\S]*pickCredit\(credits\)[\s\S]*<\/script>/,
    );
  });

  it('colours only the featured network icon on hover of the whole row', async () => {
    const testDir = path.dirname(fileURLToPath(import.meta.url));
    const src = await fs.readFile(path.join(testDir, 'Footer.astro'), 'utf8');

    expect(src).toContain('style={networkColourStyle(network.classes.fill)}');
    expect(src).toMatch(
      /\.footer-network:hover :global\(\.footer-network-glyph\)\s*\{\s*color: var\(--footer-network-colour/,
    );
    expect(src).toMatch(
      /\.footer-network:focus-visible :global\(\.footer-network-glyph\)/,
    );
  });

  it('defines the Instagram gradient that the Instagram icon references', async () => {
    const testDir = path.dirname(fileURLToPath(import.meta.url));
    const src = await fs.readFile(path.join(testDir, 'Footer.astro'), 'utf8');
    const setupJson = await fs.readFile(
      path.join(testDir, '../../../data/setup.json'),
      'utf8',
    );
    const setup = JSON.parse(setupJson) as {
      social: { networks: { id: string; classes: { fill: string } }[] };
    };
    const instagram = setup.social.networks.find((n) => n.id === 'instagram');

    expect(src).toMatch(/<radialGradient\s+id="instagram-gradient"/);
    expect(src).toMatch(/<svg[^>]*aria-hidden="true"[\s\S]*?<defs>/);
    expect(instagram?.classes.fill).toContain(
      'hover:fill-[url(#instagram-gradient)_#FF0069]',
    );
  });

  it('gives every footer network a brand hover colour', async () => {
    const testDir = path.dirname(fileURLToPath(import.meta.url));
    const setupJson = await fs.readFile(
      path.join(testDir, '../../../data/setup.json'),
      'utf8',
    );
    const setup = JSON.parse(setupJson) as {
      social: {
        networks: {
          id: string;
          classes: { fill: string };
          show: { footer: boolean };
        }[];
      };
    };
    const missing = setup.social.networks
      .filter((n) => n.show.footer)
      .filter((n) => networkHoverColour(n.classes.fill) === null)
      .map((n) => n.id);

    expect(missing).toEqual([]);
  });

  it('shows black icon-only footer networks as white in dark mode', async () => {
    const testDir = path.dirname(fileURLToPath(import.meta.url));
    const setupJson = await fs.readFile(
      path.join(testDir, '../../../data/setup.json'),
      'utf8',
    );
    const setup = JSON.parse(setupJson) as {
      social: {
        networks: {
          id: string;
          classes: { fill: string };
          show: { footer: boolean; connect: boolean };
        }[];
      };
    };
    const missing = setup.social.networks
      .filter((n) => n.show.footer && !n.show.connect)
      .filter((n) => networkHoverColour(n.classes.fill)?.dark === '#ffffff')
      .filter((n) => !n.classes.fill.includes('dark:hover:text-[#ffffff]'))
      .map((n) => n.id);

    expect(missing).toEqual([]);
  });

  it('wraps the terminal sections in a separate window without a decorative title bar', async () => {
    const testDir = path.dirname(fileURLToPath(import.meta.url));
    const src = await fs.readFile(path.join(testDir, 'Footer.astro'), 'utf8');

    expect(src).toMatch(
      /class="footer-window"\s+data-footer-window\s*>\s*<div\s+class="footer-terminal /,
    );
    expect(src).not.toContain('footer-window-bar');
    expect(src).not.toContain('footer-window-dots');
    expect(src).toMatch(
      /\.footer-window \{\s*@apply rounded-lg shadow-sm dark:shadow-none;/,
    );
  });

  it('keeps the final strip outside the constrained terminal wrapper', async () => {
    const testDir = path.dirname(fileURLToPath(import.meta.url));
    const src = await fs.readFile(path.join(testDir, 'Footer.astro'), 'utf8');

    expect(src).toMatch(/<footer\s+class="isolate z-0 w-full"/);
    expect(src).toContain('<div class={setup.classes.containers.wide}>');
    expect(src).toMatch(/<\/div>\s*<\/div>\s*<div\s+class="footer-strip /);
  });

  it('shows the "we have a footer" mark without JavaScript and animates it only with motion allowed', async () => {
    const testDir = path.dirname(fileURLToPath(import.meta.url));
    const src = await fs.readFile(path.join(testDir, 'Footer.astro'), 'utf8');

    expect(src).toMatch(
      /class="footer-mark"\s+aria-hidden="true"\s+data-footer-mark="shown"/,
    );
    expect(src).toContain('Hey look, we have a footer!!!!111One');
    expect(src).toMatch(
      /@media \(prefers-reduced-motion: no-preference\) \{\s*\.footer-mark \{[\s\S]*?\.footer-mark\[data-footer-mark="pending"\]/,
    );
    expect(src).toContain("mark.dataset['footerBurst'] = 'true'");
    expect(src).toContain('margin-top: 5lh');
    expect(src).toContain('footer-word-pop 900ms');
    expect(src).toContain('footer-spark-burst 900ms');
    expect(src).not.toMatch(
      /footer-(?:word-pop|spark-burst|arrow-kick)[^;]*infinite/,
    );
    expect(src).toContain('footerMarkInitialState({');
    expect(src).toContain(
      "document.addEventListener('astro:page-load', initFooterMark)",
    );
  });
});

describe('Footer marker scroll replay', () => {
  it('rearms on exit and replays on return without looping while visible', async () => {
    const { transpile } = await import('typescript');
    const { footerMarkInitialState } = await import(
      '../../../utils/footer-mark.pure.ts'
    );
    const src = await fs.readFile(
      new URL('./Footer.astro', import.meta.url),
      'utf8',
    );
    const start = src.indexOf('function initFooterMark(): void');
    const end = src.indexOf(
      "document.addEventListener('astro:page-load', initFooterMark)",
      start,
    );
    const mark = {
      dataset: {} as { footerMark?: string; footerBurst?: string },
      getBoundingClientRect: () => ({ top: 2000 }),
    };
    let callback: (entries: { isIntersecting: boolean }[]) => void = () => {
      throw new Error('Observer has not been initialised');
    };
    let observed: unknown;
    class Observer {
      constructor(next: typeof callback) {
        callback = next;
      }
      observe(target: unknown) {
        observed = target;
      }
      disconnect() {
        // No previous observer exists on this first page load.
      }
    }
    const initialise = new Function(
      'document',
      'window',
      'IntersectionObserver',
      'footerMarkInitialState',
      transpile(`let markObserver; ${src.slice(start, end)} initFooterMark();`),
    );
    initialise(
      { querySelector: () => mark },
      {
        IntersectionObserver: Observer,
        innerHeight: 900,
        matchMedia: () => ({ matches: false }),
      },
      Observer,
      footerMarkInitialState,
    );
    expect(observed).toBe(mark);
    expect(mark.dataset.footerMark).toBe('pending');
    callback([{ isIntersecting: true }]);
    expect(mark.dataset.footerBurst).toBe('true');
    expect(mark.dataset.footerMark).toBe('shown');
    callback([{ isIntersecting: false }]);
    expect(mark.dataset.footerBurst).toBeUndefined();
    expect(mark.dataset.footerMark).toBe('pending');
    callback([{ isIntersecting: true }]);
    expect(mark.dataset.footerBurst).toBe('true');
    expect(mark.dataset.footerMark).toBe('shown');
  });
});

describe('Footer decorative accessibility boundary', () => {
  it('marks only the non-interactive sticker as a decorative exception', async () => {
    const src = await fs.readFile(
      new URL('./Footer.astro', import.meta.url),
      'utf8',
    );
    const marker = src.match(/<p\s+class="footer-mark"[\s\S]*?<\/p>/)?.[0];
    expect(marker).toContain('aria-hidden="true"');
    expect(marker).toContain(
      'data-dnb-design-exception="decorative-low-contrast"',
    );
    expect(marker).not.toMatch(
      /<(?:a|button|input|select|textarea)\b|tabindex=/,
    );
  });
});
