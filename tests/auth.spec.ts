import { test, expect } from '@playwright/test';
import { setValidCredentials } from './helpers';

test('homepage has correct title', async ({ page }) => {
  await page.goto('/');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/PMG Inspect/);
});

test('set valid credentials and access protected page', async ({ page }) => {
  // Set valid credentials
  await setValidCredentials(page);

  const response = await page.goto('/protected');

  // The middleware should allow access and return a 200 OK status
  expect(response?.status()).toBe(200);
});

test('unauthenticated access to protected page returns 401', async ({
  page,
}) => {
  const response = await page.goto('/protected');

  // The middleware should return a 401 Unauthorized status
  expect(response?.status()).toBe(401);
});
