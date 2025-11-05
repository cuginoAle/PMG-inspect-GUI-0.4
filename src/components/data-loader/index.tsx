'use client';
import { useGlobalState } from '@/src/app/global-state';
import { useFetchProjectDetails } from '@/src/hooks/fetchers/useFetchProjectDetails';
import { useFetchProjectList } from '@/src/hooks/fetchers/useFetchProjectList';

import { useSearchParams } from 'next/navigation';
import { useEffect, useMemo } from 'react';
import { useFetchProjectStatus } from '@/src/hooks/fetchers/useFetchProjectStatus';
import { getResponseIfSuccesful } from '@/src/helpers/get-response-if-successful';
import { useFetchProjectPciScores } from '@/src/hooks/fetchers/useFetchProjectPciScores';
import { useFetchBaseConfigurations } from '@/src/hooks/fetchers/useBaseConfigurations';

const DataLoader = () => {
  const sp = useSearchParams();
  const projectPath = sp.get('path');

  // Global state setters
  const setBaseConfigurations = useGlobalState(
    (state) => state.setBaseProcessingConfigurations,
  );
  const setAiPciScores = useGlobalState((state) => state.setAiPciScores);
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
  const projectData = getResponseIfSuccesful(project);
  const baseConfigurations = useFetchBaseConfigurations();

  const projectStatus = useFetchProjectStatus(projectPath);
  const projectStatusData = getResponseIfSuccesful(projectStatus);

  // Derive processing configurations from project status
  const processingConfigurations = useMemo(() => {
    return projectStatusData?.processing_configurations
      ? Object.values(projectStatusData.processing_configurations)
      : [];
  }, [projectStatusData]);

  const pciScores = useFetchProjectPciScores({
    project: projectData,
    processingConfigurations,
  });
  useEffect(() => {
    setAiPciScores(pciScores);
  }, [pciScores, setAiPciScores]);

  // Sync data to global state
  useEffect(() => setFilesList(projects), [setFilesList, projects]);
  useEffect(() => setSelectedProject(project), [project, setSelectedProject]);
  useEffect(
    () => setProjectStatus(projectStatus),
    [projectStatus, setProjectStatus],
  );
  useEffect(() => {
    setBaseConfigurations(baseConfigurations);
  }, [baseConfigurations, setBaseConfigurations]);

  return null;
};

export { DataLoader };
