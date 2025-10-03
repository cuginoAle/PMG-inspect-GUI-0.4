'use client';
import { hookstate, useHookstate } from '@hookstate/core';
import { devtools } from '@hookstate/devtools';
import {
  GetFilesListResponse,
  GetProcessingConfigurationResponse,
  GetProjectResponse,
  InferenceModelDict,
  ProcessingConfiguration,
} from '@/src/types';

type GlobalState = {
  filesList?: GetFilesListResponse;
  selectedProject?: GetProjectResponse;
  hoveredVideoUrl?: string;
  userPreferences?: {
    unit?: 'metric' | 'imperial';
    userName?: string;
    localCacheSizeLimitInGB?: number;
  };
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
