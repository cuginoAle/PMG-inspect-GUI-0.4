import { ENDPOINT } from '@/src/constants/api-end-points';
import { GetFilesListResponse } from '@/src/types';

async function fetchProjectList(
  relativePath?: string,
): Promise<GetFilesListResponse> {
  const queryParam = new URLSearchParams();
  if (relativePath) {
    queryParam.append('relative_path', relativePath);
  }

  const fullUrl =
    ENDPOINT.PROJECT.LIST +
    (queryParam.toString() ? '?' + queryParam.toString() : '');

  return new Promise((resolve, reject) => {
    fetch(fullUrl)
      .then(async (res) => {
        const body = await res.json();

        if (!res.ok) {
          reject({ code: res.status, status: 'error', detail: body.detail });
        }

        resolve({
          status: 'ok',
          detail: body,
        });
      })
      .catch((error) => {
        reject({
          status: 'error',
          code: 'NetworkError',
          detail: { message: error.message },
        });
      });
  });
}

export { fetchProjectList };
