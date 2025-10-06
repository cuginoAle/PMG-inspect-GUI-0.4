import { LoadingToast, ProjectsTreeView } from '@/src/components';
import { fetchProjectList } from '@/src/lib/data/fetch-projectList';
import { Suspense } from 'react';

const ProjectsTreeViewContainer = async () => {
  const projects = fetchProjectList();

  return (
    <Suspense
      fallback={
        <div className="center">
          <LoadingToast message="Loading projects..." />
        </div>
      }
    >
      <ProjectsTreeView filesPromise={projects} />
    </Suspense>
  );
};

export { ProjectsTreeViewContainer };
