# PMG Inspect GUI

A Next.js application providing a graphical user interface for inspecting PMG (Project Management Group) projects. It features a file explorer to navigate project directories and view file details. The application is secured with Basic Authentication.

## Features

- **File and Directory Exploration**: Navigate through the project's file system with a tree-like structure.
- **Protected Routes**: Access to the project inspector is protected by Basic Authentication.
- **API for File System**: A dedicated API endpoint to fetch directory structures and file information.

## Getting Started

### Prerequisites

- Node.js (v18 or newer)
- pnpm (recommended)

### Installation

1.  Clone the repository:
    ```bash
    git clone <repository-url>
    ```
2.  Navigate to the project directory:
    ```bash
    cd PMG-inspect-GUI-0.4
    ```
3.  Install the dependencies:
    ```bash
    pnpm install
    ```

### Environment Configuration

Create a `.env.local` file in the root of the project and add the credentials for Basic Authentication:

```
PROTECTED_BASIC_AUTH_USER=yourusername
PROTECTED_BASIC_AUTH_PASS=yourpassword
```

### Running the Development Server

To start the development server, run:

```bash
pnpm dev
```

The application will be available at `http://localhost:3000`.

## API Endpoints

The application uses a Next.js API route to fetch data from a backend service.

### Get Directory Structure

- **Endpoint**: `/protected/api/projects`
- **Method**: `GET`
- **Description**: Retrieves the contents of a directory.
- **Query Parameters**:
  - `relative_path` (optional): The path to the directory relative to the root. If not provided, the root directory is listed.
- **Backend Service**: This endpoint fetches data from `http://localhost:8088/api/v1/get_files_list`.

To test the protected endpoint with `curl`:

```bash
curl -i -u yourusername:yourpassword http://localhost:3000/protected/api/projects?relative_path=some/folder
```

## Deployment

To deploy the application, you first need to build the project:

```bash
pnpm build
```

Then, you can start the production server:

```bash
pnpm start
```

Make sure to configure the environment variables (`PROTECTED_BASIC_AUTH_USER` and `PROTECTED_BASIC_AUTH_PASS`) in your deployment environment.
