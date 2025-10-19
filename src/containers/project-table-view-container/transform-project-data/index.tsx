import { getVideoId } from '@/src/components/project-table-view/helpers/getVideoId';
import { AugmentedProject, Project } from '@/src/types';
import { useEffect, useState } from 'react';
import { Cache } from '@/src/lib/indexeddb';

// const savedConfigsIDBKey = 'saved_video_configurations';
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

const handleConfigChange = async (videoIds: string[], selectedValue: string) =>
  Cache.batch(async () => {
    console.log('videoIds', videoIds);
    return videoIds.forEach(async (videoId) => {
      await Cache.set(savedConfigsIDBStore, videoId, selectedValue);
    });
  });

const TransformProjectData = ({
  project,
  selectedVideoUrlList,
  children,
}: {
  project: Project;
  selectedVideoUrlList: string[];
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
    const videoIds = selectedVideoUrlList?.length
      ? selectedVideoUrlList.map((videoUrl) =>
          getVideoId({
            projectName: project.project_name,
            videoUrl,
          }),
        )
      : [videoId];
    // Handle configuration change
    handleConfigChange(videoIds, selectedValue).then(() => {
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
