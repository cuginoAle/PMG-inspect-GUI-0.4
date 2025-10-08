import { ENDPOINT } from '@/src/constants/api-end-points';
import { GetProcessingConfigurationResponse } from '@/src/types';

async function fetchProcessingConfiguration(): Promise<
  GetProcessingConfigurationResponse | undefined
> {
  const fullUrl = `${ENDPOINT.PROCESSING_CONFIGURATION}`;

  return new Promise((resolve, reject) =>
    fetch(fullUrl)
      .then(async (res) => {
        const body = await res.json();
        if (!res.ok) {
          reject(new Error(res.statusText));
        }

        resolve(body);
      })
      .catch((error) => {
        reject(`NetworkError - ${error.message}`);
      }),
  );
}

export { fetchProcessingConfiguration };
