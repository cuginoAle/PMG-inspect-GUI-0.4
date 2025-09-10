'use client';
import { useState } from 'react';
import { SplitView } from 'components/base/split-view';
import { ProjectsTreeView } from 'components/projects-tree-view';
import { ProjectContentView } from 'components/project-content-view';
import { FileInfo } from '@/src/types';

interface ClientProps {
  initialProjects: FileInfo[];
}

function Client({ initialProjects }: ClientProps) {
  const [selectedProject, setSelectedProject] = useState<
    FileInfo | undefined
  >();
  return (
    <SplitView
      left={
        <ProjectsTreeView
          files={initialProjects}
          onSelect={setSelectedProject}
        />
      }
      right={<ProjectContentView selectedFile={selectedProject} />}
    />
  );
}

export { Client };
