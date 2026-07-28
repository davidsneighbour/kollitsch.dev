// @vitest-environment node
import { describe, expect, it } from 'vitest';

import { headerRules } from './headers.ts';

describe('headerRules homepage agent discovery', () => {
  it('advertises the API catalogue and machine-readable LLM resources', () => {
    const homepageRule = headerRules.find((rule) => rule.path === '/');
    const linkValues =
      homepageRule?.headers
        .filter((header) => header.name === 'Link')
        .map((header) => header.value) ?? [];

    expect(linkValues).toContain(
      '</.well-known/api-catalog>; rel="api-catalog"; type="application/linkset+json"',
    );
    expect(linkValues).toContain(
      '</llms.txt>; rel="service-desc"; type="text/markdown"',
    );
    expect(linkValues).toContain(
      '</llms-full.txt>; rel="service-desc"; type="text/markdown"',
    );
  });
});
