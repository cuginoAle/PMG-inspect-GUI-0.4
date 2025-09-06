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
            id: fullPath,
            name: item.name,
            type: 'directory',
            contents: [],
          });
        } else {
          structure.push({
            id: fullPath,
            name: item.name,
            type: 'directory',
            contents: subDirContent,
          });
        }
      } else {
        structure.push({
          id: fullPath,
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
  const contents = getDirectoryStructure(dataPath);
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

  return NextResponse.json(response);
}
