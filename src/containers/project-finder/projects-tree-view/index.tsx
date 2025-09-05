import { Project } from '@/src/app/types';
import { Tree } from 'react-arborist';
import { TreeViewNode } from './tree-view-node';

type ProjectsTreeViewProps = {
  projects: Project[];
};

const ProjectsTreeView = ({ projects }: ProjectsTreeViewProps) => {
  return (
    <Tree
      data={projects}
      width="100%"
      idAccessor={'name'}
      childrenAccessor={'contents'}
    >
      {({ node, style }) => (
        <div
          style={style}
          onClick={() => {
            node.toggle();
          }}
        >
          <TreeViewNode node={node} />
        </div>
      )}
    </Tree>
  );
};
export { ProjectsTreeView };
