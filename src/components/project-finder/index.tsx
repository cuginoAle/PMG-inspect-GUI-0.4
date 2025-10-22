'use client';
import { SplitView, ProjectContentView } from '@/src/components';

import styles from './style.module.css';
import { ProjectsTreeViewContainer } from '@/src/containers/projects-tree-view-container';

const Left = () => (
  <div className={styles.leftView}>
    <ProjectsTreeViewContainer />
  </div>
);

const Right = () => (
  <div className={styles.rightView}>
    <ProjectContentView />
  </div>
);

const ProjectFinder = () => {
  return (
    <SplitView
      name="project-finder-split-view"
      left={<Left />}
      right={<Right />}
    />
  );
};

export { ProjectFinder };
