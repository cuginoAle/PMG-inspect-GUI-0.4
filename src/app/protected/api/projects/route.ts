import { NextResponse } from 'next/server';

import { GetFilesListResponse } from '@/src/types';
import { GET_FILES_ENDPOINT } from './constants';

async function getDirectoryStructure(
  relativePath?: string,
): Promise<GetFilesListResponse> {
  const queryParam = new URLSearchParams();
  if (relativePath) {
    queryParam.append('relative_path', relativePath);
  }

  const fullUrl =
    GET_FILES_ENDPOINT.LIST +
    (queryParam.toString() ? '?' + queryParam.toString() : '');

  return fetch(fullUrl)
    .then(async (res) => {
      if (!res.ok) {
        return {
          relative_path: relativePath || '/',
          error: 'Error reading directory 1',
        };
      }
      const data = (await res.json()) as GetFilesListResponse;

      if ('error' in data) {
        return {
          relative_path: relativePath || '/',
          error: data.error + ' 2',
        };
      }
      return data;
    })
    .catch((e) => {
      return {
        relative_path: relativePath || '/',
        error: e || e.message || 'Error reading directory 3',
      };
    });
}

export async function GET(
  request: Request,
): Promise<NextResponse<GetFilesListResponse>> {
  const { searchParams } = new URL(request.url);
  const relativePath = searchParams.get('relative_path') || undefined;

  try {
    const content = await getDirectoryStructure(relativePath);

    return NextResponse.json(content, {
      headers: { 'Cache-Control': 'no-store' },
    });
  } catch (e) {
    // Map unexpected exceptions to standardized error payload.
    const errorResponse: GetFilesListResponse = {
      relative_path: relativePath || '/',
      error: 'Error reading directory 5',
    };
    return NextResponse.json(errorResponse, {
      status: 500,
      headers: { 'Cache-Control': 'no-store' },
    });
  }
}
