'use client';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import {
  GetFilesListResponse,
  GetProjectResponse,
  GetProjectStatusResponse,
  GetInferenceModelResponse,
  ProcessingConfiguration,
  GetPciScoreResponse,
  GetAugmentedProjectResponse,
  ProjectItem,
} from '@/src/types';

type GlobalState = {
  filesList?: GetFilesListResponse;
  selectedProject?: GetProjectResponse;
  projectStatus?: GetProjectStatusResponse;
  augmentedProject?: GetAugmentedProjectResponse;
  hoveredVideoUrl?: string;
  userPreferences?: {
    unit?: 'metric' | 'imperial';
    userName?: string;
    localCacheSizeLimitInGB?: number;
  };
  editedProcessingConfigurations?: ProcessingConfiguration;
  inferenceModels?: GetInferenceModelResponse;
  videoUrlToDrawOnTheMap?: string;
  aiPciScores?: GetPciScoreResponse;
  paginationPageSize: number;
  linkMapAndTable: boolean;
  renderedProjectItems?: Record<string, ProjectItem>;
};

type GlobalStateActions = {
  setFilesList: (filesList?: GetFilesListResponse) => void;
  setSelectedProject: (project?: GetProjectResponse) => void;
  setProjectStatus: (status?: GetProjectStatusResponse) => void;
  setAugmentedProject: (project?: GetAugmentedProjectResponse) => void;
  setHoveredVideoUrl: (url?: string) => void;
  setUserPreferences: (prefs?: GlobalState['userPreferences']) => void;

  setEditedProcessingConfigurations: (config?: ProcessingConfiguration) => void;
  setInferenceModels: (inferenceModels?: GetInferenceModelResponse) => void;
  setVideoUrlToDrawOnTheMap: (url?: string) => void;
  setAiPciScores: (aiPciScores?: GetPciScoreResponse) => void;
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
      userPreferences: undefined,
      analysisResults: undefined,
      processingConfigurationsDefinition: undefined,
      editedProcessingConfigurations: undefined,
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
      setAugmentedProject: (augmentedProject) => set({ augmentedProject }),
      setHoveredVideoUrl: (hoveredVideoUrl) => set({ hoveredVideoUrl }),
      setUserPreferences: (userPreferences) => set({ userPreferences }),
      setEditedProcessingConfigurations: (editedProcessingConfigurations) =>
        set({ editedProcessingConfigurations }),
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
