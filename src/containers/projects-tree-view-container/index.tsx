'use server';
import { LoadingToast, ProjectsTreeView, Warning } from '@/src/components';
import { fetchProjectList } from '@/src/lib/data/fetch-projectList';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

const ProjectsTreeViewContainer = () => {
  // const { filesList } = useGlobalState();
  // const searchParams = useSearchParams();
  // const headerList = await headers();

  // const url = new URLSearchParams(headerList.get('x-current-url') || '');
  // const pathname = searchParams.get('path') || '';
  const projects = fetchProjectList();

  // projects.then((projects) => filesList.set(projects));

  return (
    <ErrorBoundary
      fallback={<Warning message="Failed to load projects" title="Error" />}
      // fallbackRender={({ error }) => (
      //   <Warning
      //     message={`Failed to load projects: ${error.code} - ${error.detail}`}
      //     title="Error"
      //   />
      // )}
    >
      <Suspense
        fallback={
          <div className="center">
            <LoadingToast message="Loading projects..." />
          </div>
        }
      >
        <ProjectsTreeView
          filesPromise={projects}
          selectedPath={'test%2Fground_truthdata_heath_small.xlsx'}
        />
      </Suspense>
    </ErrorBoundary>
  );
};

export { ProjectsTreeViewContainer };
