import { fetchVideoMetadata } from '@/src/lib/data/fetch-video-metadata';

import { GetVideoMetadataResponse } from '@/src/types';
import React from 'react';
import { useEffect } from 'react';

const useFetchVideo = (videoUrl?: string) => {
  const [video, setVideo] = React.useState<
    GetVideoMetadataResponse | undefined
  >(undefined);

  useEffect(() => {
    if (!videoUrl) {
      setVideo(undefined);
      return;
    }

    setVideo({ status: 'loading' });
    fetchVideoMetadata(videoUrl)
      .then(setVideo)
      .catch((error) => {
        setVideo(error);
      });
  }, [videoUrl]);

  return video;
};

export { useFetchVideo };
