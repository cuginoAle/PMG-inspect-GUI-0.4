import { getVideoId } from '@/src/components/project-table-view/helpers/getVideoId';
import { AugmentedProject, Project } from '@/src/types';
import { useEffect, useState } from 'react';
import { Cache } from '@/src/lib/indexeddb';

const savedConfigsIDBKey = 'saved_video_configurations';
const savedConfigsIDBStore = 'savedConfigs';

const augmentProject = async (project: Project): Promise<AugmentedProject> => {
  // Retrieve saved configurations from localStorage
  const savedVideoConfigurations = await Cache.get<Record<string, string>>(
    savedConfigsIDBStore,
    savedConfigsIDBKey,
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

const handleConfigChange = async (videoId: string, selectedValue: string) => {
  // Save the selected configuration to localStorage
  // Retrieve saved configurations from localStorage
  const savedVideoConfigurations = await Cache.get<Record<string, string>>(
    savedConfigsIDBStore,
    savedConfigsIDBKey,
  );

  const newConfigurations = {
    ...savedVideoConfigurations,
    [videoId]: selectedValue,
  };

  return Cache.set(savedConfigsIDBStore, savedConfigsIDBKey, newConfigurations);
};

const TransformProjectData = ({
  project,
  children,
}: {
  project: Project;
  children: ({
    augmentedProject,
    onConfigurationChange,
  }: {
    augmentedProject: AugmentedProject;
    onConfigurationChange: (videoId: string, selectedValue: string) => void;
  }) => React.ReactNode;
}) => {
  const [data, setData] = useState<AugmentedProject>();

  useEffect(() => {
    // Re-augment project data when the project prop changes
    augmentProject(project).then((data) => setData(data));
  }, [project]);

  const onConfigurationChange = (videoId: string, selectedValue: string) => {
    // Handle configuration change
    handleConfigChange(videoId, selectedValue).then(() => {
      // Update localStorage and re-augment project data
      augmentProject(project).then(setData);
    });
  };

  return data ? (
    <>
      {children({
        augmentedProject: data,
        onConfigurationChange,
      })}
    </>
  ) : null;
};

export { TransformProjectData };
