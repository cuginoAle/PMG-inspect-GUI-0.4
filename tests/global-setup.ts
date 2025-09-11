import type { FullConfig } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';

async function globalSetup(_config: FullConfig) {
  if (process.env.CI) {
    return;
  }
  const envPath = path.resolve(__dirname, '../.env.local');
  dotenv.config({ path: envPath });
}

export default globalSetup;
