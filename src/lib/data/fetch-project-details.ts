import { ENDPOINT } from '@/src/constants/api-end-points';
import { Project } from '@/src/types';

async function fetchProjectDetails(path: string): Promise<Project> {
  // building the query string
  const sp = new URLSearchParams();
  sp.append('project_relative_path', path);

  const fullUrl = `${ENDPOINT.PROJECT.DETAILS}?${sp.toString()}`;

  return new Promise((resolve, reject) =>
    fetch(fullUrl)
      .then(async (res) => {
        const body = await res.json();
        if (!res.ok) {
          reject(`${res.status} - ${body.detail.message}`);
        }

        resolve(body);
      })
      .catch((error) => {
        reject(`NetworkError - ${error.message}`);
      }),
  );
}

export { fetchProjectDetails };
