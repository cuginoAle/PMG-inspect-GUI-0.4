'use client';
import { SplitView } from 'components/base/split-view';
import { ProjectsTreeView } from './projects-tree-view';
import { ProjectContentView } from './project-content-view';
import { useEffect, useState } from 'react';
import { Project } from '@/src/app/types';

const ProjectFinder = () => {
  const [selectedProject, setSelectedProject] = useState<Project | undefined>(
    undefined,
  );
  const [projects, setProjects] = useState<Project[]>([]);

  // Fetch projects from the API
  useEffect(() => {
    fetch('/protected/api/projects')
      .then((res) => res.json())
      .then((data) => setProjects(data.contents))
      .catch((err) => console.error('Error fetching projects:', err));
  }, []);

  return (
    <SplitView
      left={
        <ProjectsTreeView projects={projects} onSelect={setSelectedProject} />
      }
      right={<ProjectContentView selectedProject={selectedProject} />}
    />
  );
};

export { ProjectFinder };
