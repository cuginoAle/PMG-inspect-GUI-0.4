'use client';
import { useGlobalState } from '@/src/app/global-state';
import { useFetchProject } from '@/src/app/hooks/useFetchProject';
import { useFetchProjectList } from '@/src/app/hooks/useFetchProjectList';

import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { useFetchProjectStatus } from '@/src/app/hooks/useFetchProjectStatus';
import { getResponseIfSuccesful } from '@/src/helpers/get-response-if-successful';

const DataLoader = () => {
  const sp = useSearchParams();
  const projectPath = sp.get('path');

  // Global state setters
  const setSelectedProject = useGlobalState(
    (state) => state.setSelectedProject,
  );
  const setFilesList = useGlobalState((state) => state.setFilesList);
  const setProjectStatus = useGlobalState((state) => state.setProjectStatus);
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

  const projects = useFetchProjectList();
  const project = useFetchProject(projectPath);
  const projectStatus = useFetchProjectStatus(projectPath);

  const projectData = getResponseIfSuccesful(project);
  const projectStatusData = getResponseIfSuccesful(projectStatus);

  // const projectAiPciScores = useFetchProjectPciScores({
  //   project: projectData,
  //   processingConfiguration: Object.values(
  //     projectStatusData?.processing_configurations || {},
  //   ),
  // });

  // console.log('projectAiPciScores', projectAiPciScores);

  // Sync data to global state
  useEffect(
    () => setProjectStatus(projectStatus),
    [projectStatus, setProjectStatus],
  );

  useEffect(() => setFilesList(projects), [setFilesList, projects]);
  useEffect(() => setSelectedProject(project), [project, setSelectedProject]);

  return null;
};

export { DataLoader };
