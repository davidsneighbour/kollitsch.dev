// @vitest-environment node
import { describe, expect, it } from 'vitest';

import { headerRules, moduleHeaderRules } from './headers.ts';
import { renderHeaders } from '../scripts/build/build-headers.ts';

describe('headerRules homepage agent discovery', () => {
  it('advertises the API catalogue and LLM resources in one homepage Link field', () => {
    const homepageRule = headerRules.find((rule) => rule.path === '/');
    const linkValues =
      homepageRule?.headers
        .filter((header) => header.name === 'Link')
        .map((header) => header.value) ?? [];

    expect(linkValues).toHaveLength(1);
    expect(linkValues[0]).toContain(
      '</.well-known/api-catalog>; rel="api-catalog"; type="application/linkset+json"',
    );
    expect(linkValues[0]).toContain(
      '</llms.txt>; rel="service-desc"; type="text/markdown"',
    );
    expect(linkValues[0]).toContain(
      '</llms-full.txt>; rel="service-doc"; type="text/markdown"',
    );
    expect(linkValues[0]).toContain(
      '<https://analytics.dnbhub.xyz>; rel="preconnect"',
    );
  });

  it('renders the homepage rule after the broad wildcard rule', () => {
    const wildcardRuleIndex = headerRules.findIndex((rule) => rule.path === '/*');
    const homepageRuleIndex = headerRules.findIndex((rule) => rule.path === '/');

    expect(wildcardRuleIndex).toBeGreaterThanOrEqual(0);
    expect(homepageRuleIndex).toBeGreaterThan(wildcardRuleIndex);
  });

  it('renders homepage agent discovery after the wildcard preconnect Link header', () => {
    const rendered = renderHeaders();

    const wildcardLinkIndex = rendered.indexOf(
      'Link: <https://analytics.dnbhub.xyz>; rel="preconnect"',
    );
    const homepageLinkIndex = rendered.indexOf(
      'Link: </.well-known/api-catalog>; rel="api-catalog"; type="application/linkset+json"',
    );

    expect(wildcardLinkIndex).toBeGreaterThanOrEqual(0);
    expect(homepageLinkIndex).toBeGreaterThan(wildcardLinkIndex);
  });
});

describe('moduleHeaderRules SocialSpec files', () => {
  it.each([
    ['/.well-known/following.opml', 'text/x-opml; charset=utf-8'],
    ['/.well-known/about.md', 'text/markdown; charset=utf-8'],
    ['/.well-known/contact.vcf', 'text/vcard; charset=utf-8'],
  ])('serves %s with its media type and open CORS', (path, contentType) => {
    const rule = moduleHeaderRules.find((entry) => entry.path === path);
    const header = (name: string): string | undefined =>
      rule?.headers.find((entry) => entry.name === name)?.value;

    expect(header('Content-Type')).toBe(contentType);
    expect(header('Access-Control-Allow-Origin')).toBe('*');
  });
});
