import { GET_FILES_ENDPOINT } from '@/src/app/protected/api/constants';
import { GetFilesListResponse } from '@/src/types';

async function fetchProjectList(
  relativePath?: string,
): Promise<GetFilesListResponse> {
  const queryParam = new URLSearchParams();
  if (relativePath) {
    queryParam.append('relative_path', relativePath);
  }

  const fullUrl =
    GET_FILES_ENDPOINT.LIST +
    (queryParam.toString() ? '?' + queryParam.toString() : '');

  return new Promise((resolve, reject) => {
    fetch(fullUrl)
      .then(async (res) => {
        const body = await res.json();

        if (!res.ok) {
          reject({ status: res.status, detail: body.detail });
        }

        resolve(body);
      })
      .catch((error) => {
        reject({
          status: 'NetworkError',
          detail: { message: error.message },
        });
      });
  });
}

export { fetchProjectList };
