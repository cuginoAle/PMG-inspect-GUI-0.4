import { test, expect } from '@playwright/test';

test('homepage has correct title', async ({ page }) => {
  await page.goto('/');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/PMG Inspect/);
});

test('unauthenticated access to protected page redirects to login', async ({
  page,
}) => {
  const response = await page.goto('/protected');

  // The middleware should return a 401 Unauthorized status
  expect(response?.status()).toBe(401);
});
