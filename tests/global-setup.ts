import type { FullConfig } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';
import { startMockApiServer, MockApiServer } from './test-api-mock-server';

declare global {
  // eslint-disable-next-line no-var
  var __PLAYWRIGHT_MOCK_API__: MockApiServer | undefined;
}

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
}

export default globalSetup;
