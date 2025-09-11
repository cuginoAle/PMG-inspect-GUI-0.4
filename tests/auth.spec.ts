import { test, expect } from '@playwright/test';

test('homepage has correct title', async ({ page }) => {
  await page.goto('/');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/PMG Inspect/);
});

test('set valid credentials and access protected page', async ({ page }) => {
  // Set valid credentials
  await page.setExtraHTTPHeaders({
    Authorization: `Basic ${Buffer.from(
      `${process.env.PROTECTED_BASIC_AUTH_USER}:${process.env.PROTECTED_BASIC_AUTH_PASS}`,
    ).toString('base64')}`,
  });

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

test('API endpoint requires authentication', async ({ page }) => {
  // Attempt to access the API endpoint without authentication
  const response = await page.request.get('/protected/api/projects');

  // The middleware should return a 401 Unauthorized status
  expect(response.status()).toBe(401);
});

test('API endpoint with valid credentials returns 200', async ({ request }) => {
  // Access the API endpoint with authentication
  const response = await request.get('/protected/api/projects', {
    headers: {
      Authorization: `Basic ${Buffer.from(
        `${process.env.PROTECTED_BASIC_AUTH_USER}:${process.env.PROTECTED_BASIC_AUTH_PASS}`,
      ).toString('base64')}`,
    },
  });

  // The middleware should allow access and return a 200 OK status
  expect(response.status()).toBe(200);
});
