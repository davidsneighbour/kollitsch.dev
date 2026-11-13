// @vitest-environment node

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
    expect(src).toContain('tick(!reduceMotion.matches)');
    expect(src).toContain('motion && !!uptime && visible.has(uptime)');
    expect(src).toContain('motion && !!ageCounter && visible.has(ageCounter)');
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
});
