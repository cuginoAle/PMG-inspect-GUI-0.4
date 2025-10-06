import { LoadingToast, ProjectsTreeView } from '@/src/components';
import { fetchProjectList } from '@/src/lib/data/fetch-projectList';
import { PageSearchParams } from '@/src/types';
import { Suspense } from 'react';

const ProjectsTreeViewContainer = async ({
  searchParams,
}: {
  searchParams: PageSearchParams;
}) => {
  const { path: pathSP } = await searchParams;
  const projectPath = Array.isArray(pathSP) ? pathSP[0] : pathSP || undefined;
  const projects = fetchProjectList();

  return (
    <Suspense
      fallback={
        <div className="center">
          <LoadingToast message="Loading projects..." />
        </div>
      }
    >
      <ProjectsTreeView filesPromise={projects} selectedPath={projectPath} />
    </Suspense>
  );
};

export { ProjectsTreeViewContainer };
