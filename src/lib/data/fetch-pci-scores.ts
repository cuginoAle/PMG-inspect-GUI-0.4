import { ENDPOINT } from '@/src/constants/api-end-points';
import { logger } from '@/src/helpers/logger';
import { FetchError, PciScore, ProcessingConfiguration } from '@/src/types';

async function fetchPciScore({
  videoUrl,
  processingConfiguration,
}: {
  videoUrl?: string;
  processingConfiguration?: ProcessingConfiguration;
}): Promise<PciScore | undefined> {
  if (!videoUrl || !processingConfiguration) {
    return undefined;
  }

  try {
    const res = await fetch(ENDPOINT.PROJECT.PCI_SCORES, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        video_url: videoUrl,
        processing_configuration_name:
          processingConfiguration.inference_configurations,
      }),
    });

    if (!res.ok) {
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

    return res.json();
  } catch (error: any) {
    // Handle both FetchError and network/other errors
    if ((error as FetchError).code) {
      logger({
        severity: 'error',
        content: {
          source: 'fetchPciScore',
          message: error.code + ' - ' + error,
        },
      });
      throw error;
    }

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
