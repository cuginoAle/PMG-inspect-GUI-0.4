'use client';
import { useGlobalState } from '@/src/app/global-state';
import { VideoMetaData } from '@/src/components/video-metadata';
import { Warning } from '@/src/components/warning';
import { useSearchParams } from 'next/navigation';

const ProjectVideoMetadataContainer = () => {
  const selectedProject = useGlobalState((state) => state.selectedProject);
  const sp = useSearchParams();

  if (!selectedProject || selectedProject.status !== 'ok') {
    return null;
  }

  const selectedVideo =
    selectedProject.detail.items?.[sp.get('videoUrl') || ''];

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
