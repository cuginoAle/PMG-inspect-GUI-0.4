import { ENDPOINT } from '@/src/constants/api-end-points';
import { logger } from '@/src/helpers/logger';
import { FetchError, GetBaseConfigurationsResponse } from '@/src/types';
import toast from 'react-hot-toast';

async function fetchBaseConfigurations(): Promise<
  GetBaseConfigurationsResponse | undefined
> {
  try {
    const res = await fetch(ENDPOINT.PROCESSING_CONFIGURATIONS);
    if (!res.ok) {
      logger({
        severity: 'error',
        content: {
          source: 'fetchBaseConfigurations',
          message: res.statusText,
        },
      });
      throw {
        code: String(res.status),
        status: 'error',
        detail: {
          message: res.statusText,
        },
      } as FetchError;
    }

    const body = await res.json();

    return {
      status: 'ok',
      detail: body,
    };
  } catch (error: any) {
    // Handle both FetchError and network/other errors
    if ((error as FetchError).code) {
      toast.error('Failed to load base configurations data.');
      logger({
        severity: 'error',
        content: {
          source: 'fetchBaseConfigurations',
          message: error,
        },
      });
      throw error;
    }

    logger({
      severity: 'error',
      content: {
        source: 'fetchBaseConfigurations',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
    });

    toast.error('Failed to load base configurations data.');
    throw {
      status: 'error',
      code: '0',
      detail: {
        message: error instanceof Error ? error.message : 'Unknown error',
      },
    } as FetchError;
  }
}

export { fetchBaseConfigurations };
