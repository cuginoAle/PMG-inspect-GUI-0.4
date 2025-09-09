import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { FileInfo, DirectoryInfo, ApiResponse } from './type';

/**
 * Recursively reads the directory structure and returns it in the specified format.
 * @returns An array of FileInfo and DirectoryInfo objects or an error object.
 */

function getDirectoryStructure(
  dirPath: string,
):
  | Array<FileInfo | DirectoryInfo>
  | { error: 'Directory does not exist' | 'Error reading directory' } {
  try {
    const items = fs.readdirSync(dirPath, { withFileTypes: true });
    const structure: Array<FileInfo | DirectoryInfo> = [];

    items.forEach((item) => {
      const fullPath = path.join(dirPath, item.name);
      const stats = fs.statSync(fullPath);

      if (stats.isDirectory()) {
        const subDirContent = getDirectoryStructure(fullPath);
        if ('error' in subDirContent) {
          structure.push({
            fullPath: fullPath,
            name: item.name,
            type: 'directory',
            contents: [],
          });
        } else {
          structure.push({
            fullPath: fullPath,
            name: item.name,
            type: 'directory',
            contents: subDirContent,
          });
        }
      } else {
        structure.push({
          fullPath: fullPath,
          name: item.name,
          type: 'file',
          size: stats.size,
          lastModified: stats.mtime.toISOString(),
        });
      }
    });

    return structure;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      return { error: 'Directory does not exist' };
    }
    return { error: 'Error reading directory' };
  }
}

export async function GET(): Promise<NextResponse<ApiResponse>> {
  const dataPath = path.join(process.cwd(), 'src', 'dummy-data');
  try {
    const contents = getDirectoryStructure(dataPath);

    // Simulate network latency in non-production environments for better UX testing.
    if (process.env.NODE_ENV !== 'production') {
      await new Promise((resolve) => setTimeout(resolve, 200));
    }

    const response: ApiResponse =
      'error' in contents
        ? {
            path: dataPath,
            contents: { error: contents.error },
          }
        : {
            path: dataPath,
            contents,
          };

    return NextResponse.json(response, {
      headers: { 'Cache-Control': 'no-store' },
    });
  } catch (e) {
    // Map unexpected exceptions to standardized error payload.
    const errorResponse: ApiResponse = {
      path: dataPath,
      contents: { error: 'Error reading directory' },
    };
    return NextResponse.json(errorResponse, {
      status: 500,
      headers: { 'Cache-Control': 'no-store' },
    });
  }
}
