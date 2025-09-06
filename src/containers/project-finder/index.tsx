'use client';
import { SplitView } from 'components/base/split-view';
import { ProjectsTreeView } from 'components/projects-tree-view';
import { ProjectContentView } from 'components/project-content-view';
import { useEffect, useState } from 'react';
import { Project } from '@/src/app/types';
import { Flex, Spinner } from '@radix-ui/themes';

const ProjectFinder = () => {
  const [selectedProject, setSelectedProject] = useState<Project | undefined>(
    undefined,
  );
  const [projects, setProjects] = useState<Project[]>([]);

  const [status, setStatus] = useState<'idle' | 'loading' | 'error' | 'ready'>(
    'idle',
  );
  useEffect(() => {
    const controller = new AbortController();
    setStatus('loading');
    fetch('/protected/api/projects', { signal: controller.signal })
      .then((r) => {
        if (!r.ok) throw new Error(r.statusText);
        return r.json();
      })
      .then((data) => {
        setProjects(data.contents);
        setStatus('ready');
      })
      .catch((e) => {
        if (e.name !== 'AbortError') setStatus('error');
      });
    return () => controller.abort();
  }, []);

  return (
    <SplitView
      left={
        status === 'loading' ? (
          <Flex gap={'2'} align="center">
            <Spinner /> Loading...
          </Flex>
        ) : status === 'error' ? (
          <div>Error loading projects</div>
        ) : (
          <ProjectsTreeView projects={projects} onSelect={setSelectedProject} />
        )
      }
      right={<ProjectContentView selectedProject={selectedProject} />}
    />
  );
};

export { ProjectFinder };
