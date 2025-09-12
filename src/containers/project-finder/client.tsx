'use client';
import { useEffect, useState } from 'react';
import { SplitView } from 'components/base/split-view';
import { ProjectsTreeView } from 'components/projects-tree-view';
import { ProjectContentView } from 'components/project-content-view';
import { FileInfo, Project } from '@/src/types';

import { BFF_ENDPOINTS } from '@/src/constants/end-points';
import styles from './style.module.css';

interface ClientProps {
  initialProjects: FileInfo[];
}

function Client({ initialProjects }: ClientProps) {
  const [selectedProject, setSelectedProject] = useState<
    FileInfo | undefined
  >();

  const [projectDetails, setProjectDetails] = useState<Project | undefined>();

  useEffect(() => {
    console.log(
      'selectedProject?.relative_path',
      selectedProject?.relative_path,
    );
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
      name="project-finder-split-view"
      left={
        <div className={styles.leftView}>
          <ProjectsTreeView
            files={initialProjects}
            onSelect={setSelectedProject}
          />
        </div>
      }
      right={
        <div className={styles.rightView}>
          <ProjectContentView project={projectDetails} />
        </div>
      }
    />
  );
}

export { Client };
