'use client';
import { useGlobalState } from '@/src/app/global-state';
import { ProjectTableView } from '@/src/components/project-table-view';
import { NoProjectSelected } from '@/src/components/no-project-selected';
import { MySuspense } from '@/src/components/my-suspense';
import { useDebounce } from '@/src/hooks/useDebounce';
import { ProjectItem } from '@/src/types/api';
import { useCallback } from 'react';
import { persistConfigurationChange } from './helper';

const ProjectTableViewContainer = () => {
  // Debounced setter for hovered video URL
  const setHoveredVideoUrl = useDebounce(
    useGlobalState((state) => state.setHoveredVideoUrl),
    200,
  );

  const setVideoUrlToDrawOnTheMap = useGlobalState(
    (state) => state.setVideoUrlToDrawOnTheMap,
  );
  const augmentedProject = useGlobalState((state) => state.augmentedProject);

  const handleSetHoveredVideoUrl = useCallback(
    (projectItem?: ProjectItem) => {
      setHoveredVideoUrl(projectItem?.video_url);
    },
    [setHoveredVideoUrl],
  );

  if (!augmentedProject) {
    return <NoProjectSelected />;
  }

  return (
    <MySuspense
      data={augmentedProject}
      loadingSize="large"
      loadingMessage="Loading project..."
      undefinedDataComponent="No project data available"
    >
      {(project) => (
        <ProjectTableView
          project={project}
          processingConfiguration={Object.values(
            project.processing_configurations || {},
          )}
          onMouseOver={handleSetHoveredVideoUrl}
          onConfigurationChange={persistConfigurationChange}
          onRowClick={(item) => setVideoUrlToDrawOnTheMap(item?.video_url)}
        />
      )}
    </MySuspense>
  );
};

export { ProjectTableViewContainer };
