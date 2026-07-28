// @vitest-environment node
import { describe, expect, it } from 'vitest';

import { headerRules } from './headers.ts';

describe('headerRules homepage agent discovery', () => {
  it('advertises machine-readable LLM resources without advertising missing API catalogues', () => {
    const homepageRule = headerRules.find((rule) => rule.path === '/');
    const linkValues =
      homepageRule?.headers
        .filter((header) => header.name === 'Link')
        .map((header) => header.value) ?? [];

    expect(linkValues).toContain(
      '</llms.txt>; rel="service-desc"; type="text/markdown"',
    );
    expect(linkValues).toContain(
      '</llms-full.txt>; rel="service-desc"; type="text/markdown"',
    );
    expect(linkValues.some((value) => value.includes('rel="api-catalog"'))).toBe(
      false,
    );
  });
});
