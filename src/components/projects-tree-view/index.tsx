import { Tree } from 'react-arborist';
import { TreeViewNode } from './tree-view-node';
import { Flex, TextField } from '@radix-ui/themes';
import { MagnifyingGlassIcon } from '@radix-ui/react-icons';
import React, { useCallback } from 'react';
import { FileInfo } from '@/src/app/protected/api/projects/type';

type ProjectsTreeViewProps = {
  files: FileInfo[];
  onSelect?: (project: FileInfo | undefined) => void;
};

const ProjectsTreeView = ({ files, onSelect }: ProjectsTreeViewProps) => {
  const [searchTerm, setSearchTerm] = React.useState('');

  const onSearch = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  }, []);

  return (
    <Flex direction="column" gap="2">
      <TextField.Root placeholder="Search projects..." onChange={onSearch}>
        <TextField.Slot>
          <MagnifyingGlassIcon height="16" width="16" />
        </TextField.Slot>
      </TextField.Root>
      <Tree
        data={files}
        width="100%"
        idAccessor={'fullPath'}
        childrenAccessor={'contents'}
        rowHeight={32}
        searchTerm={searchTerm}
        openByDefault={false}
        onSelect={(node) => {
          if (onSelect && node.length > 0 && node[0].isLeaf) {
            onSelect(node[0].data);
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
    </Flex>
  );
};
export { ProjectsTreeView };
