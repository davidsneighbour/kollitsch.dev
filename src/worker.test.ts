// @vitest-environment node
import { describe, expect, it } from 'vitest';
import worker from './worker';

const env = {
  ASSETS: {
    fetch: async () => new Response('asset response'),
  },
  RESEND_API_KEY: 'test-key',
  RESEND_FROM: 'from@example.com',
  RESEND_TO: 'to@example.com',
};

describe('worker hostname handling', () => {
  it('redirects www requests to the apex hostname and preserves the path and query', async () => {
    const response = await worker.fetch(new Request('https://www.kollitsch.dev/blog/?page=2'), env);

    expect(response.status).toBe(301);
    expect(response.headers.get('location')).toBe('https://kollitsch.dev/blog/?page=2');
  });

  it('serves apex requests from static assets', async () => {
    const response = await worker.fetch(new Request('https://kollitsch.dev/blog/'), env);

    await expect(response.text()).resolves.toBe('asset response');
  });
});
