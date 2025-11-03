'use client';
import { useGlobalState } from '@/src/app/global-state';
import { ProjectTableView } from '@/src/components/project-table-view';
import { NoProjectSelected } from '@/src/components/no-project-selected';
import { MySuspense } from '@/src/components/my-suspense';
import { getProjectSavedConfigurations } from '@/src/helpers/get-project-saved-configuration';
import { Cache } from '@/src/lib/indexeddb';
import { useDebounce } from '@/src/hooks/useDebounce';
import { ProjectItem } from '@/src/types/api';
import { useCallback } from 'react';

const persistConfigurationChange = async ({
  projectName,
  itemIds,
  configurationId,
}: {
  projectName: string;
  itemIds: string[];
  configurationId: string | undefined;
}) => {
  // Persist the configuration change to IndexedDB

  // Load existing saved configurations
  const savedConfigs = (await getProjectSavedConfigurations(projectName)) || {};

  itemIds.forEach((itemId) => {
    // Update the configuration for each item
    if (configurationId === undefined) {
      delete savedConfigs[itemId];
    } else {
      savedConfigs[itemId] = configurationId;
    }
  });

  // Save back to IndexedDB
  await Cache.set('savedConfigs', projectName, savedConfigs);

  console.log(
    `Persisted configuration change for item ${itemIds} to ${configurationId}`,
  );
};

const ProjectTableViewContainer = () => {
  // Debounced setter for hovered video URL
  const setHoveredVideoUrl = useDebounce(
    useGlobalState((state) => state.setHoveredVideoUrl),
    200,
  );

  const setVideoUrlToDrawOnTheMap = useGlobalState(
    (state) => state.setVideoUrlToDrawOnTheMap,
  );
  const projectStatus = useGlobalState((state) => state.projectStatus);
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
      data={projectStatus}
      loadingMessage="Loading project status..."
      loadingSize="large"
      errorTitle="Project status"
      undefinedDataComponent="No project status available"
    >
      {(status) => (
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
                status.processing_configurations || {},
              )}
              onMouseOver={handleSetHoveredVideoUrl}
              onConfigurationChange={persistConfigurationChange}
              onRowClick={(item) => setVideoUrlToDrawOnTheMap(item?.video_url)}
            />
          )}
        </MySuspense>
      )}
    </MySuspense>
  );
};

export { ProjectTableViewContainer };
