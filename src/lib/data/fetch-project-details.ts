import { GET_FILES_ENDPOINT } from '@/src/app/protected/api/constants';
import { FetchError, GetProjectResponse } from '@/src/types';

async function fetchProjectDetails(
  path?: string,
): Promise<GetProjectResponse | undefined> {
  if (!path) {
    return Promise.resolve(undefined);
  }
  const fullUrl = `${
    GET_FILES_ENDPOINT.DETAILS
  }?relative_path=${encodeURIComponent(path)}`;

  return new Promise((resolve, reject) => {
    fetch(fullUrl)
      .then(async (res) => {
        const body = await res.json();
        if (!res.ok) {
          reject({ status: 'error', code: res.status, detail: body.detail });
        }

        resolve({
          status: 'ok',
          detail: body,
        });
      })
      .catch((error) => {
        reject({
          status: 'error',
          code: error.status,
          detail: { message: error.message },
        } as FetchError);
      });
  });
}

export { fetchProjectDetails };
