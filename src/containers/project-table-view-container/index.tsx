'use client';
import { useGlobalState } from '@/src/app/global-state';
import { ProjectTableView } from '@/src/components/project-table-view';
import { LoadingToast } from '@/src/components/loading-toast';
import { NoProjectSelected } from '@/src/components/no-project-selected';
import { Warning } from '@/src/components/warning';
import { ProjectItem } from '@/src/types';

const ProjectTableViewContainer = () => {
  const { hoveredVideoUrl, selectedProject } = useGlobalState();

  const setHoveredVideoUrl = (projectItem?: ProjectItem) => {
    hoveredVideoUrl.set(projectItem?.video_url);
  };

  const project = selectedProject.get();

  if (!project) {
    return <NoProjectSelected />;
  }

  if (project.status === 'loading') {
    return (
      <div className="center">
        <LoadingToast size="small" message="Loading project..." />
      </div>
    );
  }

  if (project.status === 'error') {
    return (
      <div className="center">
        <Warning message={`${project.code}: ${project.detail.message}`} />
      </div>
    );
  }

  return (
    <ProjectTableView
      project={project.detail}
      onMouseOver={setHoveredVideoUrl}
    />
  );
};

export { ProjectTableViewContainer };
