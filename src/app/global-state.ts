'use client';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import {
  GetAnalysisResultResponse,
  GetFilesListResponse,
  GetProcessingConfigurationResponse,
  GetProjectResponse,
  GetProjectStatusResponse,
  GetInferenceModelResponse,
  ProcessingConfiguration,
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
  analysisResults?: GetAnalysisResultResponse;
  processingConfigurationsDefinition?: GetProcessingConfigurationResponse;
  editedProcessingConfigurations?: ProcessingConfiguration;
  inferenceModels?: GetInferenceModelResponse;
  videoUrlToDrawOnTheMap?: string;
};

type GlobalStateActions = {
  setFilesList: (filesList?: GetFilesListResponse) => void;
  setSelectedProject: (project?: GetProjectResponse) => void;
  setProjectStatus: (status?: GetProjectStatusResponse) => void;
  setHoveredVideoUrl: (url?: string) => void;
  setUserPreferences: (prefs?: GlobalState['userPreferences']) => void;
  setAnalysisResults: (results?: GetAnalysisResultResponse) => void;
  setProcessingConfigurationsDefinition: (
    configs?: GetProcessingConfigurationResponse,
  ) => void;
  setEditedProcessingConfigurations: (config?: ProcessingConfiguration) => void;
  setInferenceModels: (inferenceModels?: GetInferenceModelResponse) => void;
  setVideoUrlToDrawOnTheMap: (url?: string) => void;
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

      // Actions
      setFilesList: (filesList) => set({ filesList }),
      setSelectedProject: (selectedProject) => set({ selectedProject }),
      setProjectStatus: (projectStatus) => set({ projectStatus }),
      setHoveredVideoUrl: (hoveredVideoUrl) => set({ hoveredVideoUrl }),
      setUserPreferences: (userPreferences) => set({ userPreferences }),
      setAnalysisResults: (analysisResults) => set({ analysisResults }),
      setProcessingConfigurationsDefinition: (
        processingConfigurationsDefinition,
      ) => set({ processingConfigurationsDefinition }),
      setEditedProcessingConfigurations: (editedProcessingConfigurations) =>
        set({ editedProcessingConfigurations }),
      setInferenceModels: (inferenceModels) => set({ inferenceModels }),
      setVideoUrlToDrawOnTheMap: (videoUrlToDrawOnTheMap) =>
        set({ videoUrlToDrawOnTheMap }),
    }),
    { name: 'Inspect-globalState' },
  ),
);

export { useGlobalState };
export type { GlobalState };
