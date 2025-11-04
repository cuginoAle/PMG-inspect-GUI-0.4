import { fetchProjectStatus } from '@/src/lib/data/fetch-project-status';
import { GetProjectStatusResponse } from '@/src/types';
import React from 'react';

const useFetchProjectStatus = (projectPath?: string | null) => {
  const [projectStatus, setProjectStatus] = React.useState<
    GetProjectStatusResponse | undefined
  >(undefined);

  React.useEffect(() => {
    if (!projectPath) {
      setProjectStatus(undefined);
      return;
    }
    let cancelled = false;

    setProjectStatus({ status: 'loading' });

    fetchProjectStatus(projectPath)
      .then((response) => {
        if (cancelled) return;

        setProjectStatus(response);
      })
      .catch((error) => {
        if (!cancelled) setProjectStatus(error);
      });

    if (cancelled) return;
    return () => {
      cancelled = true;
    };
  }, [projectPath]);

  return projectStatus;
};

export { useFetchProjectStatus };
