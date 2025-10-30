import { Cache } from '@/src/lib/indexeddb';

const getProjectSavedConfigurations = async (
  projectName?: string,
): Promise<Record<string, string> | undefined> => {
  if (!projectName) return undefined;

  const savedConfigs =
    (await Cache.get<Record<string, string>>('savedConfigs', projectName)) ||
    {};
  return savedConfigs;
};

export { getProjectSavedConfigurations };
