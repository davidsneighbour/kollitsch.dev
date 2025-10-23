/// <reference types="vitest/browser" />

import { describe, expect, test } from 'vitest';
import { page } from 'vitest/browser';

const TEST_IFRAME_ID = 'vitest-heading-preview';

const mountPreview = async (path: string) => {
  const url = new URL(path, window.location.origin).toString();
  const iframe = document.createElement('iframe');
  iframe.setAttribute('data-testid', TEST_IFRAME_ID);
  iframe.setAttribute('title', `Preview for ${path}`);
  iframe.src = url;
  iframe.style.width = '1280px';
  iframe.style.height = '720px';

  document.body.append(iframe);

  await new Promise<void>((resolve, reject) => {
    const cleanup = () => {
      iframe.removeEventListener('load', handleLoad);
      iframe.removeEventListener('error', handleError);
    };

    const handleLoad = () => {
      cleanup();
      resolve();
    };

    const handleError = () => {
      cleanup();
      reject(new Error(`Failed to load preview iframe from ${url}`));
    };

    iframe.addEventListener('load', handleLoad, { once: true });
    iframe.addEventListener('error', handleError, { once: true });
  });

  return iframe;
};

describe('heading preview', () => {
  test('renders multiple heading levels', async () => {
    const iframe = await mountPreview('/test/heading/');

    try {
      const previewFrame = page.frameLocator(page.getByTestId(TEST_IFRAME_ID));

      await expect
        .element(
          previewFrame.getByRole('heading', {
            exact: true,
            name: 'Visible H2',
          }),
        )
        .toBeVisible();
      await expect
        .element(
          previewFrame.getByRole('heading', {
            exact: true,
            name: 'Visible H5, no description',
          }),
        )
        .toBeVisible();
      await expect
        .element(
          previewFrame.getByRole('heading', {
            exact: true,
            name: 'Default H1',
          }),
        )
        .toBeVisible();
      await expect
        .element(
          previewFrame.getByRole('heading', {
            exact: true,
            name: 'Default H1, no description',
          }),
        )
        .toBeVisible();
      await expect
        .element(
          previewFrame.getByRole('heading', { exact: true, name: 'Too High' }),
        )
        .toBeVisible();
      await expect
        .element(
          previewFrame.getByRole('heading', { exact: true, name: 'Too Low' }),
        )
        .toBeVisible();
    } finally {
      iframe.remove();
    }
  });
});
