'use client';
import { useState } from 'react';
import { SplitView } from 'components/base/split-view';
import { ProjectsTreeView } from 'components/projects-tree-view';
import { ProjectContentView } from 'components/project-content-view';
import { Project } from '@/src/app/types';

interface ProjectFinderClientProps {
  initialProjects: Project[];
}

// Client component manages selection only; data already loaded server-side.
export default function ProjectFinderClient({
  initialProjects,
}: ProjectFinderClientProps) {
  const [selectedProject, setSelectedProject] = useState<Project | undefined>();

  return (
    <SplitView
      left={
        <ProjectsTreeView
          projects={initialProjects}
          onSelect={setSelectedProject}
        />
      }
      right={<ProjectContentView selectedProject={selectedProject} />}
    />
  );
}
