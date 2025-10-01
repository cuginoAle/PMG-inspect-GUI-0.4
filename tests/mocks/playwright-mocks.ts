import { test as base, expect } from '@playwright/test';
import { apiHandlers, ApiHandler } from './handlers';

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
  /**
   * Optional per-test API handler overrides. These run BEFORE the default handlers.
   * Useful for forcing error conditions without relying on route ordering battles.
   */
  apiOverrides: ApiHandler[];
}>({
  apiOverrides: [
    async ({}, use) => {
      await use([]);
    },
    { auto: false },
  ],
  apiMocksApplied: [
    async ({ page, apiOverrides }, use) => {
      const clientUsage: Record<string, number> = {};
      const bump = (k: string) => {
        clientUsage[k] = (clientUsage[k] || 0) + 1;
      };
      // Some code paths use direct origin (/api/v1/...), browser paths use proxy (/api/proxy/api/v1/...).
      // We intercept BOTH so tests don't depend on window.__API_DIRECT__ flag.
      const handler = async (route: any) => {
        const urlStr = route.request().url();
        const url = new URL(urlStr);
        let pathname = url.pathname; // e.g. /api/proxy/api/v1/parse_project OR /api/v1/parse_project
        // Normalize proxy prefix so handlers can just match on /api/v1/*
        if (pathname.startsWith('/api/proxy/')) {
          pathname = pathname.replace('/api/proxy/', '/');
        }
        // Debug log to trace interception occurrences
        if (process.env.DEBUG_MOCKS) {
          console.log(
            '[TEST MOCK] Intercept raw:',
            url.pathname,
            'normalized:',
            pathname,
          );
        }
        // Compose overrides first (highest precedence), then default handlers
        const composed: ApiHandler[] = [...apiOverrides, ...apiHandlers];
        for (const h of composed) {
          if (h.matches(pathname, url)) {
            try {
              const handled = await h.handle({ route, url, pathname, bump });
              if (handled) return;
            } catch (e) {
              console.error(`[TEST MOCK] Handler ${h.key} threw`, e);
              await route.fulfill({
                status: 500,
                contentType: 'application/json',
                body: JSON.stringify({ error: `Handler ${h.key} failed` }),
              });
              return;
            }
          }
        }
        console.error('[TEST MOCK] Unhandled API call (fallback):', urlStr);
        await route.fulfill({
          status: 500,
          contentType: 'application/json',
          body: JSON.stringify({ error: 'Unhandled test API call' }),
        });
      };

      // Direct (SSR or forced direct mode)
      await page.route('**/api/v1/**', handler);
      // Proxy-prefixed (browser default path)
      await page.route('**/api/proxy/api/v1/**', handler);
      // expose clientUsage snapshot via symbol on page if needed later
      (page as any)._clientApiUsage = clientUsage;
      await use(true);
    },
    { auto: true },
  ],
  apiUsage: [
    async ({ page }, use) => {
      const base = 'http://localhost:8088';
      const api = {
        // Return merged usage: server-side mock API + client route interception counts.
        get: async () => {
          let serverUsage: Record<string, number> = {};
          try {
            const res = await fetch(`${base}/__mock-usage__`);
            const data = (await res.json()) as {
              usage: Record<string, number>;
            };
            serverUsage = data.usage || {};
          } catch {
            // server may not be running (ALLOW_REAL_BACKEND scenario) – ignore
          }
          const clientUsage: Record<string, number> =
            (page as any)._clientApiUsage || {};
          return { ...serverUsage, ...clientUsage };
        },
        reset: async () => {
          try {
            await fetch(`${base}/__mock-usage__/reset`);
          } catch {
            /* ignore */
          }
          // Clear client side counts too
          if ((page as any)._clientApiUsage) {
            Object.keys((page as any)._clientApiUsage).forEach(
              (k) => delete (page as any)._clientApiUsage[k],
            );
          }
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
