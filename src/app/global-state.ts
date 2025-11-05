'use client';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import {
  GetFilesListResponse,
  GetProjectResponse,
  GetProjectStatusResponse,
  GetInferenceModelResponse,
  GetAiPciScoreResponse,
  GetAugmentedProjectResponse,
  ProjectItem,
  GetBaseConfigurationsResponse,
} from '@/src/types';

type GlobalState = {
  filesList?: GetFilesListResponse;
  selectedProject?: GetProjectResponse;
  projectStatus?: GetProjectStatusResponse;
  augmentedProject?: GetAugmentedProjectResponse;
  hoveredVideoUrl?: string;
  userPreferences: {
    unit?: 'metric' | 'imperial';
    userName?: string;
  };
  baseProcessingConfigurations?: GetBaseConfigurationsResponse;
  inferenceModels?: GetInferenceModelResponse;
  videoUrlToDrawOnTheMap?: string;
  aiPciScores?: GetAiPciScoreResponse;
  paginationPageSize: number;
  linkMapAndTable: boolean;
  renderedProjectItems?: Record<string, ProjectItem>;
};

type GlobalStateActions = {
  setFilesList: (filesList?: GetFilesListResponse) => void;
  setSelectedProject: (project?: GetProjectResponse) => void;
  setProjectStatus: (status?: GetProjectStatusResponse) => void;
  setAugmentedProject: (
    project?:
      | GetAugmentedProjectResponse
      | ((state: GlobalState) => GetAugmentedProjectResponse | undefined),
  ) => void;
  setHoveredVideoUrl: (url?: string) => void;
  setUserPreferences: (prefs?: GlobalState['userPreferences']) => void;

  setBaseProcessingConfigurations: (
    config?: GetBaseConfigurationsResponse,
  ) => void;
  setInferenceModels: (inferenceModels?: GetInferenceModelResponse) => void;
  setVideoUrlToDrawOnTheMap: (url?: string) => void;
  setAiPciScores: (aiPciScores?: GetAiPciScoreResponse) => void;
  setPaginationPageSize: (pageSize?: number) => void;
  setLinkMapAndTable: (linkMapAndTable: boolean) => void;
  setRenderedProjectItems: (items?: Record<string, ProjectItem>) => void;
};

type GlobalStore = GlobalState & GlobalStateActions;

const useGlobalState = create<GlobalStore>()(
  devtools(
    (set) => ({
      // Initial state
      filesList: undefined,
      selectedProject: undefined,
      projectStatus: undefined,
      augmentedProject: undefined,
      hoveredVideoUrl: undefined,
      userPreferences: {
        unit: 'metric',
        userName: undefined,
      },
      analysisResults: undefined,
      processingConfigurationsDefinition: undefined,
      baseProcessingConfigurations: undefined,
      selectedInferenceSettingId: undefined,
      inferenceModels: undefined,
      videoUrlToDrawOnTheMap: undefined,
      aiPciScores: {},
      paginationPageSize: 60,
      linkMapAndTable: false,
      renderedProjectItems: undefined,

      // Actions
      setFilesList: (filesList) => set({ filesList }),
      setSelectedProject: (selectedProject) => set({ selectedProject }),
      setProjectStatus: (projectStatus) => set({ projectStatus }),
      setAugmentedProject: (augmentedProject) =>
        set((state) => ({
          augmentedProject:
            typeof augmentedProject === 'function'
              ? augmentedProject(state)
              : augmentedProject,
        })),
      setHoveredVideoUrl: (hoveredVideoUrl) => set({ hoveredVideoUrl }),
      setUserPreferences: (userPreferences) => set({ userPreferences }),
      setBaseProcessingConfigurations: (baseProcessingConfigurations) =>
        set({ baseProcessingConfigurations }),
      setInferenceModels: (inferenceModels) => set({ inferenceModels }),
      setVideoUrlToDrawOnTheMap: (videoUrlToDrawOnTheMap) =>
        set({ videoUrlToDrawOnTheMap }),
      setAiPciScores: (aiPciScores) => set({ aiPciScores }),
      setPaginationPageSize: (paginationPageSize) =>
        set({ paginationPageSize }),
      setLinkMapAndTable: (linkMapAndTable) => set({ linkMapAndTable }),
      setRenderedProjectItems: (items) => set({ renderedProjectItems: items }),
    }),
    { name: 'Inspect-globalState' },
  ),
);

export { useGlobalState };
export type { GlobalState };
