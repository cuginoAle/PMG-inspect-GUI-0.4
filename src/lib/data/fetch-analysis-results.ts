import { ENDPOINT } from '@/src/constants/api-end-points';
import { FetchError, GetAnalysisResultResponse } from '@/src/types';

async function fetchAnalysisResults(
  path?: string,
): Promise<GetAnalysisResultResponse | undefined> {
  if (!path) {
    return undefined;
  }

  // building the query string
  const sp = new URLSearchParams();
  sp.append('project_relative_path', path);

  const fullUrl = `${ENDPOINT.PROJECT.ANALYSIS}?${sp.toString()}`;

  try {
    const res = await fetch(fullUrl);
    const body = await res.json();

    if (!res.ok) {
      return Promise.reject({
        status: 'error',
        code: res.status.toString(),
        detail: { message: res.statusText },
      } as FetchError);
    }

    return {
      status: 'ok',
      detail: body,
    };
  } catch (error: any) {
    return Promise.reject({
      status: 'error',
      code: error.code || error.errno || 'NetworkError',
      detail: { message: error.message || String(error) },
    } as FetchError);
  }
}

export { fetchAnalysisResults };
