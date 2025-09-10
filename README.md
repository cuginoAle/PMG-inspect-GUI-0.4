# PMG-inspect-GUI-0.4

A small Next.js (app router) GUI for inspecting PMG projects. Includes a simple middleware-based Basic Auth protecting `/protected` routes (development-friendly, in-memory attempt tracking).

## Quick start

Prerequisites

- Node.js (recommended v18+)
- pnpm (optional but recommended — the repo contains a pnpm lockfile)

Install

```bash
# from repository root
pnpm install
```

Environment

Create a `.env.local` in the project root with the Basic Auth credentials used by the middleware:

```
PROTECTED_BASIC_AUTH_USER=youruser
PROTECTED_BASIC_AUTH_PASS=yourpass
```

Run (development)

```bash
pnpm dev
# then open http://localhost:3000
```

Build and start (production)

```bash
pnpm build
pnpm start
```

Testing the protected route

To verify the middleware returns the proper 401/WWW-Authenticate header (which triggers browser login prompts for direct navigations):

```bash
curl -i http://localhost:3000/protected
```
