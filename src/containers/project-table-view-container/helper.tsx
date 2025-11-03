import { getProjectSavedConfigurations } from '@/src/helpers/get-project-saved-configuration';
import { Cache } from '@/src/lib/indexeddb';

const persistConfigurationChange = async ({
  projectName,
  itemIds,
  configurationId,
}: {
  projectName: string;
  itemIds: string[];
  configurationId: string | undefined;
}) => {
  // Persist the configuration change to IndexedDB

  // Load existing saved configurations
  const savedConfigs = (await getProjectSavedConfigurations(projectName)) || {};

  itemIds.forEach((itemId) => {
    // Update the configuration for each item
    if (configurationId === undefined) {
      delete savedConfigs[itemId];
    } else {
      savedConfigs[itemId] = configurationId;
    }
  });

  // Save back to IndexedDB
  await Cache.set('savedConfigs', projectName, savedConfigs);

  console.log(
    `Persisted configuration change for item ${itemIds} to ${configurationId}`,
  );
};

export { persistConfigurationChange };
