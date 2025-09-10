import { Tree } from 'react-arborist';
import { TreeViewNode } from './tree-view-node';
import { Flex, TextField } from '@radix-ui/themes';
import { MagnifyingGlassIcon } from '@radix-ui/react-icons';
import React, { useCallback } from 'react';
import { DirectoryResponse, FileInfo } from '@/src/types';
import useResizeObserver from 'use-resize-observer';
import styles from './style.module.css';

type ProjectsTreeViewProps = {
  files: DirectoryResponse;
  onSelect?: (project: FileInfo | undefined) => void;
};

const ProjectsTreeView = ({ files, onSelect }: ProjectsTreeViewProps) => {
  const [searchTerm, setSearchTerm] = React.useState('');
  const { ref, width, height } = useResizeObserver();

  const onSearch = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  }, []);

  return (
    <Flex direction="column" gap="2" height={'100%'}>
      <TextField.Root placeholder="Search projects..." onChange={onSearch}>
        <TextField.Slot>
          <MagnifyingGlassIcon height="16" width="16" />
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
          onSelect={(node) => {
            if (onSelect && node.length > 0 && node[0].isLeaf) {
              onSelect(node[0].data as FileInfo);
            } else if (onSelect) {
              onSelect(undefined);
            }
          }}
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
