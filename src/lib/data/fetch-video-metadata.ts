import { GET_FILES_ENDPOINT } from '@/src/app/protected/api/constants';
import { VideoData } from '@/src/types';

async function fetchVideoMetadata(videoUrl: string): Promise<VideoData> {
  const fullUrl = `${GET_FILES_ENDPOINT.VIDEOS}?video_url=${encodeURIComponent(
    videoUrl,
  )}`;

  return new Promise((resolve, reject) => {
    fetch(fullUrl)
      .then(async (res) => {
        const body = await res.json();

        if (!res.ok) {
          reject({ status: res.status, detail: body.detail });
        }

        resolve(body);
      })
      .catch((error) => {
        reject({
          message: 'Network error or server is unreachable',
          detail: error,
        });
      });
  });
}

export { fetchVideoMetadata };
