'use client';
import { hookstate, useHookstate } from '@hookstate/core';
import { devtools } from '@hookstate/devtools';
import { GetFilesListResponse, GetProjectResponse } from '@/src/types';

type GlobalState = {
  filesList?: GetFilesListResponse;
  selectedProject?: GetProjectResponse;
  hoveredVideoUrl?: string;
  userPreferences?: {
    unit?: 'metric' | 'imperial';
    userName?: string;
    localCacheSizeLimitInGB?: number;
  };
  inferenceSettings?: Record<
    string,
    {
      label: string;
      parameters: Record<string, unknown>;
    }
  >; // TODO: define type
  selectedInferenceSettingId?: string;
  selectedVideoUrlList?: Record<string, string[]>; // { [inferenceSettingId: string]: videoUrlList as string[] }
};

const globalState = hookstate<GlobalState>(
  {},
  devtools({ key: 'Inspect-globalState' }),
);

export const useGlobalState = () => useHookstate(globalState);
export type { GlobalState };
