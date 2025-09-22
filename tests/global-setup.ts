import type { FullConfig } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';
import { startMockApiServer, MockApiServer } from './test-api-mock-server';

declare global {
  // eslint-disable-next-line no-var
  var __PLAYWRIGHT_MOCK_API__: MockApiServer | undefined;
}

const readJson = (rel: string) => {
  const fs = require('fs');
  const p = path.resolve(__dirname, 'mocks', 'stubs', rel);
  return JSON.parse(fs.readFileSync(p, 'utf-8'));
};

async function globalSetup(_config: FullConfig) {
  const envPath = path.resolve(__dirname, '../.env.local');
  dotenv.config({ path: envPath });

  // Start mock API server unless user explicitly opts out
  if (!process.env.NO_MOCK_API) {
    if (!global.__PLAYWRIGHT_MOCK_API__) {
      try {
        global.__PLAYWRIGHT_MOCK_API__ = await startMockApiServer(8088);
      } catch (e) {
        console.warn('[global-setup] Failed to start mock API server:', e);
      }
    }
  }

  // Monkey patch global.fetch for SSR / server-side fetch interception.
  // This ensures Next.js server rendering and any server actions use the same stubbed responses
  // that browser route interception supplies. Disable by setting NO_SSR_FETCH_PATCH=1.
  if (
    typeof (global as any).fetch === 'function' &&
    process.env.NO_SSR_FETCH_PATCH !== '1'
  ) {
    const realFetch = (global as any).fetch.bind(global);
    const base = 'http://localhost:8088';
    let projectListCache: any | undefined;
    let projectDetailsCache: any | undefined;

    try {
      projectListCache = readJson('project-list.json');
    } catch {}
    try {
      projectDetailsCache = readJson('project-details.json');
    } catch {}

    (global as any).fetch = async (input: any, init?: any) => {
      const url =
        typeof input === 'string'
          ? input
          : input instanceof URL
          ? input.toString()
          : input.url;
      if (url.startsWith(base + '/api/v1/get_files_list')) {
        return new Response(
          JSON.stringify(projectListCache || { status: 'ok', detail: [] }),
          {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
          },
        );
      }
      if (url.startsWith(base + '/api/v1/parse_project')) {
        return new Response(
          JSON.stringify(
            projectDetailsCache || {
              name: 'sample_project',
              project_items: [],
              status: 'ok',
            },
          ),
          {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
          },
        );
      }
      return realFetch(input, init);
    };
    // eslint-disable-next-line no-console
    console.log('[global-setup] SSR fetch monkey patch active');
  }
}

export default globalSetup;
