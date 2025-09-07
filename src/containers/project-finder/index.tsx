import { Suspense } from 'react';
import { headers } from 'next/headers';
import Client from './client';
import { Flex, Spinner, Text } from '@radix-ui/themes';

async function fetchProjects() {
  const h = await headers();
  const host = h.get('x-forwarded-host') || h.get('host');
  if (!host) throw new Error('Unable to resolve host for internal fetch');
  const proto = h.get('x-forwarded-proto') || 'http';
  const url = `${proto}://${host}/protected/api/projects`;
  const auth = h.get('authorization');
  const res = await fetch(url, {
    cache: 'no-store',
    headers: auth ? { authorization: auth } : undefined,
  });
  if (!res.ok) throw new Error(`Failed to load projects (${res.status})`);
  const data = await res.json();
  return data.contents ?? [];
}

// Inner async component that will suspend while fetching.
const ProjectsPanel = async () => {
  const projects = await fetchProjects();
  return <Client initialProjects={projects} />;
};

const ProjectFinder = () => (
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
);

export { ProjectFinder };
