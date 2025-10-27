import { ENDPOINT } from '@/src/constants/api-end-points';
import { FetchError, PciScore, ProcessingConfiguration } from '@/src/types';

async function fetchPciScore({
  videoUrl,
  processingConfiguration,
}: {
  videoUrl: string;
  processingConfiguration: ProcessingConfiguration;
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
          processingConfiguration.processing_configuration_name,
      }),
    });

    if (!res.ok) {
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

export { fetchPciScore };
