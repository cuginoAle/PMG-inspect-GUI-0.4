'use client';
import { useGlobalState } from '@/src/app/global-state';
import { VideoMetaData } from '@/src/components/video-metadata';
import { Warning } from '@/src/components/warning';
import { useSearchParams } from 'next/navigation';

const ProjectVideoMetadataContainer = () => {
  const selectedProject = useGlobalState((state) => state.selectedProject);
  const sp = useSearchParams();
  const videoUrl = sp.get('videoUrl');

  if (
    !selectedProject ||
    selectedProject.status !== 'ok' ||
    videoUrl === null
  ) {
    return null;
  }

  const selectedVideo = selectedProject.detail.items?.[videoUrl || ''];

  if (!selectedVideo) {
    return (
      <div className="center">
        <Warning message={'No video found!'} />
      </div>
    );
  }

  return <VideoMetaData cameraData={selectedVideo.camera_data} />;
};

export { ProjectVideoMetadataContainer };
