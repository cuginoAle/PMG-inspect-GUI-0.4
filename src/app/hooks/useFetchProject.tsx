import { fetchProjectDetails } from '@/src/lib/data/fetch-project-details';
import { Cache } from '@/src/lib/indexeddb';
import { GetProjectResponse } from '@/src/types';
import React from 'react';
import { useEffect } from 'react';

const useFetchProject = (projectPath?: string | null) => {
  const [project, setProject] = React.useState<GetProjectResponse | undefined>(
    undefined,
  );

  useEffect(() => {
    if (!projectPath) {
      setProject(undefined);
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const cached = await Cache.get<GetProjectResponse>(
          'projectDetails',
          projectPath,
        );
        if (!cancelled && cached) {
          setProject(cached);
          return; // Skip fetching since we have cache
        }
      } catch {
        // ignore cache errors
      }
      if (cancelled) return;
      setProject({ status: 'loading' });

      return fetchProjectDetails(projectPath)
        .then((data) => {
          Cache.set('projectDetails', projectPath, data);
          if (!cancelled) setProject(data);
        })
        .catch((error) => {
          if (!cancelled) setProject(error);
        });
    })();

    return () => {
      cancelled = true;
    };
  }, [projectPath]);

  return project;
};

export { useFetchProject };
