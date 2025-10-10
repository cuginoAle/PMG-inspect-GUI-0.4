import { fetchProcessingConfiguration } from '@/src/lib/data/fetch-processing-configuration';
import { GetProcessingConfigurationResponse } from '@/src/types';
import React from 'react';

const useFetchProcessingConfiguration = () => {
  const [settings, setSettings] =
    React.useState<GetProcessingConfigurationResponse>();

  // TODO: add this to the cache
  React.useEffect(() => {
    let cancelled = false;
    setSettings({ status: 'loading' });
    fetchProcessingConfiguration()
      .then(async (response) => {
        // wait for 2 seconds to simulate loading
        await new Promise((resolve) => setTimeout(resolve, 1000));
        if (!cancelled) {
          setSettings(response);
        }
      })
      .catch((error) => {
        if (!cancelled) {
          setSettings(error);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return settings;
};
export { useFetchProcessingConfiguration };
