'use client';
import { useGlobalState } from '@/src/app/global-state';
import { ProjectTableView } from '@/src/components/project-table-view';
import { LoadingToast } from '@/src/components/loading-toast';
import { NoProjectSelected } from '@/src/components/no-project-selected';
import { Warning } from '@/src/components/warning';
import { ProjectItem } from '@/src/types';
import { getResponseIfSuccesful } from '@/src/helpers/get-response-if-successful';

const ProjectTableViewContainer = () => {
  const gState = useGlobalState();
  const project = gState.selectedProject.get();

  const setHoveredVideoUrl = (projectItem?: ProjectItem) => {
    gState.hoveredVideoUrl.set(projectItem?.video_url);
  };

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
        <Warning message={project.detail.message} />
      </div>
    );
  }

  const response = getResponseIfSuccesful(project);
  const pro = {
    project_name: response?.project_name ?? '',
    // clone readonly project_items into a mutable array expected by ProjectTableView
    project_items: project.detail?.project_items
      ? [...project.detail.project_items]
      : [],
  };

  return <ProjectTableView project={pro} onMouseOver={setHoveredVideoUrl} />;
};

export { ProjectTableViewContainer };
