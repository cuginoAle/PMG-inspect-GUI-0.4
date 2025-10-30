'use client';
import { SplitView } from 'src/components';

import styles from './style.module.css';
import { ProjectVideoPreviewContainer } from '@/src/containers/project-video-preview-container';
import { Flex } from '@radix-ui/themes';
import { ProjectVideoMetadataContainer } from '@/src/containers/project-video-metadata-container';
import { ProjectMapContainer } from '@/src/containers/project-map-container';

import React, { Suspense } from 'react';
import { ProjectContentViewContainer } from '@/src/containers/project-content-view-container';

const ProjectContentView = () => {
  return (
    <div className={styles.root}>
      <SplitView
        name="project-content-split-view"
        leftMinSize={500}
        rightMinSize={100}
        proportionalLayout={true}
        left={
          <div className={styles.leftPane} id="project-content-left-pane">
            <Suspense fallback={<div>Loading Project Finder...</div>}>
              <ProjectContentViewContainer />
            </Suspense>
          </div>
        }
        right={
          <div className={styles.rightPane}>
            <Flex direction="column" gap={'4'}>
              <Suspense fallback={<div>Loading Project Finder...</div>}>
                <ProjectMapContainer />
                <ProjectVideoPreviewContainer />
                <ProjectVideoMetadataContainer />
              </Suspense>
            </Flex>
          </div>
        }
      />
    </div>
  );
};

export { ProjectContentView };
