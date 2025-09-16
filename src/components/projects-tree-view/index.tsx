'use client';
import { Tree } from 'react-arborist';
import { TreeViewNode } from './tree-view-node';
import { Flex, TextField } from '@radix-ui/themes';
import { MagnifyingGlassIcon } from '@radix-ui/react-icons';
import React, { useCallback } from 'react';
import { GetFilesListResponse } from '@/src/types';
import useResizeObserver from 'use-resize-observer';
import styles from './style.module.css';
import { Warning } from 'components/warning';

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

  if ('status' in files) {
    return (
      <div className="center">
        <Warning
          message={files.detail.message}
          title="Error loading projects"
        />
      </div>
    );
  }

  return (
    <Flex direction="column" gap="2" height={'100%'}>
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

      <div ref={ref} className={styles.tree}>
        <Tree
          data={files}
          width={width}
          height={height}
          idAccessor={'relative_path'}
          childrenAccessor={'content'}
          rowHeight={32}
          searchTerm={searchTerm}
          openByDefault={false}
          selection={selectedPath!}
        >
          {({ node, style }) => (
            <div style={style}>
              <TreeViewNode node={node} />
            </div>
          )}
        </Tree>
      </div>
    </Flex>
  );
};
export { ProjectsTreeView };
