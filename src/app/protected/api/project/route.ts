import { NextResponse } from 'next/server';
import { GET_FILES_ENDPOINT } from '@/src/app/protected/api/constants';

import { GetProjectResponse } from '@/src/types';

async function getProject(projectId: string): Promise<GetProjectResponse> {
  const fullUrl = `${
    GET_FILES_ENDPOINT.DETAILS
  }?relative_path=${encodeURIComponent(projectId)}`;

  // return dummyData;
  return fetch(fullUrl)
    .then(async (res) => {
      if (!res.ok) {
        return {
          detail: {
            message: 'Error fetching project details 1',
            relative_path: projectId,
          },
        };
      }
      const data = (await res.json()) as GetProjectResponse;

      if ('error' in data) {
        return {
          detail: {
            message: data.error + ' 2',
            relative_path: projectId,
          },
        };
      }
      return data;
    })
    .catch((e) => {
      return {
        detail: {
          message: e || e.message || 'Error fetching project details 3',
          relative_path: projectId,
        },
      };
    });
}

export async function GET(
  request: Request,
): Promise<NextResponse<GetProjectResponse>> {
  const { searchParams } = new URL(request.url);
  const projectId = searchParams.get('relative_path');
  if (!projectId) {
    return NextResponse.json(
      {
        detail: {
          message: 'relative_path is required',
        },
      },
      { status: 400, headers: { 'Cache-Control': 'no-store' } },
    );
  }

  try {
    const content = await getProject(projectId);

    return NextResponse.json(content, {
      headers: { 'Cache-Control': 'no-store' },
    });
  } catch (e) {
    return NextResponse.json(
      {
        detail: {
          message: 'Error fetching project details 5',
        },
      },
      {
        status: 500,
        headers: { 'Cache-Control': 'no-store' },
      },
    );
  }
}
