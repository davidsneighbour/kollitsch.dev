// @vitest-environment node
import { stripHtmlTags } from '@utils/content.pure';
import { describe, expect, it } from 'vitest';

describe('stripHtmlTags', () => {
  it('removes inline HTML tags from post titles', () => {
    expect(
      stripHtmlTags(
        'Keeping <code>engines.node</code> aligned with the Node release schedule',
      ),
    ).toBe('Keeping engines.node aligned with the Node release schedule');
  });

  it('collapses redundant whitespace after stripping tags', () => {
    expect(stripHtmlTags('Hello <em>there</em>   world')).toBe(
      'Hello there world',
    );
  });
});
