import {
  AugmentedProject,
  AugmentedProjectItemData,
  Project,
  ProjectItem,
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
    // TODO: fetch all saved configurations for the given project!!!   <<<<======= TODO!!
    videoConfigurations =
      (await Cache.get<Record<string, string>>(
        savedConfigsIDBStore,
        project.project_name,
      )) || {};

    console.log('videoConfigurations 1', videoConfigurations);

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

  console.log('videoConfigurations 2', videoConfigurations);
  const projectClone = { ...project, items: { ...project.items } };

  Object.entries(videoConfigurations).forEach(
    ([key]) =>
      (projectClone.items[key] = {
        ...projectClone.items[key],
        selected_configuration: videoConfigurations[key],
      } as AugmentedProjectItemData),
  );

  console.time('Augment project data');
  // Augment project items with selected configurations
  // const data = {
  //   ...project,
  //   items: Object.entries(project?.items || {}).reduce((acc, [key, item]) => {
  //     const videoId = getVideoId({
  //       projectName: project.project_name,
  //       videoUrl: item.video_url,
  //     });
  //     acc[key] = {
  //       ...item,
  //       selected_configuration: videoConfigurations?.[videoId] as
  //         | string
  //         | undefined,
  //     };

  //     return acc;
  //   }, {} as Record<string, ProjectItem & { selected_configuration?: string }>),
  // };

  console.timeEnd('Augment project data');

  return projectClone;
};

const saveSelectedConfigsToIDB = async ({
  videoUrls,
  projectName,
  selectedValue,
}: {
  videoUrls: string[];
  projectName: string;
  selectedValue: string;
}) =>
  Cache.set(
    savedConfigsIDBStore,
    projectName,
    videoUrls.reduce((acc, videoUrl) => {
      acc[videoUrl] = selectedValue;
      return acc;
    }, {} as Record<string, string>),
  );

const TransformProjectData = ({
  project,
  // selectedVideoUrlList,
  children,
}: {
  project: Project;
  // selectedVideoUrlList: string[];
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
    // Handle configuration change
    saveSelectedConfigsToIDB({
      videoUrls: videoIds,
      projectName: project.project_name,
      selectedValue,
    }).then(() => {
      // Update localStorage and re-augment project data
      console.log('Saved configurations to IDB');
    });
    augmentProject({ project, videoIds, selectedValue }).then(setData);
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
