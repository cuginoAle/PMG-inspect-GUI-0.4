import { Project } from '@/src/app/types';
import { Tree } from 'react-arborist';
import { TreeViewNode } from './tree-view-node';
import { Flex, TextField } from '@radix-ui/themes';
import { MagnifyingGlassIcon } from '@radix-ui/react-icons';
import React from 'react';

type ProjectsTreeViewProps = {
  projects: Project[];
  onSelect?: (project: Project | undefined) => void;
};

const ProjectsTreeView = ({ projects, onSelect }: ProjectsTreeViewProps) => {
  const [searchTerm, setSearchTerm] = React.useState('');

  const onSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  return (
    <Flex direction="column" gap="2">
      <TextField.Root placeholder="Search projects..." onChange={onSearch}>
        <TextField.Slot>
          <MagnifyingGlassIcon height="16" width="16" />
        </TextField.Slot>
      </TextField.Root>
      <Tree
        data={projects}
        width="100%"
        idAccessor={'id'}
        childrenAccessor={'contents'}
        rowHeight={32}
        searchTerm={searchTerm}
        onSelect={(node) => {
          if (onSelect && node.length > 0 && node[0].isLeaf) {
            onSelect(node[0].data);
          } else if (onSelect) {
            onSelect(undefined);
          }
        }}
      >
        {({ node, style }) => (
          <div style={style} onClick={() => node.toggle()}>
            <TreeViewNode node={node} />
          </div>
        )}
      </Tree>
    </Flex>
  );
};
export { ProjectsTreeView };
