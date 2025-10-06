'use client';
import { SplitView } from '@/src/components';

import styles from './style.module.css';
import { Flex } from '@radix-ui/themes';

import React from 'react';
import { ProjectMapContainer } from '@/src/containers/project-map-container';
import { ProjectVideoPreviewContainer } from '@/src/containers/project-video-preview-container';
import { ProjectVideoMetadataContainer } from '@/src/containers/project-video-metadata-container';

const ProjectContentView = () => {
  return (
    <div className={styles.root}>
      <SplitView
        name="project-content-split-view"
        leftMinSize={500}
        rightMinSize={100}
        proportionalLayout={true}
        left={<div className={styles.leftPane}>{/* <LeftPane /> */}</div>}
        right={
          <div className={styles.rightPane}>
            <Flex direction="column" gap={'4'}>
              <ProjectMapContainer />
              <ProjectVideoPreviewContainer />
              <ProjectVideoMetadataContainer />
            </Flex>
          </div>
        }
      />
    </div>
  );
};

export { ProjectContentView };
