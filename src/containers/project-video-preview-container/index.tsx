'use client';
import { useGlobalState } from '@/src/app/global-state';
import { MySuspense } from '@/src/components';
import { VideoPreview } from '@/src/components/video-preview';

import { useSearchParams } from 'next/navigation';
import React from 'react';

const ProjectVideoPreviewContainer = () => {
  const searchParams = useSearchParams();
  const videoUrl = searchParams.get('videoUrl') || undefined;
  const selectedProject = useGlobalState((state) => state.selectedProject);

  if (!selectedProject || !videoUrl) {
    return null;
  }

  return (
    <MySuspense data={selectedProject}>
      {(data) => {
        const selectedProjectItem = data.items?.[videoUrl];
        return <VideoPreview projectItem={selectedProjectItem} delay={1000} />;
      }}
    </MySuspense>
  );
};

export { ProjectVideoPreviewContainer };
