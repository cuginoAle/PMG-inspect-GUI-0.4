import type { KnipConfig } from 'knip';

const config: KnipConfig = {
  // Entry points that represent the app. For Next.js App Router, Next discovers files automatically,
  // so we hint knip with common entry folders.
  entry: [
    'src/app/**/*.{ts,tsx}',
    'src/components/**/*.{ts,tsx}',
    'src/containers/**/*.{ts,tsx}',
    'src/lib/**/*.{ts,tsx}',
    'src/helpers/**/*.{ts,tsx}',
  ],
  project: ['src/**/*.{ts,tsx}'],
  ignore: [
    // Next.js special files discovered by the framework
    'src/app/**/page.{ts,tsx}',
    'src/app/**/layout.{ts,tsx}',
    'src/app/**/template.{ts,tsx}',
    'src/app/**/loading.{ts,tsx}',
    'src/app/**/error.{ts,tsx}',
    'src/app/**/not-found.{ts,tsx}',
    'src/app/**/route.{ts,tsx}',
    'src/middleware.ts',
    // Types, tests, configs, generated, assets
    'src/types/**',
    'src/dummy-data/**',
    'tests/**',
    'playwright.config.ts',
    'jest.config.*',
    'jest.setup.*',
    '.next/**',
  ],
  // Enable reporting of unused files and exports (orphans)
  rules: {
    files: 'error',
    exports: 'error',
  },
};

export default config;
