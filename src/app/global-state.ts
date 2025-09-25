'use client';
import { hookstate, useHookstate } from '@hookstate/core';
import { devtools } from '@hookstate/devtools';
import {
  GetFilesListResponse,
  GetProjectResponse,
  GetVideoMetadataResponse,
} from '@/src/types';

type GlobalState = {
  filesList?: GetFilesListResponse;
  selectedProject?: GetProjectResponse;
  selectedVideo?: GetVideoMetadataResponse;
  hoveredVideoUrl?: string;
};

const globalState = hookstate<GlobalState>(
  {},
  devtools({ key: 'Inspect-globalState' }),
);

export const useGlobalState = () => useHookstate(globalState);
export type { GlobalState };
