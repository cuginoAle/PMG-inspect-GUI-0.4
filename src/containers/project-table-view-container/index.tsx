'use client';
import { useGlobalState } from '@/src/app/global-state';
import { ProjectTableView } from '@/src/components/project-table-view';
import { NoProjectSelected } from '@/src/components/no-project-selected';
import { MySuspense } from '@/src/components/my-suspense';
import { useState } from 'react';
import { TransformProjectData } from './transform-project-data';

const ProjectTableViewContainer = () => {
  const setVideoUrlToDrawOnTheMap = useGlobalState(
    (state) => state.setVideoUrlToDrawOnTheMap,
  );
  const selectedProject = useGlobalState((state) => state.selectedProject);
  const projectStatus = useGlobalState((state) => state.projectStatus);
  const [selectedVideoUrlList, setSelectedVideoUrlList] = useState<string[]>(
    [],
  );

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
            <TransformProjectData
              project={project}
              selectedVideoUrlList={selectedVideoUrlList}
            >
              {({
                augmentedProject,
                onConfigurationChange,
                handleSetHoveredVideoUrl,
              }) => {
                return (
                  <ProjectTableView
                    processingConfiguration={Object.values(
                      status.processing_configurations || {},
                    )}
                    project={augmentedProject}
                    onMouseOver={handleSetHoveredVideoUrl}
                    onRowCheckbox={setSelectedVideoUrlList}
                    onConfigurationChange={onConfigurationChange}
                    onRowClick={(item) =>
                      setVideoUrlToDrawOnTheMap(item?.video_url)
                    }
                  />
                );
              }}
            </TransformProjectData>
          )}
        </MySuspense>
      )}
    </MySuspense>
  );
};

export { ProjectTableViewContainer };
