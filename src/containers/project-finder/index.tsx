import { Suspense } from 'react';
import { ErrorBoundary } from './error-boundary';

import { Client } from './client';
import { Flex, Spinner, Text } from '@radix-ui/themes';
import { ProjectsErrorFallback } from './error-fallback';
import { fetchProjects } from '@/src/lib/data/fetch-projects';
import { FetchError } from '@/src/types';

// Inner async component that will suspend while fetching.
const ProjectsPanel = async () => {
  try {
    const projects = await fetchProjects();
    return <Client initialProjects={projects} />;
  } catch (error) {
    const errorObj = error as FetchError;
    return <ProjectsErrorFallback message={errorObj.status.toString()} />;
  }
};

const ProjectFinder = () => (
  <ErrorBoundary>
    <Suspense
      fallback={
        <div className="center">
          <Flex
            gap={'4'}
            align={'center'}
            style={{
              padding: 'var(--space-4) var(--space-6)',
              backgroundColor: 'var(--black-a7)',
              borderRadius: 'var(--space-8)',
            }}
          >
            <Spinner size={'3'} />
            <Text size={'5'}>Loading projects…</Text>
          </Flex>
        </div>
      }
    >
      {/* Suspends until projects fetched */}
      <ProjectsPanel />
    </Suspense>
  </ErrorBoundary>
);

export { ProjectFinder };
