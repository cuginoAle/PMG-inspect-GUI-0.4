import { test as base, expect } from '@playwright/test';
import projectList from './stubs/project-list.json';
import projectDetails from './stubs/project-details.json';

// Route-interception based fixture (replaces MSW). This avoids service worker startup timing issues
// and keeps mocks colocated with test assets.
export const test = base.extend<{
  apiMocksApplied: boolean;
  apiUsage: {
    get: () => Promise<Record<string, number>>;
    reset: () => Promise<void>;
    expectHit: (endpointKey: string) => Promise<void>;
  };
  clientUsage: Record<string, number>;
}>({
  apiMocksApplied: [
    async ({ page }, use) => {
      const clientUsage: Record<string, number> = {};
      const bump = (k: string) => {
        clientUsage[k] = (clientUsage[k] || 0) + 1;
      };
      // Single consolidated handler for all API v1 requests to avoid overlap ambiguity
      await page.route('**/api/v1/**', async (route) => {
        const url = route.request().url();
        const parsed = new URL(url);
        const pathname = parsed.pathname; // e.g. /api/v1/parse_project
        if (pathname.endsWith('/parse_project')) {
          const rel = parsed.searchParams.get('relative_path');
          bump('parse_project');
          console.log('[TEST MOCK] Intercept parse_project', { url, relative_path: rel });
          if (!rel) {
            await route.fulfill({
              status: 400,
              contentType: 'application/json',
              body: JSON.stringify({
                detail: [
                  {
                    type: 'missing',
                    loc: ['query', 'relative_path'],
                    msg: 'Field required',
                    input: null,
                  },
                ],
              }),
            });
            return;
          }
          await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify(projectDetails),
          });
          return;
        }
        if (pathname.endsWith('/get_files_list')) {
          bump('get_files_list');
            console.log('[TEST MOCK] Intercept get_files_list', { url });
            await route.fulfill({
              status: 200,
              contentType: 'application/json',
              body: JSON.stringify(projectList),
            });
            return;
        }
        // Unknown endpoint under /api/v1/
        console.error('[TEST MOCK] Unhandled API call (fallback):', url);
        await route.fulfill({
          status: 500,
          contentType: 'application/json',
          body: JSON.stringify({ error: 'Unhandled test API call' }),
        });
      });
      // expose clientUsage snapshot via symbol on page if needed later
      (page as any)._clientApiUsage = clientUsage;
      await use(true);
    },
    { auto: true },
  ],
  apiUsage: [
    async ({}, use) => {
      const base = 'http://localhost:8088';
      const api = {
        get: async () => {
          const res = await fetch(`${base}/__mock-usage__`);
          const data = (await res.json()) as { usage: Record<string, number> };
          return data.usage || {};
        },
        reset: async () => {
          await fetch(`${base}/__mock-usage__/reset`);
        },
        expectHit: async (endpointKey: string) => {
          const usage = await api.get();
          if (!usage[endpointKey]) {
            throw new Error(
              `Expected endpoint "${endpointKey}" to be hit at least once, but it was not. Usage: ${JSON.stringify(
                usage,
              )}`,
            );
          }
        },
      };
      await use(api);
    },
    { auto: false },
  ],
  clientUsage: [
    async ({ page }, use) => {
      await use((page as any)._clientApiUsage || {});
    },
    { auto: false },
  ],
});

export { expect };
