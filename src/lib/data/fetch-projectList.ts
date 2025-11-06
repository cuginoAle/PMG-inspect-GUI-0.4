import { ENDPOINT } from '@/src/constants/api-end-points';
import { logger } from '@/src/helpers/logger';
import { FetchError, GetFilesListResponse } from '@/src/types';
import { toast } from 'react-hot-toast/headless';

async function fetchProjectList(
  relativePath?: string,
): Promise<GetFilesListResponse> {
  const queryParam = new URLSearchParams();
  if (relativePath) {
    queryParam.append('folder_relative_path', relativePath);
  }

  const fullUrl =
    ENDPOINT.PROJECT.LIST +
    (queryParam.toString() ? '?' + queryParam.toString() : '');

  try {
    const res = await fetch(fullUrl);

    if (!res.ok) {
      logger({
        severity: 'error',
        content: {
          source: 'fetchProjectList',
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
      toast.error('Failed to load project list data.');
      logger({
        severity: 'error',
        content: {
          source: 'fetchProjectList',
          message: error,
        },
      });
      throw error;
    }
    logger({
      severity: 'error',
      content: {
        source: 'fetchProjectList',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
    });

    toast.error('Failed to load project list data.');
    throw {
      status: 'error',
      code: '0',
      detail: {
        message: error instanceof Error ? error.message : 'Unknown error',
      },
    } as FetchError;
  }
}

export { fetchProjectList };
