'use client';
import { useGlobalState } from '@/src/app/global-state';
import { useFetchProcessingConfiguration } from '@/src/app/hooks/useFetchProcessingConfiguration';
import { useFetchProject } from '@/src/app/hooks/useFetchProject';
import { useFetchProjectList } from '@/src/app/hooks/useFetchProjectList';
import { useFetchAnalysisResults } from '@/src/app/hooks/useFetchAnalysisResults';

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
  const setProcessingConfigurationsDefinition = useGlobalState(
    (state) => state.setProcessingConfigurationsDefinition,
  );
  const setAnalysisResults = useGlobalState(
    (state) => state.setAnalysisResults,
  );
  const setProjectStatus = useGlobalState((state) => state.setProjectStatus);

  const project = useFetchProject(projectPath);
  const projects = useFetchProjectList();
  const projectStatusData = useFetchProjectStatus(projectPath);
  const processingConfigurations = useFetchProcessingConfiguration();
  const analysisResultsData = useFetchAnalysisResults(projectPath as string);

  // Sync data to global state
  useEffect(
    () => setProjectStatus(projectStatusData),
    [projectStatusData, setProjectStatus],
  );
  useEffect(
    () => setAnalysisResults(analysisResultsData),
    [analysisResultsData, setAnalysisResults],
  );
  useEffect(() => setFilesList(projects), [setFilesList, projects]);
  useEffect(() => setSelectedProject(project), [project, setSelectedProject]);
  useEffect(
    () => setProcessingConfigurationsDefinition(processingConfigurations),
    [setProcessingConfigurationsDefinition, processingConfigurations],
  );

  return null;
};

export { DataLoader };
