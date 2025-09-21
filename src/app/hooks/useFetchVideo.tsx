import { fetchVideoMetadata } from '@/src/lib/data/fetch-video-metadata';
import { Cache } from '@/src/lib/indexeddb';
import { GetVideoMetadataResponse, VideoData } from '@/src/types';
import React from 'react';
import { useEffect } from 'react';

const useFetchVideo = (videoUrl?: string | null) => {
  const [video, setVideo] = React.useState<
    GetVideoMetadataResponse | undefined
  >(undefined);

  useEffect(() => {
    if (!videoUrl) {
      setVideo(undefined);
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const cached = await Cache.get<VideoData>('videoMetadata', videoUrl);
        if (!cancelled && cached) {
          setVideo({
            status: 'ok',
            detail: cached,
          });
          return; // Skip network
        }
      } catch {
        // ignore cache errors
      }
      if (cancelled) return;
      setVideo({ status: 'loading' });

      fetchVideoMetadata(videoUrl)
        .then((data) => {
          // write-through cache on success
          if (data?.status === 'ok') {
            Cache.set('videoMetadata', videoUrl, data.detail);
          }
          if (!cancelled) setVideo(data);
        })
        .catch((error) => {
          if (!cancelled) setVideo(error);
        });
    })();

    return () => {
      cancelled = true;
    };
  }, [videoUrl]);

  return video;
};

export { useFetchVideo };
