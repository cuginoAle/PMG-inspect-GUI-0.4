import { NoProjectSelected, ProjectContentView } from '@/src/components';
import { MainContentPane } from '@/src/components/project-content-view/main-content';
import { fetchProjectDetails } from '@/src/lib/data/fetch-project-details';
import { PageSearchParams } from '@/src/types';

const ProjectContentContainer = async ({
  searchParams,
}: {
  searchParams: PageSearchParams;
}) => {
  const { path: pathSP } = await searchParams;
  const projectPath = Array.isArray(pathSP) ? pathSP[0] : pathSP || undefined;

  if (!projectPath) {
    return <NoProjectSelected />;
  }

  const project = fetchProjectDetails(projectPath);

  //TODO: pass project to MainContentPane when ready

  return <ProjectContentView mainContent={<MainContentPane />} />;
};

export { ProjectContentContainer };
