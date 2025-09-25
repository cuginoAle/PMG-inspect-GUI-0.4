'use client';
import { Tree } from 'react-arborist';
import { TreeViewNode } from './tree-view-node';
import { Button, Flex, TextField } from '@radix-ui/themes';
import { MagnifyingGlassIcon, UploadIcon } from '@radix-ui/react-icons';
import React, { useCallback } from 'react';
import { GetFilesListResponse } from '@/src/types';
import useResizeObserver from 'use-resize-observer';
import styles from './style.module.css';
import { Warning } from '@/src/components';

type ProjectsTreeViewProps = {
  files: GetFilesListResponse;
  selectedPath?: string;
};

const ProjectsTreeView = ({ files, selectedPath }: ProjectsTreeViewProps) => {
  const [searchTerm, setSearchTerm] = React.useState('');
  const { ref, width, height } = useResizeObserver();

  const onSearch = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  }, []);

  if (files.status === 'error') {
    return (
      <div className="center">
        <Warning
          message={files.detail.message}
          title="Error loading projects"
        />
      </div>
    );
  }

  const treeViewData = [
    {
      content: files.detail,
      file_type: 'remote',
      file_origin: 'remote',
      name: 'Remote',
      relative_path: 'remote',
    },
    {
      content: [],
      file_type: 'local',
      name: 'Local',
      relative_path: 'local',
      file_origin: 'local',
    },
  ];

  return (
    <Flex direction="column" gap="2" height={'100%'}>
      <div className={styles.searchBox}>
        <TextField.Root
          name="search"
          placeholder="Search projects..."
          onChange={onSearch}
          size={'3'}
        >
          <TextField.Slot>
            <MagnifyingGlassIcon width="24" height="24" />
          </TextField.Slot>
        </TextField.Root>
      </div>

      <div ref={ref} className={styles.tree}>
        <Tree
          data={treeViewData}
          width={width}
          height={height}
          idAccessor={'relative_path'}
          childrenAccessor={'content'}
          rowHeight={32}
          searchTerm={searchTerm}
          openByDefault={false}
          initialOpenState={{
            remote: true,
            local: true,
          }}
          selection={selectedPath!}
        >
          {({ node, style }) => (
            <div style={style}>
              <TreeViewNode node={node} />
            </div>
          )}
        </Tree>
      </div>
      <div className={styles.uploadButtonContainer}>
        <Button size="3" variant="outline">
          <UploadIcon width={20} height={20} />
          <span className="ellipsis">Upload videos or images</span>
        </Button>
      </div>
    </Flex>
  );
};
export { ProjectsTreeView };
