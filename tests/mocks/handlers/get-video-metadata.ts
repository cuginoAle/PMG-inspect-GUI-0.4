import videoMetadata from '@/tests/mocks/stubs/video-metadata.json';
import { ApiHandler } from './types';

const getVideoMetadata: ApiHandler = {
  key: 'parse_video',
  matches: (pathname) => pathname.endsWith('/parse_video'),
  handle: async ({ route, url, bump }) => {
    const rel = url.searchParams.get('video_url');
    bump('parse_video');
    console.log('[TEST MOCK] Intercept parse_video', {
      url: url.toString(),
      video_url: rel,
    });

    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(videoMetadata),
    });
    return true;
  },
};

export default getVideoMetadata;
