// Uses the Playwright test fixture that applies route-based API mocks (see tests/mocks/playwright-mocks.ts).
import { test, expect } from './mocks/playwright-mocks';
import { setValidCredentials } from './helpers';

test('Project finder page', async ({ page, apiUsage }) => {
  await apiUsage.reset();
  await setValidCredentials(page);
  await page.goto('/protected');

  const projectFinder = await page.locator(
    'input[placeholder="Search projects..."]',
  );
  await expect(projectFinder).toBeVisible();

  // type in the search box and verify results update (basic sanity check)
  await projectFinder.fill('Briarcliff');
  const searchResults = page
    .locator('.rt-Text')
    .filter({ hasText: 'Briarcliff' });

  await expect(searchResults).toHaveCount(3);

  //when a project is clicked, the details panel should appear
  await searchResults.nth(1).click();

  const detailsPanel = page.locator('h2', { hasText: 'debug/Briarcliff' });
  await expect(detailsPanel).toBeVisible();

  // Verify the first table row contains expected text
  const firstTableCell = page.locator('.rt-TableCell', {
    hasText: 'ADMIRAL WORDENS LN',
  });
  await expect(firstTableCell).toBeVisible();

  // create a snapshot for visual regression testing
  // expect(await page.screenshot()).toMatchSnapshot('project-finder.png');
});
