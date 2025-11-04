import { fetchProjectDetails } from '@/src/lib/data/fetch-project-details';
import { GetProjectResponse } from '@/src/types';
import React from 'react';
import { useEffect } from 'react';
import { Cache } from '@/src/lib/indexeddb';
import { generateMockProject } from './dummy-data';

// change this to true to use mock data
const useMockData = false;

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
      // Return mock data with a LOAT of projects immediately
      if (useMockData) {
        const mockData = generateMockProject(projectPath, 20000);
        setProject(mockData);
      } else {
        // Original implementation commented out for testing

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

        fetchProjectDetails(projectPath)
          .then((data) => {
            Cache.set('projectDetails', projectPath, data);
            if (!cancelled) setProject(data);
          })
          .catch((error) => {
            if (!cancelled) setProject(error);
          });
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [projectPath]);

  return project;
};

export { useFetchProject };
