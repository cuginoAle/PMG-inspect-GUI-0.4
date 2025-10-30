'use client';
import { useGlobalState } from '@/src/app/global-state';
import { getProjectSavedConfigurations } from '@/src/helpers/get-project-saved-configuration';
import { getResponseIfSuccesful } from '@/src/helpers/get-response-if-successful';
import { AugmentedProject } from '@/src/types';
import { useEffect, useState } from 'react';
import { Cache } from '@/src/lib/indexeddb';

const DataTransformer = () => {
  const setAugmentedProject = useGlobalState(
    (state) => state.setAugmentedProject,
  );
  const projectStatusResponse = useGlobalState((state) => state.projectStatus);

  const selectedProjectResponse = useGlobalState(
    (state) => state.selectedProject,
  );
  const selectedProject = getResponseIfSuccesful(selectedProjectResponse);

  const [projectSavedConfigs, setProjectSavedConfigs] = useState<
    Record<string, string> | undefined
  >();

  // const [videosAiPciScores, setVideosAiPciScores] = useState<
  //   Record<string, Record<string, number | null>>
  // >({});

  useEffect(() => {
    // Load saved configurations from IndexedDB
    getProjectSavedConfigurations(selectedProject?.project_name).then(
      (config) => setProjectSavedConfigs(config),
    );
  }, [selectedProject?.project_name]);

  useEffect(() => {
    // Subscribe to changes in the IndexedDB cache for saved configurations
    const unsubscribe = Cache.onChange((store) => {
      if (store === 'savedConfigs') {
        getProjectSavedConfigurations(selectedProject?.project_name).then(
          (config) => setProjectSavedConfigs(config),
        );
      }
    });
    return () => {
      unsubscribe();
    };
  }, [selectedProject?.project_name]);

  useEffect(() => {
    if (selectedProjectResponse?.status !== 'ok') {
      setAugmentedProject(selectedProjectResponse);
    }

    const projectItems = Object.values(selectedProject?.items || {});

    if (projectItems.length === 0) {
      // early return if there are no items in the project
      return;
    }

    if (!projectSavedConfigs) {
      // If saved configurations are not loaded yet, set the augmented project without them
      setAugmentedProject({
        status: 'ok',
        detail: selectedProject as AugmentedProject,
      });
      return;
    }

    const augmentedProjectItems = projectItems.map((item) => {
      // Augment each item with its saved configuration if available
      const savedConfig = projectSavedConfigs[item.video_url];
      return {
        ...item,
        selected_configuration: savedConfig,
      };
    });

    // Construct the augmented project
    const augmentedProject = {
      ...selectedProject!,
      items: augmentedProjectItems.reduce((acc, item) => {
        acc[item.video_url] = item;
        return acc;
      }, {} as Record<string, (typeof augmentedProjectItems)[0]>),
    };

    const projectStatus = getResponseIfSuccesful(projectStatusResponse);

    console.log('augmentedProject', augmentedProject);
    setAugmentedProject({
      status: 'ok',
      detail: augmentedProject,
    });
  }, [
    selectedProject,
    projectSavedConfigs,
    setAugmentedProject,
    selectedProjectResponse,
    projectStatusResponse,
  ]);

  return null;
};

export { DataTransformer };
