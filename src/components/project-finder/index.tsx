'use client';
import { SplitView, Warning } from '@/src/components';

import styles from './style.module.css';
import { ReactNode } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

const ProjectFinder = ({
  left,
  right,
}: {
  left: ReactNode;
  right: ReactNode;
}) => {
  return (
    <SplitView
      name="project-finder-split-view"
      left={
        <div className={styles.leftView}>
          <ErrorBoundary
            fallbackRender={({ error }) => (
              <div className="center">
                <Warning
                  title="Failed to load projects"
                  message={error.message}
                />
              </div>
            )}
          >
            {left}
          </ErrorBoundary>
        </div>
      }
      right={<div className={styles.rightView}>{right}</div>}
    />
  );
};

export { ProjectFinder };
