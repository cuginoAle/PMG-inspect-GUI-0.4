import { test, expect, Page } from '@playwright/test';

const setValidCredentials = async (page: Page) => {
  await page.setExtraHTTPHeaders({
    Authorization: `Basic ${Buffer.from(
      `${process.env.PROTECTED_BASIC_AUTH_USER}:${process.env.PROTECTED_BASIC_AUTH_PASS}`,
    ).toString('base64')}`,
  });
};

test('project finder is visible', async ({ page }) => {
  await setValidCredentials(page);
  await page.goto('/protected');
  const projectFinder = await page.locator(
    'input[placeholder="Search projects..."]',
  );
  await expect(projectFinder).toBeVisible();

  // create a snapshot for visual regression testing
  // expect(await page.screenshot()).toMatchSnapshot('project-finder.png');
});
