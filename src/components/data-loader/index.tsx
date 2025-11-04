'use client';
import { useGlobalState } from '@/src/app/global-state';
import { useFetchProjectDetails } from '@/src/hooks/fetchers/useFetchProjectDetails';
import { useFetchProjectList } from '@/src/hooks/fetchers/useFetchProjectList';

import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { useFetchProjectStatus } from '@/src/hooks/fetchers/useFetchProjectStatus';

const DataLoader = () => {
  const sp = useSearchParams();
  const projectPath = sp.get('path');

  // Global state setters
  const setFilesList = useGlobalState((state) => state.setFilesList);
  const setProjectStatus = useGlobalState((state) => state.setProjectStatus);
  const setSelectedProject = useGlobalState(
    (state) => state.setSelectedProject,
  );
  const setUserPreferences = useGlobalState(
    (state) => state.setUserPreferences,
  );

  // Load user preferences from localStorage on mount
  useEffect(() => {
    const prefsString = window.localStorage.getItem('userPreferences');
    if (prefsString) {
      try {
        const prefs = JSON.parse(prefsString);
        setUserPreferences(prefs);
      } catch (e) {
        console.error('Failed to parse user preferences from localStorage', e);
      }
    }
  }, [setUserPreferences]);

  // Fetch project list, selected project, and project status
  const projects = useFetchProjectList();
  const project = useFetchProjectDetails(projectPath);
  const projectStatus = useFetchProjectStatus(projectPath);

  // Sync data to global state
  useEffect(() => setFilesList(projects), [setFilesList, projects]);
  useEffect(() => setSelectedProject(project), [project, setSelectedProject]);
  useEffect(
    () => setProjectStatus(projectStatus),
    [projectStatus, setProjectStatus],
  );

  return null;
};

export { DataLoader };
