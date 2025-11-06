import { ENDPOINT } from '@/src/constants/api-end-points';
import { logger } from '@/src/helpers/logger';
import {
  FetchError,
  GetAiPciScoreResponse,
  ProcessingConfiguration,
} from '@/src/types';
import toast from 'react-hot-toast';

async function fetchPciScore({
  videosUrl,
  processingConfigurations,
}: {
  videosUrl?: string[];
  processingConfigurations?: ProcessingConfiguration[];
}): Promise<GetAiPciScoreResponse | undefined> {
  if (!videosUrl || !processingConfigurations) {
    return undefined;
  }

  try {
    const res = await fetch(ENDPOINT.PCI_SCORES, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        video_urls: videosUrl,
        processing_configurations: processingConfigurations,
      }),
    });

    if (!res.ok) {
      toast.error('Failed to load PCI score data.');
      logger({
        severity: 'error',
        content: {
          source: 'fetchPciScore',
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
      toast.error('Failed to load PCI score data.');
      logger({
        severity: 'error',
        content: {
          source: 'fetchPciScore',
          message: error,
        },
      });
      throw error;
    }

    toast.error('Failed to load PCI score data.');
    logger({
      severity: 'error',
      content: {
        source: 'fetchPciScore',
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

export { fetchPciScore };
