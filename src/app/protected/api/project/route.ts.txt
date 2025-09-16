import { NextResponse } from 'next/server';

import { GetProjectResponse, FetchError } from '@/src/types';
import { fetchProjectDetails } from '@/src/lib/data/fetch-project-details';

export async function GET(
  request: Request,
): Promise<NextResponse<GetProjectResponse>> {
  const { searchParams } = new URL(request.url);
  const projectId = searchParams.get('relative_path');

  try {
    const content = await fetchProjectDetails(projectId!);

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
