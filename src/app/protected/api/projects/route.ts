import { NextResponse } from 'next/server';

import { FetchError, GetFilesListResponse } from '@/src/types';
import { fetchProjectList } from '@/src/lib/data/fetch-projectList';

export async function GET(
  request: Request,
): Promise<NextResponse<GetFilesListResponse>> {
  const { searchParams } = new URL(request.url);
  const relativePath = searchParams.get('relative_path') || undefined;

  try {
    const content = await fetchProjectList(relativePath);

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
