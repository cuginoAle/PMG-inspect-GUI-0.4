import { Tree } from 'react-arborist';
import { TreeViewNode } from './tree-view-node';
import { Flex, TextField } from '@radix-ui/themes';
import { MagnifyingGlassIcon } from '@radix-ui/react-icons';
import React, { useCallback } from 'react';
import { FileInfo } from '@/src/types';
import useResizeObserver from 'use-resize-observer';
import styles from './style.module.css';

type ProjectsTreeViewProps = {
  files: FileInfo[];
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
          onSelect={(node) => {
            if (onSelect && node.length > 0 && node[0]?.isLeaf) {
              const data: FileInfo = node[0].data;
              if (data.file_type === 'project') {
                onSelect(data);
              } else {
                alert('Sorry, this file type is not supported yet!');
                onSelect(undefined);
              }
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
