import { useGlobalState } from '@/src/app/global-state';
import { ProjectsTreeView } from '@/src/components';
import { MySuspense } from '@/src/components';

const ProjectsTreeViewContainer = ({
  projectPath,
}: {
  projectPath?: string;
}) => {
  const filesList = useGlobalState((state) => state.filesList);

  console.log('filesList', filesList);

  return (
    <MySuspense
      data={filesList}
      errorTitle="Failed to load projects!"
      loadingMessage="Loading projects..."
      loadingSize="large"
    >
      {(data) => <ProjectsTreeView files={data} selectedPath={projectPath} />}
    </MySuspense>
  );
};

export { ProjectsTreeViewContainer };
