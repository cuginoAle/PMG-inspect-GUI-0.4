'use client';
import { hookstate, useHookstate } from '@hookstate/core';
import { devtools } from '@hookstate/devtools';
import {
  GetAnalysisResultResponse,
  GetFilesListResponse,
  GetProcessingConfigurationResponse,
  GetProjectResponse,
  InferenceModelDict,
  ProcessingConfiguration,
  ProjectStatus,
} from '@/src/types';

type GlobalState = {
  filesList?: GetFilesListResponse;
  selectedProject?: GetProjectResponse;
  projectStatus?: ProjectStatus;
  hoveredVideoUrl?: string;
  userPreferences?: {
    unit?: 'metric' | 'imperial';
    userName?: string;
    localCacheSizeLimitInGB?: number;
  };
  analysisResults?: GetAnalysisResultResponse;
  processingConfigurations?: GetProcessingConfigurationResponse;
  editedProcessingConfigurations?: ProcessingConfiguration;
  inferenceModelDictionary?: InferenceModelDict;
  selectedInferenceSettingId?: string;
  selectedVideoUrlList?: Record<string, string[]>; // { [inferenceSettingId: string]: videoUrlList as string[] }
};

const globalState = hookstate<GlobalState>(
  {},
  devtools({ key: 'Inspect-globalState' }),
);

export const useGlobalState = () => useHookstate(globalState);
export type { GlobalState };
