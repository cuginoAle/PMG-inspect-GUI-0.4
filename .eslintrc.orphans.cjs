// ESLint config used only for orphaned file detection.
// We enable `import/no-unused-modules` and ignore Next.js App Router entry files
// and common test/build artifacts to reduce false positives.
module.exports = {
  extends: ['next/core-web-vitals'],
  plugins: ['import'],
  settings: {
    'import/resolver': {
      typescript: {
        project: './tsconfig.json',
      },
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
    },
  },
  overrides: [
    {
      files: ['src/**/*.{ts,tsx}'],
      excludedFiles: [
        // Next.js App Router routable files and special files
        'src/app/**/page.tsx',
        'src/app/**/page.ts',
        'src/app/**/layout.tsx',
        'src/app/**/layout.ts',
        'src/app/**/template.tsx',
        'src/app/**/template.ts',
        'src/app/**/loading.tsx',
        'src/app/**/loading.ts',
        'src/app/**/error.tsx',
        'src/app/**/error.ts',
        'src/app/**/not-found.tsx',
        'src/app/**/not-found.ts',
        'src/app/**/route.ts',
        'src/app/**/route.tsx',
        // Root-level special files
        'src/middleware.ts',
        // Tests and tooling
        '**/*.test.ts',
        '**/*.test.tsx',
        '**/*.spec.ts',
        '**/*.spec.tsx',
        'tests/**',
        'playwright.config.ts',
        'jest.config.*',
        'jest.setup.*',
        // Types and dummy data/assets
        'src/types/**',
        'src/dummy-data/**',
      ],
      rules: {
        // Flag modules that export things never imported anywhere (potential orphans)
        'import/no-unused-modules': [
          'error',
          {
            missingExports: false,
            unusedExports: true,
          },
        ],
      },
    },
  ],
};
