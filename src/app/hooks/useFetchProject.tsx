import { fetchProjectDetails } from '@/src/lib/data/fetch-project-details';
import { GetProjectResponse } from '@/src/types';
import React from 'react';
import { useEffect } from 'react';

const useFetchProject = (projectPath?: string) => {
  const [project, setProject] = React.useState<GetProjectResponse | undefined>(
    undefined,
  );

  useEffect(() => {
    if (!projectPath) {
      setProject(undefined);
      return;
    }

    setProject({ status: 'loading' });
    fetchProjectDetails(projectPath)
      .then(setProject)
      .catch((error) => {
        setProject(error);
      });
  }, [projectPath]);

  return project;
};

export { useFetchProject };
