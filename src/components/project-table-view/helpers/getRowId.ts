import { ProjectItem } from '@/src/types';

const getRowId = (projectItem: ProjectItem) => {
  return `project-tableview-row-${projectItem.video_url}`;
};

export { getRowId };
