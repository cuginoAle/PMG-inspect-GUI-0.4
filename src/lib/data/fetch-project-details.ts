import { ENDPOINT } from '@/src/constants/api-end-points';
import { FetchError, GetProjectResponse } from '@/src/types';

async function fetchProjectDetails(
  path?: string,
): Promise<GetProjectResponse | undefined> {
  if (!path) {
    return undefined;
  }

  // building the query string
  const sp = new URLSearchParams();
  sp.append('project_relative_path', path);

  const fullUrl = `${ENDPOINT.PROJECT.DETAILS}?${sp.toString()}`;

  try {
    const res = await fetch(fullUrl);
    if (!res.ok) {
      if (res.status === 500) {
        return Promise.reject({
          code: res.status,
          status: 'error',
          detail: {
            message: res.statusText,
          },
        });
      }
      const body = await res.json();
      return Promise.reject({
        code: res.status,
        status: 'error',
        detail: body.detail,
      });
    }

    const body = await res.json();

    return {
      status: 'ok',
      detail: body,
    };
  } catch (error: any) {
    // Handle both FetchError and network/other errors
    if ((error as FetchError).code) {
      throw error;
    }
    throw {
      status: 'error',
      code: '0',
      detail: {
        message: error instanceof Error ? error.message : 'Unknown error',
      },
    } as FetchError;
  }
}

export { fetchProjectDetails };
