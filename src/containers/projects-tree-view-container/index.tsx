import { useGlobalState } from '@/src/app/global-state';
import { Warning, ProjectsTreeView } from '@/src/components';

const ProjectsTreeViewContainer = ({
  projectPath,
}: {
  projectPath?: string;
}) => {
  const { filesList } = useGlobalState();
  const projects = filesList.get();

  if (!projects) {
    return null;
  }

  if (projects?.status === 'loading') {
    return <div>Loading...</div>;
  }

  if (projects?.status === 'error') {
    return (
      <div className="center">
        <Warning message={projects.detail.message} />
      </div>
    );
  }

  return (
    <ProjectsTreeView files={projects.detail} selectedPath={projectPath} />
  );
};

export { ProjectsTreeViewContainer };
