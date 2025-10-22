import { getVideoId } from '@/src/components/project-table-view/helpers/getVideoId';
import { AugmentedProject, Project, ProjectItem } from '@/src/types';
import { useEffect, useState } from 'react';
import { Cache } from '@/src/lib/indexeddb';
import { useGlobalState } from '@/src/app/global-state';
import { useDebounce } from '@/src/hooks/useDebounce';

const savedConfigsIDBStore = 'savedConfigs';

const augmentProject = async (project: Project): Promise<AugmentedProject> => {
  // Retrieve saved configurations from localStorage
  const savedVideoConfigurations = await Cache.getAll<Record<string, string>>(
    savedConfigsIDBStore,
  );

  // Augment project items with selected configurations
  return {
    ...project,
    items: Object.entries(project?.items || {}).reduce((acc, [key, item]) => {
      const videoId = getVideoId({
        projectName: project.project_name,
        videoUrl: item.video_url,
      });
      return {
        ...acc,
        [key]: {
          ...item,
          selected_configuration: savedVideoConfigurations?.[videoId],
        },
      };
    }, {}),
  };
};

const saveSelectedConfigsToIDB = async (
  videoIds: string[],
  selectedValue: string,
) =>
  Cache.batch(async () => {
    return videoIds.forEach(async (videoId) => {
      await Cache.set(savedConfigsIDBStore, videoId, selectedValue);
    });
  });

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
    augmentProject(project).then((data) => setData(data));
  }, [project]);

  const persistConfigurationChange = (
    videoIds: string[],
    selectedValue: string,
  ) => {
    // Handle configuration change
    saveSelectedConfigsToIDB(videoIds, selectedValue).then(() => {
      // Update localStorage and re-augment project data
      augmentProject(project).then(setData);
      console.log('Saved configurations to IDB');
    });
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
