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
  InferenceModel,
} from '@/src/types';

type GlobalState = {
  inferenceModels?: GetInferenceModelResponse;
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
  processingConfigurations?: GetProcessingConfigurationResponse;
  editedProcessingConfigurations?: ProcessingConfiguration;
  selectedInferenceSettingId?: string;
  selectedVideoUrlList?: Record<string, string[]>; // { [inferenceSettingId: string]: videoUrlList as string[] }
};

type GlobalStateActions = {
  setInferenceModels: (inferenceModels?: InferenceModel) => void;
  setFilesList: (filesList?: GetFilesListResponse) => void;
  setSelectedProject: (project?: GetProjectResponse) => void;
  setProjectStatus: (status?: GetProjectStatusResponse) => void;
  setHoveredVideoUrl: (url?: string) => void;
  setUserPreferences: (prefs?: GlobalState['userPreferences']) => void;
  setAnalysisResults: (results?: GetAnalysisResultResponse) => void;
  setProcessingConfigurations: (
    configs?: GetProcessingConfigurationResponse,
  ) => void;
  setEditedProcessingConfigurations: (config?: ProcessingConfiguration) => void;
  setSelectedInferenceSettingId: (id?: string) => void;
  setSelectedVideoUrlList: (list?: Record<string, string[]>) => void;
  mergeSelectedVideoUrlList: (list: Record<string, string[]>) => void;
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
      processingConfigurations: undefined,
      editedProcessingConfigurations: undefined,
      selectedInferenceSettingId: undefined,
      selectedVideoUrlList: undefined,
      inferenceModels: undefined,

      // Actions
      setFilesList: (filesList) => set({ filesList }),
      setSelectedProject: (selectedProject) => set({ selectedProject }),
      setProjectStatus: (projectStatus) => set({ projectStatus }),
      setHoveredVideoUrl: (hoveredVideoUrl) => set({ hoveredVideoUrl }),
      setUserPreferences: (userPreferences) => set({ userPreferences }),
      setAnalysisResults: (analysisResults) => set({ analysisResults }),
      setProcessingConfigurations: (processingConfigurations) =>
        set({ processingConfigurations }),
      setEditedProcessingConfigurations: (editedProcessingConfigurations) =>
        set({ editedProcessingConfigurations }),
      setSelectedInferenceSettingId: (selectedInferenceSettingId) =>
        set({ selectedInferenceSettingId }),
      setSelectedVideoUrlList: (selectedVideoUrlList) =>
        set({ selectedVideoUrlList }),
      mergeSelectedVideoUrlList: (list) =>
        set((state) => ({
          selectedVideoUrlList: { ...state.selectedVideoUrlList, ...list },
        })),
    }),
    { name: 'Inspect-globalState' },
  ),
);

export { useGlobalState };
export type { GlobalState };
