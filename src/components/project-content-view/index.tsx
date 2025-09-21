'use client';
import { SplitView } from 'components/base/split-view';

import styles from './style.module.css';
import { ProjectTableViewContainer } from '@/src/containers/project-table-view-container';
import { ProjectVideoPreviewContainer } from '@/src/containers/project-video-preview-container';
import { Flex, Heading } from '@radix-ui/themes';
import { ProjectVideoMetadataContainer } from '@/src/containers/project-video-metadata-container';
import { ProjectMapContainer } from '@/src/containers/project-map-container';
import { useGlobalState } from '@/src/app/global-state';

import { FileIcon } from 'components/file-icon';
import { getResponseIfSuccesful } from '@/src/helpers/get-response-if-successful';
import { Project, ResponseType } from '@/src/types';
import { useSearchParams } from 'next/navigation';
import { getFileIconType } from '@/src/helpers/get-file-icon-type';
import { removeFileExtension } from '@/src/helpers/remove-file-extension';

const ProjectContentView = () => {
  const sp = useSearchParams();
  const { selectedProject } = useGlobalState();
  const project = getResponseIfSuccesful<Project>(
    selectedProject.get({ noproxy: true }) as unknown as ResponseType<Project>,
  );

  const fileType = getFileIconType(sp.get('path') || '');

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
              {project?.project_name && (
                <Heading size="7" weight="light" as="h2">
                  <Flex gap={'2'} align="center">
                    <FileIcon type={fileType} />
                    {removeFileExtension(sp.get('path'))}
                  </Flex>
                </Heading>
              )}

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
