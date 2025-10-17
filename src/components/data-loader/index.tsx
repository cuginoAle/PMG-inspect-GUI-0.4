'use client';
import { useGlobalState } from '@/src/app/global-state';
import { useFetchProcessingConfiguration } from '@/src/app/hooks/useFetchProcessingConfiguration';
import { useFetchProject } from '@/src/app/hooks/useFetchProject';
import { useFetchProjectList } from '@/src/app/hooks/useFetchProjectList';
import { useFetchAnalysisResults } from '@/src/app/hooks/useFetchAnalysisResults';
import { getResponseIfSuccesful } from '@/src/helpers/get-response-if-successful';

import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { useFetchProjectStatus } from '@/src/app/hooks/useFetchProjectStatus';

const DataLoader = () => {
  const sp = useSearchParams();
  const projectPath = sp.get('path');

  const {
    selectedProject,
    filesList,
    processingConfigurations,
    inferenceModelDictionary,
    analysisResults,
    projectStatus,
  } = useGlobalState();

  const selectedProjectSet = selectedProject.set;
  const filesListSet = filesList.set;
  const updateProcessingConfigurations = processingConfigurations.set;
  const updateInferenceModelDictionary = inferenceModelDictionary.set;
  const updateAnalysisResults = analysisResults.set;

  const project = useFetchProject(projectPath);
  const projects = useFetchProjectList();
  const projectStatusData = useFetchProjectStatus(projectPath);
  const updateProjectStatus = projectStatus.set;
  const processingSettingsData = useFetchProcessingConfiguration();
  const analysisResultsData = useFetchAnalysisResults(projectPath as string);

  useEffect(() => {
    updateProjectStatus(getResponseIfSuccesful(projectStatusData));
  }, [projectStatusData, updateProjectStatus]);

  useEffect(() => {
    updateAnalysisResults(analysisResultsData);
  }, [analysisResultsData, updateAnalysisResults]);

  useEffect(() => {
    filesListSet(projects);
  }, [filesListSet, projects]);

  useEffect(() => {
    selectedProjectSet(project);
  }, [project, selectedProjectSet]);

  useEffect(() => {
    const processingConfigurationsValue = getResponseIfSuccesful(
      processingSettingsData,
    );

    updateInferenceModelDictionary(
      processingConfigurationsValue?.inference_model_ids,
    );

    updateProcessingConfigurations(processingSettingsData);
  }, [
    updateProcessingConfigurations,
    processingSettingsData,
    updateInferenceModelDictionary,
  ]);

  return null;
};

export { DataLoader };
