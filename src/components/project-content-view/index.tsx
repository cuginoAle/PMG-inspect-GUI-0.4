'use client';
import { SplitView } from 'components/base/split-view';

import styles from './style.module.css';
import { ProjectTableViewContainer } from '@/src/containers/project-table-view-container';
import { ProjectVideoPreviewContainer } from '@/src/containers/project-video-preview-container';
import { Flex, IconButton, Separator } from '@radix-ui/themes';
import { ProjectVideoMetadataContainer } from '@/src/containers/project-video-metadata-container';
import { ProjectMapContainer } from '@/src/containers/project-map-container';

import { ProjectAnalysisDashboard } from 'components/project-analysis-dashboard';
import { PinBottomIcon, PinTopIcon } from '@radix-ui/react-icons';
import React from 'react';

const ProjectContentView = () => {
  const [tableExpanded, setTableExpanded] = React.useState(false);

  return (
    <div className={styles.root}>
      <SplitView
        name="project-content-split-view"
        leftMinSize={500}
        rightMinSize={100}
        proportionalLayout={true}
        left={
          <div className={styles.leftPane}>
            <Flex direction={'column'} gap={'6'} height={'100%'}>
              {!tableExpanded && <ProjectAnalysisDashboard />}

              <Separator
                className={styles.mainContentSeparator}
                size={'4'}
                orientation="horizontal"
                color="amber"
              />

              <div className={styles.projectTableWrapper}>
                <IconButton
                  onClick={() => setTableExpanded(!tableExpanded)}
                  variant="soft"
                  className={styles.pinButton}
                  title="Toggle Table Expansion"
                >
                  {tableExpanded ? <PinBottomIcon /> : <PinTopIcon />}
                </IconButton>
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
