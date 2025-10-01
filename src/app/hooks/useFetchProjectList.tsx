import { GetFilesListResponse } from '@/src/types';
import { fetchProjectList } from '@/src/lib/data/fetch-projectList';
import React from 'react';

const useFetchProjectList = () => {
  const [projects, setProjects] = React.useState<
    GetFilesListResponse | undefined
  >(undefined);

  React.useEffect(() => {
    let cancelled = false;

    setProjects({ status: 'loading' });
    fetchProjectList()
      .then((response) => {
        if (cancelled) return;

        setProjects(response);
      })
      .catch((error) => {
        if (!cancelled) setProjects(error);
      });

    if (cancelled) return;
    return () => {
      cancelled = true;
    };
  }, []);

  return projects;
};

export { useFetchProjectList };
