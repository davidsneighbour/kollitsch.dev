import { expect, test } from '@playwright/test';

test('lite-youtube element is rendered with correct attributes', async ({
  page,
}) => {
  await page.goto('/test/youtube/');

  const yt = page.locator('lite-youtube');
  await expect(yt).toHaveCount(11);
  await expect(yt).toHaveAttribute('videoid', 'I2wIj7G-5Qc');
  await expect(yt).toHaveAttribute(
    'playlabel',
    '[Live Video] 이날치 LEENALCHI - 새타령 Bird (정년이 OST)',
  );
});
