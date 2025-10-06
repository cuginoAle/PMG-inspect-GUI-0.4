'use client';
import { Tree, TreeApi } from 'react-arborist';
import { TreeViewNode } from './tree-view-node';
import { Button, Flex, TextField } from '@radix-ui/themes';

import { MagnifyingGlassIcon, UploadIcon } from '@radix-ui/react-icons';
import React, { use, useCallback } from 'react';
import useResizeObserver from 'use-resize-observer';
import styles from './style.module.css';
import { FileInfo } from '@/src/types';
import { Immutable, ImmutableObject } from '@hookstate/core';

type ProjectsTreeViewProps = {
  filesPromise: Promise<FileInfo[]>;
  selectedPath?: string;
};

// Feature flag (compile-time) to enable top-level Remote/Local grouping nodes in the tree
const enableRemoteAndLocalNodes = false as const;

type RemoteLocalNode = {
  content: Immutable<FileInfo[]>;
  file_type?: string;
  file_origin?: string;
  name: string;
  relative_path: string;
};

// Resolve the node type used by the Tree (compile-time based on the flag)
type TreeNode = typeof enableRemoteAndLocalNodes extends true
  ? RemoteLocalNode
  : ImmutableObject<FileInfo>;

const ProjectsTreeView = ({
  filesPromise,
  selectedPath,
}: ProjectsTreeViewProps) => {
  const [searchTerm, setSearchTerm] = React.useState('');
  const { ref, width, height } = useResizeObserver();
  const files = use(filesPromise);

  const treeRef = React.useRef<TreeApi<TreeNode> | undefined>(undefined);

  const onSearch = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  }, []);

  type DataType = typeof enableRemoteAndLocalNodes extends true
    ? RemoteLocalNode[]
    : Immutable<FileInfo[]>;

  const groupedData: RemoteLocalNode[] = [
    {
      content: files,
      file_type: 'remote',
      file_origin: 'remote',
      name: 'Remote',
      relative_path: 'remote',
    },
    {
      content: [] as Immutable<FileInfo[]>,
      file_type: 'local',
      name: 'Local',
      relative_path: 'local',
      file_origin: 'local',
    },
  ];

  const treeViewData = (
    enableRemoteAndLocalNodes ? groupedData : files
  ) as DataType;

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
        <Tree<TreeNode>
          ref={treeRef}
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
          onClick={() => {
            if (selectedPath) {
              treeRef.current?.select(selectedPath);
              treeRef.current?.scrollTo(selectedPath);
            }
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
      {enableRemoteAndLocalNodes && (
        <div className={styles.uploadButtonContainer}>
          <Button size="3" variant="outline">
            <UploadIcon width={20} height={20} />
            <span className="ellipsis">Upload videos or images</span>
          </Button>
        </div>
      )}
    </Flex>
  );
};
export { ProjectsTreeView };
