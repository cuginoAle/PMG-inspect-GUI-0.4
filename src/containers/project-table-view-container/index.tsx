'use client';
import { useGlobalState } from '@/src/app/global-state';
import { ProjectTableView } from '@/src/components/project-table-view';
import { NoProjectSelected } from '@/src/components/no-project-selected';
import { ProjectItem } from '@/src/types';
import { MySuspense } from '@/src/components/my-suspense';
import { useState } from 'react';
import { TransformProjectData } from './transform-project-data';

const ProjectTableViewContainer = () => {
  const selectedProject = useGlobalState((state) => state.selectedProject);
  const [selectedVideoUrlList, setSelectedVideoUrlList] = useState<string[]>(
    [],
  );

  console.log('selectedVideoUrlList', selectedVideoUrlList);

  const projectStatus = useGlobalState((state) => state.projectStatus);

  const setHoveredVideoUrl = useGlobalState(
    (state) => state.setHoveredVideoUrl,
  );

  const handleSetHoveredVideoUrl = (projectItem?: ProjectItem) => {
    setHoveredVideoUrl(projectItem?.video_url);
  };

  if (!selectedProject) {
    return <NoProjectSelected />;
  }

  return (
    <MySuspense
      data={projectStatus}
      loadingMessage="Loading project status..."
      loadingSize="large"
      errorTitle="Project status"
      undefinedDataComponent="No project status available"
    >
      {(status) => (
        <MySuspense
          data={selectedProject}
          loadingSize="large"
          loadingMessage="Loading project..."
          undefinedDataComponent="No project data available"
        >
          {(project) => (
            <TransformProjectData project={project}>
              {({ augmentedProject, onConfigurationChange }) => (
                <ProjectTableView
                  processingConfiguration={Object.values(
                    status.processing_configurations || {},
                  )}
                  project={augmentedProject}
                  onMouseOver={handleSetHoveredVideoUrl}
                  onRowSelected={setSelectedVideoUrlList}
                  onConfigurationChange={onConfigurationChange}
                />
              )}
            </TransformProjectData>
          )}
        </MySuspense>
      )}
    </MySuspense>
  );
};

export { ProjectTableViewContainer };
