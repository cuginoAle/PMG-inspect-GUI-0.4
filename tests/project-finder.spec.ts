/**
 * Project Finder E2E Tests
 *
 * Tests the project search, selection, and data display functionality.
 * Uses route-based API mocks via Playwright fixtures (see tests/mocks/playwright-mocks.ts).
 */

import { test, expect } from './mocks/playwright-mocks';
import {
  overrideGetVideoMetadataError,
  overrideParseProjectError,
} from './mocks/api-override-helpers';
import { setValidCredentials } from './helpers';

test.describe('Project Finder', () => {
  test.beforeEach(async ({ page, apiUsage }) => {
    await apiUsage.reset();
    await setValidCredentials(page);
  });

  test('displays search interface and loads project list', async ({
    page,
    apiUsage,
  }) => {
    await page.goto('/protected');

    // Verify the search input is visible
    const searchInput = page.locator('input[placeholder="Search projects..."]');
    await expect(searchInput).toBeVisible();

    // Wait for initial data load
    await page.waitForLoadState('networkidle');

    // Verify API was called to fetch files list
    await apiUsage.expectHit('get_files_list');
  });

  test('filters projects based on search query', async ({ page }) => {
    await page.goto('/protected');

    const searchInput = page.locator('input[placeholder="Search projects..."]');
    await expect(searchInput).toBeVisible();
    await page.waitForLoadState('networkidle');

    // Type search query
    await searchInput.fill('Briarcliff');

    // Verify filtered results
    const searchResults = page
      .locator('[data-component-id="file-logo-title"]')
      .filter({ hasText: 'Briarcliff' });

    await expect(searchResults).toHaveCount(3);
  });

  test('displays project details when a project is selected', async ({
    page,
    apiUsage,
  }) => {
    await page.goto('/protected');

    const searchInput = page.locator('input[placeholder="Search projects..."]');
    await page.waitForLoadState('networkidle');

    // Search and select a project
    await searchInput.fill('Briarcliff');
    const searchResults = page
      .locator('[data-component-id="file-logo-title"]')
      .filter({ hasText: 'Briarcliff' });

    await searchResults.nth(1).click();

    // Verify project details panel appears
    const detailsPanel = page.locator(
      '[data-component-id="project-analysis-dashboard-file-title"]',
      { hasText: 'debug/Briarcliff' },
    );
    await expect(detailsPanel).toBeVisible();

    // Verify table data is loaded
    const tableCell = page.locator('.rt-TableCell', {
      hasText: 'ADMIRAL WORDENS LN',
    });
    await expect(tableCell).toBeVisible();

    // Verify video metadata section is present
    const metadataHeading = page.locator('text=Video Metadata:');
    await expect(metadataHeading).toBeVisible();

    // Verify all required APIs were called
    await apiUsage.expectHit('get_files_list');
    await apiUsage.expectHit('parse_project');
    await apiUsage.expectHit('parse_video');
  });

  test('handles parse_project API error gracefully', async ({
    page,
    apiUsage,
    apiOverrides,
  }) => {
    // Override the parse_project endpoint to return an error BEFORE navigation
    apiOverrides.push(
      overrideParseProjectError({ message: 'Failed to parse project data' }),
    );

    await page.goto('/protected?path=debug/Briarcliff');

    // Verify error message is displayed to user
    const errorMessage = page.locator('text=Failed to parse project data');
    await expect(errorMessage).toBeVisible();

    // Verify the error endpoint was tracked
    await apiUsage.expectHit('parse_project_error');
  });

  test('handles video metadata API error gracefully', async ({
    page,
    apiUsage,
    apiOverrides,
  }) => {
    const videoUrl = encodeURIComponent(
      'https://storage.googleapis.com/briarcliff_manor_2025_videos/BISHOP LN_01.MP4',
    );

    // Override the video metadata endpoint to return an error
    apiOverrides.push(
      overrideGetVideoMetadataError({
        message: 'Unable to retrieve video metadata',
      }),
    );

    await page.goto(`/protected?path=debug/Briarcliff&videoUrl=${videoUrl}`);

    // Verify error message is displayed to user
    const errorMessage = page.locator('text=Unable to retrieve video metadata');
    await expect(errorMessage).toBeVisible();

    // Verify the error endpoint was tracked
    await apiUsage.expectHit('get_video_metadata_error');
  });

  test.skip('visual regression - project finder interface', async ({
    page,
  }) => {
    await page.goto('/protected');

    const searchInput = page.locator('input[placeholder="Search projects..."]');
    await expect(searchInput).toBeVisible();
    await page.waitForLoadState('networkidle');

    // Search and select a project for full UI state
    await searchInput.fill('Briarcliff');
    const searchResults = page
      .locator('[data-component-id="file-logo-title"]')
      .filter({ hasText: 'Briarcliff' });
    await searchResults.nth(1).click();

    // Wait for details to load
    await page.locator('text=Video Metadata:').waitFor({ state: 'visible' });

    // Take snapshot for visual regression testing
    expect(await page.screenshot()).toMatchSnapshot('project-finder-full.png');
  });
});
