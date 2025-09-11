import { NextResponse } from 'next/server';
import { GET_FILES_ENDPOINT } from '@/src/app/protected/api/constants';

//TODO: THIS IS JUST TEST CODE AND SHOULD BE REMOVED AS SOON AS THE API IS READY!!
import { Project } from './types/project';
import dummyData from './dummy-data/ground_truthdata_heath_small.json';

type GetProjectResponse =
  | Project
  | {
      error: string;
    };

async function getProject(projectId: string): Promise<GetProjectResponse> {
  const fullUrl = `${
    GET_FILES_ENDPOINT.DETAILS
  }?project_id=${encodeURIComponent(projectId)}`;

  return dummyData;
  // return fetch(fullUrl)
  //   .then(async (res) => {
  //     if (!res.ok) {
  //       return {
  //         error: 'Error fetching project details 1',
  //       };
  //     }
  //     const data = (await res.json()) as GetProjectResponse;

  //     if ('error' in data) {
  //       return {
  //         error: data.error + ' 2',
  //       };
  //     }
  //     return data;
  //   })
  //   .catch((e) => {
  //     return {
  //       error: e || e.message || 'Error fetching project details 3',
  //     };
  //   });
}

export async function GET(
  request: Request,
): Promise<NextResponse<GetProjectResponse>> {
  const { searchParams } = new URL(request.url);
  const projectId = searchParams.get('project_id');
  if (!projectId) {
    return NextResponse.json(
      { error: 'project_id is required' },
      { status: 400, headers: { 'Cache-Control': 'no-store' } },
    );
  }

  try {
    const content = await getProject(projectId);

    return NextResponse.json(content, {
      headers: { 'Cache-Control': 'no-store' },
    });
  } catch (e) {
    // Map unexpected exceptions to standardized error payload.
    const errorResponse: GetProjectResponse = {
      error: 'Error fetching project details 5',
    };
    return NextResponse.json(errorResponse, {
      status: 500,
      headers: { 'Cache-Control': 'no-store' },
    });
  }
}
