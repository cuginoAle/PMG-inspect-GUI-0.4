import { GET_FILES_ENDPOINT } from '@/src/app/protected/api/constants';
import { GetProjectResponse } from '@/src/types';

async function fetchProjectDetails(
  projectId: string,
): Promise<GetProjectResponse> {
  const fullUrl = `${
    GET_FILES_ENDPOINT.DETAILS
  }?relative_path=${encodeURIComponent(projectId)}`;

  return new Promise((resolve, reject) => {
    fetch(fullUrl).then(async (res) => {
      const body = await res.json();
      if (!res.ok) {
        reject({ status: res.status, detail: body.detail });
      }

      resolve(body);
    });
  });
}

export { fetchProjectDetails };
