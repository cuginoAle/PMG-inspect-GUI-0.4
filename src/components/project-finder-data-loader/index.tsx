'use client';
import { useGlobalState } from '@/src/app/global-state';
import { useFetchProject } from '@/src/app/hooks/useFetchProject';
import { useFetchProjectList } from '@/src/app/hooks/useFetchProjectList';

import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

const ProjectFinderDataLoader = () => {
  const { selectedProject, filesList } = useGlobalState();
  const sp = useSearchParams();
  const projectPath = sp.get('path');

  const project = useFetchProject(projectPath);
  const projects = useFetchProjectList();

  useEffect(() => {
    selectedProject.set(project);
    filesList.set(projects);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [project, projects]);

  return null;
};

export { ProjectFinderDataLoader };
