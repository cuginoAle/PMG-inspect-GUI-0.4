'use client';
import { hookstate, useHookstate } from '@hookstate/core';
import { devtools } from '@hookstate/devtools';
import { VideoData, FetchError, LoadingState, Project } from '@/src/types';

type GlobalState = {
  selectedProject?: Project | FetchError | LoadingState;
  selectedVideo?: VideoData | FetchError | LoadingState;
  hoveredVideoUrl?: string; // video_url
};

const globalState = hookstate<GlobalState>(
  {},
  devtools({ key: 'Inspect-globalState' }),
);

export const useGlobalState = () => useHookstate(globalState);
export type { GlobalState };
