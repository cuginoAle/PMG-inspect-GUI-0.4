import { fetchBaseConfigurations } from '@/src/lib/data/fetch-base-configurations';
import { GetBaseConfigurationsResponse } from '@/src/types';
import React from 'react';

const useFetchBaseConfigurations = () => {
  const [baseConfigurations, setBaseConfigurations] = React.useState<
    GetBaseConfigurationsResponse | undefined
  >(undefined);

  React.useEffect(() => {
    let cancelled = false;

    setBaseConfigurations({ status: 'loading' });

    fetchBaseConfigurations()
      .then(async (response) => {
        if (cancelled) return;
        setBaseConfigurations(response);
      })
      .catch((error) => {
        if (!cancelled) setBaseConfigurations(error);
      });

    if (cancelled) return;
    return () => {
      cancelled = true;
    };
  }, []);

  return baseConfigurations;
};

export { useFetchBaseConfigurations };
