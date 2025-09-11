import { test, expect } from '@playwright/test';
import { setValidCredentials } from './helpers';

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
