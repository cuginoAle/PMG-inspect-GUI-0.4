import { ENDPOINT } from '@/src/constants/api-end-points';
import { FileInfo } from '@/src/types';

async function fetchProjectList(relativePath?: string): Promise<FileInfo[]> {
  const queryParam = new URLSearchParams();
  if (relativePath) {
    queryParam.append('folder_relative_path', relativePath);
  }

  const fullUrl =
    ENDPOINT.PROJECT.LIST +
    (queryParam.toString() ? '?' + queryParam.toString() : '');

  return new Promise((resolve, reject) => {
    return fetch(fullUrl)
      .then(async (res) => {
        const body = await res.json();

        if (!res.ok) {
          reject(`${res.status} - ${body.detail.message}`);
        }

        resolve(body);
      })
      .catch((error) => {
        reject(`NetworkError - ${error.message}`);
      });
  });
}

export { fetchProjectList };
