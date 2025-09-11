'use client';
import { useEffect, useState } from 'react';
import { SplitView } from 'components/base/split-view';
import { ProjectsTreeView } from 'components/projects-tree-view';
import { ProjectContentView } from 'components/project-content-view';
import { FileInfo } from '@/src/types';
import { Project } from '@/src/app/protected/api/project/types/project';
import { BFF_ENDPOINTS } from '@/src/constants/end-points';

interface ClientProps {
  initialProjects: FileInfo[];
}

function Client({ initialProjects }: ClientProps) {
  const [selectedProject, setSelectedProject] = useState<
    FileInfo | undefined
  >();

  const [projectDetails, setProjectDetails] = useState<Project | undefined>();

  useEffect(() => {
    if (selectedProject) {
      fetch(
        BFF_ENDPOINTS.PROJECT +
          `?relative_path=${selectedProject?.relative_path}`,
      )
        .then((res) => res.json())
        .then((data) => {
          setProjectDetails(data);
        });
    }
  }, [selectedProject]);

  return (
    <SplitView
      left={
        <ProjectsTreeView
          files={initialProjects}
          onSelect={setSelectedProject}
        />
      }
      right={<ProjectContentView project={projectDetails} />}
    />
  );
}

export { Client };
