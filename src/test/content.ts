import { createDefaultPost } from './utils/createDefaultPost';
import { expect } from 'vitest';

test('createDefaultPost fills in missing values', () => {
  const result = createDefaultPost({ title: 'Test' });

  expect(result.title).toBe('Test');
  expect(result.description).toBe('No description available.');
  expect(result.cover).toBeUndefined(); // No cover provided
  expect(Array.isArray(result.tags)).toBe(true);
});
