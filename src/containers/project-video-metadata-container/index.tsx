'use client';
import { useGlobalState } from '@/src/app/global-state';
import { LoadingToast } from '@/src/components/loading-toast';
import { VideoMetaData } from '@/src/components/video-metadata';
import { Warning } from '@/src/components/warning';
import { VideoData } from '@/src/types';

const ProjectVideoMetadataContainer = () => {
  const gState = useGlobalState();
  const selectedVideo = gState.selectedVideo.get({
    noproxy: true,
  });

  if (selectedVideo?.status === 'loading') {
    return (
      <div className="center">
        <LoadingToast size="small" message="Loading video metadata..." />
      </div>
    );
  }

  if (selectedVideo?.status === 'error') {
    return (
      <div className="center">
        <Warning message={selectedVideo.detail.message} />
      </div>
    );
  }

  // Narrow to successful payload and create mutable gps_data array if present
  const video: VideoData =
    selectedVideo?.status === 'ok'
      ? {
          ...(selectedVideo as any).detail,
          gps_data: Array.isArray((selectedVideo as any).detail?.gps_data)
            ? [...(selectedVideo as any).detail.gps_data]
            : (selectedVideo as any).detail?.gps_data,
        }
      : undefined;

  return <VideoMetaData video={video} />;
};

export { ProjectVideoMetadataContainer };
