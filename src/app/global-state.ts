'use client';
import { hookstate, useHookstate } from '@hookstate/core';
import { devtools } from '@hookstate/devtools';
import { Project } from '@/src/types';
import { PresetsData } from '@/src/types/setting';

// TODO: Implement settings fetch rather than using static JSON: presetJsonData
import presetJsonData from '@/src/containers/settings-container/presets-data.json';
import { Distress } from '@/src/types/distress';

type GlobalState = {
  selectedFile?: string;
  frames: {
    current: number;
    count: number;
  };
  selectedRoad?: string;
  project?: Project;
  settings: PresetsData;
  analysis?: Record<string, any>; // Placeholder for analysis data
  distresses: Record<string, Distress | undefined>; // Placeholder for distress dictionary
};

const globalState = hookstate<GlobalState>(
  {
    frames: {
      current: 0,
      count: 0,
    },
    settings: presetJsonData as PresetsData,
    distresses: {},
  },
  devtools({ key: 'PCI-globalState' }),
);

export const useGlobalState = () => useHookstate(globalState);
export type { GlobalState };
