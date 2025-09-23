'use client';
import { SplitView } from 'components/base/split-view';

import styles from './style.module.css';
import { ProjectTableViewContainer } from '@/src/containers/project-table-view-container';
import { ProjectVideoPreviewContainer } from '@/src/containers/project-video-preview-container';
import { Flex } from '@radix-ui/themes';
import { ProjectVideoMetadataContainer } from '@/src/containers/project-video-metadata-container';
import { ProjectMapContainer } from '@/src/containers/project-map-container';

import { ProjectAnalysisDashboard } from 'components/project-analysis-dashboard';

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
            <Flex direction={'column'} gap={'4'} height={'100%'}>
              <ProjectAnalysisDashboard />

              <div style={{ flexGrow: 1, minHeight: 0 }}>
                <ProjectTableViewContainer />
              </div>
            </Flex>
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
