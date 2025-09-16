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

Create a `.env.local` file in the root of the project and add the credentials for Basic Authentication:

```
PROTECTED_BASIC_AUTH_USER=yourusername
PROTECTED_BASIC_AUTH_PASS=yourpassword
```

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
