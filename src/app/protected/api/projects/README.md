# Directory Structure API

⏰ TODO: remove this endpoint and use the production one!

A protected API endpoint that returns the directory structure and file information from the `/src/dummy-data` directory.

## Endpoint

```
GET /protected/api/projects
```

## Authentication

This endpoint is protected by Basic Authentication:

- Username: `admin`
- Password: `password123`

## Response Format

### TypeScript Interfaces

```typescript
interface FileInfo {
  name: string;
  type: 'file';
  size: number;
  lastModified: string; // ISO 8601 date string
}

interface DirectoryInfo {
  name: string;
  type: 'directory';
  contents: Array<FileInfo | DirectoryInfo>;
}

interface DirectoryResponse {
  path: string;
  contents: Array<FileInfo | DirectoryInfo>;
}

interface ErrorResponse {
  path: string;
  contents: {
    error: 'Directory does not exist' | 'Error reading directory';
  };
}

type ApiResponse = DirectoryResponse | ErrorResponse;
```

### Example Response

```json
{
  "path": "/src/data",
  "contents": [
    {
      "name": "example-file.txt",
      "type": "file",
      "size": 1024,
      "lastModified": "2024-03-21T12:00:00.000Z"
    },
    {
      "name": "example-directory",
      "type": "directory",
      "contents": [
        {
          "name": "nested-file.json",
          "type": "file",
          "size": 512,
          "lastModified": "2024-03-21T12:00:00.000Z"
        }
      ]
    }
  ]
}
```

### Error Responses

If the directory doesn't exist:

```json
{
  "path": "/src/data",
  "contents": {
    "error": "Directory does not exist"
  }
}
```

If there's a filesystem error:

```json
{
  "path": "/src/data",
  "contents": {
    "error": "Error reading directory"
  }
}
```

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

// Type guard to check if response contains an error
const isErrorResponse = (data: ApiResponse): data is ErrorResponse => {
  return 'error' in data.contents;
};

if (isErrorResponse(data)) {
  console.error('Error:', data.contents.error);
} else {
  // Example: Get all file names from the response
  const fileNames = data.contents
    .filter((item): item is FileInfo => item.type === 'file')
    .map((item) => item.name);

  console.log('Files found:', fileNames);
}
```

## Features

- Lists all files and directories under `/src/data`
- Recursively traverses nested directories
- Array-based structure for ordered file listing
- Each item includes its name and type
- Provides file metadata (size and last modified date)
- Protected access using Basic Authentication
- Error handling for missing directories and filesystem errors
- Full TypeScript type definitions for response handling
