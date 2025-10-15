import { ENDPOINT } from '@/src/constants/api-end-points';
import { FetchError, GetProcessingConfigurationResponse } from '@/src/types';

async function fetchProcessingConfiguration(): Promise<
  GetProcessingConfigurationResponse | undefined
> {
  const fullUrl = `${ENDPOINT.PROCESSING_CONFIGURATION}`;

  try {
    const res = await fetch(fullUrl);

    if (!res.ok) {
      if (res.status === 500) {
        throw {
          code: String(res.status),
          status: 'error',
          detail: {
            message: res.statusText,
          },
        } as FetchError;
      }

      const body = await res.json();
      throw {
        code: String(res.status),
        status: 'error',
        detail: body.detail,
      } as FetchError;
    }

    const body = await res.json();
    return {
      status: 'ok',
      detail: body,
    };
  } catch (error) {
    // Handle both FetchError and network/other errors
    if ((error as FetchError).code) {
      throw error;
    }
    throw {
      status: 'error',
      code: '0',
      detail: {
        message: error instanceof Error ? error.message : 'Unknown error',
      },
    } as FetchError;
  }
}

export { fetchProcessingConfiguration };
