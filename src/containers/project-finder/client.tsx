'use client';
import { useState } from 'react';
import { SplitView } from 'components/base/split-view';
import { ProjectsTreeView } from 'components/projects-tree-view';
import { ProjectContentView } from 'components/project-content-view';
import { Project } from '@/src/app/types';

interface ClientProps {
  initialProjects: Project[];
}

export default function Client({ initialProjects }: ClientProps) {
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
