import { ENDPOINT } from '@/src/constants/api-end-points';
import { logger } from '@/src/helpers/logger';
import { FetchError, GetProjectResponse } from '@/src/types';
import toast from 'react-hot-toast';

async function fetchProjectDetails(
  path?: string,
): Promise<GetProjectResponse | undefined> {
  if (!path) {
    return undefined;
  }

  // building the query string
  const sp = new URLSearchParams();
  sp.append('project_relative_path', path);

  const fullUrl = `${ENDPOINT.PROJECT.DETAILS}?${sp.toString()}`;

  try {
    const res = await fetch(fullUrl);

    if (!res.ok) {
      logger({
        severity: 'error',
        content: {
          source: 'fetchProjectDetails',
          message: `${res.status} - ${res.statusText}`,
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
      toast.error('Failed to load project details data.');
      logger({
        severity: 'error',
        content: {
          source: 'fetchProjectDetails',
          message: error,
        },
      });
      throw error;
    }
    logger({
      severity: 'error',
      content: {
        source: 'fetchProjectDetails',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
    });

    toast.error('Failed to load project details data.');
    throw {
      status: 'error',
      code: '0',
      detail: {
        message: error instanceof Error ? error.message : 'Unknown error',
      },
    } as FetchError;
  }
}

export { fetchProjectDetails };
