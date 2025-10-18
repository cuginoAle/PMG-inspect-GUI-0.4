'use client';
import { useGlobalState } from '@/src/app/global-state';
import { ProjectTableView } from '@/src/components/project-table-view';
import { NoProjectSelected } from '@/src/components/no-project-selected';
import {
  AugmentedProject,
  Project,
  ProjectItem,
  ProjectStatus,
} from '@/src/types';
import { useCallback } from 'react';
import { MySuspense } from '@/src/components/my-suspense';

const augmentProjectsWithStatus = (
  project: Project,
  status?: ProjectStatus,
): AugmentedProject => {
  return {
    ...project,
    items: Object.entries(project?.items || {}).reduce(
      (acc, [key, item]) => ({
        ...acc,
        [key]: {
          ...item,
          configuration: status?.processing_configurations,
        },
      }),
      {},
    ),
  };
};

const ProjectTableViewContainer = () => {
  const hoveredVideoUrl = useGlobalState((state) => state.hoveredVideoUrl);
  const selectedProject = useGlobalState((state) => state.selectedProject);
  const selectedInferenceSettingId = useGlobalState(
    (state) => state.selectedInferenceSettingId,
  );
  const selectedVideoUrlList = useGlobalState(
    (state) => state.selectedVideoUrlList,
  );
  const projectStatus = useGlobalState((state) => state.projectStatus);

  const setHoveredVideoUrl = useGlobalState(
    (state) => state.setHoveredVideoUrl,
  );
  const mergeSelectedVideoUrlList = useGlobalState(
    (state) => state.mergeSelectedVideoUrlList,
  );

  const handleSetHoveredVideoUrl = (projectItem?: ProjectItem) => {
    setHoveredVideoUrl(projectItem?.video_url);
  };

  const onSelectedVideoChange = useCallback(
    (selectedItemIdList: string[] | []) => {
      if (!selectedInferenceSettingId) {
        console.log('No inference setting selected!!!');
        return;
      }
      mergeSelectedVideoUrlList({
        [selectedInferenceSettingId]: selectedItemIdList,
      });
    },
    [selectedInferenceSettingId, mergeSelectedVideoUrlList],
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
    >
      {(status) => {
        return (
          <MySuspense
            data={selectedProject}
            loadingSize="large"
            loadingMessage="Loading project..."
          >
            {(data) => (
              <ProjectTableView
                project={augmentProjectsWithStatus(data, status)}
                onMouseOver={handleSetHoveredVideoUrl}
                onChange={onSelectedVideoChange}
              />
            )}
          </MySuspense>
        );
      }}
    </MySuspense>
  );
};

export { ProjectTableViewContainer };
