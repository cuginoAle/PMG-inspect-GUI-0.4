'use client';
import { SplitView, VideoAnalysisProgress } from 'src/components';

import styles from './style.module.css';
import { ProjectVideoPreviewContainer } from '@/src/containers/project-video-preview-container';
import { Flex } from '@radix-ui/themes';
import { ProjectVideoMetadataContainer } from '@/src/containers/project-video-metadata-container';
import { ProjectMapContainer } from '@/src/containers/project-map-container';

import React from 'react';
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
          <div className={styles.leftPane}>
            {/* Example usages of VideoAnalysisProgress component */}
            <div
              style={{
                fontSize: '1.7em',
                display: 'flex',
                gap: '20px',
                padding: '10px',
              }}
            >
              <VideoAnalysisProgress progress={70} pciScore={91} />
              <VideoAnalysisProgress progress={60} pciScore={75} />
              <VideoAnalysisProgress progress={50} pciScore={65} />
              <VideoAnalysisProgress progress={80} pciScore={45} />
              <VideoAnalysisProgress progress={40} pciScore={25} />
              <hr />
              <VideoAnalysisProgress progress={100} pciScore={91} />
              <VideoAnalysisProgress progress={100} pciScore={75} />
              <VideoAnalysisProgress progress={100} pciScore={65} />
              <VideoAnalysisProgress progress={100} pciScore={45} />
              <VideoAnalysisProgress progress={100} pciScore={25} />
              <hr />
              <VideoAnalysisProgress progress={70} pciScore={65} hasErrors />
            </div>
            {/* remove */}

            <ProjectContentViewContainer />
          </div>
        }
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
