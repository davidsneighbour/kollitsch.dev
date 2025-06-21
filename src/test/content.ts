import { createDefaultPost } from '@utils/createDefaultPost';
import { describe, test, expect } from 'vitest';

describe('createDefaultPost', () => {
  test('fills in missing values', () => {
    const result = createDefaultPost({ title: 'Test' });

    expect(result.title).toBe('Test');
    expect(result.description).toBe('No description available.');
    expect(result.cover).toBeUndefined();
    expect(Array.isArray(result.tags)).toBe(true);
  });
});
