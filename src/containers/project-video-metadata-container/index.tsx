'use client';
import { useGlobalState } from '@/src/app/global-state';
import { useFetchVideo } from '@/src/app/hooks/useFetchVideo';
import { VideoMetaData } from '@/src/components/video-metadata';
import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

const ProjectVideoMetadataContainer = () => {
  const searchParams = useSearchParams();
  const videoUrl = searchParams.get('videoUrl') || undefined;
  const gState = useGlobalState();
  const setVideo = gState.selectedVideo.set;

  const videoData = useFetchVideo(videoUrl);

  useEffect(() => {
    setVideo(videoData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videoData]);

  return <VideoMetaData video={videoData} />;
};

export { ProjectVideoMetadataContainer };
