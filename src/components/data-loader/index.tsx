'use client';
import { useGlobalState } from '@/src/app/global-state';
import { useFetchProject } from '@/src/app/hooks/useFetchProject';
import { useFetchProjectList } from '@/src/app/hooks/useFetchProjectList';

import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { useFetchProjectStatus } from '@/src/app/hooks/useFetchProjectStatus';

const DataLoader = () => {
  const sp = useSearchParams();
  const projectPath = sp.get('path');

  const setSelectedProject = useGlobalState(
    (state) => state.setSelectedProject,
  );
  const setFilesList = useGlobalState((state) => state.setFilesList);

  const setProjectStatus = useGlobalState((state) => state.setProjectStatus);

  const project = useFetchProject(projectPath);
  const projects = useFetchProjectList();
  const projectStatusData = useFetchProjectStatus(projectPath);

  // Sync data to global state
  useEffect(
    () => setProjectStatus(projectStatusData),
    [projectStatusData, setProjectStatus],
  );

  useEffect(() => setFilesList(projects), [setFilesList, projects]);
  useEffect(() => setSelectedProject(project), [project, setSelectedProject]);

  return null;
};

export { DataLoader };
