'use client';
import { useGlobalState } from '@/src/app/global-state';
import { MySuspense } from '@/src/components';
import { VideoPreview } from '@/src/components/video-preview';

import { useSearchParams } from 'next/navigation';
import React from 'react';

const ProjectVideoPreviewContainer = () => {
  const searchParams = useSearchParams();
  const videoUrl = searchParams.get('videoUrl') || undefined;
  const gState = useGlobalState();
  const selectedProject = gState.selectedProject.get();

  if (!selectedProject || !videoUrl) {
    return null;
  }

  // if (selectedProject.status === 'loading') {
  //   return <LoadingToast message="Loading video..." />;
  // }

  // if (selectedProject.status === 'error') {
  //   return <Warning message={selectedProject.detail.message} />;
  // }

  // const selectedVideo = getResponseIfSuccesful(selectedProject);

  // const selectedProjectItem = selectedVideo?.project_items.find(
  //   (item) => item.video_url === videoUrl,
  // );

  // if (!selectedProject || !selectedProjectItem) {
  //   return null;
  // }

  return (
    <MySuspense data={selectedProject}>
      {(data) => {
        const selectedProjectItem = data.items?.[videoUrl];
        return <VideoPreview projectItem={selectedProjectItem} />;
      }}
    </MySuspense>
  );
};

export { ProjectVideoPreviewContainer };
