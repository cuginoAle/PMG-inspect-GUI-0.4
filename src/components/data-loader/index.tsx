'use client';
import { useGlobalState } from '@/src/app/global-state';
import { useFetchProject } from '@/src/app/hooks/useFetchProject';
import { useFetchProjectList } from '@/src/app/hooks/useFetchProjectList';

import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

const DataLoader = () => {
  const { selectedProject, filesList, inferenceSettings } = useGlobalState();
  const updateInferenceSettings = inferenceSettings.set;
  const sp = useSearchParams();
  const projectPath = sp.get('path');

  const project = useFetchProject(projectPath);
  const projects = useFetchProjectList();

  useEffect(() => {
    selectedProject.set(project);
    filesList.set(projects);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [project, projects]);

  useEffect(() => {
    updateInferenceSettings({
      setting_1: { label: 'Setting 1', parameters: {} },
      setting_2: { label: 'Setting 2', parameters: {} },
    });
  }, [updateInferenceSettings]);

  return null;
};

export { DataLoader };
