# Directory Structure API

⏰ TODO: remove this endpoint and use the production one!

A protected API endpoint that returns the directory structure and file information from the `/src/dummy-data` directory.

## Endpoint

```
GET /protected/api/projects
```

## Authentication

This endpoint is protected by Basic Authentication: check `.env.local` file for credentials.

## Response Format

See: `src/types/api/index.ts`

## Example Usage

Using curl:

```bash
curl -u admin:password123 http://localhost:3000/protected/api/dir
```

Using fetch with TypeScript:

```typescript
const response = await fetch('http://localhost:3000/protected/api/dir', {
  headers: {
    Authorization: 'Basic ' + btoa('admin:password123'),
  },
});
const data: ApiResponse = await response.json();
```
