'use client';
import { useGlobalState } from '@/src/app/global-state';
import { useFetchProcessingConfiguration } from '@/src/app/hooks/useFetchProcessingConfiguration';
import { useFetchProject } from '@/src/app/hooks/useFetchProject';
// import { useFetchProjectList } from '@/src/app/hooks/useFetchProjectList';
import { getResponseIfSuccesful } from '@/src/helpers/get-response-if-successful';

import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

const DataLoader = () => {
  const sp = useSearchParams();
  const projectPath = sp.get('path');

  const {
    selectedProject,
    // filesList,
    processingConfigurations,
    inferenceModelDictionary,
  } = useGlobalState();

  const selectedProjectSet = selectedProject.set;
  // const filesListSet = filesList.set;
  const updateProcessingConfigurations = processingConfigurations.set;
  const updateInferenceModelDictionary = inferenceModelDictionary.set;

  const project = useFetchProject(projectPath);
  // const projects = useFetchProjectList();
  const processingSettingsData = useFetchProcessingConfiguration();

  // useEffect(() => {
  //   filesListSet(projects);
  // }, [filesListSet, projects]);

  useEffect(() => {
    selectedProjectSet(project);
  }, [project]);

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
