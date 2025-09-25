'use client';
import { useGlobalState } from '@/src/app/global-state';
import { useFetchProject } from '@/src/app/hooks/useFetchProject';
import { useFetchProjectList } from '@/src/app/hooks/useFetchProjectList';
import { useFetchVideo } from '@/src/app/hooks/useFetchVideo';
import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

const ProjectFinderDataLoader = () => {
  const { selectedProject, selectedVideo, filesList } = useGlobalState();
  const sp = useSearchParams();
  const projectPath = sp.get('path');
  const videoUrl = sp.get('videoUrl');

  const project = useFetchProject(projectPath);
  const video = useFetchVideo(videoUrl);
  const projects = useFetchProjectList();

  useEffect(() => {
    selectedProject.set(project);
    selectedVideo.set(video);
    filesList.set(projects);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [project, video, projects]);

  return null;
};

export { ProjectFinderDataLoader };
