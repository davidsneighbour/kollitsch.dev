import { expect, test } from '@playwright/test';

// The contact form posts to a Netlify function backed by the Resend REST API
// (src/netlify/functions/send-email.ts). Actually submitting would send a real
// email, so this exercises ContentPageConnect.astro's dev-only `?scenario=`
// client-side simulator instead — it intercepts submit and never reaches the
// network, matching the same success/error UI paths a real Resend response
// would trigger.
async function submitContactForm(page: import('@playwright/test').Page, scenario: string) {
  await page.goto(`/connect/?scenario=${scenario}`);
  await page.getByLabel('First name').fill('Ada');
  await page.getByLabel('Email').fill('ada@example.com');
  await page.getByLabel('Message').fill('Hello there.');
  await page.getByRole('button', { name: 'Send message' }).click();
}

test.describe('Contact form submission states', () => {
  test('success scenario shows a success message and resets the form', async ({ page }) => {
    await submitContactForm(page, 'success');

    const status = page.locator('[data-form-status]');
    await expect(status).toBeVisible();
    await expect(status).toHaveText('Thank you for your message!');
    await expect(page.getByLabel('First name')).toHaveValue('');
  });

  test('email-missing scenario flags the email field', async ({ page }) => {
    await submitContactForm(page, 'email-missing');

    await expect(page.locator('[data-form-status]')).toHaveText('Email is required.');
    await expect(page.locator('#email-error')).toHaveText('Email is required.');
    await expect(page.getByLabel('Email')).toHaveAttribute('aria-invalid', 'true');
  });

  test('invalid-email scenario flags the email field', async ({ page }) => {
    await submitContactForm(page, 'invalid-email');

    await expect(page.locator('#email-error')).toHaveText('Please enter a valid email address.');
  });

  test('message-missing scenario flags the message field', async ({ page }) => {
    await submitContactForm(page, 'message-missing');

    await expect(page.locator('#message-error')).toHaveText('Message is required.');
  });

  test('server-500 scenario shows a generic error on all required fields', async ({ page }) => {
    await submitContactForm(page, 'server-500');

    await expect(page.locator('[data-form-status]')).toHaveText('Internal Server Error');
    await expect(page.locator('#first-name-error')).toHaveText('Internal Server Error');
    await expect(page.locator('#email-error')).toHaveText('Internal Server Error');
    await expect(page.locator('#message-error')).toHaveText('Internal Server Error');
  });

  test('network scenario shows a generic network error message', async ({ page }) => {
    await submitContactForm(page, 'network');

    await expect(page.locator('[data-form-status]')).toHaveText(
      'Network error. Please try again in a moment.',
    );
  });
});
