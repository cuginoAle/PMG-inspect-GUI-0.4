// Uses the Playwright test fixture that applies route-based API mocks (see tests/mocks/playwright-mocks.ts).
import { test, expect } from './mocks/playwright-mocks';
import {
  overrideGetVideoMetadataError,
  overrideParseProjectError,
} from './mocks/api-override-helpers';
import { setValidCredentials } from './helpers';

test('Project finder page', async ({ page, apiUsage }) => {
  await apiUsage.reset();
  await setValidCredentials(page);
  await page.goto('/protected');

  const projectFinder = await page.locator(
    'input[placeholder="Search projects..."]',
  );
  await expect(projectFinder).toBeVisible();

  await page.waitForLoadState('networkidle');

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

  const metaData = page.locator('text=Video Metadata:');

  await expect(metaData).toBeVisible();

  // Verify API usage
  await apiUsage.expectHit('get_files_list');
  await apiUsage.expectHit('parse_project');
  await apiUsage.expectHit('parse_video');

  // create a snapshot for visual regression testing
  // expect(await page.screenshot()).toMatchSnapshot('project-finder.png');
});

// Test api calls error handling
test('Project finder handles API errors - parse_project', async ({
  page,
  apiUsage,
  apiOverrides,
}) => {
  await apiUsage.reset();
  await setValidCredentials(page);

  // Provide an override handler BEFORE navigation so it wins over defaults.
  // This forces the get_files_list endpoint to return a 500 and exercise the UI error path.
  apiOverrides.push(
    overrideParseProjectError({ message: 'What a terrible failure!' }),
  );

  await page.goto('/protected?path=debug/Briarcliff');
  const errorMessage = page.locator('text=What a terrible failure!');
  await expect(errorMessage).toBeVisible();

  // Ensure the endpoint was accounted for in usage (even though overridden)
  await apiUsage.expectHit('parse_project_error');
});

test('Project finder handles API errors - video-metadata', async ({
  page,
  apiUsage,
  apiOverrides,
}) => {
  await apiUsage.reset();
  await setValidCredentials(page);

  // Provide an override handler BEFORE navigation so it wins over defaults.
  // This forces the get_video_metadata endpoint to return a 500 and exercise the UI error path.
  apiOverrides.push(
    overrideGetVideoMetadataError({ message: 'Video metadata failure!' }),
  );

  await page.goto(
    '/protected?path=debug/Briarcliff&videoUrl=https%3A%2F%2Fstorage.googleapis.com%2Fbriarcliff_manor_2025_videos%2FBISHOP%2520LN_01.MP4',
  );
  const errorMessage = page.locator('text=Video metadata failure!');
  await expect(errorMessage).toBeVisible();

  // Ensure the endpoint was accounted for in usage (even though overridden)
  await apiUsage.expectHit('get_video_metadata_error');
});
