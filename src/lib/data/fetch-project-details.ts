import { ENDPOINT } from '@/src/constants/api-end-points';
import { FetchError, GetProjectResponse } from '@/src/types';

async function fetchProjectDetails(
  path?: string,
): Promise<GetProjectResponse | undefined> {
  if (!path) {
    return Promise.resolve(undefined);
  }

  // building the query string
  const sp = new URLSearchParams();
  sp.append('project_relative_path', path);

  const fullUrl = `${ENDPOINT.PROJECT.DETAILS}?${sp.toString()}`;

  return new Promise((resolve, reject) => {
    fetch(fullUrl)
      .then(async (res) => {
        const body = await res.json();
        if (!res.ok) {
          reject({
            status: 'error',
            code: res.status.toString(),
            detail: { message: res.statusText },
          } as FetchError);
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
