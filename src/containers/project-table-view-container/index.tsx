'use client';
import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { useGlobalState } from '@/src/app/global-state';
import { useFetchProject } from '@/src/app/hooks/useFetchProject';
import { ProjectTableView } from '@/src/components/project-table-view';
import { LoadingToast } from '@/src/components/loading-toast';
import { NoProjectSelected } from '@/src/components/no-project-selected';
import { Warning } from '@/src/components/warning';

const ProjectTableViewContainer = () => {
  const gState = useGlobalState();
  const setSelectedProject = gState.selectedProject.set;

  const searchParams = useSearchParams();
  const projectPath = searchParams.get('path') || undefined;

  const project = useFetchProject(projectPath);

  useEffect(() => {
    setSelectedProject(project);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [project]);

  if (!project) {
    return <NoProjectSelected />;
  }

  if (project && 'status' in project && project.status === 'loading') {
    return (
      <div className="center">
        <LoadingToast message="Loading project..." />
      </div>
    );
  }

  if (project && 'status' in project) {
    return (
      <div className="center">
        <Warning message={project.detail.message} />
      </div>
    );
  }

  return <ProjectTableView project={project} defaultSelectedRowIndex={0} />;
};

export { ProjectTableViewContainer };
