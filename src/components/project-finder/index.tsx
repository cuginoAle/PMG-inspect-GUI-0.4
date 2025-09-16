import { SplitView } from 'components/base/split-view';

import styles from './style.module.css';
import { ProjectsTreeViewContainer } from '@/src/containers/projects-tree-view-container';
import { Suspense } from 'react';
import { LoadingToast } from 'components/loading-toast';
import { ProjectContentView } from 'components/project-content-view';

function ProjectFinder({ projectPath }: { projectPath?: string }) {
  return (
    <SplitView
      name="project-finder-split-view"
      left={
        <div className={styles.leftView}>
          <Suspense
            fallback={
              <div className="center">
                <LoadingToast message="Loading projects..." />
              </div>
            }
          >
            <ProjectsTreeViewContainer projectPath={projectPath} />
          </Suspense>
        </div>
      }
      right={
        <div className={styles.rightView}>
          <ProjectContentView />
        </div>
      }
    />
  );
}

export { ProjectFinder };
