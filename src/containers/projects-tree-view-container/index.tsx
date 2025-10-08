import { useGlobalState } from '@/src/app/global-state';
import { ProjectsTreeView } from '@/src/components';
import { MySuspense } from '@/src/components';

const ProjectsTreeViewContainer = ({
  projectPath,
}: {
  projectPath?: string;
}) => {
  const { filesList } = useGlobalState();
  const projects = filesList.get();

  return (
    <MySuspense
      data={projects}
      errorTitle="Failed to load projects!"
      loadingMessage="Loading projects..."
      loadingSize="large"
    >
      {(data) => <ProjectsTreeView files={data} selectedPath={projectPath} />}
    </MySuspense>
  );
};

export { ProjectsTreeViewContainer };
