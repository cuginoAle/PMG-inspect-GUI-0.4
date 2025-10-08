'use client';
import { useGlobalState } from '@/src/app/global-state';
import { ProjectTableView } from '@/src/components/project-table-view';
import { NoProjectSelected } from '@/src/components/no-project-selected';
import { ProjectItem } from '@/src/types';
import { useCallback } from 'react';
import { MySuspense } from '@/src/components/my-suspense';

const ProjectTableViewContainer = () => {
  const {
    hoveredVideoUrl,
    selectedProject,
    selectedInferenceSettingId,
    selectedVideoUrlList,
  } = useGlobalState();

  const updateSelectedVideoUrlList = selectedVideoUrlList.merge;

  const setHoveredVideoUrl = (projectItem?: ProjectItem) => {
    hoveredVideoUrl.set(projectItem?.video_url);
  };

  const project = selectedProject.get();

  const onSelectedVideoChange = useCallback(
    (selectedItemIdList: string[] | []) => {
      const selectedInference = selectedInferenceSettingId.get();
      if (!selectedInference) {
        console.log('No inference setting selected!!!');
        return;
      }
      updateSelectedVideoUrlList({
        [selectedInference]: selectedItemIdList,
      });
    },
    [selectedInferenceSettingId, updateSelectedVideoUrlList],
  );

  if (!project) {
    return <NoProjectSelected />;
  }

  return (
    <MySuspense
      data={project}
      loadingSize="large"
      loadingMessage="Loading project..."
    >
      {(data) => (
        <ProjectTableView
          project={data}
          onMouseOver={setHoveredVideoUrl}
          onChange={onSelectedVideoChange}
        />
      )}
    </MySuspense>
  );
};

export { ProjectTableViewContainer };
