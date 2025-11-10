'use client';
import { useGlobalState } from '@/src/app/global-state';
import { getProjectSavedConfigurations } from '@/src/helpers/get-project-saved-configuration';
import { getResponseIfSuccesful } from '@/src/helpers/get-response-if-successful';
import { AugmentedProject, AugmentedProjectItemData } from '@/src/types';
import { useEffect, useRef, useState } from 'react';
import { Cache } from '@/src/lib/indexeddb';
import {
  getAvgPciScore,
  getAvgPciScoreTreatment,
  getSortedTreatmentScores,
} from './helpers';
import toast from 'react-hot-toast';

const DataTransformer = () => {
  const augmentedProjectRef = useRef<AugmentedProject | null>(null);

  // Local state to hold saved configurations from IndexedDB
  const [projectSavedConfigs, setProjectSavedConfigs] = useState<
    Record<string, string> | undefined
  >();

  // Global state setters
  const setAugmentedProject = useGlobalState(
    (state) => state.setAugmentedProject,
  );

  // Global state selectors
  const baseProcessingConfigurations = getResponseIfSuccesful(
    useGlobalState((state) => state.baseProcessingConfigurations),
  );
  const aiPciScores = useGlobalState((state) => state.aiPciScores);
  const projectStatusResponse = useGlobalState((state) => state.projectStatus);
  const selectedProjectResponse = useGlobalState(
    (state) => state.selectedProject,
  );

  const selectedProject = getResponseIfSuccesful(selectedProjectResponse);

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
      const savedConfig =
        projectSavedConfigs[item.video_url] ||
        baseProcessingConfigurations?.[0]?.processing_configuration_name;
      return {
        ...item,
        selected_configuration: savedConfig,
      };
    });

    // Extract processing_configurations and video_status from project status response
    const { processing_configurations, video_status } =
      getResponseIfSuccesful(projectStatusResponse) || {};

    // Construct the augmented project
    const augmentedProject = {
      ...selectedProject!,
      // Add processing configurations to the augmented project
      processing_configurations: processing_configurations,
      items: augmentedProjectItems.reduce((acc, item) => {
        acc[item.video_url] = {
          ...item,
          video_status: video_status ? video_status[item.video_url]! : null,
        };
        return acc;
      }, {} as Record<string, (typeof augmentedProjectItems)[0]>),
    };

    augmentedProjectRef.current = augmentedProject;

    // Update the global state with the augmented project
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
    baseProcessingConfigurations,
  ]);

  useEffect(() => {
    if (aiPciScores?.status !== 'ok' || !projectSavedConfigs) return;
    const aiPciScoresData = getResponseIfSuccesful(aiPciScores)!;

    setAugmentedProject((state) => {
      const augmentedProject = getResponseIfSuccesful(state.augmentedProject);
      if (!augmentedProject) return augmentedProject;

      return {
        status: 'ok',
        detail: {
          ...augmentedProject,
          items: {
            ...Object.values(augmentedProject.items).reduce((acc, item) => {
              const savedConfig =
                projectSavedConfigs[item.video_url] ||
                baseProcessingConfigurations?.[0]
                  ?.processing_configuration_name;

              const aiPciScores =
                aiPciScoresData[item.selected_configuration!]?.[item.video_url];

              const scoreValues = Object.values(aiPciScores || {});
              const framesCount = scoreValues.length;
              const nonNullValues = scoreValues.filter(
                (score) => score?.pci_score,
              );
              let config = baseProcessingConfigurations?.find(
                (baseConfig) =>
                  baseConfig.processing_configuration_name ===
                  item.selected_configuration,
              );

              if (!config) {
                toast.error(
                  `Processing configuration "${item.selected_configuration}" not found for video "${item.video_url}".`,
                );
                config = baseProcessingConfigurations?.[0];
              }

              const sortedTreatmentByName = getSortedTreatmentScores(
                nonNullValues,
              ).map(([treatment, count]) => {
                return [
                  (config?.mappings?.treatment as Record<string, string>)[
                    treatment
                  ] as string,
                  count,
                ] as [string, number];
              });

              const treatmentScores = getAvgPciScoreTreatment({
                scores: nonNullValues,
                mapping: config?.mappings as Record<string, string> | undefined, // TODO: Ask the API for the correct type
              });

              const avgPciScore = getAvgPciScore(nonNullValues);

              const progress =
                framesCount > 0
                  ? Math.round((nonNullValues.length / framesCount) * 100)
                  : 100;

              acc[item.video_url] = {
                ...item,
                selected_configuration: savedConfig,
                aiPciScores,
                avgPciScore,
                avgPciScoreTreatment: sortedTreatmentByName,
                avgTreatment: treatmentScores,
                progress,
              };
              return acc;
            }, {} as Record<string, AugmentedProjectItemData>),
          },
        },
      };
    });
  }, [
    aiPciScores,
    baseProcessingConfigurations,
    setAugmentedProject,
    projectSavedConfigs,
  ]);

  return null;
};

export { DataTransformer };
