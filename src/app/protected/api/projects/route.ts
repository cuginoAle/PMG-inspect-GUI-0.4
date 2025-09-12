import { NextResponse } from 'next/server';

import { FetchError, GetFilesListResponse } from '@/src/types';
import { fetchProjects } from '@/src/lib/data/fetch-projects';

export async function GET(
  request: Request,
): Promise<NextResponse<GetFilesListResponse>> {
  const { searchParams } = new URL(request.url);
  const relativePath = searchParams.get('relative_path') || undefined;

  try {
    const content = await fetchProjects(relativePath);

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
