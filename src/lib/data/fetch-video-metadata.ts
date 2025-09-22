import { ENDPOINT } from '@/src/constants/api-end-points';
import { FetchError, GetVideoMetadataResponse } from '@/src/types';

let fetching = false;
async function fetchVideoMetadata(
  videoUrl?: string,
): Promise<GetVideoMetadataResponse | undefined> {
  if (!videoUrl) return;

  const fullUrl = `${ENDPOINT.VIDEOS}?video_url=${encodeURIComponent(
    videoUrl,
  )}`;

  return new Promise((resolve, reject) => {
    if (fetching) return; // Prevent multiple simultaneous fetches

    fetch(fullUrl)
      .then(async (res) => {
        fetching = true;
        const body = await res.json();

        fetching = false;
        if (!res.ok) {
          reject({ status: 'error', code: res.status, detail: body.detail });
        }
        resolve({ status: 'ok', detail: body });
      })
      .catch((error) => {
        fetching = false;
        reject({
          status: 'error',
          code: error.code || 500,
          detail: { message: error.message },
        } as FetchError);
      });
  });
}

export { fetchVideoMetadata };
