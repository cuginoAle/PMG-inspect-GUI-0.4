'use client';
import {
  SplitView,
  ProjectAnalysisDashboard,
  FileLogoTitle,
} from '@/src/components';

import styles from './style.module.css';
import { ProjectTableViewContainer } from '@/src/containers/project-table-view-container';
import { ProjectVideoPreviewContainer } from '@/src/containers/project-video-preview-container';
import { Flex, IconButton, Separator } from '@radix-ui/themes';
import { ProjectVideoMetadataContainer } from '@/src/containers/project-video-metadata-container';
import { ProjectMapContainer } from '@/src/containers/project-map-container';

import { PinBottomIcon, PinTopIcon } from '@radix-ui/react-icons';
import React, { useMemo } from 'react';
import { getFileIconType } from '@/src/helpers/get-file-icon-type';
import { removeFileExtension } from '@/src/helpers/remove-file-extension';
import { useSearchParams } from 'next/navigation';

const ProjectContentView = () => {
  const [tableExpanded, setTableExpanded] = React.useState(false);
  const sp = useSearchParams();
  const projectPath = sp.get('path') || '';

  const fileType = useMemo(() => getFileIconType(projectPath), [projectPath]);
  const label = useMemo(() => removeFileExtension(projectPath), [projectPath]);

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
              {projectPath && (
                <FileLogoTitle
                  as="div"
                  fileType={fileType}
                  label={label}
                  size="medium"
                  componentId="project-analysis-dashboard-file-title"
                />
              )}
              {!tableExpanded && <ProjectAnalysisDashboard />}

              {!tableExpanded && projectPath && (
                <Separator
                  className={styles.mainContentSeparator}
                  size={'4'}
                  orientation="horizontal"
                  color="amber"
                />
              )}

              <div className={styles.projectTableWrapper}>
                {projectPath && (
                  <IconButton
                    onClick={() => setTableExpanded(!tableExpanded)}
                    variant="soft"
                    className={styles.pinButton}
                    title="Toggle Table Expansion"
                  >
                    {tableExpanded ? <PinBottomIcon /> : <PinTopIcon />}
                  </IconButton>
                )}
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
