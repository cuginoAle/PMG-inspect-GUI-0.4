import { NextResponse } from 'next/server';

import { FetchError, GetFilesListResponse } from '@/src/types';
import { GET_FILES_ENDPOINT } from '@/src/app/protected/api/constants';

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

  return new Promise((resolve, reject) => {
    fetch(fullUrl).then(async (res) => {
      const body = await res.json();
      if (!res.ok) {
        reject({ status: res.status, detail: body.detail });
      }

      resolve(body);
    });
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
    const error = e as FetchError;

    return NextResponse.json(error, {
      status: error.status,
      headers: { 'Cache-Control': 'no-store' },
    });
  }
}
