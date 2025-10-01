'use client';
import { SplitView, ProjectContentView } from '@/src/components';

import styles from './style.module.css';
import { ProjectsTreeViewContainer } from '@/src/containers/projects-tree-view-container';

const Left = ({ projectPath }: { projectPath?: string }) => (
  <div className={styles.leftView}>
    <ProjectsTreeViewContainer projectPath={projectPath} />
  </div>
);

const Right = () => (
  <div className={styles.rightView}>
    <ProjectContentView />
  </div>
);

const ProjectFinder = ({ projectPath }: { projectPath?: string }) => {
  return (
    <SplitView
      name="project-finder-split-view"
      left={<Left projectPath={projectPath} />}
      right={<Right />}
    />
  );
};

export { ProjectFinder };
