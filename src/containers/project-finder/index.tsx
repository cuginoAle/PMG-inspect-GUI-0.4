import { Suspense } from 'react';
import { ErrorBoundary } from './error-boundary';

import { Client } from './client';

import { fetchProjectList } from '@/src/lib/data/fetch-projectList';
import { FetchError } from '@/src/types';
import { LoadingToast } from '@/src/components/loading-toast';
import { Warning } from '@/src/components/warning';

// Inner async component that will suspend while fetching.
const ProjectsPanel = async () => {
  try {
    const projects = await fetchProjectList();
    return <Client initialProjects={projects} />;
  } catch (error) {
    const errorObj = error as FetchError;
    return (
      <Warning
        title="Something went wrong loading projects"
        message={errorObj.status.toString()}
      />
    );
  }
};

const ProjectFinder = () => (
  <ErrorBoundary>
    <Suspense
      fallback={
        <div className="center">
          <LoadingToast message="Loading projects..." />
        </div>
      }
    >
      <ProjectsPanel />
    </Suspense>
  </ErrorBoundary>
);

export { ProjectFinder };
