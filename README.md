# PMG Inspect GUI

This project is a web-based graphical user interface for inspecting and analyzing PMG (Pavement Management Group) video data.

The frontend is built with [Next.js](https://nextjs.org/), [React](https://react.dev/), and [Radix UI](https://www.radix-ui.com/), and it communicates with a backend service for data retrieval.

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v20 or later recommended)
- [pnpm](https://pnpm.io/installation) package manager

This project also requires a running instance of the backend service, which provides the necessary API endpoints. The backend service is expected to be available at `http://localhost:8088`.

### Environment Configuration

Copy `.env.example` to `.env.local` and adjust values as needed. At minimum set credentials for Basic Authentication:

```
PROTECTED_BASIC_AUTH_USER=yourusername
PROTECTED_BASIC_AUTH_PASS=yourpassword
```

If you need Mapbox features, also set:

```
NEXT_PUBLIC_MAPBOX_API_KEY=your-mapbox-token
```

By default the app proxies browser API calls through Next.js to avoid CORS (notably Safari strictness). The backend origin defaults to `http://localhost:8088` but can be overridden:

```
NEXT_PUBLIC_API_BASE_URL=https://your-backend.example.com
```

To disable the proxy and call the backend directly from the browser (requires proper CORS headers), set:

```
NEXT_PUBLIC_API_DIRECT=1
```

You normally should NOT enable direct mode during development unless explicitly testing backend CORS.

### Setup and Installation

1.  **Clone the repository:**

    ```bash
    git clone <your-repository-url>
    cd PMG-inspect-GUI-0.4
    ```

2.  **Install dependencies:**
    Use `pnpm` to install the project's dependencies.
    ```bash
    pnpm install
    ```

### Running the Application Locally

To run the application in development mode, you need to have the backend service running first.

1.  **Ensure the backend is running:**
    Start your backend service. The frontend application expects it to be serving the OpenAPI specification at `http://localhost:8088/openapi.json`.

2.  **Start the frontend development server:**
    Run the following command to start the Next.js development server with Turbopack:

    ```bash
    pnpm dev
    ```

    This command performs three main actions:

    - `generate-api-types`: Generates TypeScript types from the backend's OpenAPI schema.
    - `next dev --turbopack`: Starts the Next.js development server.
    - `generate-css-types`: Watches for changes in CSS modules and generates corresponding TypeScript definition files.

3.  **Open the application:**
    Once the server is running, you can view the application by navigating to [http://localhost:3000](http://localhost:3000) in your web browser.

## Available Scripts

- `pnpm dev`: Starts the development server.
- `pnpm build`: Creates a production-ready build of the application.
- `pnpm start`: Starts the production server (requires a build to be created first).
- `pnpm lint`: Lints the codebase for errors and style issues.
- `pnpm test:e2e`: Runs end-to-end tests using Playwright.
- `pnpm test:e2e:ui`: Opens the Playwright UI for interactive testing.

## Orphaned Files Detection

Detect files and exports that are not used anywhere (potentially safe to delete):

- ESLint (quick, editor-friendly):

  ```bash
  pnpm lint:orphans
  ```

  This uses `import/no-unused-modules` and ignores Next.js special routable files, tests, and assets to reduce false positives. Treat findings as candidates; verify before deletion.

- Knip (repo-wide static analysis):

  ```bash
  pnpm knip:orphans
  ```

  This runs with `knip.config.ts` tailored for Next.js App Router and TypeScript path aliases. It reports unused files and exports with fewer false positives.

Notes:

- Route files (`page.tsx`, `layout.tsx`, API `route.ts`, etc.) are auto-wired by Next.js and may not have explicit imports. They are excluded from ESLint scanning and ignored in Knip.
- Always review reports; some modules are loaded dynamically or by conventions.

## Playwright HTTP Mocking (Route Interception)

### Environment Variables (Testing / Mocks)

| Variable                                                  | Purpose                                                                        | Default Behavior            |
| --------------------------------------------------------- | ------------------------------------------------------------------------------ | --------------------------- |
| `NO_MOCK_API`                                             | Skip starting the mock API HTTP server in tests                                | Mock server starts if unset |
| `ALLOW_REAL_BACKEND`                                      | Allow tests to proceed when port `8088` is already in use (disables fail-fast) | Fail fast on port conflict  |
| `NO_SSR_FETCH_PATCH`                                      | Disable SSR `global.fetch` monkey patch interception                           | Patch enabled               |
| `PROTECTED_BASIC_AUTH_USER` / `PROTECTED_BASIC_AUTH_PASS` | Credentials for protected route basic auth                                     | Required locally            |
| `NEXT_PUBLIC_API_BASE_URL`                                | Override backend API origin (used for SSR + proxy target)                      | `http://localhost:8088`     |
| `NEXT_PUBLIC_API_DIRECT`                                  | Disable proxy rewrites; browser calls backend origin directly                  | Proxy enabled (unset/0)     |
| `API_PORT`                                                | Helper port value used if `NEXT_PUBLIC_API_BASE_URL` unset                     | 8088                        |
| `E2E_TEST`                                                | Indicates E2E context to server-side code (set by Playwright webServer cmd)    | `1` during Playwright runs  |
| `NEXT_PUBLIC_E2E_TEST`                                    | Indicates E2E context to client-side/browser code                              | `1` during Playwright runs  |

If you introduce a new base URL strategy in tests (e.g. an alternate host), add it here for visibility.

End-to-end tests mock backend HTTP calls using Playwright's built-in `page.route` interception instead of a service worker. This removes service worker startup complexity and ensures all API calls in tests are deterministic without requiring the backend.

### How It Works

- A custom test fixture (`tests/mocks/playwright-mocks.ts`) registers network routes before navigation.
- Routes matching `**/api/v1/parse_project*` and `**/api/v1/get_files_list*` are fulfilled with JSON stubs from `tests/mocks/stubs/`.
- Any other `**/api/v1/**` calls are treated as unhandled and return a 500 with a clear error payload (fail-fast signal to add a mock).

Example:

```ts
// tests/example.spec.ts
import { test, expect } from './mocks/playwright-mocks';

test('project finder loads projects', async ({ page, apiUsage }) => {
  await apiUsage.reset(); // optional: start clean
  await page.goto('/protected');
  await expect(page.getByPlaceholder('Search projects...')).toBeVisible();
  await apiUsage.expectHit('parse_project');
});
```

### Adding / Updating Mocks

1. Add or modify stub JSON under `tests/mocks/stubs/`.
2. Update the route interception logic in `tests/mocks/playwright-mocks.ts` if a new endpoint is introduced.
3. (Optional) Tailor responses per query parameter (see commented code capturing `relative_path`).

### Allowing a Real Request Temporarily

Avoided by default for test determinism. If you truly need a live call:

- Comment out the specific `page.route` handler locally, or
- Add a conditional around `route.fulfill` to `route.fallback()` (not recommended for committed code).

### Unhandled Requests

Unhandled API calls to `**/api/v1/**` will log a console error and are fulfilled with a 500 JSON error (`{"error":"Unhandled test API call"}`). Treat this as a signal to add a mock route.

### Why Not MSW?

MSW was initially used, but for these tests static route interception:

- Eliminates service worker timing issues.
- Reduces serialization/bootstrapping complexity.
- Keeps mocks explicit and colocated with test concerns.

If future needs require richer runtime behavior (e.g., GraphQL, conditional mutation flows), MSW or a lightweight mock server can be reintroduced.

### Future Improvements

- Add typed factories for stub generation.
- Provide a helper to assert that all defined mocks were actually hit (coverage of mocked endpoints). (Partially implemented via `apiUsage` fixture.)
- Introduce per-test overrides via a `test.extend({ mockOverrides: ... })` fixture.

### API Usage Tracking (Coverage of Mocked Endpoints)

The mock API server (started in `global-setup`) tracks how many times each mocked endpoint is called. A Playwright fixture `apiUsage` is exposed for convenience.

Fixture methods:

```ts
const usage = await apiUsage.get(); // { parse_project: 1, get_files_list: 2 }
await apiUsage.reset(); // resets counts
await apiUsage.expectHit('parse_project'); // throws if count is 0 / undefined
```

Raw introspection endpoints (if you need manual access):

- `GET http://localhost:8088/__mock-usage__` -> `{ usage: { key: count } }`
- `GET http://localhost:8088/__mock-usage__/reset` -> 204 reset

Example focused assertion:

```ts
import { test, expect } from './mocks/playwright-mocks';

test('calls expected endpoints', async ({ page, apiUsage }) => {
  await apiUsage.reset();
  await page.goto('/protected');
  const usage = await apiUsage.get();
  expect(usage.parse_project).toBeGreaterThan(0);
});
```

### SSR vs Browser Interception & Port Conflicts

Some data-fetching runs during Next.js server rendering (SSR / React Server Components) before the browser context exists. Playwright's `page.route` only intercepts browser-originated network traffic. If an API call happens on the server first, it bypasses route interception.

Key points:

- Absolute URLs like `http://localhost:8088/...` are fetched directly by the Node process during SSR.
- If the mock server cannot start because port `8088` is already bound by a real backend, tests now fail fast (unless explicitly allowed) to prevent false-positive mixing of real and mocked data.
- Environment variable `ALLOW_REAL_BACKEND=1` disables fail-fast behavior and allows tests to run against a real backend (not recommended for deterministic CI runs).

Behavior on port conflict:

```
FAIL (default)  -> Port 8088 busy and ALLOW_REAL_BACKEND not set
ALLOW           -> Set ALLOW_REAL_BACKEND=1 to permit real backend usage
```

If you need to confirm whether a fetch ran on the server or in the browser, temporarily add a diagnostic:

```ts
console.log(
  '[APP FETCH] parse_project context:',
  typeof window === 'undefined' ? 'SERVER' : 'BROWSER',
);
```

Remove diagnostics once confirmed to keep test output clean.

#### Making SSR Interception Deterministic

If future endpoints must always be mocked during SSR:

1. Monkey-patch `global.fetch` in `tests/global-setup.ts`.
2. Or switch to a unified mock layer (e.g. MSW in Node mode) for SSR + `page.route` for browser overrides.
3. Or use an env-driven alternate API base (e.g. `NEXT_PUBLIC_API_BASE_URL`) pointing to a test-only host you fully control.

#### When a Request Still Appears "Unhandled"

1. Verify whether it's an SSR call (look for diagnostic context logs).
2. Ensure the mock server started (no port conflict message).
3. Confirm the path & query parameters match your interception logic.
4. Add a catch-all logger (already present) to surface unexpected endpoints early.

---

### SSR Fetch Monkey Patch

During tests, server-side (SSR) fetches to `http://localhost:8088/api/v1/get_files_list` and `http://localhost:8088/api/v1/parse_project` are intercepted in `tests/global-setup.ts` by monkey patching `global.fetch`. This guarantees deterministic data even when Next.js renders pages or React Server Components before the browser context exists.

Disable this behavior by setting:

```bash
NO_SSR_FETCH_PATCH=1 pnpm test:e2e
```

Or remove the block in `tests/global-setup.ts` if you prefer real backend calls for SSR.

### Troubleshooting Mock Failures

| Symptom                                     | Likely Cause                                                   | Action                                                              |
| ------------------------------------------- | -------------------------------------------------------------- | ------------------------------------------------------------------- |
| `Unhandled API call` log in test output     | Endpoint not matched or executed during SSR before route setup | Check SSR patch active; add/adjust handler in `playwright-mocks.ts` |
| Test fails with port conflict error         | Real backend already bound to 8088                             | Stop real backend OR set `ALLOW_REAL_BACKEND=1` (non-deterministic) |
| Stale data returned when expecting new stub | Browser served cached response or SSR pre-fetched              | Invalidate cache/remove local storage / ensure unique query param   |
| `apiUsage.expectHit` fails                  | Endpoint never hit in test                                     | Ensure user interaction triggers fetch (query param/path)           |
| SSR patch not logging                       | `NO_SSR_FETCH_PATCH=1` set or global fetch replaced elsewhere  | Unset var or move patch earlier in `global-setup.ts`                |

When adding new endpoints:

1. Add stub JSON under `tests/mocks/stubs`.
2. Extend consolidated handler or add specific route logic.
3. (Optional) Update usage tracking expectations in your spec.
