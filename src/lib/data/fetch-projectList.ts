import { ENDPOINT } from '@/src/constants/api-end-points';
import { GetFilesListResponse } from '@/src/types';

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
    const body = await res.json();

    // NOTE: this end-point doesn't handle the errors properly
    // so res.json() may throw an error (trying to parse an html error page)
    // this would be caught in the catch block below - i.e. it would look like a network error even if the server did respond.
    // If the server DOES return a json with an error status, then we handle it here

    if (!res.ok) {
      return Promise.reject({
        code: res.status,
        status: 'error',
        detail: body.detail,
      });
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
    });
  }
}

export { fetchProjectList };
