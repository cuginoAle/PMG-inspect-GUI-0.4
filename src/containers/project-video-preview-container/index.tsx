'use client';
import { useGlobalState } from '@/src/app/global-state';
import { LoadingToast } from '@/src/components/loading-toast';
import { VideoPreview } from '@/src/components/video-preview';
import { Warning } from '@/src/components/warning';
import { VideoData } from '@/src/types';
import { useSearchParams } from 'next/navigation';

const ProjectVideoPreviewContainer = () => {
  const searchParams = useSearchParams();
  const videoUrl = searchParams.get('videoUrl') || undefined;
  const gState = useGlobalState();
  const selectedProject = gState.selectedProject.get();
  const mediaData = gState.selectedVideo.get();

  if (!selectedProject || !videoUrl) {
    return null;
  }

  if ('status' in selectedProject && selectedProject.status === 'loading') {
    return <LoadingToast message="Loading video..." />;
  }

  if ('status' in selectedProject) {
    return <Warning message={selectedProject.detail.message} />;
  }

  const selectedProjectItem = selectedProject.project_items.find(
    (item) => item.video_url === videoUrl,
  );

  if (!selectedProject || !selectedProjectItem) {
    return null;
  }

  return (
    <VideoPreview
      projectItem={selectedProjectItem}
      mediaData={(mediaData as unknown as VideoData)?.media_data || {}}
    />
  );
};

export { ProjectVideoPreviewContainer };
