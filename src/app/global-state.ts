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
} from '@/src/types';

type GlobalState = {
  filesList?: GetFilesListResponse;
  selectedProject?: GetProjectResponse;
  projectStatus?: GetProjectStatusResponse;
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
};

type GlobalStateActions = {
  setFilesList: (filesList?: GetFilesListResponse) => void;
  setSelectedProject: (project?: GetProjectResponse) => void;
  setProjectStatus: (status?: GetProjectStatusResponse) => void;
  setHoveredVideoUrl: (url?: string) => void;
  setUserPreferences: (prefs?: GlobalState['userPreferences']) => void;

  setEditedProcessingConfigurations: (config?: ProcessingConfiguration) => void;
  setInferenceModels: (inferenceModels?: GetInferenceModelResponse) => void;
  setVideoUrlToDrawOnTheMap: (url?: string) => void;
  setAiPciScores: (aiPciScores?: GetPciScoreResponse) => void;
};

type GlobalStore = GlobalState & GlobalStateActions;

const useGlobalState = create<GlobalStore>()(
  devtools(
    (set) => ({
      // Initial state
      filesList: undefined,
      selectedProject: undefined,
      projectStatus: undefined,
      hoveredVideoUrl: undefined,
      userPreferences: undefined,
      analysisResults: undefined,
      processingConfigurationsDefinition: undefined,
      editedProcessingConfigurations: undefined,
      selectedInferenceSettingId: undefined,
      inferenceModels: undefined,
      videoUrlToDrawOnTheMap: undefined,
      aiPciScores: {},

      // Actions
      setFilesList: (filesList) => set({ filesList }),
      setSelectedProject: (selectedProject) => set({ selectedProject }),
      setProjectStatus: (projectStatus) => set({ projectStatus }),
      setHoveredVideoUrl: (hoveredVideoUrl) => set({ hoveredVideoUrl }),
      setUserPreferences: (userPreferences) => set({ userPreferences }),
      setEditedProcessingConfigurations: (editedProcessingConfigurations) =>
        set({ editedProcessingConfigurations }),
      setInferenceModels: (inferenceModels) => set({ inferenceModels }),
      setVideoUrlToDrawOnTheMap: (videoUrlToDrawOnTheMap) =>
        set({ videoUrlToDrawOnTheMap }),
      setAiPciScores: (aiPciScores) => set({ aiPciScores }),
    }),
    { name: 'Inspect-globalState' },
  ),
);

export { useGlobalState };
export type { GlobalState };
