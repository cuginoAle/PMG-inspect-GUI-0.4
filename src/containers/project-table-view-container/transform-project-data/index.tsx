import {
  AugmentedProject,
  AugmentedProjectItemData,
  Project,
  ProjectItem,
  ProjectStatus,
} from '@/src/types';
import { useEffect, useState } from 'react';
import { Cache } from '@/src/lib/indexeddb';
import { useGlobalState } from '@/src/app/global-state';
import { useDebounce } from '@/src/hooks/useDebounce';

const savedConfigsIDBStore = 'savedConfigs';

const augmentProject = async ({
  project,
  videoIds,
  selectedValue,
}: {
  project: Project;
  videoIds?: string[];
  selectedValue?: string;
}): Promise<AugmentedProject> => {
  let videoConfigurations: Record<string, string> = {};

  if (!videoIds) {
    // Retrieve saved configurations from localStorage
    videoConfigurations = await loadProjectSavedConfigurations(
      project.project_name,
    );

    if (Object.keys(videoConfigurations).length === 0) {
      // No saved configurations, return the project as is
      return project as AugmentedProject;
    }
  } else {
    // Update saved configurations with the videoIds and selectedValue
    videoIds.forEach((videoId) => {
      videoConfigurations[videoId] = selectedValue!;
    });
  }

  const projectClone = { ...project, items: { ...project.items } };

  Object.entries(videoConfigurations).forEach(
    ([key]) =>
      (projectClone.items[key] = {
        ...projectClone.items[key],
        selected_configuration: videoConfigurations[key],
      } as AugmentedProjectItemData),
  );

  return projectClone;
};

const loadProjectSavedConfigurations = async (
  projectName: string,
): Promise<Record<string, string>> => {
  const savedConfigs =
    (await Cache.get<Record<string, string>>(
      savedConfigsIDBStore,
      projectName,
    )) || {};
  return savedConfigs;
};

const TransformProjectData = ({
  project,
  children,
  defaultConfiguration,
}: {
  project: Project;
  defaultConfiguration: ProjectStatus['processing_configurations'];
  children: ({
    augmentedProject,
    persistConfigurationChange,
  }: {
    augmentedProject: AugmentedProject;
    persistConfigurationChange: (
      videoIds: string[],
      selectedValue: string,
    ) => void;
    handleSetHoveredVideoUrl: (projectItem?: ProjectItem) => void;
  }) => React.ReactNode;
}) => {
  const defaultProcessingConfigurationName = defaultConfiguration
    ? Object.values(defaultConfiguration)[0]?.processing_configuration_name
    : undefined;

  const [data, setData] = useState<AugmentedProject>();
  const setHoveredVideoUrl = useDebounce(
    useGlobalState((state) => state.setHoveredVideoUrl),
    200,
  );

  const handleSetHoveredVideoUrl = (projectItem?: ProjectItem) => {
    setHoveredVideoUrl(projectItem?.video_url);
  };

  useEffect(() => {
    // Re-augment project data when the project prop changes
    augmentProject({ project }).then((data) => setData(data));
  }, [project]);

  const persistConfigurationChange = (
    videoIds: string[],
    selectedValue: string,
  ) => {
    // Read the project data and save the selected configurations to IndexedDB
    loadProjectSavedConfigurations(project.project_name).then(
      (existingConfigs) => {
        const updatedConfigs = { ...existingConfigs };
        videoIds.forEach((videoId) => {
          // If the selected value is the default, remove it from saved configs
          if (selectedValue === defaultProcessingConfigurationName) {
            delete updatedConfigs[videoId];
          } else {
            updatedConfigs[videoId] = selectedValue;
          }
        });

        augmentProject({
          project: data || project,
          videoIds,
          selectedValue,
        }).then(setData);
        Cache.set(savedConfigsIDBStore, project.project_name, updatedConfigs);
      },
    );
  };

  return data ? (
    <>
      {children({
        augmentedProject: data,
        persistConfigurationChange,
        handleSetHoveredVideoUrl,
      })}
    </>
  ) : null;
};

export { TransformProjectData };
