import { SplitView } from 'components/base/split-view';

import styles from './style.module.css';
import { ProjectTableViewContainer } from '@/src/containers/project-table-view-container';
import { ProjectVideoPreviewContainer } from '@/src/containers/project-video-preview-container';
import { Flex } from '@radix-ui/themes';
import { ProjectVideoMetadataContainer } from '@/src/containers/project-video-metadata-container';

const ProjectContentView = async () => {
  return (
    <div className={styles.root}>
      <SplitView
        name="project-content-split-view"
        leftMinSize={500}
        rightMinSize={100}
        proportionalLayout={true}
        left={
          <div className={styles.leftPane}>
            <ProjectTableViewContainer />
          </div>
        }
        right={
          <div className={styles.rightPane}>
            <Flex direction="column" gap={'4'}>
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
