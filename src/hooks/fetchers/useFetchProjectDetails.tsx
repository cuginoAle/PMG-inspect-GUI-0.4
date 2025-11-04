import { fetchProjectDetails } from '@/src/lib/data/fetch-project-details';
import { GetProjectResponse } from '@/src/types';
import React from 'react';
import { useEffect } from 'react';
import { Cache } from '@/src/lib/indexeddb';
import { generateMockProject } from './dummy-data';

// change this to true to use mock data
const useMockData = false;
const mockDataSize = 20000; // number of files in mock data

const useFetchProjectDetails = (projectPath?: string | null) => {
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
      // Return mock data with LOADS of projects immediately
      if (useMockData) {
        const mockData = generateMockProject(projectPath, mockDataSize);
        setProject(mockData);
      } else {
        // Original implementation
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

export { useFetchProjectDetails };
