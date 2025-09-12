import { NextResponse } from 'next/server';
import { GET_FILES_ENDPOINT } from '@/src/app/protected/api/constants';

import { GetProjectResponse, FetchError } from '@/src/types';

async function getProject(projectId: string): Promise<GetProjectResponse> {
  const fullUrl = `${
    GET_FILES_ENDPOINT.DETAILS
  }?relative_path=${encodeURIComponent(projectId)}`;

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
): Promise<NextResponse<GetProjectResponse>> {
  const { searchParams } = new URL(request.url);
  const projectId = searchParams.get('relative_path');

  try {
    const content = await getProject(projectId!);

    return NextResponse.json(content, {
      status: 200,
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
