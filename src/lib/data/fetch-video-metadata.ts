import { GET_FILES_ENDPOINT } from '@/src/app/protected/api/constants';
import { VideoData } from '@/src/types';

let fetching = false;
async function fetchVideoMetadata(videoUrl: string): Promise<VideoData> {
  const fullUrl = `${GET_FILES_ENDPOINT.VIDEOS}?video_url=${encodeURIComponent(
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
          reject({ status: res.status, detail: body.detail });
        }
        resolve(body);
      })
      .catch((error) => {
        fetching = false;
        reject({
          message: 'Network error or server is unreachable',
          detail: error,
        });
      });
  });
}

export { fetchVideoMetadata };
