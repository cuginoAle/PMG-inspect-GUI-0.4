import { ENDPOINT } from '@/src/constants/api-end-points';
import { FetchError, GetProcessingConfigurationResponse } from '@/src/types';

async function fetchProcessingConfiguration(): Promise<
  GetProcessingConfigurationResponse | undefined
> {
  const fullUrl = `${ENDPOINT.PROCESSING_CONFIGURATION}`;

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

export { fetchProcessingConfiguration };
