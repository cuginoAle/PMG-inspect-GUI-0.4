import { ENDPOINT } from '@/src/constants/api-end-points';
import { logger } from '@/src/helpers/logger';
import { FetchError, GetProjectStatusResponse } from '@/src/types';

async function fetchProjectStatus(
  path?: string,
): Promise<GetProjectStatusResponse | undefined> {
  if (!path) {
    return undefined;
  }

  // building the query string
  const sp = new URLSearchParams();
  sp.append('project_relative_path', path);

  const fullUrl = `${ENDPOINT.PROJECT.STATUS}?${sp.toString()}`;

  try {
    const res = await fetch(fullUrl);
    if (!res.ok) {
      logger({
        severity: 'error',
        content: {
          source: 'fetchProjectStatus',
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
      logger({
        severity: 'error',
        content: {
          source: 'fetchProjectStatus',
          message: error.code + ' - ' + error,
        },
      });
      throw error;
    }
    logger({
      severity: 'error',
      content: {
        source: 'fetchProjectStatus',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
    });

    throw {
      status: 'error',
      code: '0',
      detail: {
        message: error instanceof Error ? error.message : 'Unknown error',
      },
    } as FetchError;
  }
}

export { fetchProjectStatus };
