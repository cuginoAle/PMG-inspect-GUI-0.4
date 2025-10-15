import { ENDPOINT } from '@/src/constants/api-end-points';
import { FetchError, GetFilesListResponse } from '@/src/types';

async function fetchProjectList(
  relativePath?: string,
): Promise<GetFilesListResponse> {
  const queryParam = new URLSearchParams();
  if (relativePath) {
    queryParam.append('folder_relative_path', relativePath);
  }

  const fullUrl =
    ENDPOINT.PROJECT.LIST +
    (queryParam.toString() ? '?' + queryParam.toString() : '');

  try {
    const res = await fetch(fullUrl);

    // NOTE: this end-point doesn't handle the errors properly
    // so res.json() may throw an error (trying to parse an html error page)
    // this would be caught in the catch block below - i.e. it would look like a network error even if the server did respond.
    // If the server DOES return a json with an error status, then we handle it here

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

export { fetchProjectList };
