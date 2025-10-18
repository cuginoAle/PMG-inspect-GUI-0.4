import { AugmentedProject, Project } from '@/src/types';
import { useEffect, useState } from 'react';

const augmentProject = (project: Project): AugmentedProject => {
  // Retrieve saved configurations from localStorage
  const savedVideoConfigurations: Record<string, string> = JSON.parse(
    window.localStorage.getItem('saved_video_configurations') || '{}',
  );

  // Augment project items with selected configurations
  return {
    ...project,
    items: Object.entries(project?.items || {}).reduce(
      (acc, [key, item]) => ({
        ...acc,
        [key]: {
          ...item,
          selected_configuration: savedVideoConfigurations[key],
        },
      }),
      {},
    ),
  };
};

const handleConfigChange = (videoUrl: string, selectedValue: string) => {
  // Save the selected configuration to localStorage
  const savedVideoConfigurations: Record<string, string> = JSON.parse(
    window.localStorage.getItem('saved_video_configurations') || '{}',
  );

  const newConfigurations = {
    ...savedVideoConfigurations,
    [videoUrl]: selectedValue,
  };

  window.localStorage.setItem(
    'saved_video_configurations',
    JSON.stringify(newConfigurations),
  );
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
    onConfigurationChange: (videoUrl: string, selectedValue: string) => void;
  }) => React.ReactNode;
}) => {
  const [data, setData] = useState<AugmentedProject>(augmentProject(project));

  useEffect(() => {
    // Re-augment project data when the project prop changes
    setData(augmentProject(project));
  }, [project]);

  const onConfigurationChange = (videoUrl: string, selectedValue: string) => {
    // Handle configuration change
    handleConfigChange(videoUrl, selectedValue);
    // Update localStorage and re-augment project data
    setData(augmentProject(project));
  };

  return (
    <>
      {children({
        augmentedProject: data,
        onConfigurationChange,
      })}
    </>
  );
};

export { TransformProjectData };
