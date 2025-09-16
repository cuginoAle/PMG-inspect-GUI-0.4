import { ProjectsTreeView } from '@/src/components/projects-tree-view';
import { fetchProjectList } from '@/src/lib/data/fetch-projectList';

const ProjectsTreeViewContainer = async ({
  projectPath,
}: {
  projectPath?: string;
}) => {
  const projects = await fetchProjectList().catch((error) => error);

  return <ProjectsTreeView files={projects} selectedPath={projectPath} />;
};

export { ProjectsTreeViewContainer };
